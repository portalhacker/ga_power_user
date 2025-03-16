'use client';

import { useState } from 'react';

const fetchAccountSummaries = async () => {
  const res = await fetch('/api/google-analytics/admin/account-summaries');
  return res.json();
};

export default function Page() {
  const [accountSummaries, setAccountSummaries] = useState<
    { name: string; displayName: string }[]
  >([]);

  if (!accountSummaries.length) {
    fetchAccountSummaries().then(setAccountSummaries);
  }

  return (
    <div>
      <h1>Google Analytics Accounts</h1>
      <ul>
        {accountSummaries.length === 0 && (
          <li key="loading">Loading account summaries...</li>
        )}

        {accountSummaries.length > 0 &&
          accountSummaries.map((accountSummary) => (
            <li key={accountSummary.name}>{accountSummary.displayName}</li>
          ))}
      </ul>
    </div>
  );
}
