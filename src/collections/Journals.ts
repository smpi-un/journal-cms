import { CollectionConfig } from 'payload/types';

const Journals: CollectionConfig = {
  slug: 'journals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['entryAt', 'title', 'moodLabel'],
  },
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // --- タブ1: メインコンテンツ ---
        {
          label: 'Main',
          fields: [
            {
              name: 'entryAt',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'yyyy-MM-dd HH:mm',
                },
              },
            },
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'richTextContent',
              type: 'richText',
            },
            {
              name: 'textContent',
              type: 'textarea',
            },
            // ▼ ここが指示通りの修正箇所
            {
              name: 'attachments',
              label: 'Attachments',
              type: 'array',
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'files', // Files コレクションと紐付け
                  required: true,
                },
              ],
            },
          ],
        },

        // --- タブ2: 整理・分類 ---
        {
          label: 'Organization',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isFavorite',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'isPinned',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'notebook',
              type: 'text',
            },
            {
              name: 'tags',
              type: 'array',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // --- タブ3: コンテキスト ---
        {
          label: 'Context',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'moodLabel',
                  type: 'text',
                },
                {
                  name: 'moodScore',
                  type: 'number',
                },
              ],
            },
            {
              name: 'activities',
              type: 'array',
              fields: [
                {
                  name: 'activity',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // --- タブ4: 環境 (位置・天気) ---
        {
          label: 'Environment',
          fields: [
            {
              name: 'location',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'latitude', type: 'number' },
                    { name: 'longitude', type: 'number' },
                  ],
                },
                { name: 'name', type: 'text' },
                { name: 'address', type: 'text' },
                { name: 'altitude', type: 'number' },
              ],
            },
            {
              name: 'weather',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'temperature', type: 'number' },
                    { name: 'humidity', type: 'number' },
                    { name: 'pressure', type: 'number' },
                  ],
                },
                { name: 'condition', type: 'text' },
              ],
            },
          ],
        },

        // --- タブ5: メタデータ ---
        {
          label: 'Meta',
          fields: [
            {
              name: 'timezone',
              type: 'text',
            },
            {
              type: 'row',
              fields: [
                { name: 'deviceName', type: 'text' },
                { name: 'stepCount', type: 'number' },
              ],
            },
            {
              name: 'source',
              type: 'group',
              fields: [
                { name: 'appName', type: 'text' },
                { name: 'originalId', type: 'text' },
                { name: 'importedAt', type: 'date' },
                { name: 'rawData', type: 'json' },
              ],
            },
            // DB上の作成・更新日時とは別に保持したい場合
            {
              name: 'created_at',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'modified_at',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
      ],
    },
  ],
};

export default Journals;