import SignIn from '@/components/features/auth/sign-in';
import { auth } from '@/lib/auth/auth';
import { GoogleAnalyticsClient } from '@/lib/google/analytics/google-analytics-client';
import { prisma } from '@/src/lib/db/prisma';

// import { sortArrayByProperty } from '@/src/lib/utils';
// import { DataTable } from '@/src/components/common/data-table';

export default async function AccountsGroup({
  accountId,
}: {
  accountId: number;
}) {
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

  const promises = [
    client.getAccount(accountId),
    client.listProperties(accountId),
  ];
  const [account, properties] = await Promise.all(promises);
  if (!account) {
    return <p>Issue fetching account details.</p>;
  }
  if (!properties) {
    return <p>Issue fetching properties.</p>;
  }

  return (
    <pre>
      <code>{JSON.stringify(account, null, 2)}</code>
      <code>{JSON.stringify(properties, null, 2)}</code>
    </pre>
    // <DataTable
    //   columns={accounts_table_columns}
    //   data={sortedAccounts}
    //   initialVisibility={accounts_table_columns_initial_visibility}
    // />
  );
}
