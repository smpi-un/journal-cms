import { Field, ArrayField } from 'payload/types';

export const createTagsField = (
  name: string = 'tags',
  label: string = 'Tags',
  overrides?: Partial<ArrayField>,
): Field => ({
  name,
  label,
  type: 'array',
  fields: [
    {
      name: 'tag',
      type: 'text',
      label: 'Tag',
    },
  ],
  ...overrides,
});
