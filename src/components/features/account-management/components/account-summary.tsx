import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import BadgeClipboard from '@/src/components/ui/badge-clipboard';
import { BarChart3 } from 'lucide-react';
import PropertySummaries from './property-summaries';

export default function AccountSummary({
  accountSummary,
  searchQuery,
}: {
  accountSummary: any;
  searchQuery: string;
}) {
  const filteredPropertySummaries = accountSummary.propertySummaries.filter(
    (propertySummary: any) => {
      try {
        const regex = new RegExp(searchQuery, 'i'); // Case-insensitive regex
        return (
          regex.test(propertySummary.displayName) || // Match property display name
          regex.test(propertySummary.property) // Match property name
        );
      } catch (e) {
        // If the regex is invalid, fallback to a simple includes check
        const lowerQuery = searchQuery.toLowerCase();
        return (
          propertySummary.displayName?.toLowerCase().includes(lowerQuery) ||
          propertySummary.property?.toLowerCase().includes(lowerQuery)
        );
      }
    }
  );

  return (
    <AccordionItem
      value={accountSummary.account?.split('/')[1] || ''}
      className="border rounded-lg overflow-hidden"
    >
      <AccordionTrigger className="px-4 py-3 hover:bg-muted/50 [&[data-state=open]>svg]:rotate-180">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-primary" />
            <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
              <div className="w-fit">
                <BadgeClipboard>
                  {accountSummary.account?.split('/')[1]}
                </BadgeClipboard>
              </div>
              <h3 className="text-xl">{accountSummary.displayName}</h3>
              <p>{filteredPropertySummaries.length} properties</p>
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="pl-4">
        <PropertySummaries propertySummaries={filteredPropertySummaries} />
      </AccordionContent>
    </AccordionItem>
  );
}
