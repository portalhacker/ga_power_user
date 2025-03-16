import oauth2Client from '@/services/google/auth/oauth2';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.json({ error: 'Missing code parameter' }, { status: 400 });
  }

  try {
    // Exchange the authorization code for tokens.
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Here you might store tokens in cookies, session, or a database.
    console.info('Tokens acquired:', tokens);
    console.info('request.url:', request.url);

    // Redirect to a success page with the tokens in cookies.
    return NextResponse.redirect(new URL('/success', request.url), {
      headers: {
        'Set-Cookie': `tokens=${JSON.stringify(tokens)}; Path=/; Secure; SameSite=Strict`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to exchange code for tokens' }, { status: 500 });
  }
}