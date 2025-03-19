'use client';

import { Accordion } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/src/components/ui/input';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import AccountSummary from './account-summary';

interface AccountSummariesClientProps {
  accountSummaries: Array<any>; // Replace `any` with the actual type of account summaries
  allKeys: string[];
  searchQuery: string | undefined;
}

export default function AccountSummariesClient({
  accountSummaries,
  allKeys,
  searchQuery,
}: AccountSummariesClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [openAll, setOpenAll] = useState(true);
  const [openKeys, setOpenKeys] = useState<string[]>(allKeys);
  const [inputValue, setInputValue] = useState(searchQuery || '');

  console.log('inputValue account-summaries.client.tsx', inputValue);
  // Update input value when searchQuery prop changes
  useEffect(() => {
    setInputValue(inputValue);
  }, [searchQuery]);

  const handleToggle = (checked: boolean) => {
    setOpenAll(checked);
    setOpenKeys(checked ? allKeys : []);
  };

  const handleSearch = (value: string) => {
    setInputValue(value);
    // Debounce the URL update to avoid too many history entries
    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams();
      if (value) {
        params.set('q', value);
      }
      const newUrl = `${pathname}${value ? `?${params.toString()}` : ''}`;
      router.push(newUrl);
    }, 1);
    return () => clearTimeout(timeoutId);
  };

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
          value={inputValue}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full"
        />
      </div>

      <Accordion
        type="multiple"
        value={openKeys}
        onValueChange={(keys) => setOpenKeys(keys)}
        className="space-y-4"
      >
        {accountSummaries.map((accountSummary) => (
          <AccountSummary
            key={accountSummary.account?.split('/')[1]}
            accountSummary={accountSummary}
          />
        ))}
      </Accordion>
    </div>
  );
}
