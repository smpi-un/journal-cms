import { CollectionConfig } from 'payload/types';

const Files: CollectionConfig = {
  slug: 'files',
  versions: {
    maxPerDoc: 10, // 1ドキュメントあたり保持する最大履歴数（古いものから削除）
    drafts: {
      autosave: {
        // 自動保存の設定（任意）
        interval: 2000, // 2秒ごとに自動保存
      },
    },
  },
  upload: {
    adminThumbnail: 'filename',
  },
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
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
