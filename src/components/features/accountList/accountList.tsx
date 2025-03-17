import { redirect } from 'next/navigation';

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';
import oAuth2Client from '@/src/lib/google/auth/oauth2';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export default async function AccountList() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const tokens = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: 'google',
    },
    select: {
      refresh_token: true,
      access_token: true,
    },
  });

  if (!tokens) {
    return <p>No Google Analytics credentials.</p>;
  }

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
