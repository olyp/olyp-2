import S3 from 'aws-sdk/clients/s3';

Meteor.methods({
	'file.upload': function (file) {
		console.log('Uploading ...');

		

		// var bucket = new S3({
		// 	params: {
		// 		Bucket: Meteor.settings.aws.bucket
		// 	}
		// });

		// console.log(s3.buckets);
	}
});