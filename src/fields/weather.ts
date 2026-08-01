import { Field, GroupField } from 'payload/types';

export const createWeatherField = (
  name: string = 'weather',
  label: string = 'Weather',
  overrides?: Partial<GroupField>,
): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'temperature', type: 'number' },
        { name: 'humidity', type: 'number' },
        { name: 'pressure', type: 'number' },
      ],
    },
    { name: 'condition', type: 'text' },
  ],
  ...overrides,
});
