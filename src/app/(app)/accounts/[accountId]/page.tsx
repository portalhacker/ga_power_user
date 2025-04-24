import type { Metadata } from 'next';
import { Suspense } from 'react';

import AccountGroup from '@/src/components/features/account-management/components/account-group';

export const metadata: Metadata = {
  title: 'GA Power - Account',
};

export default async function Page({
  params,
}: {
  params: Promise<{ accountId: number }>;
}) {
  const accountId = (await params).accountId;
  return (
    <div>
      <Suspense fallback={<p>Loading...</p>}>
        <AccountGroup accountId={accountId} />
      </Suspense>
    </div>
  );
}
