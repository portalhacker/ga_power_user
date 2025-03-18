'use client';

import { Accordion } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/src/components/ui/input';
import { useState } from 'react';
import AccountSummary from './account-summary';

interface AccountSummariesClientProps {
  accountSummaries: Array<any>; // Replace `any` with the actual type of account summaries
  allKeys: string[];
}

export default function AccountSummariesClient({
  accountSummaries,
  allKeys,
}: AccountSummariesClientProps) {
  const [openAll, setOpenAll] = useState(true);
  const [openKeys, setOpenKeys] = useState<string[]>(allKeys);
  const [searchQuery, setSearchQuery] = useState('');

  const handleToggle = (checked: boolean) => {
    setOpenAll(checked);
    setOpenKeys(checked ? allKeys : []);
  };

  const filteredAccountSummaries = accountSummaries.filter((accountSummary) => {
    try {
      const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex
      return (
        regex.test(accountSummary.displayName) || // Match account display name
        regex.test(accountSummary.account) || // Match account name
        accountSummary.propertySummaries?.some(
          (propertySummary: any) =>
            regex.test(propertySummary.displayName) || // Match property display name
            regex.test(propertySummary.property) // Match property name
        )
      );
    } catch (e) {
      // If the regex is invalid, fallback to a simple includes check
      const lowerQuery = searchQuery.toLowerCase();
      return (
        accountSummary.displayName?.toLowerCase().includes(lowerQuery) ||
        accountSummary.account?.toLowerCase().includes(lowerQuery) ||
        accountSummary.propertySummaries?.some(
          (propertySummary: any) =>
            propertySummary.displayName?.toLowerCase().includes(lowerQuery) ||
            propertySummary.property?.toLowerCase().includes(lowerQuery)
        )
      );
    }
  });

  return (
    <div>
      <div className="flex items-center mb-4">
        <Switch
          checked={openAll}
          onCheckedChange={handleToggle}
          id="toggle-accordion"
        />
        <label htmlFor="toggle-accordion" className="ml-2">
          {openAll ? 'Close All' : 'Open All'}
        </label>
      </div>

      <div className="mb-4">
        <Input
          type="text"
          placeholder="Search accounts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>

      <Accordion
        type="multiple"
        value={openKeys}
        onValueChange={(keys) => setOpenKeys(keys)}
        className="space-y-4"
      >
        {filteredAccountSummaries.map((accountSummary) => (
          <AccountSummary
            key={accountSummary.account?.split('/')[1]}
            accountSummary={accountSummary}
            searchQuery={searchQuery}
          />
        ))}
      </Accordion>
    </div>
  );
}
