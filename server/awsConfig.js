import fs from 'fs';
import path from 'path';
import uuid from 'uuid/v4';

import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import CloudFront from 'aws-sdk/clients/cloudfront';
import Lambda from 'aws-sdk/clients/lambda';
import Iam from 'aws-sdk/clients/iam';
import APIGateway from 'aws-sdk/clients/apigateway';
import STS from 'aws-sdk/clients/sts';

const basePath = path.resolve('.').split('.meteor')[0];

var myConfig = new AWS.Config({
	accessKeyId: Meteor.settings.aws.accessKey,
	secretAccessKey: Meteor.settings.aws.secretKey,
	region: Meteor.settings.aws.region
});

AWS.config = myConfig;

var s3 = new S3();
var cloudfront = new CloudFront();
var lambda = new Lambda();
var iam = new Iam();
var apigateway = new APIGateway();
var sts = new STS();

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

			checkCloudFront();
			checkLambda();

			// Just for testing
			// checkApi();
		}

		if (bucketExists) {
			console.log('AWS bucket exists');

			checkCloudFront();
			checkLambda();

			// Just for testing
			// checkApi();
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
		}
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

const checkLambda = () => {

	console.log('Checking if lambda function exists ...');

	lambda.listFunctions(function(err, data) {
		if (err) {
			console.log(err);
		} else {

			var functionExists = false;
			const functionName = 'resize-images-on-' + Meteor.settings.aws.bucket;

			for (var i = 0; i < data.Functions.length; i++) {

				if (data.Functions[i].FunctionName == functionName) {
						functionExists = true;
						break;
				}
			}

			if (functionExists) {
				console.log('Lambda function exists');
			}

			if (!functionExists) {
				setUpLambda();
			}

		}
	});
}

const setUpLambda = () => {

	console.log('Checking if IAM role exists');

	iam.listRoles(function(err, data) {
		if (err) {
			console.log(err);
		} else {

			var roleExists = false;
			const roleName = 'resize-images-on-' + Meteor.settings.aws.bucket + '-basic-execution';

			for (var i = 0; i < data.Roles.length; i++) {

				if (data.Roles[i].RoleName == roleName) {
					roleExists = true;
					break;
				}
			}

			if (roleExists) {
				console.log('IAM role exists');
			}

			if (!roleExists) {
				createIamRole();
			}
		}
	});
}

const createIamRole = () => {
	console.log('Creating IAM role ...');

	const roleName = 'resize-images-on-' + Meteor.settings.aws.bucket + '-basic-execution';
	const policyName = roleName + '-policy';
	const resource = "arn:aws:s3:::" + Meteor.settings.aws.bucket + "/*";

	var trustPolicyDocument = {
		"Version": "2012-10-17",
		"Statement": [
			{
				"Effect": "Allow",
				"Principal": {
					"Service": "lambda.amazonaws.com"
				},
				"Action": "sts:AssumeRole"
			}
 		]
	};

	var rolePolicyDocument = {
		"Version": "2012-10-17",
		"Statement": [
			{
				"Effect": "Allow",
				"Action": [
					"logs:CreateLogGroup",
					"logs:CreateLogStream",
					"logs:PutLogEvents"
				],
				"Resource": "arn:aws:logs:*:*:*"
			},
			{
				"Effect": "Allow",
				"Action": "s3:PutObject",
				"Resource": resource    
			}
		]
	};

	trustPolicyDocument = JSON.stringify(trustPolicyDocument);
	rolePolicyDocument = JSON.stringify(rolePolicyDocument);

	const iamParams = {
		AssumeRolePolicyDocument: trustPolicyDocument,
		RoleName: roleName
	};

	iam.createRole(iamParams, function(err, data) {
		if (err) {
			console.log(err);
		} else {

			const iamArn = data.Role.Arn;

			const rolePolicyParams = {
				PolicyDocument: rolePolicyDocument,
				PolicyName: policyName,
				RoleName: roleName
			};

			iam.putRolePolicy(rolePolicyParams, function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log('IAM role created');

					// Waiting for the role policy to implement system wide on AWS
					setTimeout(function(){
						createLambda(iamArn);
					}, 6000);
				}
			});
		}
	});
}

