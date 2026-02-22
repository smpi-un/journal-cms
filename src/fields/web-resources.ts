import { Field, Block, BlockField } from 'payload/types';
import { createCommentsField } from './comments';
import { createTagsField } from './tags';

export const createWebResourcesField = (
  name: string = 'webResources',
  label: string = 'Web Resources',
  overrides?: Partial<BlockField>,
): Field => {
  const generalBlock: Block = {
    slug: 'general',
    labels: {
      singular: 'General Link',
      plural: 'General Links',
    },
    fields: [
      {
        name: 'url',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'imageUrl',
        type: 'text',
        label: 'Image URL',
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'files',
        label: 'Saved Image',
      },
      {
        name: 'siteName',
        type: 'text',
      },
      {
        name: 'crawledAt',
        type: 'date',
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
          },
        },
      },
      createTagsField(),
      createCommentsField(),
    ],
  };
  const youtubeBlock: Block = {
    slug: 'youtube',
    labels: {
      singular: 'Youtube Video',
      plural: 'Youtube Videos',
    },
    fields: [
      {
        name: 'url',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'imageUrl',
        type: 'text',
        label: 'Thumbnail URL',
      },
      {
        name: 'siteName',
        type: 'text',
        defaultValue: 'YouTube',
      },
      {
        name: 'videoId',
        type: 'text',
      },
      {
        name: 'channelTitle',
        type: 'text',
      },
      {
        name: 'duration',
        type: 'text',
        label: 'Duration',
      },
      {
        name: 'viewCount',
        type: 'number',
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'files',
        label: 'Saved Image',
      },
      {
        name: 'crawledAt',
        type: 'date',
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
          },
        },
      },
    ],
  };
  const googleMapBlock: Block = {
    slug: 'googleMap',
    labels: {
      singular: 'Google Map Place',
      plural: 'Google Map Places',
    },
    fields: [
      {
        name: 'url',
        type: 'text',
        required: true,
      },
      {
        name: 'title',
        type: 'text',
      },
      {
        name: 'description',
        type: 'textarea',
      },
      {
        name: 'imageUrl',
        type: 'text',
        label: 'Image URL',
      },
      {
        name: 'siteName',
        type: 'text',
        defaultValue: 'Google Maps',
      },
      {
        name: 'placeId',
        type: 'text',
      },
      {
        name: 'formattedAddress',
        type: 'text',
      },
      {
        name: 'location',
        type: 'point',
        label: 'Coordinates',
      },
      {
        name: 'rating',
        type: 'number',
      },
      {
        name: 'userRatingsTotal',
        type: 'number',
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'files',
        label: 'Saved Image',
      },
      {
        name: 'crawledAt',
        type: 'date',
        admin: {
          date: {
            pickerAppearance: 'dayAndTime',
          },
        },
      },
    ],
  };

  return {
    name,
    label,
    type: 'blocks',
    blocks: [generalBlock, youtubeBlock, googleMapBlock],
    ...overrides,
  };
};
