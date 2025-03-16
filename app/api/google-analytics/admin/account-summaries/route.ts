import { AnalyticsAdminServiceClient } from "@google-analytics/admin";

export async function GET(request: Request) {
  const client = new AnalyticsAdminServiceClient();
  const [accountSummaries] = await client.listAccountSummaries();
  return Response.json(accountSummaries);
}

