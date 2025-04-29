import * as cdk from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');
import * as s3 from 'aws-cdk-lib/aws-s3';
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Runtime } from 'aws-cdk-lib/aws-lambda';

export class BackendStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

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
 
    // Lambda
    const getCardsFunction = new NodejsFunction(this, 'MyFunction', {
      entry: path.join(__dirname, '/lambdas/dataHandler.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X, // ADD THIS LINE

      bundling: {
        forceDockerBundling: false, // force using local esbuild
      },
      environment: {
        TABLE_NAME: table.tableName,
        BUCKET_NAME: bucket.bucketName,
      }
    });

    getCardsFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['dynamodb:PutItem'],
      resources: ['arn:aws:dynamodb:us-west-2:263167772103:table/cards'],
    }));

    table.grantWriteData(getCardsFunction);

    // Grant the Lambda function permissions to write to the S3 bucket
    bucket.grantWrite(new iam.ServicePrincipal('lambda.amazonaws.com'));
    // Add a policy to allow the Lambda function to write to the S3 bucket
    getCardsFunction.addToRolePolicy(new iam.PolicyStatement({
      effect: iam.Effect.ALLOW,
      actions: ['s3:PutObject'],
      resources: [`arn:aws:s3:::${bucket.bucketName}/*`],
    }));

    

    const cardsResource = restApi.root.addResource('cards');

    // Add a GET method to that resource and link it to your Lambda
    // cardsResource.addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(getCardsFunction));
    cardsResource.addMethod('POST', new cdk.aws_apigateway.LambdaIntegration(getCardsFunction));

  }
}
