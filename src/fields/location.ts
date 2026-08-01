import { Field, GroupField } from 'payload/types';

export const createLocationField = (
  name: string = 'location',
  label: string = 'Location',
  overrides?: Partial<GroupField>,
): Field => ({
  name,
  label,
  type: 'group',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'latitude', type: 'number' },
        { name: 'longitude', type: 'number' },
      ],
    },
    { name: 'name', type: 'text' },
    { name: 'address', type: 'text' },
    { name: 'altitude', type: 'number' },
  ],
  ...overrides,
});
