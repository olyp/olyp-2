import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';

Meteor.startup(function () {

	// Defining initial user credentials
	var initialUser = {};
	initialUser.email = Meteor.settings.private.initialUser.email;
	initialUser.password = Meteor.settings.private.initialUser.password;

	// Checking if initial user exists based on email
	var initialUserExists = Meteor.users.findOne({'emails.address': initialUser.email});

	if (!initialUserExists) {

		// If Initial user doesn't exist, create it

		const profile = {
			'name': 'Jonas Barsten',
			'firstName': 'Jonas',
			'lastName': 'Barsten'
		}

		let newUserId = Accounts.createUser( { profile: profile, email: initialUser.email, password: initialUser.password } );

		// Give initial user the role of admin
		Roles.addUsersToRoles( newUserId, 'super-admin', Roles.GLOBAL_GROUP );
	}

	// If user exists, but does not have super-admin, assign super-admin role
	// if (!Roles.userIsInRole(initialUserExists._id, 'super-admin', Roles.GLOBAL_GROUP)) {
	// 	Roles.addUsersToRoles( initialUserExists._id, 'super-admin', Roles.GLOBAL_GROUP );
	// }

	// Set mail settings
	process.env.MAIL_URL = Meteor.settings.private.smtp;


	// Configure facebook-login
	ServiceConfiguration.configurations.upsert({
		service: "facebook"
	}, {
		$set: {
			appId: Meteor.settings.facebook.appId,
			loginStyle: "popup",
			secret: Meteor.settings.facebook.secret
		}
	});

	// Configure google-login
	ServiceConfiguration.configurations.upsert({
		service: "google"
	}, {
		$set: {
			clientId: Meteor.settings.google.clientId,
			secret: Meteor.settings.google.secret
		}
	});

	// AWS Config
	var myCredentials = new AWS.CognitoIdentityCredentials({IdentityPoolId:'IDENTITY_POOL_ID'});
	var myConfig = new AWS.Config({
		accessKeyId: Meteor.settings.aws.accessKey,
		secretAccessKey: Meteor.settings.aws.secretKey,
		region: Meteor.settings.aws.region
	});

	// Create AWS bucket
	var s3 = new S3();

	var newBucket = {
		Bucket: Meteor.settings.aws.bucket, /* required */
		// ACL: private | public-read | public-read-write | authenticated-read,
		CreateBucketConfiguration: {
			LocationConstraint: Meteor.settings.aws.region
		}
		// GrantFullControl: 'STRING_VALUE',
		// GrantRead: 'STRING_VALUE',
		// GrantReadACP: 'STRING_VALUE',
		// GrantWrite: 'STRING_VALUE',
		// GrantWriteACP: 'STRING_VALUE'
	};

	s3.listBuckets(function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {

			var bucketExists = false;

			for (var i = 0; i < data.Buckets.length; i++) {
			    if (data.Buckets[i].Name == Meteor.settings.aws.bucket) {
			        bucketExists = true;
			        break;
			    }
			}

			if (!bucketExists) {

				s3.createBucket(newBucket, function(err, data) {
					if (err) {
						// console.log(err, err.stack);
						if (err.code == "BucketAlreadyOwnedByYou") {
							console.log("Nice, AWS bucket already created and owned by you!");
						}
						if (err.code == "BucketAlreadyExists") {
							console.log("Bucket name not available");
						}
					} else {
						// console.log(data);
						console.log("AWS bucket created @ " + data.Location);
					}
				});

			}
		}
	});
});