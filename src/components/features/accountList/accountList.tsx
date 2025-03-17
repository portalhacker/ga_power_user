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
import { Badge } from '@/components/ui/badge';
import BadgeClipboard from '@/components/ui/badgeClipboard';
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
                  <div className="flex flex-row items-center gap-3">
                    <BadgeClipboard>
                      {accountSummary.account?.split('/')[1]}
                    </BadgeClipboard>
                    <h3>{accountSummary.displayName}</h3>
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
                            <div className="flex flex-row items-center gap-3">
                              <BadgeClipboard>
                                {propertySummary.property?.split('/')[1]}
                              </BadgeClipboard>
                              <Link
                                href={`https://analytics.google.com/analytics/web/#/p${
                                  propertySummary.property?.split('/')[1]
                                }`}
                                className="font-medium hover:underline"
                              >
                                {propertySummary.displayName}
                              </Link>
                              {propertySummary.propertyType ===
                                'PROPERTY_TYPE_ROLLUP' && (
                                <Badge variant="secondary">Rollup</Badge>
                              )}
                              {propertySummary.propertyType ===
                                'PROPERTY_TYPE_SUBPROPERTY' && (
                                <Badge variant="secondary">Rollup</Badge>
                              )}
                            </div>
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
