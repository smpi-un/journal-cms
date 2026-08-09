import { CollectionConfig } from 'payload/types';
import { createCommentsField } from '../fields/comments';
import { createTagsField } from '../fields/tags';
import { createPropertiesField } from '../fields/properties';
import { createAuthorshipField } from '../fields/authorship';
import { createEncryptionMetaField } from '../fields/encryption';

import { createWebResourcesField } from '../fields/web-resources';
import { createLocationField } from '../fields/location';
import { createWeatherField } from '../fields/weather';
import { createAttachmentsField } from '../fields/attachments';

const Journals: CollectionConfig = {
  slug: 'journals',
  versions: {
    maxPerDoc: 10, // 1ドキュメントあたり保持する最大履歴数（古いものから削除）
    drafts: {
      autosave: {
        // 自動保存の設定（任意）
        interval: 2000, // 2秒ごとに自動保存
      },
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['entryAt', 'title', 'moodLabel'],
  },
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user),
    create: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    createEncryptionMetaField(),
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
            createAuthorshipField('titleAuthorship', 'Title Source'),
            {
              name: 'richTextContent',
              type: 'richText',
            },
            {
              name: 'textContent',
              type: 'textarea',
            },
            // AI要約はPayload外部のクライアントがAIへ直接問い合わせて生成し、PATCHで書き込みます。
            // Payload自身がAIを呼び出すことはありません。
            {
              name: 'summary',
              type: 'textarea',
              admin: {
                description:
                  'AI要約はPayload外部のクライアントがAIへ直接問い合わせて生成し、PATCHで書き込みます。Payload自身がAIを呼び出すことはありません。',
              },
            },
            createAuthorshipField('summaryAuthorship', 'Summary Source'),
            // Unified Attachments Field
            createAttachmentsField(),
            // Web Resources Field
            createWebResourcesField(),
            // Comments Field
            createCommentsField(),
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
            createTagsField(),
            createPropertiesField('properties', 'Properties', {
              admin: {
                description: 'Add custom key-value properties.',
              },
            }),
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
          fields: [createLocationField(), createWeatherField()],
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
