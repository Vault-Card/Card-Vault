import * as cdk from 'aws-cdk-lib';
import { RestApi } from 'aws-cdk-lib/aws-apigateway';
import { Construct } from 'constructs';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

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
      entry: 'lambda/getCards.ts',
      handler: 'handler',
      environment: {
        TABLE_NAME: table.tableName
      }
    });

  }
}
