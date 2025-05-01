import { DynamoDBClient, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3';

const dynamo = new DynamoDBClient({});
const s3 = new S3Client({});

export const handler = async (event: any) => {
  const isApiGateway = !!event.queryStringParameters || !!event.body;
  const data = isApiGateway ? JSON.parse(event.body || '{}') : event;
  const { id } = data;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing card id.' }),
    };
  }

  const tableName = process.env.TABLE_NAME!;
  const bucketName = process.env.BUCKET_NAME!;
  const imageKey = `${id}.jpg`;

  try {
    await dynamo.send(new DeleteItemCommand({
      TableName: tableName,
      Key: { id: { S: id } },
    }));

    await s3.send(new DeleteObjectCommand({
      Bucket: bucketName,
      Key: imageKey,
    }));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Deleted card ${id}` }),
    };
  } catch (error: any) {
    console.error('Error deleting card:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Delete failed', error: error.message }),
    };
  }
};
