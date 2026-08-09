import express from 'express';
import payload from 'payload';
import 'dotenv/config';

const app = express();

// Redirect root to Admin panel
app.get('/', (_, res) => {
  res.redirect('/admin');
});

const start = async () => {
  // Add S3 proxy middleware before initializing Payload to intercept /media requests
  const { createProxyMiddleware } = await import('http-proxy-middleware');

  app.use(
    '/media',
    createProxyMiddleware({
      target: `http://garage:3902`,
      changeOrigin: false,
      pathRewrite: {
        '^/media': '',
      },
      headers: {
        host: `payload-media.s3.garage`,
      },
    }),
  );

  // Initialize Payload
  await payload.init({
    secret: process.env.PAYLOAD_SECRET,
    mongoURL: process.env.MONGODB_URI,
    express: app,
    onInit: async () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  app.listen(3000);
};

start();
