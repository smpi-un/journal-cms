// src/collections/Posts.ts
import { CollectionConfig } from 'payload/types';

const Posts: CollectionConfig = {
  slug: 'posts', // APIのパスやDBのテーブル名になります
  versions: {
    maxPerDoc: 10, // 1ドキュメントあたり保持する最大履歴数（古いものから削除）
    drafts: {
      autosave: {    // 自動保存の設定（任意）
        interval: 2000, // 2秒ごとに自動保存
      },
    }
  },
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