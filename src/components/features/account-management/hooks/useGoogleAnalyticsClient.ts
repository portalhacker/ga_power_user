import oAuth2Client from '@/src/lib/google/auth/oauth2';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export default function useGoogleAnalyticsClient(tokens: {
  refresh_token: string;
  access_token: string;
}) {
  oAuth2Client.setCredentials(tokens);
  return new AnalyticsAdminServiceClient({
    auth: oAuth2Client as unknown as any,
    fallback: 'rest',
  });
}
