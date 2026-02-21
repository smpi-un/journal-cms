import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
import path from 'path';

// Load env from root
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error('API KEY NOT FOUND in .env');
  process.exit(1);
}

console.log('API Key found:', apiKey.substring(0, 5) + '...');

const genAI = new GoogleGenerativeAI(apiKey);

async function testModel() {
  const modelName = 'gemini-2.0-flash-001';
  console.log(`Testing model: ${modelName} with image input...`);
  try {
    const model = genAI.getGenerativeModel({ model: modelName });

    // 1x1 Transparent PNG
    const base64Data =
      'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';
    const mimeType = 'image/png';

    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent(['Describe this image', imagePart]);
    console.log('Success! Response:', result.response.text());
  } catch (error: any) {
    console.error('Error testing model:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
    }
  }
}

testModel();
