import { CollectionConfig } from 'payload/types';
import path from 'path';
import payload from 'payload';

const Files: CollectionConfig = {
  slug: 'files',
  upload: {
    staticURL: '/files',
    // 絶対パス指定（前回修正した通り）
    staticDir: '/uploads/files',//path.resolve(__dirname, '../../media/files'),
    
    imageSizes: [], 
    mimeTypes: undefined, 
    adminThumbnail: 'filename',
  },
  access: {
    read: () => true,
  },
  // ▼▼▼ 修正箇所：ここをコピペしてください ▼▼▼
  hooks: {
    beforeChange: [
      (args) => {
        const { data, req } = args;

        if (req.files && req.files.file) {
          const file = req.files.file; // アップロードされたファイルオブジェクト
          
          // 1. 元のファイル名を保存（DB用）
          data.originalFilename = file.name;
          
          // 2. 安全なファイル名を生成
          const ext = path.extname(file.name);
          const safeName = `${Date.now()}-${Math.floor(Math.random() * 1000)}${ext}`;
          
          // 3. DB上のファイル名を書き換え
          data.filename = safeName;

          // ★★★ 4. 重要：保存される「実ファイル名」も書き換え ★★★
          // これがないと、元の名前(文字化け)で保存されてしまいます
          file.name = safeName;
        }
        
        return data;
      },
    ],
  },
  // ▲▲▲ ここまで ▲▲▲
  // ▼▼▼ ここから追加：ダウンロード専用エンドポイント ▼▼▼
  endpoints: [
    {
      path: '/:id/download',
      method: 'get',
      handler: async (req, res) => {
        try {
          // 1. IDからファイル情報をDB検索する
          const file = await payload.findByID({
            collection: 'files',
            id: req.params.id,
          });

          if (!file) {
            res.status(404).send({ error: 'File not found' });
            return;
          }

          // 2. 物理ファイルのパスを特定する
          //    (staticDirで指定した絶対パス + システム上のファイル名)
          //    ※前回 path.resolve で設定したパスと同じ場所を指定します
          const filePath = path.resolve(__dirname, '../../media/files', file.filename as string);

          // 3. Expressの機能を使ってダウンロードさせる
          //    第2引数に「元のファイル名」を指定することで、
          //    ブラウザはその名前で保存しようとします。
          res.download(filePath, file.originalFilename as string);

        } catch (err) {
          res.status(500).send({ error: 'Error downloading file' });
        }
      },
    },
  ],
  fields: [
    // ▼ 元のファイル名を保存しておくフィールド
    {
      name: 'originalFilename',
      type: 'text',
      admin: {
        readOnly: true, // 管理画面では書き換え不可にする
        position: 'sidebar',
      },
    },
    {
      name: 'alt',
      type: 'text',
      label: 'Description / Alt Text',
    },
  ],
};

export default Files;