import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import oAuth2Client from '@/src/lib/google/auth/oauth2';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export default async function AccountList() {
  const cookieStore = await cookies();
  const tokensCookie = cookieStore.get('tokens');
  if (!tokensCookie) {
    redirect('/login');
  }

  const tokens = JSON.parse(tokensCookie.value);
  oAuth2Client.setCredentials(tokens);
  const client = new AnalyticsAdminServiceClient({
    auth: oAuth2Client as unknown as any,
    fallback: 'rest',
  });
  const [accountSummaries] = await client.listAccountSummaries();

  if (!accountSummaries) {
    return <p>Issue fetching...</p>;
  } else if (accountSummaries.length === 0) {
    return <p>No Google Analytics accounts found.</p>;
  } else if (accountSummaries.length > 0) {
    return (
      <ul>
        {accountSummaries.map((accountSummary) => (
          <li key={accountSummary.name}>{accountSummary.displayName}</li>
        ))}
      </ul>
    );
  } else {
    return <p>Unknown error.</p>;
  }
}
