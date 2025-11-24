'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  if (typeof window === 'undefined') {
    // 服务端渲染时返回完整 HTML，绕过 layout
    return (
      <html lang="zh-CN">
        <head>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>500 - 服务器错误</title>
        </head>
        <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: 'bold' }}>500</h1>
            <p style={{ marginTop: '1rem', color: '#888' }}>发生了错误</p>
            <a href="/" style={{ display: 'inline-block', marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#000', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '500' }}>
              返回首页
            </a>
          </div>
        </body>
      </html>
    );
  }

  // 客户端渲染时使用交互式组件
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#000', color: '#fff' }}>
      <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: 'bold' }}>500</h1>
      <p style={{ marginTop: '1rem', color: '#888' }}>发生了错误</p>
      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={reset}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#000', border: 'none', borderRadius: '0.5rem', fontWeight: '500', cursor: 'pointer' }}
        >
          重试
        </button>
        <button
          onClick={() => window.location.href = '/'}
          style={{ padding: '0.75rem 1.5rem', backgroundColor: 'transparent', color: '#fff', border: '1px solid #fff', borderRadius: '0.5rem', fontWeight: '500', cursor: 'pointer' }}
        >
          返回首页
        </button>
      </div>
    </div>
  );
}

