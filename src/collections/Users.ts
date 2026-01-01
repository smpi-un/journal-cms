import { CollectionConfig } from 'payload/types';

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // 👇 これを追加するだけで、このCollectionでAPIキーが使えるようになります
    useAPIKey: true,
  },
  // auth: true,
  admin: {
    useAsTitle: 'email',
  },
  access: {
    read: () => true,
  },
  fields: [
    // Email added by default
    // Add more fields as needed
  ],
};

export default Users;
