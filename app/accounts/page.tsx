'use client';

import { useEffect, useState } from "react";

import { GA4AccountType, GA4AdminClient } from "@/services/google/analytics/admin";

export default function Page() {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [accounts, setAccounts] = useState<GA4AccountType[]>([]);

  useEffect(() => {
    const tokens = document.cookie
      .split('; ')
      .find((row) => row.startsWith('tokens='))
      ?.split('=')[1];
    const accessToken
      = tokens && JSON.parse(tokens).access_token ? JSON.parse(tokens).access_token : null;
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, []);

  useEffect(() => {
    if (accessToken) {
      const client = new GA4AdminClient(accessToken);
      client.listAccounts().then((response) => {
        setAccounts(response);
      }
    );
    }
  }, [accessToken]);

  return (
    <div>
      <h1>Google Analytics Accounts</h1>
      <ul>
        {accounts.map((account) => (
          <li key={account.name.split('/')[1]}>{account.name.split('/')[1]} - {account.displayName}</li>
        ))}
      </ul>
    </div>
  );
}