import { Field } from 'payload/types';

export const createCommentsField = (
  name: string = 'comments',
  label: string = 'Comments',
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
  ],
});
