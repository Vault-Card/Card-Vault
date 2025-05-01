const fs = require('fs');
const path = require('path');
const axios = require('axios');
const uuid = require('uuid');

const API_URL = 'https://d942zlq098.execute-api.us-east-1.amazonaws.com/prod/cards';

// === Modify these ===
const imagePath = './me.jpeg';  
const cardId = uuid.v4(); 
const cardName = 'Isaac Linkedin';
const cardPrice = 12.99;
const printId = '1st-edition';

async function uploadCard() {
  try {
    const imageBase64 = fs.readFileSync(path.resolve(imagePath), { encoding: 'base64' });

    const card = {
      id: cardId,
      name: cardName,
      price: cardPrice,
      print_id: printId,
      imageBase64, // Only needed by Lambda to upload to S3
      // imgurl will be generated in the Lambda based on bucket name + id
    };

    const response = await axios.post(API_URL, { card }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    console.log('✅ Upload success:', response.data);
  } catch (err) {
    console.error('❌ Upload failed:', err.response?.data || err.message);
  }
}

uploadCard();

