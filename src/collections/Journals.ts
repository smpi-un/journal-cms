import { CollectionConfig } from 'payload/types';

const Journals: CollectionConfig = {
  slug: 'journals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['entryAt', 'title', 'moodLabel'],
  },
  access: {
    read: () => true,
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
              name: 'entryAt', // Python: entry_at
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
              name: 'title', // Python: title
              type: 'text',
            },
            {
              name: 'richTextContent', // Python: rich_text_content
              type: 'richText',
            },
            {
              name: 'textContent', // Python: text_content
              type: 'textarea',
            },
            // ▼ ここが指示通りの修正箇所
            {
              name: 'attachments', // Python: media_attachments (指示によりリネーム)
              label: 'Attachments',
              type: 'array',
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'files', // さっき作った Files コレクションと紐付け
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
                  name: 'isFavorite', // Python: is_favorite
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'isPinned', // Python: is_pinned
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'notebook', // Python: notebook
              type: 'text',
            },
            {
              name: 'tags', // Python: tags
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
                  name: 'moodLabel', // Python: mood_label
                  type: 'text',
                },
                {
                  name: 'moodScore', // Python: mood_score
                  type: 'number',
                },
              ],
            },
            {
              name: 'activities', // Python: activities
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
            // Python: location_xxx (Group化)
            {
              name: 'location',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'latitude', type: 'number' }, // lat
                    { name: 'longitude', type: 'number' }, // lon
                  ],
                },
                { name: 'name', type: 'text' },
                { name: 'address', type: 'text' },
                { name: 'altitude', type: 'number' },
              ],
            },
            // Python: weather_xxx (Group化)
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
              name: 'timezone', // Python: timezone
              type: 'text',
            },
            {
              type: 'row',
              fields: [
                { name: 'deviceName', type: 'text' }, // Python: device_name
                { name: 'stepCount', type: 'number' }, // Python: step_count
              ],
            },
            // Python: source_xxx (Group化)
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
              name: 'created_at', // Python: created_at
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'modified_at', // Python: modified_at
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