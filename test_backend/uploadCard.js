const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const API_URL = 'https://955419w6w3.execute-api.us-west-2.amazonaws.com/prod/cards';

// === Modify these ===
const imagePath = './me.jpeg';   // Path to your image file
const id = uuidv4();             // Generate a random unique ID for the card
const name = 'Isaac Headshot'; // Metadata name

async function uploadImage() {
  try {
    const imageBase64 = fs.readFileSync(path.resolve(imagePath), { encoding: 'base64' });

    const payload = {
      id,
      name,
      imageBase64
    };

    const response = await axios.post(API_URL, payload, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Upload success:', response.data);
  } catch (err) {
    console.error('❌ Upload failed:', err.response?.data || err.message);
  }
}

uploadImage();
