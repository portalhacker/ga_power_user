'use client';

export default function LoginPage() {
  const handleLogin = async () => {
    const res = await fetch('/api/auth/url');
    const data = await res.json();
    // Redirect to the Google OAuth2 consent screen.
    window.location.href = data.url;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Login with Google</h1>
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}