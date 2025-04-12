import * as cdk from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import path = require('path');
// import * as sqs from 'aws-cdk-lib/aws-sqs';
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
 
    // Lambda
    const getCardsFunction = new NodejsFunction(this, 'MyFunction', {
      entry: path.join(__dirname, '/lambdas/dataHandler.ts'),
      handler: 'handler',
      runtime: Runtime.NODEJS_22_X, // ADD THIS LINE

      bundling: {
        forceDockerBundling: false, // force using local esbuild
      },
      environment: {
        TABLE_NAME: table.tableName
      }
    });


    const cardsResource = restApi.root.addResource('cards');

    // Add a GET method to that resource and link it to your Lambda
    cardsResource.addMethod('GET', new cdk.aws_apigateway.LambdaIntegration(getCardsFunction));
  }
}
