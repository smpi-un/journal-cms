import { CollectionConfig } from 'payload/types';
import AiSummaryButton from '../components/AiSummaryButton'; // Import AiSummaryButton

const DIFY_API_URL = `${process.env.DIFY_API_URL}/datasets/${process.env.DIFY_DATASET_ID}/document/create_by_text`;
const DIFY_API_KEY = `Bearer ${process.env.DIFY_API_KEY}`; // "Bearer " + キー

const Journals: CollectionConfig = {
  slug: 'journals',
  versions: {
    maxPerDoc: 10, // 1ドキュメントあたり保持する最大履歴数（古いものから削除）
    drafts: {
      autosave: {
        // 自動保存の設定（任意）
        interval: 2000, // 2秒ごとに自動保存
      },
    },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['entryAt', 'title', 'moodLabel'],
  },
  access: {
    read: () => true,
    update: () => true,
    create: () => true,
    delete: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        // --- タブ1: メインコンテンツ ---
        {
          label: 'Main',
          fields: [
            {
              name: 'entryAt',
              type: 'date',
              required: true,
              admin: {
                date: {
                  pickerAppearance: 'dayAndTime',
                  displayFormat: 'yyyy-MM-dd HH:mm',
                },
              },
            },
            {
              name: 'title',
              type: 'text',
            },
            {
              name: 'richTextContent',
              type: 'richText',
            },
            {
              name: 'textContent',
              type: 'textarea',
            },
            // AI Summary Button
            {
              name: 'aiGenerator',
              type: 'ui',
              admin: {
                components: {
                  Field: AiSummaryButton,
                },
              },
            },
            // AI Summary Output Field
            {
              name: 'summary',
              type: 'textarea',
              admin: {
                description: 'AIが生成した要約が自動入力されます。',
              },
            },
            // Unified Attachments Field
            {
              name: 'attachments',
              label: 'Attachments',
              type: 'array',
              fields: [
                {
                  name: 'file',
                  type: 'upload',
                  relationTo: 'files',
                  required: true,
                },
                {
                  name: 'description',
                  type: 'text',
                  label: 'Description / Caption',
                },
              ],
            },
            // Comments Field
            {
              name: 'comments',
              label: 'Comments',
              type: 'array',
              fields: [
                {
                  name: 'commentDate',
                  type: 'date',
                  defaultValue: () => new Date(),
                  admin: {
                    date: {
                      pickerAppearance: 'dayAndTime',
                    },
                  },
                },
                {
                  name: 'commentBody',
                  type: 'textarea',
                  label: 'Comment',
                  required: true,
                },
              ],
            },
          ],
        },

        // --- タブ2: 整理・分類 ---
        {
          label: 'Organization',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'isFavorite',
                  type: 'checkbox',
                  defaultValue: false,
                },
                {
                  name: 'isPinned',
                  type: 'checkbox',
                  defaultValue: false,
                },
              ],
            },
            {
              name: 'notebook',
              type: 'text',
            },
            {
              name: 'tags',
              type: 'array',
              fields: [
                {
                  name: 'tag',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // --- タブ3: コンテキスト ---
        {
          label: 'Context',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'moodLabel',
                  type: 'text',
                },
                {
                  name: 'moodScore',
                  type: 'number',
                },
              ],
            },
            {
              name: 'activities',
              type: 'array',
              fields: [
                {
                  name: 'activity',
                  type: 'text',
                },
              ],
            },
          ],
        },

        // --- タブ4: 環境 (位置・天気) ---
        {
          label: 'Environment',
          fields: [
            {
              name: 'location',
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
            },
            {
              name: 'weather',
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
            },
          ],
        },

        // --- タブ5: メタデータ ---
        {
          label: 'Meta',
          fields: [
            {
              name: 'timezone',
              type: 'text',
            },
            {
              type: 'row',
              fields: [
                { name: 'deviceName', type: 'text' },
                { name: 'stepCount', type: 'number' },
              ],
            },
            {
              name: 'source',
              type: 'group',
              fields: [
                { name: 'appName', type: 'text' },
                { name: 'originalId', type: 'text' },
                { name: 'importedAt', type: 'date' },
                { name: 'rawData', type: 'json' },
              ],
            },
            // DB上の作成・更新日時とは別に保持したい場合
            {
              name: 'created_at',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
            {
              name: 'modified_at',
              type: 'date',
              admin: { date: { pickerAppearance: 'dayAndTime' } },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        const extractText = (children: any[]): string => {
          if (!Array.isArray(children)) return '';

          return children
            .map((node) => {
              // テキストノードならそのまま返す
              if (node.text) return node.text;

              // 子要素（リンクや太字など）があるなら再帰的に取得
              if (node.children) return extractText(node.children);

              return '';
            })
            .join('\n'); // ブロックごとに改行を入れる
        };
        // 作成(create)または更新(update)の時だけ実行
        if (operation === 'create' || operation === 'update') {
          const content = doc.textContent ? doc.textContent : extractText(doc.richTextContent);

          // タイトルがない場合は日付をベースに生成
          const name =
            doc.title || `ジャーナル ${new Date(doc.entryAt).toLocaleDateString('ja-JP')}`;

          // Difyに送信するための構造化されたテキストデータを生成
          const textData = `
# ${doc.title || '無題のジャーナル'}

---

## 基本情報

- **記録日時**: ${new Date(doc.entryAt).toLocaleString('ja-JP')}
- **お気に入り**: ${doc.isFavorite ? 'はい' : 'いいえ'}
- **ピン留め**: ${doc.isPinned ? 'はい' : 'いいえ'}
- **ノートブック**: ${doc.notebook || 'なし'}
- **気分ラベル**: ${doc.moodLabel || 'なし'}

---

## タグ

${doc.tags && doc.tags.length > 0 ? doc.tags.map((t) => `- ${t.tag}`).join('\n') : 'タグなし'}

---

## 本文

${content}
`.trim();

          try {
            const response = await fetch(DIFY_API_URL, {
              method: 'POST',
              headers: {
                Authorization: DIFY_API_KEY,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                name: name, // Dify上のドキュメント名
                text: textData, // 実際に学習させるテキスト
                indexing_technique: 'high_quality',
                process_rule: {
                  mode: 'automatic',
                },
              }),
            });

            if (!response.ok) {
              console.error('Dify Sync Error:', await response.text());
            } else {
              console.log('Dify Sync Success:', name);
            }
          } catch (error) {
            console.error('Dify Connection Error:', error);
          }
        }
      },
    ],
  },
};

export default Journals;
