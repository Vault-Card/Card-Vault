import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const dynamo = new DynamoDBClient({});
const s3 = new S3Client({});

export const handler = async (event: any) => {
  const { id, name } = JSON.parse(event.body);

  // Put item into DynamoDB
  await dynamo.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      id: { S: id },
      name: { S: name },
    }
  }));

  // Upload file to S3
  await s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: `${id}.txt`,
    Body: `User: ${name}`,
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Success!' }),
  };
};
