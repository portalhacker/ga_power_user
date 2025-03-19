import { Suspense } from 'react';

import AccountSummaries from '@/src/components/features/account-management/components/account-summaries';

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const searchQuery = (await searchParams).q;
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <AccountSummaries searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
