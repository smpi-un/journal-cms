// src/collections/Posts.ts
import { CollectionConfig } from 'payload/types';

const Posts: CollectionConfig = {
  slug: 'posts', // APIのパスやDBのテーブル名になります
  admin: {
    useAsTitle: 'title', // 管理画面の一覧で表示するフィールド
  },
  access: {
    read: () => true, // 誰でも閲覧可能（APIを公開）にする
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'content',
      type: 'richText', // リッチテキストエディタ
    },
    {
      name: 'author',
      type: 'relationship', // 他のコレクションとの紐付け
      relationTo: 'users',
    }
  ],
};

export default Posts;