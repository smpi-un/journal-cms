// src/endpoints/generateSummary.ts
import { Endpoint } from 'payload/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const generateSummary: Endpoint = {
  path: '/generate-summary',
  method: 'post',
  handler: async (req, res) => {
    console.log('[/api/generate-summary] Received request.');
    const { content } = req.body; // Only expecting content now

    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      console.error('[/api/generate-summary] GEMINI_API_KEY is not set.');
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured on the server.' });
    }

    const prompt = `以下の文章を300文字以内で要約してください:

${content}`;

    try {
      const modelName = process.env.GEMINI_MODEL_NAME || 'gemini-pro'; // Default to gemini-pro for maximum compatibility
      console.log(`[/api/generate-summary] Using model: ${modelName}`);

      console.log('[/api/generate-summary] Getting generative model...');
      const model = genAI.getGenerativeModel({ model: modelName });
      console.log('[/api/generate-summary] Model obtained. Generating content...');

      const result = await model.generateContent(prompt, {
        timeout: 20000,
      });
      console.log('[/api/generate-summary] Content generated.');

      const response = result.response;
      const summary = response.text();

      res.status(200).json({ summary });
    } catch (error) {
      console.error('Gemini API Error:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      res.status(500).json({ error: errorMessage });
    }
  },
};

export default generateSummary;
