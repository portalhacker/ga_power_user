import { unstable_cache } from 'next/cache';
import Link from 'next/link';
import { redirect } from 'next/navigation';

import { BarChart3, Globe } from 'lucide-react';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

import { auth } from '@/lib/auth/auth';
import { prisma } from '@/src/lib/db/prisma';
import oAuth2Client from '@/src/lib/google/auth/oauth2';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export default async function AccountList() {
  const session = await auth();

  if (!session?.user) {
    redirect('/');
  }

  const tokens = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      provider: 'google',
    },
    select: {
      refresh_token: true,
      access_token: true,
    },
  });

  if (!tokens) {
    return <p>No Google Analytics credentials.</p>;
  }

  oAuth2Client.setCredentials(tokens);
  const client = new AnalyticsAdminServiceClient({
    auth: oAuth2Client as unknown as any,
    fallback: 'rest',
  });

  const getAccountSummaries = unstable_cache(async () => {
    return await client.listAccountSummaries();
  }, ['account-summaries']);

  const [accountSummaries] = await getAccountSummaries();

  if (!accountSummaries) {
    return <p>Issue fetching...</p>;
  } else if (accountSummaries.length === 0) {
    return <p>No Google Analytics accounts found.</p>;
  } else if (accountSummaries.length > 0) {
    return (
      <Accordion type="multiple" className="space-y-4">
        {accountSummaries.map((accountSummary) => (
          <AccordionItem
            key={accountSummary.account?.split('/')[1]}
            value={accountSummary.account?.split('/')[1] || ''}
            className="border rounded-lg overflow-hidden"
          >
            <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <BarChart3 className="h-5 w-5 text-primary" />
                  <div className="text-left">
                    <h3>{accountSummary.displayName}</h3>
                    <p>{accountSummary.account?.split('/')[1]}</p>
                  </div>
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <ul>
                {(accountSummary.propertySummaries ?? []).map(
                  (propertySummary) => (
                    <div
                      key={propertySummary.property?.split('/')[1]}
                      className="px-4 py-3 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <Link
                              href="#"
                              className="font-medium hover:underline"
                            >
                              {propertySummary.displayName}
                            </Link>
                            <p className="text-xs text-muted-foreground">
                              {propertySummary.property?.split('/')[1]}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {propertySummary.propertyType}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                )}
              </ul>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    );
  } else {
    return <p>Unknown error.</p>;
  }
}
