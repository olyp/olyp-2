import crypto from 'crypto';
import uuid from 'uuid/v4';
import moment from 'moment';
import S3 from 'aws-sdk/clients/s3';

import Files from '../collections/files';
import Images from '../collections/images';

var s3 = new S3();

Meteor.methods({
	'file.generateUploadTicket': function (filename, type) {

		check(filename, String);
		check(type, String);

		var bucket = '';

		if (type == 'file') {
			bucket = Meteor.settings.public.aws.bucket;
		}

		if (type == 'image') {
			bucket = Meteor.settings.public.aws.imageBucket;
		}


		const key = uuid() + '-' + filename;
		
		return s3Credentials(key);

		function s3Credentials(filename) {
			return {
				// S3 uses some hours to update DNS, region specified URL works imedeatly, but not with us-east-1
				endpoint_url: "https://" + bucket + '.s3-' + Meteor.settings.public.aws.region + ".amazonaws.com",
				// endpoint_url: "https://" + bucket + ".s3.amazonaws.com",
				params: s3Params(filename)
			}
		}

		// Returns the parameters that must be passed to the API call
		function s3Params(filename) {
			var credential = amzCredential();
			var policy = s3UploadPolicy(filename, credential);
			var policyBase64 = new Buffer(JSON.stringify(policy)).toString('base64');
			return {
				key: filename,
				acl: 'public-read',
				success_action_status: '201',
				policy: policyBase64,
				'x-amz-algorithm': 'AWS4-HMAC-SHA256',
				'x-amz-credential': credential,
				'x-amz-date': dateString() + 'T000000Z',
				'x-amz-signature': s3UploadSignature(policyBase64, credential)
	  		}
		}

		function dateString() {
			var date = new Date().toISOString();
			return date.substr(0, 4) + date.substr(5, 2) + date.substr(8, 2);
		}

		function amzCredential() {
			return [Meteor.settings.aws.accessKey, dateString(), Meteor.settings.public.aws.region, 's3/aws4_request'].join('/')
		}

		// Constructs the policy
		function s3UploadPolicy(filename, credential) {
	 		return {
	   			// 5 minutes into the future
				expiration: new Date((new Date).getTime() + (5 * 60 * 1000)).toISOString(),
				conditions: [
					{ bucket: bucket },
					{ key: filename },
					{ acl: 'public-read' },
					{ success_action_status: "201" },
					// Content type and file size
					// {'Content-Type': 'application/pdf'},
					// ['content-length-range', 0, 1000000],
					{ 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
					{ 'x-amz-credential': credential },
					{ 'x-amz-date': dateString() + 'T000000Z' }
				],
			}
		}

		function hmac(key, string) {
			var hmac = crypto.createHmac('sha256', key);
			hmac.end(string);
			return hmac.read();
		}

		// Signs the policy with the credential
		function s3UploadSignature(policyBase64, credential) {
			var dateKey = hmac('AWS4' + Meteor.settings.aws.secretKey, dateString());
			var dateRegionKey = hmac(dateKey, Meteor.settings.public.aws.region);
			var dateRegionServiceKey = hmac(dateRegionKey, 's3');
			var signingKey = hmac(dateRegionServiceKey, 'aws4_request');
			return hmac(signingKey, policyBase64).toString('hex');
		}
	},
	'file.add': function (file, type) {
		check(file, Object);
		check(type, String);

		file.dateAdded = moment().toDate();
		file.addedBy = Meteor.userId();

		if (type == 'image') {
			const entry = Images.insert(file);

			const res = {
				localId: entry,
				awsKey: file.awsKey
			}

			return res;
		}

		if (type == 'file') {
			const entry = Files.insert(file);

			const res = {
				localId: entry,
				awsKey: file.awsKey
			}

			return res;
		}
	},
	'file.toTrash': function (fileId, type) {
		check(fileId, String);
		check(type, String);

		// Files will be deleted from S3 with a cron job, intervall set at server/awsConfig.js

		if (type == 'image') {
			Images.update({_id: fileId}, {$set: {inTrash: true, trashedBy: Meteor.userId(), dateTrashed: moment().toDate()}});
		}

		if (type == 'file') {
			Files.update({_id: fileId}, {$set: {inTrash: true, trashedBy: Meteor.userId(), dateTrashed: moment().toDate()}});
		}
	},
	'files.emptyTrash': function () {

		console.log('Running S3 garbage collection ' + moment().toDate());
		const expireTreshold = moment().subtract(1, 'minutes').toDate();

		// Delete trashed and expired images
		const expiredImages = Images.find(
			{
				inTrash: true,
				deletedFromS3: { $exists: false }, 
				dateTrashed: {
					$lt: expireTreshold
				}
			}, 
			{ fields: {_id: 1, awsKey: 1} }
		).fetch();

		expiredImages.map((file) => {

			s3.deleteObject({Bucket: Meteor.settings.public.aws.imageBucket, Key: file.awsKey}, Meteor.bindEnvironment((err, data) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Deleted ' + file.awsKey + ' from S3');

					Images.update({_id: file._id}, {$set: {'deletedFromS3': true, 'dateDeleted': moment().toDate()}});

				}
			}));
		});

		// Delete trashed and expired files
		const expiredFiles = Files.find(
			{
				inTrash: true,
				deletedFromS3: { $exists: false }, 
				dateTrashed: {
					$lt: expireTreshold
				}
			}, 
			{ fields: {_id: 1, awsKey: 1} }
		).fetch();

		expiredFiles.map((file) => {

			s3.deleteObject({Bucket: Meteor.settings.public.aws.bucket, Key: file.awsKey}, Meteor.bindEnvironment((err, data) => {
				if (err) {
					console.log(err);
				} else {
					console.log('Deleted ' + file.awsKey + ' from S3');

					Files.update({_id: file._id}, {$set: {'deletedFromS3': true, 'dateDeleted': moment().toDate()}});

				}
			}));

		});
	},
	'files.compareAndDelete': function () {
		// Delete all images that had been marked as deleted on S3 in case they are not or if there has been made any minified versions of them
		s3.listObjectsV2({Bucket: Meteor.settings.public.aws.imageBucket}, Meteor.bindEnvironment((err, data) => {
			if (err) {
				console.log(err);
			} else {

				data.Contents.map((file) => {
					const pathAndName = file.Key.split("/");
					const originalKey = pathAndName[pathAndName.length -1];

					const originalImageHasBeenDeleted = Images.findOne({awsKey: originalKey, deletedFromS3: true}, {fields: {_id: 1}});

					if (originalImageHasBeenDeleted) {
						s3.deleteObject({Bucket: Meteor.settings.public.aws.imageBucket, Key: file.Key}, (err,res) => {
							console.log('Deleted ' + file.Key + ' from S3');
						});
					}
				});
			}
		}));


		// Delete all files that had been marked as deleted on S3 in case they are not
		s3.listObjectsV2({Bucket: Meteor.settings.public.aws.bucket}, Meteor.bindEnvironment((err, data) => {
			if (err) {
				console.log(err);
			} else {

				data.Contents.map((file) => {

					const originalFileHasBeenDeleted = Files.findOne({awsKey: file.Key, deletedFromS3: true}, {fields: {_id: 1}});

					if (originalFileHasBeenDeleted) {
						s3.deleteObject({Bucket: Meteor.settings.public.aws.bucket, Key: file.Key}, (err,res) => {
							console.log('Deleted ' + file.Key + ' from S3');
						});
					}
				});
			}
		}));
	}
});