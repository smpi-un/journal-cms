import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Posts from './collections/Posts'; // ← 1. インポートを追加
import Files from './collections/Files';
import Journals from './collections/Journals';
import { payloadCloud } from '@payloadcms/plugin-cloud';
import BeforeDashboard from './components/BeforeDashboard';
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      // The BeforeDashboard component renders the 'welcome' block that you see after logging into your admin panel.
      // Feel free to delete this at any time. Simply remove the line below and the import BeforeDashboard statement on line 5.
      beforeDashboard: [BeforeDashboard],
    }
  },
  upload: {
    defParamCharset: 'utf-8',
  },
  collections: [
    Users,
    Posts,
    Files,
    Journals,
  ],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [
    payloadCloud(),
    cloudStorage({
      collections: {
        'files': { // Uploadsを有効にしているコレクション
          disableLocalStorage: true,
          prefix: '', // ← add
          adapter: s3Adapter({
            config: {
              endpoint: process.env.S3_ENDPOINT,
              region: process.env.S3_REGION,
              credentials: {
                accessKeyId: process.env.S3_ACCESS_KEY,
                secretAccessKey: process.env.S3_SECRET_KEY,
              },
              forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
            },
            bucket: process.env.S3_BUCKET,
          }),
          // ブラウザ用のURLを生成する関数
          generateFileURL: (file) => {
            return `http://localhost:9000/${process.env.S3_BUCKET}/${file.filename}`;
          },
        },
      },
    }),
  ]
});
