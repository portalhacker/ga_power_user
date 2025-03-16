// 'use client';

import { cookies } from 'next/headers';

import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

import oAuth2Client from '@/src/services/google/auth/oauth2';

export default async function Page() {
  const cookieStore = cookies();
  const tokensCookie = cookieStore.get('tokens');

  if (!tokensCookie) {
    return <div>Not authenticated</div>;
  }

  const tokens = JSON.parse(tokensCookie.value);
  oAuth2Client.setCredentials(tokens);

  const adminClient = new AnalyticsAdminServiceClient({
    auth: oAuth2Client as unknown as any,
    fallback: 'rest',
  });
  const [accountSummaries] = await adminClient.listAccountSummaries();

  // const accountPlaceholdersCount = 5;
  // const accountPlaceholders = Array.from(
  //   { length: accountPlaceholdersCount },
  //   (_, i) => i
  // );

  return (
    <div>
      <h1>Google Analytics Accounts</h1>
      <ul>
        {/* {accountPlaceholders.map((i) => (
          <li key={i}>Loading...</li>
        ))} */}
        {accountSummaries.map((accountSummary) => (
          <li key={accountSummary.name}>{accountSummary.displayName}</li>
        ))}
      </ul>
    </div>
  );
}
