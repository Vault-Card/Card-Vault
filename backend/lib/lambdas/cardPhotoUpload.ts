import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const dynamo = new DynamoDBClient({});
const s3 = new S3Client({});

export const handler = async (event: any) => {
  const isApiGateway = !!event.queryStringParameters || !!event.body;
  const data = isApiGateway ? JSON.parse(event.body || '{}') : event;
  const { card } = data;

  if (!card || !card.id || !card.name || !card.imageBase64) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Missing required fields in card object.' }),
    };
  }

  const bucketName = process.env.BUCKET_NAME!;
  const imageKey = `${card.id}.jpg`;
  const imageUrl = `https://${bucketName}.s3.amazonaws.com/${imageKey}`;

  // Store metadata in DynamoDB
  await dynamo.send(new PutItemCommand({
    TableName: process.env.TABLE_NAME,
    Item: {
      id:        { S: card.id },
      name:      { S: card.name },
      imgurl:    { S: imageUrl },
      price:     { N: String(card.price || 0) },
      print_id:  { S: card.print_id || '' },
    }
  }));

  // Upload image to S3
  const imageBuffer = Buffer.from(card.imageBase64, 'base64');

  await s3.send(new PutObjectCommand({
    Bucket: bucketName,
    Key: imageKey,
    Body: imageBuffer,
    ContentType: 'image/jpeg',
  }));

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Card uploaded successfully!',
      s3Key: imageKey,
      imageUrl,
    }),
  };
};
