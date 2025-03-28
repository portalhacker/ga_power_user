import SignIn from '@/components/features/auth/sign-in';
import { auth } from '@/lib/auth/auth';
import { GoogleAnalyticsClient } from '@/lib/google/analytics/google-analytics-client';
import { prisma } from '@/src/lib/db/prisma';
import { sortArrayByProperty } from '@/src/lib/utils';
import AccountSummariesClient from './account-summaries.client';

export const dynamic = 'force-dynamic';

export default async function AccountSummaries({
  searchQuery,
}: {
  searchQuery: string | undefined;
}) {
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

  const accountSummaries = await client.listAccountSummaries();

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

  // No longer filtering server-side - moved to client-side
  const allKeys = sortedAccountSummaries.map(
    (accountSummary) => accountSummary.account?.split('/')[1]
  ) as string[];

  return (
    <AccountSummariesClient
      accountSummaries={sortedAccountSummaries}
      allKeys={allKeys}
      searchQuery={searchQuery}
    />
  );
}
