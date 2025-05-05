const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// const API_URL = 'https://955419w6w3.execute-api.us-west-2.amazonaws.com/prod/cards'; 
const API_URL = 'http://ec2-3-20-222-164.us-east-2.compute.amazonaws.com:5000/uploads'


const imagePath = './me.jpeg';   
const id = uuidv4();            
const name = 'Isaac Headshot';

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
