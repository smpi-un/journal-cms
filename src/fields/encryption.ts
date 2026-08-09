import { Field, GroupField } from 'payload/types';

// Records the encryption state of a document. Encryption/decryption itself
// happens entirely client-side — Payload never sees plaintext for encrypted
// scopes, this group only tracks what state the stored data is in.
export const createEncryptionMetaField = (
  name: string = 'encryption',
  label: string = 'Encryption',
  overrides?: Partial<GroupField>,
): Field => ({
  name,
  label,
  type: 'group',
  admin: {
    position: 'sidebar',
    description:
      'Encryption/decryption is performed client-side. This only records state — Payload does not encrypt or decrypt anything itself.',
  },
  fields: [
    {
      name: 'scope',
      type: 'select',
      label: 'Scope',
      defaultValue: 'none',
      required: true,
      options: [
        { label: 'None (plaintext)', value: 'none' },
        { label: 'Partial (content fields only)', value: 'partial' },
        { label: 'Full (including title/tags)', value: 'full' },
      ],
    },
    {
      name: 'algorithm',
      type: 'text',
      label: 'Algorithm',
      defaultValue: 'AES-256-GCM',
      admin: {
        condition: (_, siblingData) => siblingData?.scope !== 'none',
      },
    },
    {
      name: 'keyId',
      type: 'text',
      label: 'Key ID',
      admin: {
        condition: (_, siblingData) => siblingData?.scope !== 'none',
        description: 'Identifies which client-held key/version encrypted this document (supports key rotation).',
      },
    },
    {
      name: 'encryptedAt',
      type: 'date',
      label: 'Encrypted At',
      admin: {
        condition: (_, siblingData) => siblingData?.scope !== 'none',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
  ],
  ...overrides,
});
