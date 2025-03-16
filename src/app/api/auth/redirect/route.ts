import oAuth2Client from '@/src/lib/google/auth/oauth2';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) {
    return new Response('No auth code provided.', { status: 400 });
  }
  try {
    const { tokens } = await oAuth2Client.getToken(code as string);

    return new Response('Authentication successful!', {
      status: 302,
      headers: {
        'Set-Cookie': `tokens=${JSON.stringify(
          tokens
        )}; Path=/; HttpOnly; Secure; SameSite=Strict`,
        Location: '/accounts',
      },
    });
  } catch (error) {
    console.error('Error retrieving tokens:', error);
    return new Response('Authentication failed.', { status: 500 });
  }
}
