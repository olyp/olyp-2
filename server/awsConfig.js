import fs from 'fs';
import path from 'path';
import uuid from 'uuid/v4';

import AWS from 'aws-sdk/global';
import S3 from 'aws-sdk/clients/s3';
import CloudFormation from 'aws-sdk/clients/cloudformation';

Meteor.startup( () => {

	var myConfig = new AWS.Config({
		accessKeyId: Meteor.settings.aws.accessKey,
		secretAccessKey: Meteor.settings.aws.secretKey,
		region: Meteor.settings.public.aws.region
	});

	AWS.config = myConfig;

	var s3 = new S3();
	var cloudformation = new CloudFormation();

	// Create buckets and serverless on-demand resizing for image bucket

	const basePath = path.resolve('.').split('.meteor')[0];
	const bucket = Meteor.settings.public.aws.bucket;
	const imageBucket = Meteor.settings.public.aws.imageBucket;
	const region = Meteor.settings.public.aws.region;
	const accountId = Meteor.settings.aws.accountId;
	const tempBucketName = 'temp-' + imageBucket + '-' + uuid();
	const tempBucketFile = uuid();
	const stackName = imageBucket + '-stack';
	const apiName = imageBucket + '-api';

	cloudformation.listStacks( (err, data) => {
		if (err) {
			console.log(err);
		} else {

			var stackExists = false;

			for (var i = 0; i < data.StackSummaries.length; i++) {
				if (data.StackSummaries[i].StackName == stackName && data.StackSummaries[i].StackStatus != 'DELETE_COMPLETE') {
					stackExists = true;
					break;
				}
			}

			if (stackExists) {
				console.log('AWS stack exists.');
			} else {
				console.log('Creating AWS stack ...');
				deployCloudFormationStack();
			}
		}
	});

	const deployCloudFormationStack = () => {

		s3.createBucket({Bucket: tempBucketName}, (err, res) => {
			if (err) {
				console.log(err);
			} else {

				const filePath = basePath + '/server/' + 'lambdaResizeImage.zip';

				fs.readFile(filePath, (err, data) => {
					if (err) {
						console.log(err);
					} else {

						console.log('Temp S3 bucket created.');

						const uploadParams = {Bucket: tempBucketName, Key: tempBucketFile, Body: new Buffer(data)};

						s3.upload(uploadParams, (err, res) => {
							if (err) {
								console.log(err);
							} else {
								console.log('Lambda function zip uploaded.');
								createCloudFormationStack();
							}
						});
					}
				});
			}
		});
	}

	const createCloudFormationStack = () => {

		console.log('Deploying stack ...');

		const apiTemplate = {
			"swagger": 2,
			"info": {
				"title": apiName
			},
			"paths": {
				"/": {
					"get": {
						"x-amazon-apigateway-integration": {
							"uri": "arn:aws:apigateway:" + region + ":lambda:path/2015-03-31/functions/arn:aws:lambda:" + region + ":" + accountId + ":function:${stageVariables.LambdaFunctionName}/invocations",
							"type": "AWS_PROXY",
							"httpMethod": "post"
						}
					}
				}
			}
		}

		var template = {
			"AWSTemplateFormatVersion": "2010-09-09",
			"Outputs": {
				"Bucket": {
					"Value": {
						"Ref": "ImageBucket"
					}
				},
				"BucketWebsiteUrl": {
					"Value": {
						"Fn::GetAtt": [
							"ImageBucket",
							"WebsiteURL"
						]
					}
				}
			},
			"Resources": {
				"ResizeFunctionRole": {
					"Type": "AWS::IAM::Role",
					"Properties": {
						"ManagedPolicyArns": [
							"arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
						],
						"Policies": [
							{
								"PolicyName": "ResizeFunctionRolePolicy0",
								"PolicyDocument": {
									"Statement": [
										{
											"Action": [
												"s3:PutObject"
											],
											"Resource": {
												"Fn::Sub": "arn:aws:s3:::${ImageBucket}/*"
											},
											"Effect": "Allow"
										}
									]
								}
							}
						],
						"AssumeRolePolicyDocument": {
							"Version": "2012-10-17",
							"Statement": [
								{
									"Action": [
										"sts:AssumeRole"
									],
									"Effect": "Allow",
									"Principal": {
										"Service": [
											"lambda.amazonaws.com"
										]
									}
								}
							]
						}
					}
				},
				"Api": {
					"Type": "AWS::ApiGateway::RestApi",
					"Properties": {
						"Body": apiTemplate,
					}
				},
				"ApiDeploymentcbe884f39d": {
					"Type": "AWS::ApiGateway::Deployment",
					"Properties": {
						"RestApiId": {
							"Ref":"Api"
						},
						"StageName":"Stage"
					}
				},
				"ResizeFunction": {
					"Type": "AWS::Lambda::Function",
					"Properties": {
						"Code": {
							"S3Bucket" : tempBucketName,
							"S3Key" : tempBucketFile,
						},
						"MemorySize": 1536,
						"Environment": {
							"Variables": {
								"URL": {
									"Fn::GetAtt": [
										"ImageBucket",
										"WebsiteURL"
									]
								},
								"BUCKET": {
									"Ref": "ImageBucket"
								}
							}
						},
						"Handler": "index.handler",
						"Role": {
							"Fn::GetAtt": [
								"ResizeFunctionRole",
								"Arn"
							]
						},
						"Timeout": 60,
						"Runtime": "nodejs6.10"
					}
				},
				"ImageBucketPolicy": {
					"Type": "AWS::S3::BucketPolicy",
					"Properties": {
						"PolicyDocument": {
							"Statement": [
								{
									"Action": "s3:GetObject",
									"Resource": {
										"Fn::Sub": "arn:aws:s3:::${ImageBucket}/*"
									},
									"Effect": "Allow",
									"Principal": "*"
								}
							]
						},
						"Bucket": {
							"Ref": "ImageBucket"
						}
					}
				},
				"ApiprodStage": {
					"Type": "AWS::ApiGateway::Stage",
					"Properties": {
						"Variables": {
							"LambdaFunctionName": {
								"Ref": "ResizeFunction"
							}
						},
						"RestApiId": {
								"Ref": "Api"
						},
						"DeploymentId": {
								"Ref": "ApiDeploymentcbe884f39d"
						},
						"StageName": "prod"
					}
				},
				"ImageBucket": {
					"DeletionPolicy": "Retain",
					"Type": "AWS::S3::Bucket",
					"Properties": {
						"BucketName": imageBucket,
						"AccessControl": "PublicRead",
						"CorsConfiguration": {
							"CorsRules": [
								{
									"AllowedMethods": [
										"PUT",
										"POST"
									],
									"AllowedOrigins": [
										"*"
									],
									"AllowedHeaders": [
										"Content-Type",
										"x-amz-acl",
										"origin",
										"accept"
									],
									"ExposedHeaders": [
										"Location"
									],
									"MaxAge": "3000"
								}
							]
						},
						"WebsiteConfiguration": {
							"IndexDocument": "index.html",
							"RoutingRules": [
								{
									"RoutingRuleCondition": {
											"HttpErrorCodeReturnedEquals": 404
									},
									"RedirectRule": {
										"HostName": {
											"Fn::Sub": "${Api}.execute-api.${AWS::Region}.amazonaws.com"
										},
										"Protocol": "https",
										"ReplaceKeyPrefixWith": "prod?key=",
										"HttpRedirectCode": 307
									}
								}
							]
						}
					}
				},
				"ResizeFunctionPermission": {
					"Type": "AWS::Lambda::Permission",
					"Properties": {
						"Action": "lambda:InvokeFunction",
						"Principal": "apigateway.amazonaws.com",
						"FunctionName": {
								"Ref": "ResizeFunction"
						},
						"SourceArn": {
								"Fn::Sub": "arn:aws:execute-api:${AWS::Region}:${AWS::AccountId}:${Api}/*"
						}
					}
				},
				"FileBucket":{
					"DeletionPolicy": "Retain",
					"Type": "AWS::S3::Bucket",
					"Properties": {
						"BucketName": bucket,
						"AccessControl": "PublicRead",
						"CorsConfiguration": {
							"CorsRules": [
								{
									"AllowedMethods": [
										"PUT",
										"POST"
									],
									"AllowedOrigins": [
										"*"
									],
									"AllowedHeaders": [
										"Content-Type",
										"x-amz-acl",
										"origin",
										"accept"
									],
									"ExposedHeaders": [
										"Location"
									],
									"MaxAge": "3000"
								}
							]
						},
						"WebsiteConfiguration": {
								"IndexDocument": "index.html"
						}
					}
				}	
			}
		}

		template = JSON.stringify(template);

		const cloudFormationParams = {
			"StackName": stackName,
			"Capabilities": [
				"CAPABILITY_IAM"
			],
			"TemplateBody": template
		}

		cloudformation.createStack(cloudFormationParams, function(err, res) {
			if (err) {
				console.log(err) 
			} else {

				const waitForParams = {
					"StackName": stackName
				};

				cloudformation.waitFor('stackCreateComplete', waitForParams, function(err, res) {
					if (err) {
						console.log(err);
					} else {
						console.log('Stack created!');

						const deleteFileParams = {
							Bucket: tempBucketName,
							Key: tempBucketFile,
						};

						s3.deleteObject(deleteFileParams, function(err, data) {
							if (err) {
								console.log(err);
							} else {

								const deleteBucketParams = {
									Bucket: tempBucketName
								};

								s3.deleteBucket(deleteBucketParams, function(err, res) {
									if (err) {
										console.log(err);
									} else {
										console.log('Temp S3 bucket deleted.')
									}
								});

							}
						});
					}
				});
			}
		});
	};
});
