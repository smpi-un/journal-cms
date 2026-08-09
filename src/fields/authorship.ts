import { Field, GroupField } from 'payload/types';

// Spread directly into an array field's `fields` (e.g. comments, tags) so every
// item records who/what authored it. Append-only arrays keep every AI answer
// even as later answers differ, instead of overwriting history.
export const authorshipSubFields = (): Field[] => [
  {
    name: 'authorType',
    type: 'select',
    label: 'Author',
    required: true,
    defaultValue: 'human',
    options: [
      { label: 'Human', value: 'human' },
      { label: 'AI', value: 'ai' },
    ],
  },
  {
    name: 'aiMeta',
    type: 'group',
    label: 'AI Metadata',
    admin: {
      condition: (_, siblingData) => siblingData?.authorType === 'ai',
    },
    fields: [
      {
        name: 'provider',
        type: 'select',
        label: 'Provider',
        options: [
          { label: 'Anthropic', value: 'anthropic' },
          { label: 'OpenAI', value: 'openai' },
          { label: 'Google', value: 'google' },
          { label: 'Other', value: 'other' },
        ],
      },
      {
        name: 'model',
        type: 'text',
        label: 'Model',
      },
      {
        name: 'respondedAt',
        type: 'date',
        label: 'Responded At',
        // No defaultValue: admin.condition on the parent group only hides
        // this in the UI, it doesn't stop Payload from applying a
        // defaultValue at the data layer. A default here would silently
        // stamp aiMeta.respondedAt on human-authored items too, since the
        // sibling authorType isn't consulted for field-level defaults.
        // The client (which knows when it's writing an AI response) sets
        // this explicitly.
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
          },
        },
      },
    ],
  },
];

// Wraps the same fields in a group, for attaching next to a scalar field
// (e.g. title, summary, alt) to record who/what produced its current value.
export const createAuthorshipField = (
  name: string,
  label: string = 'Source',
  overrides?: Partial<GroupField>,
): Field => ({
  name,
  label,
  type: 'group',
  admin: {
    position: 'sidebar',
  },
  fields: authorshipSubFields(),
  ...overrides,
});
