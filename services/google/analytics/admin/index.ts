import analyticsAdmin from '@google-analytics/admin';

export const getAccounts = async () => {
  const analyticsAdminClient = new analyticsAdmin.AnalyticsAdminServiceClient({
    credentials: {}
  });
  const [accounts] = await analyticsAdminClient.listAccounts();
  return accounts;
}