const createLambda = (arn) => {

	const iamArn = arn;

	console.log('Creating lambda function ...');

	const filePath = basePath + '/server/' + 'lambdaResizeImage.zip';

	fs.readFile(filePath, (err, data) => {
		if (err) {
			console.log(err);
		} else {

			const functionName = 'resize-images-on-' + Meteor.settings.aws.bucket;
			const bucketWebEndpoint = 'http://' + Meteor.settings.aws.bucket + '.s3-website-' + Meteor.settings.aws.region + '.amazonaws.com';

			const lambdaParams = {
				Code: {
					ZipFile: new Buffer(data)
				},
				FunctionName: functionName,
				Handler: 'index.handler',
				Role: iamArn,
				Runtime: 'nodejs6.10',
				Description: 'Resizes images on the fly',
				Environment: {
					Variables: {
						BUCKET: Meteor.settings.aws.bucket,
						URL: bucketWebEndpoint
					}
				},
				MemorySize: 512,
				Publish: true,
				Timeout: 10
			};

			lambda.createFunction(lambdaParams, function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log('Lambda function created');
					checkApi();
				}
			});
		}
	});
};


const checkApi = () => {

	console.log('Checking API ...');

	const apiName = 'resize-images-on-' + Meteor.settings.aws.bucket + '-api';

	apigateway.getRestApis(function(err, data) {
		if (err) {
			console.log(err);
		} else {

			var apiExists = false;

			for (var i = 0; i < data.items.length; i++) {
				if (data.items[i].name == apiName) {
					apiExists = true;
					break;
				}
			}

			if (apiExists) {
				console.log('API exists');
			}

			if (!apiExists) {
				createApi();
			}

		}
	});
};

const createApi = () => {

	sts.getCallerIdentity(function(err, data) {
		if (err) {
			console.log(err);
		} else {

			const accountId = data.Account;
			const functionName = 'resize-images-on-' + Meteor.settings.aws.bucket;

			const apiName = 'resize-images-on-' + Meteor.settings.aws.bucket + '-api';
			const uri = 'arn:aws:apigateway:' + Meteor.settings.aws.region + ':lambda:path/2015-03-31/functions/arn:aws:lambda:' + Meteor.settings.aws.region + ':' + accountId + ':function:' + functionName + '/invocations';

			var apiSwagger = {
			  "swagger": "2.0",
			  "info": {
			    "version": "2017-04-10T12:43:16Z",
			    "title": apiName
			  },
			  "basePath": "/prod",
			  "schemes": [
			    "https"
			  ],
			  "paths": {
			    "/resize": {
			      "x-amazon-apigateway-any-method": {
			        "responses": {
			          "200": {
			            "description": "200 response"
			          }
			        },
			        "x-amazon-apigateway-integration": {
			          "responses": {
			            ".*": {
			              "statusCode": "200"
			            }
			          },
			          "uri": uri,
			          "passthroughBehavior": "when_no_match",
			          "httpMethod": "POST",
			          "type": "aws_proxy"
			        }
			      }
			    }
			  }
			}

			apiSwagger = JSON.stringify(apiSwagger);

			const apiParams = {
				body: apiSwagger,
			};

			apigateway.importRestApi(apiParams, function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log('API created');
					configureLambda(data.id, accountId);
				}
			});
		}
	});
}

const configureLambda = (apiId, accountId) => {

	console.log('Configuring lambda ...');

	const functionName = 'resize-images-on-' + Meteor.settings.aws.bucket;

	const lambdaPolicies = [
		{
			Action: "lambda:InvokeFunction", 
			FunctionName: functionName, 
			Principal: "apigateway.amazonaws.com", 
			StatementId: uuid(),
			SourceArn: 'arn:aws:execute-api:' + Meteor.settings.aws.region + ':' + accountId + ':' + apiId + '/prod/ANY/resize'
		},
		{
			Action: "lambda:InvokeFunction", 
			FunctionName: functionName, 
			Principal: "apigateway.amazonaws.com", 
			StatementId: uuid(),
			SourceArn: 'arn:aws:execute-api:' + Meteor.settings.aws.region + ':' + accountId + ':' + apiId + '/*/*/resize'
		}
	];

	lambda.addPermission(lambdaPolicies[0], function(err, data) {
		if (err) {
			console.log(err);
		} else {
			lambda.addPermission(lambdaPolicies[1], function(err, data) {
				if (err) {
					console.log(err);
				} else {
					console.log('Lambda configured');
				}
			});

		}
	});
}


