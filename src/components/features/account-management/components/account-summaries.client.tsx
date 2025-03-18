'use client';

import { Accordion } from '@/components/ui/accordion';
import { Switch } from '@/components/ui/switch';
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

  const handleToggle = (checked: boolean) => {
    setOpenAll(checked);
    setOpenKeys(checked ? allKeys : []);
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
