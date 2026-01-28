import { buildConfig } from 'payload/config';
import path from 'path';
import Users from './collections/Users';
import Files from './collections/Files';
import Journals from './collections/Journals'; // Corrected typo here
import { payloadCloud } from '@payloadcms/plugin-cloud';
import BeforeDashboard from './components/BeforeDashboard';
import DifyDashboard from './components/DifyDashboard'; // Import DifyDashboard
import { cloudStorage } from '@payloadcms/plugin-cloud-storage';
import { s3Adapter } from '@payloadcms/plugin-cloud-storage/s3';
import generateSummary from './endpoints/generateSummary';

import Collections from './collections/Collections';

export default buildConfig({
  admin: {
    user: Users.slug,
    components: {
      beforeDashboard: [BeforeDashboard],
      afterDashboard: [DifyDashboard], // Add DifyDashboard here
    },
  },
  upload: {
    defParamCharset: 'utf-8',
  },
  collections: [Users, Files, Journals, Collections],
  endpoints: [generateSummary],
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
        files: {
          disableLocalStorage: true,
          prefix: '',
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
          generateFileURL: (file) => {
            return `${process.env.S3_PUBLIC_ENDPOINT}/${process.env.S3_BUCKET}/${file.filename}`;
          },
        },
      },
    }),
  ],
});
