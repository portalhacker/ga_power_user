import type { Metadata } from 'next';
import { Suspense } from 'react';

import AccountSummaries from '@/src/components/features/account-management/components/account-summaries';

export const metadata: Metadata = {
  title: 'GA Power - Accounts',
};

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
