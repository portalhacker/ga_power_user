import oAuth2Client from '@/src/lib/google/auth/oauth2';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export class GoogleAnalyticsClient {
  private client: AnalyticsAdminServiceClient;

  constructor(tokens: { refresh_token: string; access_token: string }) {
    oAuth2Client.setCredentials(tokens);
    this.client = new AnalyticsAdminServiceClient({
      auth: oAuth2Client as unknown as any,
      fallback: 'rest',
    });
  }

  async listAccountSummaries() {
    try {
      const [accountSummaries] = await this.client.listAccountSummaries();
      return accountSummaries || [];
    } catch (error) {
      throw new Error('Failed to fetch account summaries');
    }
  }
}
