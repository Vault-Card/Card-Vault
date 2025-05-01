import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const dynamo = new DynamoDBClient({});
const s3 = new S3Client({});

export const handler = async (event: any) => {
  const isApiGateway = !!event.queryStringParameters || !!event.body;

  // Parse input from query params or direct invocation
  const data = isApiGateway ? JSON.parse(event.body || '{}') : event;
  const { id, name, imageBase64 } = data;

  console.log("id:", id);
  console.log("name:", name);
  console.log("adding print statement to test CI/CD changes.")

  if (!id || !name || !imageBase64) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields: id, name, imageBase64' }),
    };
  }

  // Store metadata in DynamoDB
  await dynamo.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      id: { S: id },
      name: { S: name },
    }
  }));

  // Decode base64 image and store in S3
  const imageBuffer = Buffer.from(imageBase64, 'base64');
  const imageKey = `${id}.jpg`;

  await s3.send(new PutObjectCommand({
    Bucket: process.env.BUCKET_NAME,
    Key: imageKey,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Image and metadata stored!',
      s3Key: imageKey,
    }),
  };
};
