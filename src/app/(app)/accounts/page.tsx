import type { Metadata } from 'next';
import { Suspense } from 'react';

import AccountsGroup from '@/src/components/features/account-management/components/accounts-group';

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
        <AccountsGroup />
      </Suspense>
    </div>
  );
}
