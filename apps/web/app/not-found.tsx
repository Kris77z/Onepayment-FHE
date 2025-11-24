export default function NotFound() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, -apple-system, sans-serif', backgroundColor: '#000', color: '#fff' }}>
      <h1 style={{ fontSize: '4rem', margin: 0, fontWeight: 'bold' }}>404</h1>
      <p style={{ marginTop: '1rem', color: '#888' }}>页面未找到</p>
      <a href="/" style={{ display: 'inline-block', marginTop: '2rem', padding: '0.75rem 1.5rem', backgroundColor: '#fff', color: '#000', textDecoration: 'none', borderRadius: '0.5rem', fontWeight: '500' }}>
        返回首页
      </a>
    </div>
  );
}

