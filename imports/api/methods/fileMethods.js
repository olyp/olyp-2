import crypto from 'crypto';
import uuid from 'uuid/v4';

Meteor.methods({
	'file.generateUploadTicket': function (filename) {

		const key = uuid() + '-' + filename;
		
		return s3Credentials(key);

		function s3Credentials(filename) {
			return {
				// endpoint_url: "https://" + Meteor.settings.aws.bucket + '.s3-' + Meteor.settings.aws.region + ".amazonaws.com",
				endpoint_url: "https://" + Meteor.settings.aws.bucket + ".s3.amazonaws.com",
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
			return [Meteor.settings.aws.accessKey, dateString(), Meteor.settings.aws.region, 's3/aws4_request'].join('/')
		}

		// Constructs the policy
		function s3UploadPolicy(filename, credential) {
	 		return {
	   			// 5 minutes into the future
				expiration: new Date((new Date).getTime() + (5 * 60 * 1000)).toISOString(),
				conditions: [
					{ bucket: Meteor.settings.aws.bucket },
					{ key: filename },
					{ acl: 'public-read' },
					{ success_action_status: "201" },
					// Optionally control content type and file size
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
			var dateRegionKey = hmac(dateKey, Meteor.settings.aws.region);
			var dateRegionServiceKey = hmac(dateRegionKey, 's3');
			var signingKey = hmac(dateRegionServiceKey, 'aws4_request');
			return hmac(signingKey, policyBase64).toString('hex');
		}
	}
});