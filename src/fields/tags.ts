import { Field, ArrayField } from 'payload/types';

export const createTagsField = (overrides?: Partial<ArrayField>): Field => {
  const tagsField: ArrayField = {
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
    ...overrides,
  };
  return tagsField;
};
