import React from 'react';

const DifyDashboard: React.FC = () => {
  return (
    <div style={{ marginTop: '40px', padding: '20px', background: '#f5f5f5' }}>
      <h3>🤖 AIアシスタント</h3>
      <div style={{ height: '600px', width: '100%', border: '1px solid #ddd' }}>
        {/* Difyからコピーしたiframeコードをここに貼る */}
        <iframe
          src="http://localhost/chat/YOUR_APP_TOKEN"
          style={{ width: '100%', height: '100%', border: 'none' }}
          allow="microphone"
        ></iframe>
      </div>
    </div>
  );
};

export default DifyDashboard;
