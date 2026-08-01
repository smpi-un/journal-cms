import { Field, ArrayField } from 'payload/types';
import { createCommentsField } from './comments';
import { createTagsField } from './tags';

export const createWebResourcesField = (
  name: string = 'webResources',
  label: string = 'Web Resources',
  overrides?: Partial<ArrayField>,
): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    {
      name: 'url',
      type: 'text',
      required: true,
    },
    {
      name: 'title',
      type: 'text',
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'imageUrl',
      type: 'text',
      label: 'Image URL',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'files',
      label: 'Saved Image',
    },
    {
      name: 'siteName',
      type: 'text',
    },
    {
      name: 'crawledAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    createTagsField(),
    createCommentsField(),
  ],
  ...overrides,
});
