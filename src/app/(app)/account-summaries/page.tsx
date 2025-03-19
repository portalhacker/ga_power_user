import { Suspense } from 'react';

import AccountSummaries from '@/src/components/features/account-management/components/account-summaries';

export default async function Page({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const searchQuery = (await searchParams).q;
  return (
    <div>
      <h1>Google Analytics Accounts</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <AccountSummaries searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
