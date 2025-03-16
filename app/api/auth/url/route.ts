// app/api/auth/url/route.js
import oauth2Client from '@/services/google/auth/oauth2';

export async function GET() {
  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/analytics',
      'https://www.googleapis.com/auth/analytics.readonly',
    ],
    // Optionally force consent to always get a refresh token:
    prompt: 'consent'
  });

  return new Response(JSON.stringify({ url: authorizeUrl }), {
    headers: { 'Content-Type': 'application/json' }
  });
}