'use client';

import { Accordion } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/src/components/ui/input';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
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
  const searchParams = useSearchParams();
  const [openAll, setOpenAll] = useState(true);
  const [openKeys, setOpenKeys] = useState<string[]>(allKeys);
  const [inputValue, setInputValue] = useState(searchQuery || '');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Update input value when searchQuery prop changes (only on initial load)
  useEffect(() => {
    setInputValue(searchQuery || '');
  }, []); // Empty dependency array means this only runs once on mount

  const handleToggle = (checked: boolean) => {
    setOpenAll(checked);
    setOpenKeys(checked ? allKeys : []);
  };

  const handleSearch = (value: string) => {
    // Update the input value immediately for client-side filtering
    setInputValue(value);

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Debounce the URL update to avoid too many history entries and server requests
    debounceTimerRef.current = setTimeout(() => {
      // Create a new URLSearchParams object
      const params = new URLSearchParams(searchParams.toString());

      // Update or remove the 'q' parameter
      if (value) {
        params.set('q', value);
      } else {
        params.delete('q');
      }

      // Construct the new URL
      const newUrl = `${pathname}${
        params.toString() ? `?${params.toString()}` : ''
      }`;

      // Update the URL without causing a full page reload
      router.replace(newUrl);
    }, 500); // Increased debounce time for better performance
  };

  // Client-side filtering based on search query
  const filteredAccountSummaries = useMemo(() => {
    if (!inputValue) return accountSummaries;

    return accountSummaries
      .map((accountSummary) => {
        try {
          const regex = new RegExp(inputValue, 'i'); // Case-insensitive regex

          // Check if the account itself matches
          const accountMatches =
            regex.test(accountSummary.displayName) ||
            regex.test(accountSummary.account);

          // Filter property summaries that match the search query
          const filteredPropertySummaries =
            accountSummary.propertySummaries?.filter(
              (propertySummary: any) =>
                regex.test(propertySummary.displayName) ||
                regex.test(propertySummary.property)
            ) || [];

          // If account matches, return all properties
          // If only some properties match, return just those properties
          // If neither account nor properties match, return null
          if (accountMatches) {
            return accountSummary; // Return account with all its properties
          } else if (filteredPropertySummaries.length > 0) {
            return {
              ...accountSummary,
              propertySummaries: filteredPropertySummaries,
            };
          } else {
            return null;
          }
        } catch (e) {
          // If the regex is invalid, fallback to a simple includes check
          const lowerQuery = inputValue.toLowerCase();

          // Check if the account itself matches
          const accountMatches =
            accountSummary.displayName?.toLowerCase().includes(lowerQuery) ||
            accountSummary.account?.toLowerCase().includes(lowerQuery);

          // Filter property summaries that match the search query
          const filteredPropertySummaries =
            accountSummary.propertySummaries?.filter(
              (propertySummary: any) =>
                propertySummary.displayName
                  ?.toLowerCase()
                  .includes(lowerQuery) ||
                propertySummary.property?.toLowerCase().includes(lowerQuery)
            ) || [];

          // If account matches, return all properties
          // If only some properties match, return just those properties
          // If neither account nor properties match, return null
          if (accountMatches) {
            return accountSummary; // Return account with all its properties
          } else if (filteredPropertySummaries.length > 0) {
            return {
              ...accountSummary,
              propertySummaries: filteredPropertySummaries,
            };
          } else {
            return null;
          }
        }
      })
      .filter(Boolean); // Remove null values
  }, [accountSummaries, inputValue]);

  return (
    <div>
      <div className="mb-4 flex justify-end gap-4">
        <div className="flex-gow">
          <Input
            type="text"
            placeholder="Search accounts..."
            value={inputValue}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full"
          />
        </div>

        <div className="flex items-center">
          <Switch
            checked={openAll}
            onCheckedChange={handleToggle}
            id="toggle-accordion"
          />
          <label htmlFor="toggle-accordion" className="ml-2">
            Open All
          </label>
        </div>
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
          />
        ))}
      </Accordion>
    </div>
  );
}
