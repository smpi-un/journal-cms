import { CollectionConfig, PayloadRequest } from 'payload/types';
import path from 'path';

const Files: CollectionConfig = {
  slug: 'files',
  upload: {
    staticURL: '/files',
    staticDir: path.resolve(__dirname, '../../media/files'),
    imageSizes: [],
    mimeTypes: undefined,
    adminThumbnail: 'filename',
  },
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
  },
  hooks: {
    beforeChange: [
      ({ req, data, operation }: { req: PayloadRequest & { file?: any }, data: any, operation: any }) => {
        // For 'create' operations, save the original filename.
        if (operation === 'create') {
          // req.file is reliable for admin UI uploads.
          if (req.file) {
            return { ...data, originalFilename: req.file.name };
          }
          // Fallback for API uploads where req.file might not be present.
          if (data.filename) {
            return { ...data, originalFilename: data.filename };
          }
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Description / Alt Text',
    },
    {
      name: 'originalFilename',
      type: 'text',
      label: 'Original Filename',
      admin: {
        readOnly: true, // 管理画面では読み取り専用
        position: 'sidebar', // サイドバーに表示
      },
    },
    {
      name: 'metaData',
      type: 'textarea', // JSON文字列として保存
      label: 'Meta Data (JSON)',
      admin: {
        description: 'Store additional metadata as a JSON string. Make sure it is valid JSON.',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Tags',
      fields: [
        {
          name: 'tag',
          type: 'text',
          label: 'Tag',
        },
      ],
      admin: {
        description: 'Add tags to categorize the file.',
      },
    },
  ],
};

export default Files;