import { CollectionConfig } from 'payload/types';

const JournalsCollection: CollectionConfig = {
  slug: 'groupings', // "collections" is a reserved word in some contexts, so using "groupings" or keeping user facing label as "Collections"
  labels: {
    singular: 'Collection',
    plural: 'Collections',
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'journalCount', 'updatedAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      name: 'type',
      type: 'select',
      defaultValue: 'static',
      options: [
        { label: 'Manual (Static)', value: 'static' },
        { label: 'Smart (Dynamic)', value: 'dynamic' },
      ],
      required: true,
      admin: {
        description:
          'Manual: Manually select journals. Smart: Automatically gather journals based on rules.',
      },
    },
    // Dynamic Rules Configuration
    {
      name: 'rules',
      type: 'group',
      admin: {
        condition: (data) => data.type === 'dynamic',
        description: 'Journals matching ANY of these rules will be included.',
      },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'dateStart',
              type: 'date',
              admin: {
                date: { pickerAppearance: 'dayOnly' },
                placeholder: 'Start Date',
              },
            },
            {
              name: 'dateEnd',
              type: 'date',
              admin: {
                date: { pickerAppearance: 'dayOnly' },
                placeholder: 'End Date',
              },
            },
          ],
        },
        {
          name: 'tags',
          type: 'array',
          admin: {
            description: 'Match journals with these tags (OR match)',
          },
          fields: [
            {
              name: 'tag',
              type: 'text',
            },
          ],
        },
        {
          name: 'moods',
          type: 'array',
          admin: {
            description: 'Match journals with these moods',
          },
          fields: [
            {
              name: 'mood',
              type: 'text',
            },
          ],
        },
      ],
    },
    // The actual Relationship
    {
      name: 'journals',
      type: 'relationship',
      relationTo: 'journals',
      hasMany: true,
      admin: {
        description: 'List of journals in this collection. Auto-populated if type is Smart.',
      },
    },
    // Meta for counts etc
    {
      name: 'journalCount',
      type: 'number',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req }) => {
        if (data.type === 'dynamic') {
          // Logic to populate 'journals' based on 'rules'
          // We need to construct a query for proper 'journals' collection

          const where: any = {
            and: [],
          };

          // Validations needed?
          // If no rules are set, maybe clear results?
          const rules = data.rules || {};
          let hashRules = false;

          // Date Range
          if (rules.dateStart) {
            where.and.push({
              entryAt: {
                greater_than_equal: rules.dateStart,
              },
            });
            hashRules = true;
          }
          if (rules.dateEnd) {
            where.and.push({
              entryAt: {
                less_than_equal: rules.dateEnd,
              },
            });
            hashRules = true;
          }

          // Tags (OR logic for tags provided?)
          // rules.tags is now array of { tag: string }
          if (rules.tags && Array.isArray(rules.tags) && rules.tags.length > 0) {
            const tagValues = rules.tags.map((t: any) => t.tag).filter((t: any) => t);
            if (tagValues.length > 0) {
              where.and.push({
                'tags.tag': {
                  in: tagValues,
                },
              });
              hashRules = true;
            }
          }

          if (rules.moods && Array.isArray(rules.moods) && rules.moods.length > 0) {
            const moodValues = rules.moods.map((m: any) => m.mood).filter((m: any) => m);
            if (moodValues.length > 0) {
              where.and.push({
                moodLabel: {
                  in: moodValues,
                },
              });
              hashRules = true;
            }
          }

          if (hashRules) {
            try {
              const matchedJournals = await req.payload.find({
                collection: 'journals',
                where: where,
                limit: 1000, // Safe limit for now
                depth: 0,
              });

              data.journals = matchedJournals.docs.map((doc) => doc.id);
              data.journalCount = matchedJournals.totalDocs;
            } catch (err) {
              console.error('Error populating dynamic collection:', err);
              // don't fail properly, just warn?
            }
          } else {
            // No rules, empty list
            data.journals = [];
            data.journalCount = 0;
          }
        } else {
          // Static - just update count
          if (Array.isArray(data.journals)) {
            data.journalCount = data.journals.length;
          }
        }
        return data;
      },
    ],
  },
};

export default JournalsCollection;
