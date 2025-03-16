import { cookies } from 'next/headers';

import oAuth2Client from '@/src/services/google/auth/oauth2';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export async function GET(request: Request) {
  const cookieStore = cookies();
  const tokensCookie = cookieStore.get('tokens');

  if (!tokensCookie) {
    return Response.redirect('/login');
  }

  const tokens = JSON.parse(tokensCookie.value);
  oAuth2Client.setCredentials(tokens);

  const client = new AnalyticsAdminServiceClient({
    auth: oAuth2Client as unknown as any,
    fallback: 'rest',
  });
  const [accountSummaries] = await client.listAccountSummaries();
  return Response.json(accountSummaries);
}
