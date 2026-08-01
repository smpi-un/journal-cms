import { Field, ArrayField } from 'payload/types';

export const createAttachmentsField = (
  name: string = 'attachments',
  label: string = 'Attachments',
  overrides?: Partial<ArrayField>,
): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    {
      name: 'file',
      type: 'upload',
      relationTo: 'files',
      required: true,
    },
    {
      name: 'description',
      type: 'text',
      label: 'Description / Caption',
    },
  ],
  ...overrides,
});
