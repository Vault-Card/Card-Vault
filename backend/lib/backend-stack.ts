import * as cdk from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import path = require('path');
import * as fs from 'fs';
import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // EC2 Instance for model
    const vpc = new ec2.Vpc(this, 'MLVpc', {
      maxAzs: 1
    });

    const securityGroup = new ec2.SecurityGroup(this, 'FlaskSG', {
      vpc,
      description: 'Allow SSH and Flask HTTP access',
      allowAllOutbound: true
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22), 'Allow SSH');
    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5000), 'Allow Flask');

    const userDataScript = fs.readFileSync('user_data.sh', 'utf8');

    const instance = new ec2.Instance(this, 'MLModelInstance', {
      vpc,
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T2,
        ec2.InstanceSize.MEDIUM
      ),
      machineImage: ec2.MachineImage.latestAmazonLinux2023(),
      securityGroup,
    });

    instance.addUserData(userDataScript);
    
    // API Gateway
    const restApi = new RestApi(this, 'cards-api');

    // DynamoDB
    const table = new dynamodb.Table(this, 'Table', {
      partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
      tableClass: dynamodb.TableClass.STANDARD,
      tableName: 'cards'
    });

    // add S3 bucket
    const bucket = new s3.Bucket(this, 'MyBucket', {
      removalPolicy: cdk.RemovalPolicy.DESTROY, // NOT recommended for production code
      autoDeleteObjects: true, // NOT recommended for production code
      bucketName: 'card-photo-bucket',
    });
 
    // Lambdas
    const uploadCardFunction = new NodejsFunction(this, 'UploadCardFunction', {
      entry: path.join(__dirname, '/lambdas/cardPhotoUpload.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X, // ADD THIS LINE
      environment: {
        TABLE_NAME: table.tableName,
        BUCKET_NAME: bucket.bucketName,
      }
    });

    const deleteCardFunction = new NodejsFunction(this, 'DeleteCardFunction', {
      entry: path.join(__dirname, '/lambdas/cardPhotoDelete.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X, // ADD THIS LINE
      environment: {
        TABLE_NAME: table.tableName,
        BUCKET_NAME: bucket.bucketName,
      }
    });

    uploadCardFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:PutItem'],
      resources: ['arn:aws:dynamodb:us-west-2:263167772103:table/cards'],
    }));

    deleteCardFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:DeleteItem'],
      resources: ['arn:aws:dynamodb:us-west-2:263167772103:table/cards'],
    }));

    table.grantWriteData(uploadCardFunction);
    table.grantWriteData(deleteCardFunction);

    // Grant the Lambda function permissions to write to the S3 bucket
    bucket.grantWrite(new iam.ServicePrincipal('lambda.amazonaws.com'));

    // Add a policy to allow the Lambda function to write to the S3 bucket
    uploadCardFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:PutObject'],
      resources: [`arn:aws:s3:::${bucket.bucketName}/*`],
    }));

    deleteCardFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:DeleteObject'],
      resources: [`arn:aws:s3:::${bucket.bucketName}/*`],
    }));

    

    const cardsResource = restApi.root.addResource('cards');
    // Add a GET method to that resource and link it to your Lambda
    // cardsResource.addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(getCardsFunction));
    cardsResource.addMethod('POST', new cdk.aws_apigateway.LambdaIntegration(uploadCardFunction));
    cardsResource.addMethod('DELETE', new cdk.aws_apigateway.LambdaIntegration(deleteCardFunction));

  }
}
