import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth, signIn } from '@/lib/auth/auth';
import { GoogleAnalyticsClient } from '@/lib/google/analytics/google-analytics-client';
import { prisma } from '@/src/lib/db/prisma';
import { sortArrayByProperty } from '@/src/lib/utils';
import AccountSummariesClient from './account-summaries.client';

export const dynamic = 'force-dynamic';

export default async function AccountSummaries() {
  const session = await auth();
  if (session?.error === 'RefreshTokenError') {
    await signIn('google'); // Force sign in to obtain a new set of access and refresh tokens
  }

  if (!session?.user) {
    redirect('/');
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

  if (!tokens || !tokens.refresh_token || !tokens.access_token) {
    return <p>No valid Google Analytics credentials.</p>;
  }

  // Initialize the GoogleAnalyticsClient class
  const client = new GoogleAnalyticsClient({
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token,
  });

  // Fetch account summaries using `unstable_cache`
  const accountSummaries = await unstable_cache(async () => {
    return await client.listAccountSummaries();
  }, ['account-summaries'])();

  if (!accountSummaries) {
    return <p>Issue fetching account summaries.</p>;
  }

  if (accountSummaries.length === 0) {
    return <p>No Google Analytics accounts found.</p>;
  }

  const sortedAccountSummaries = sortArrayByProperty(
    accountSummaries,
    'displayName'
  );
  const allKeys = sortedAccountSummaries.map(
    (accountSummary) => accountSummary.account?.split('/')[1]
  ) as string[];

  return (
    <AccountSummariesClient
      accountSummaries={sortedAccountSummaries}
      allKeys={allKeys}
    />
  );
}
