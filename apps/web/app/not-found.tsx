export default function NotFound() {
  return (
    <html lang="zh-CN">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>404 - 页面未找到</title>
      </head>
      <body style={{ margin: 0, padding: 0, fontFamily: 'system-ui, -apple-system, sans-serif', display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', color: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: 'bold' }}>404</h1>
          <p style={{ marginTop: '1rem', color: '#888' }}>页面未找到</p>
          <a href="/" style={{ display: 'inline-block', marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#000', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '500' }}>
            返回首页
          </a>
        </div>
      </body>
    </html>
  );
}

