import { Field, ArrayField } from 'payload/types';
import { authorshipSubFields } from './authorship';

export const createCommentsField = (
  name: string = 'comments',
  label: string = 'Comments',
  overrides?: Partial<ArrayField>,
): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    {
      name: 'commentDate',
      type: 'date',
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'commentBody',
      type: 'textarea',
      label: 'Comment',
      required: true,
    },
    ...authorshipSubFields(),
  ],
  ...overrides,
});
