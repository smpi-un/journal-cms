import express from 'express';
import payload from 'payload';
import 'dotenv/config';

process.env.DIFY_API_KEY = process.env.DIFY_API_KEY || '';
process.env.DIFY_DATASET_ID = process.env.DIFY_DATASET_ID || '';
process.env.DIFY_API_URL = process.env.DIFY_API_URL || '';

const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  // Add your own express routes here

  app.listen(3000);
};

start();
