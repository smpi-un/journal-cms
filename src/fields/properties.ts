import { Field, ArrayField } from 'payload/types';

export const createPropertiesField = (overrides?: Partial<ArrayField>): Field => {
  const propertiesField: ArrayField = {
    name: 'properties',
    type: 'array',
    label: 'Properties',
    fields: [
      {
        name: 'key',
        type: 'text',
        label: 'Key',
        required: true,
      },
      {
        name: 'value',
        type: 'text',
        label: 'Value',
        required: true,
      },
    ],
    admin: {
      description: 'Add custom key-value properties.',
    },
    ...overrides,
  };
  return propertiesField;
};
