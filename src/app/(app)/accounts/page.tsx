import type { Metadata } from 'next';
import { Suspense } from 'react';

import SignIn from '@/components/features/auth/sign-in';
import { auth } from '@/lib/auth/auth';
import { GoogleAnalyticsClient } from '@/lib/google/analytics/google-analytics-client';
import { prisma } from '@/src/lib/db/prisma';

import { AccountsTable } from '@/src/components/features/account-management/components/accounts-table';
import { accounts_table_columns } from '@/src/components/features/account-management/components/accounts-table-columns';

export const metadata: Metadata = {
  title: 'GA Power - Accounts',
};

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const searchQuery = (await searchParams).q;

  const session = await auth();
  if (
    !session ||
    session === null ||
    !session.user ||
    session?.error === 'RefreshTokenError'
  ) {
    return <SignIn />;
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

  const accounts = await client.listAccounts();
  if (!accounts) {
    return <p>Issue fetching account summaries.</p>;
  }
  if (accounts.length === 0) {
    return <p>No Google Analytics accounts found.</p>;
  }
  const accountSummaries = await client.listAccountSummaries();
  // console.log('accountSummaries', accountSummaries);
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const accountSummary = accountSummaries.find(
      (summary) => summary.account === account.name
    );
    // console.log('accountSummary', accountSummary);
    // console.log('account', account);
    if (accountSummary) {
      accounts[i] = { ...account, ...accountSummary };
    }
  }

  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <AccountsTable columns={accounts_table_columns} data={accounts} />
      </Suspense>
    </div>
  );
}
