import { unstable_cache } from 'next/cache';

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

  // Filter account summaries based on search query
  const filteredAccountSummaries = searchQuery
    ? sortedAccountSummaries
        .map((accountSummary) => {
          try {
            const regex = new RegExp(searchQuery || '', 'i'); // Case-insensitive regex

            // Check if the account itself matches
            const accountMatches =
              regex.test(accountSummary.displayName) ||
              regex.test(accountSummary.account);

            // Filter property summaries that match the search query
            const filteredPropertySummaries =
              accountSummary.propertySummaries?.filter(
                (propertySummary: any) =>
                  regex.test(propertySummary.displayName) ||
                  regex.test(propertySummary.property)
              ) || [];

            // Return the account with only matching properties
            // Or return null if neither the account nor any properties match
            return accountMatches || filteredPropertySummaries.length > 0
              ? {
                  ...accountSummary,
                  propertySummaries: filteredPropertySummaries,
                }
              : null;
          } catch (e) {
            // If the regex is invalid, fallback to a simple includes check
            const lowerQuery = searchQuery?.toLowerCase();

            // Check if the account itself matches
            const accountMatches =
              accountSummary.displayName?.toLowerCase().includes(lowerQuery) ||
              accountSummary.account?.toLowerCase().includes(lowerQuery);

            // Filter property summaries that match the search query
            const filteredPropertySummaries =
              accountSummary.propertySummaries?.filter(
                (propertySummary: any) =>
                  propertySummary.displayName
                    ?.toLowerCase()
                    .includes(lowerQuery) ||
                  propertySummary.property?.toLowerCase().includes(lowerQuery)
              ) || [];

            // Return the account with only matching properties
            // Or return null if neither the account nor any properties match
            return accountMatches || filteredPropertySummaries.length > 0
              ? {
                  ...accountSummary,
                  propertySummaries: filteredPropertySummaries,
                }
              : null;
          }
        })
        .filter(Boolean) // Remove null values
    : sortedAccountSummaries;

  const allKeys = sortedAccountSummaries.map(
    (accountSummary) => accountSummary.account?.split('/')[1]
  ) as string[];

  return (
    <AccountSummariesClient
      accountSummaries={filteredAccountSummaries}
      allKeys={allKeys}
      searchQuery={searchQuery}
    />
  );
}
