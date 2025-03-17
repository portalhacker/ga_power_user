import oAuth2Client from '@/src/lib/google/auth/oauth2';

export async function GET(request: Request) {
  const authUrl = oAuth2Client.generateAuthUrl({
    // access_type: 'offline',
    // prompt: 'consent',
    scope: ['https://www.googleapis.com/auth/analytics.readonly'],
  });
  return Response.redirect(authUrl);
}
