import SignIn from '@/components/features/auth/sign-in';
import { auth } from '@/lib/auth/auth';
import { GoogleAnalyticsClient } from '@/lib/google/analytics/google-analytics-client';
import { prisma } from '@/src/lib/db/prisma';

import { DataTable } from '@/src/components/common/data-table';
import {
  accounts_table_columns,
  accounts_table_columns_initial_visibility,
} from '@/src/components/features/account-management/components/accounts-table-columns';
import { sortArrayByProperty } from '@/src/lib/utils';

export default async function AccountsGroup() {
  const session = await auth();
  if (!session || session === null || !session.user) {
    return (
      <>
        <p>Not looged-in</p>
        <SignIn />
      </>
    );
  } else if (session?.error === 'RefreshTokenError' && session?.user?.id) {
    const res = await prisma.account.deleteMany({
      where: {
        userId: session.user.id,
        provider: 'google',
      },
    });
    console.log('Deleted expired tokens:', res);
    return (
      <>
        <p>Refresh token expired. Please re-authenticate.</p>
        <SignIn />
      </>
    );
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
    return (
      <>
        <p>No valid Google Analytics credentials.</p>
        <SignIn />
      </>
    );
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
  for (let i = 0; i < accounts.length; i++) {
    const account = accounts[i];
    const accountSummary = accountSummaries.find(
      (summary) => summary.account === account.name
    );
    if (accountSummary) {
      accounts[i] = { ...account, ...accountSummary };
    }
  }
  const sortedAccounts = sortArrayByProperty(accounts, 'displayName');

  return (
    <DataTable
      columns={accounts_table_columns}
      data={sortedAccounts}
      initialVisibility={accounts_table_columns_initial_visibility}
    />
  );
}
