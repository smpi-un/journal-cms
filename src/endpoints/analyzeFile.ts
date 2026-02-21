import { Endpoint } from 'payload/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const analyzeFile: Endpoint = {
  path: '/analyze-file',
  method: 'post',
  handler: async (req, res) => {
    // Basic Auth Check
    if (!req.user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { filename, mimeType } = req.body;

    if (!filename) {
      return res.status(400).json({ error: 'Filename is required' });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    try {
      // Find file document to get URL
      // Use 'files' collection slug
      const result = await req.payload.find({
        collection: 'files',
        where: {
          filename: {
            equals: filename,
          },
        },
        limit: 1,
      });

      if (result.totalDocs === 0) {
        return res.status(404).json({ error: 'File not found' });
      }

      const fileDoc = result.docs[0];

      // Determine the URL to fetch the file from
      let fetchURL = fileDoc.url;

      // If the URL is relative (e.g. /media/file.jpg), we need to resolve it.
      // If S3 is used, fileDoc.url might already be a full URL if the plugin is configured to do so.
      // However, Payload's S3 plugin often uses the generateFileURL to determining the public URL.
      // If we are server-side, we might need to access S3 directly if the public URL is not accessible strictly (e.g. private bucket).
      // But for this CMS, it seems assets are public.

      if (fetchURL && !fetchURL.startsWith('http')) {
        // It's a relative path.
        // If S3 is configured, we construct the S3 URL.
        if (process.env.S3_ENDPOINT && process.env.S3_BUCKET) {
          const endpoint = process.env.S3_ENDPOINT; // e.g. s3.amazonaws.com
          const bucket = process.env.S3_BUCKET;

          if (process.env.S3_FORCE_PATH_STYLE === 'true') {
            const hasProtocol = endpoint.startsWith('http://') || endpoint.startsWith('https://');
            const protocol = hasProtocol ? '' : 'https://';
            fetchURL = `${protocol}${endpoint}/${bucket}/${filename}`;
          } else {
            const hasProtocol = endpoint.startsWith('http://') || endpoint.startsWith('https://');
            const protocol = hasProtocol ? '' : 'https://';
            fetchURL = `${protocol}${bucket}.${endpoint}/${filename}`;
          }
        } else {
          // Fallback to localhost if S3 is not used (though disableLocalStorage is true)
          // If disableLocalStorage is true and no S3, then where is it?
          // Maybe another storage plugin.
          // For now, assuming S3 as per package.json and config.
          // If we can't construct URL, fail.
          if (!process.env.S3_BUCKET) {
            return res
              .status(500)
              .json({ error: 'Storage configuration issue: Cannot determine file URL.' });
          }
        }
      }

      console.log(`[analyzeFile] Fetching file from: ${fetchURL}`);

      const response = await fetch(fetchURL);
      if (!response.ok) {
        throw new Error(`Failed to fetch file from ${fetchURL}: ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const base64Data = buffer.toString('base64');

      const modelName = 'gemini-2.0-flash-001';
      console.log(
        `[analyzeFile] Base64 data length: ${base64Data.length}, MimeType: ${mimeType || 'image/jpeg'}`,
      );
      console.log(`[analyzeFile] Using model: ${modelName}`);
      const model = genAI.getGenerativeModel({ model: modelName });

      const prompt = `
      Analyze this image and provide the following in JSON format:
      1. OCR text found in the image (preserve original language).
      2. A description of the image (in Japanese).
      3. A list of tags relevant to the image (in Japanese).

      Output JSON format:
      {
        "ocr": "text found...",
        "description": "description...",
        "tags": ["tag1", "tag2"]
      }
      `;

      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType: mimeType || 'image/jpeg',
        },
      };

      console.log('[analyzeFile] Generating content...');
      const aiResult = await model.generateContent([prompt, imagePart], {
        timeout: 30000,
      });
      console.log('[analyzeFile] Content generated.');
      const aiResponse = aiResult.response;
      let text = aiResponse.text();

      // Clean up markdown code blocks if present
      text = text
        .replace(/```json/g, '')
        .replace(/```/g, '')
        .trim();

      let analysis;
      try {
        analysis = JSON.parse(text);
      } catch {
        console.error('Failed to parse AI response:', text);
        return res.status(500).json({ error: 'Failed to parse AI response', raw: text });
      }

      res.status(200).json({
        success: true,
        analysis: {
          ocr: analysis.ocr,
          description: analysis.description,
          tags: analysis.tags,
        },
      });
    } catch (error) {
      console.error('Error analyzing file:', error);
      res.status(500).json({
        error: 'Failed to analyze file',
        details: error instanceof Error ? error.message : String(error),
      });
    }
  },
};

export default analyzeFile;
