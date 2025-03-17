import { Suspense } from 'react';

import AccountList from '@/src/components/features/accountList/accountList';

export default async function Page() {
  return (
    <div>
      <h1>Google Analytics Accounts</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <AccountList />
      </Suspense>
    </div>
  );
}
