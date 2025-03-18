import oAuth2Client from '@/src/lib/google/auth/oauth2';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export default function useGoogleAnalyticsClient(tokens: {
  refresh_token: string;
  access_token: string;
}) {
  console.log('useGoogleAnalyticsClient', tokens);
  oAuth2Client.setCredentials(tokens);
  console.log('useGoogleAnalyticsClient', oAuth2Client);
  return new AnalyticsAdminServiceClient({
    auth: oAuth2Client as unknown as any,
    fallback: 'rest',
  });
}
