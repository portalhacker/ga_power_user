import Link from 'next/link';

import { ExternalLink, Globe } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import BadgeClipboard from '@/src/components/ui/badge-clipboard';

export default function PropertySummary({
  propertySummary,
}: {
  propertySummary: any;
}) {
  return (
    <div className="px-4 py-3 hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3">
          <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
          <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
            <div className="w-fit">
              <BadgeClipboard>
                {propertySummary.property?.split('/')[1]}
              </BadgeClipboard>
            </div>
            <Link href="#" className="text-l hover:underline">
              {propertySummary.displayName}
            </Link>
            <Link
              href={`https://analytics.google.com/analytics/web/#/p${
                propertySummary.property?.split('/')[1]
              }`}
              target="_blank"
            >
              <ExternalLink size={16} className="hover:scale-110" />
            </Link>
            {propertySummary.propertyType === 'PROPERTY_TYPE_ROLLUP' && (
              <Badge variant="secondary">Rollup</Badge>
            )}
            {propertySummary.propertyType === 'PROPERTY_TYPE_SUBPROPERTY' && (
              <Badge variant="secondary">Subproperty</Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
