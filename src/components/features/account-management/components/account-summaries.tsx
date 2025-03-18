import { unstable_cache } from 'next/cache';
import { redirect } from 'next/navigation';

import { auth, signIn } from '@/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';
import { sortArrayByProperty } from '@/src/lib/utils';
import useGoogleAnalyticsClient from '../hooks/useGoogleAnalyticsClient';
import AccountSummariesClient from './account-summaries.client';

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

  if (!tokens) {
    return <p>No Google Analytics credentials.</p>;
  }

  if (!tokens.refresh_token || !tokens.access_token) {
    return <p>Invalid Google Analytics credentials.</p>;
  }

  const client = useGoogleAnalyticsClient({
    refresh_token: tokens.refresh_token,
    access_token: tokens.access_token,
  });

  const getAccountSummaries = unstable_cache(async () => {
    return await client.listAccountSummaries();
  }, ['account-summaries']);
  const [accountSummaries] = await getAccountSummaries();

  if (!accountSummaries) {
    return <p>Issue fetching...</p>;
  } else if (accountSummaries.length === 0) {
    return <p>No Google Analytics accounts found.</p>;
  } else if (accountSummaries.length > 0) {
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
  } else {
    return <p>Unknown error.</p>;
  }
}
