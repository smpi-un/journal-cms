// src/components/AiSummaryButton.tsx
import React, { useState } from 'react';
import { useFormFields, useField } from 'payload/components/forms';

const AiSummaryButton: React.FC = () => {
  // `richTextContent`と`textContent`の両方を取得
  const { richTextContent, textContent } = useFormFields(([fields]) => ({
    richTextContent: fields.richTextContent?.value,
    textContent: fields.textContent?.value as string,
  }));

  // 概要(summary)フィールドを操作するためのフック
  const { setValue } = useField({ path: 'summary' }); // Only summary now

  const [isLoading, setIsLoading] = useState(false);

  // RichTextのJSONからプレーンテキストを抽出する関数
  const extractText = (children: any[]): string => {
    if (!Array.isArray(children)) return '';
    return children
      .map((node) => {
        if (node.text) return node.text;
        if (node.children) return extractText(node.children);
        return '';
      })
      .join('\n');
  };

  const handleGenerate = async () => {
    // textContentを優先し、なければrichTextContentからテキストを抽出
    const plainText = textContent || extractText(richTextContent);

    if (!plainText || plainText.trim() === '') {
      alert('本文が入力されていません');
      return;
    }

    setIsLoading(true);

    try {
      // Payloadのカスタムエンドポイントを呼び出す
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: plainText, // Only sending content
        }),
      });

      const data = await response.json();

      if (response.ok && data.summary) {
        // 取得した要約を「概要」フィールドにセット
        setValue(data.summary);
      } else {
        alert(`生成に失敗しました: ${data.error || '不明なエラー'}`);
        console.error(data);
      }
    } catch (e) {
      console.error(e);
      alert('エラーが発生しました');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <button
        type="button"
        onClick={handleGenerate}
        disabled={isLoading}
        style={{
          padding: '10px 15px',
          backgroundColor: isLoading ? '#ccc' : '#000',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
          borderRadius: '4px',
        }}
      >
        {isLoading ? '生成中...' : '🤖 AIで要約を生成する'}
      </button>
    </div>
  );
};

export default AiSummaryButton;
