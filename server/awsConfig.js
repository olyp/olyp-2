import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import CloudFront from 'aws-sdk/clients/cloudfront';

var myConfig = new AWS.Config({
	accessKeyId: Meteor.settings.aws.accessKey,
	secretAccessKey: Meteor.settings.aws.secretKey,
	region: Meteor.settings.aws.region
});

var s3 = new S3();
var cloudfront = new AWS.CloudFront();

// Check if AWS bucket exists
s3.listBuckets(function(err, data) {

	console.log('Checking if AWS bucket exists ...')

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
			console.log('AWS bucket does not exists')
			createNewBucket();
		}

		if (bucketExists) {
			console.log('AWS bucket exists');
			checkCloudFront();
		}

		
	}
});

const createNewBucket = () => {

	console.log('Creating AWS bucket ...');

	var newBucket = {
		Bucket: Meteor.settings.aws.bucket,
		CreateBucketConfiguration: {
			LocationConstraint: Meteor.settings.aws.region
		}
	};

	if (Meteor.settings.aws.region == 'us-east-1') {
		newBucket = {
			Bucket: Meteor.settings.aws.bucket
		}
	}

	s3.createBucket(newBucket, function(err, data) {
		if (err) {

			console.log(err, err.stack);

			if (err.code == 'BucketAlreadyExists') {
				console.log('********** The AWS bucket name is already taken, please choose another one **********')
			}
			
		} else {
			console.log("AWS bucket created");
			console.log("********** I might take up to 2 hours for DNS to update, uploads will NOT work untill this is done **********");
			configureBucket();
			checkCloudFront();
		}
	});
};

const checkCloudFront = () => {

	cloudfront.listDistributions(function(err, data) {

		console.log('Checking if CloudFront distribution exists ...');

		if (err) {
			console.log(err, err.stack);
		} else {
			
			var distExists = false;
			var distDomainName = 'Does not exist';

			data.DistributionList.Items.map((distributon) => {

				const origins = distributon.Origins.Items;

				const expectedDomainName = Meteor.settings.aws.bucket + '.s3.amazonaws.com';

				for (var i = 0; i < origins.length; i++) {

						if (origins[i].DomainName == expectedDomainName) {
								distExists = true;
								distDomainName = distributon.DomainName;
								break;
						}
				}
			});

			if (!distExists) {
				console.log('CloudFront distribution does not exists ...');
				createCloudFront();
			}

			if (distExists) {
				console.log('CloudFront distribution exists');
				process.env.CLOUDFRONT_URL = distDomainName;
			}

		}
	});
};

const createCloudFront = () => {
	console.log('Creating CloudFront distribution ...');

	var timestamp = + new Date();
	timestamp = timestamp.toString();
	const targetOriginId = 'S3-' + Meteor.settings.aws.bucket;
	const targetDomainName = Meteor.settings.aws.bucket + '.s3.amazonaws.com';

	toString()

	const newCloudFront = {
		DistributionConfig: {
			CallerReference: timestamp,
			Comment: '',
			DefaultCacheBehavior: {
				ForwardedValues: {
					Cookies: {
						Forward: 'none',
						WhitelistedNames: {
							Quantity: 0,
							Items: []
						}
					},
					QueryString: false,
					Headers: {
						Quantity: 0,
						Items: []
					},
					QueryStringCacheKeys: {
						Quantity: 0,
						Items: []
					}
				},
				MinTTL: 0,
				TargetOriginId: targetOriginId,
				TrustedSigners: {
					Enabled: false,
					Quantity: 0,
					Items: []
				},
				ViewerProtocolPolicy: 'allow-all',
				AllowedMethods: {
					Quantity: 2,
					Items: [ 'HEAD', 'GET' ],
					CachedMethods: {
						Items: [ 'HEAD', 'GET' ],
						Quantity: 2
					}
				},
				Compress: false,
				DefaultTTL: 86400,
				LambdaFunctionAssociations: {
					Quantity: 0,
					Items: []
				},
				MaxTTL: 31536000,
				SmoothStreaming: false
			},
			Enabled: true,
			Origins: {
				Quantity: 1,
				Items: [
					{
						DomainName: targetDomainName,
						Id: targetOriginId,
						CustomHeaders: {
							Quantity: 0,
							Items: []
						},
						// CustomOriginConfig: {
						// 	HTTPPort: 0, /* required */
						// 	HTTPSPort: 0, /* required */
						// 	OriginProtocolPolicy: http-only | match-viewer | https-only, /* required */
						// 	OriginKeepaliveTimeout: 0,
						// 	OriginReadTimeout: 0,
						// 	OriginSslProtocols: {
						// 		Items: [ /* required */
						// 			SSLv3 | TLSv1 | TLSv1.1 | TLSv1.2,
						// 			/* more items */
						// 		],
						// 		Quantity: 0 /* required */
						// 	}
						// },
						OriginPath: '',
						S3OriginConfig: {
							OriginAccessIdentity: ''
						}
					},
				]
			},
			Aliases: {
				Quantity: 0,
				Items: []
			},
			CacheBehaviors: {
				Quantity: 0,
				Items: []
			},
			CustomErrorResponses: {
				Quantity: 0,
				Items: []
			},
			DefaultRootObject: '',
			HttpVersion: 'http2',
			IsIPV6Enabled: true,
			Logging: {
				Bucket: '',
				Enabled: false,
				IncludeCookies: false,
				Prefix: ''
			},
			PriceClass: 'PriceClass_All',
			Restrictions: {
				GeoRestriction: {
					Quantity: 0,
					RestrictionType: 'none',
					Items: []
				}
			},
			ViewerCertificate: {
				CertificateSource: 'cloudfront',
				// CertificateSource: 'iam',
				CloudFrontDefaultCertificate: true,
				MinimumProtocolVersion: 'SSLv3',
			},
			WebACLId: ''
		}
	};

	cloudfront.createDistribution(newCloudFront, function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {

			console.log("CloudFront distribution is being created @ " + data.Distribution.DomainName);
			console.log("This will take some minutes. Visit https://console.aws.amazon.com/cloudfront/home to see the deployment process.");

			process.env.CLOUDFRONT_URL = data.Distribution.DomainName;
		};
	});
};

const configureBucket = () => {
	console.log("Configuring AWS bucket ...");

	var staticHostParams = {
		Bucket: Meteor.settings.aws.bucket,
		WebsiteConfiguration: {
			ErrorDocument: {
				Key: 'error.html'
			},
			IndexDocument: {
				Suffix: 'index.html'
			},
		}
	};

	var corsParams = {
		Bucket: Meteor.settings.aws.bucket,
		CORSConfiguration: {
			CORSRules: [
				{
					AllowedMethods: [
						'POST'
					],
					AllowedOrigins: [
						'*'
					],
					AllowedHeaders: [
						'*'
					]
				}
			]
		}
	};

	s3.putBucketWebsite(staticHostParams, function(err, data) {
		if (err) {
			console.log(err);
		} else {
			s3.putBucketCors(corsParams, function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log("AWS bucket configured");
				}
			});
		}
	});
};











