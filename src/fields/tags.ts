import { Field, ArrayField } from 'payload/types';

export const createTagsField = (overrides?: Partial<ArrayField>): Field => {
  const tagsField: ArrayField = {
    name: 'tags',
    type: 'array',
    fields: [
      {
        name: 'tag',
        type: 'text',
      },
    ],
    ...overrides,
  };
  return tagsField;
};
