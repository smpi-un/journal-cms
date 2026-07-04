import { CollectionConfig } from 'payload/types';
import AiAnalysisButton from '../components/AiAnalysisButton';
import { createCommentsField } from '../fields/comments';
import { createTagsField } from '../fields/tags';
import { createPropertiesField } from '../fields/properties';

const Files: CollectionConfig = {
  slug: 'files',
  versions: {
    maxPerDoc: 10,
    drafts: false, // ドラフト機能を無効化（ファイルアップロードのエラー回避のため）
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    disableLocalStorage: true,
    mimeTypes: ['image/*', 'video/*', 'audio/*', 'application/pdf'],
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
    createTagsField('tags', 'Tags', {
      admin: {
        description: 'Add tags to categorize the file.',
      },
    }),
    createPropertiesField('properties', 'Properties', {
      admin: {
        position: 'sidebar',
        description: 'Add custom key-value properties.',
      },
    }),
    createCommentsField(),
    {
      name: 'fileType',
      type: 'select',
      label: 'File Type',
      defaultValue: 'other',
      options: [
        { label: 'Image', value: 'image' },
        { label: 'Video', value: 'video' },
        { label: 'Audio', value: 'audio' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'imageDetails',
      type: 'group',
      label: 'Image Details',
      admin: {
        condition: (data) => data?.fileType === 'image',
      },
      fields: [
        {
          name: 'width',
          type: 'number',
          label: 'Width (px)',
        },
        {
          name: 'height',
          type: 'number',
          label: 'Height (px)',
        },
        {
          name: 'exif',
          type: 'textarea', // JSON format
          label: 'Exif Data (JSON)',
        },
      ],
    },
    {
      name: 'aiAnalysis',
      type: 'group',
      label: 'AI Analysis',
      admin: {
        condition: (data) => data?.fileType === 'image',
      },
      fields: [
        {
          name: 'aiAnalysisButton',
          type: 'ui',
          label: 'Action',
          admin: {
            components: {
              Field: AiAnalysisButton,
            },
          },
        },
        {
          name: 'ocr',
          type: 'group',
          label: 'OCR Results',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              label: 'Text',
            },
            {
              name: 'model',
              type: 'text',
              label: 'Model',
            },
            {
              name: 'analyzedAt',
              type: 'date',
              label: 'Analyzed At',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
        {
          name: 'description',
          type: 'group',
          label: 'Descriptions & Tags',
          fields: [
            {
              name: 'text',
              type: 'textarea',
              label: 'Description Text',
            },
            {
              name: 'tags',
              type: 'array',
              label: 'Tags',
              fields: [
                {
                  name: 'item',
                  type: 'text',
                },
              ],
            },
            {
              name: 'model',
              type: 'text',
              label: 'Model',
            },
            {
              name: 'analyzedAt',
              type: 'date',
              label: 'Analyzed At',
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                },
              },
            },
          ],
        },
      ],
    },
  ],
};

export default Files;
