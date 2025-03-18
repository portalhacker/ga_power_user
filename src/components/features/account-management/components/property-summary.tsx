import Link from 'next/link';

import { ExternalLink, Globe } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu';
import BadgeClipboard from '@/src/components/ui/badge-clipboard';

export default function PropertySummary({
  propertySummary,
}: {
  propertySummary: any;
}) {
  const propertyId = propertySummary.property?.split('/')[1];
  const accountId = propertySummary.parent?.split('/')[1];
  const links = [
    {
      href: `https://analytics.google.com/analytics/web/#/p${propertyId}/reports/intelligenthome`,
      label: 'Home',
    },
    {
      href: `https://analytics.google.com/analytics/web/#/p${propertyId}/reports/reportinghub`,
      label: 'Reports',
    },
    {
      href: `https://analytics.google.com/analytics/web/#/analysis/p${propertyId}`,
      label: 'Explore',
    },
    {
      href: `https://analytics.google.com/analytics/web/#/p${propertyId}/advertising`,
      label: 'Advertising',
    },
    {
      href: `https://analytics.google.com/analytics/web/#/a${accountId}p${propertyId}/admin`,
      label: 'Admin',
    },
  ];

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
            <ContextMenu>
              <ContextMenuTrigger>
                <Link
                  href={`https://analytics.google.com/analytics/web/#/p${propertyId}`}
                  target="_blank"
                >
                  <ExternalLink size={16} className="hover:scale-110" />
                </Link>
              </ContextMenuTrigger>
              <ContextMenuContent>
                {links.map((link, index) => (
                  <Link
                    href={link.href}
                    className="hover:underline"
                    target="_blank"
                    key={index}
                  >
                    <ContextMenuItem key={index}>{link.label}</ContextMenuItem>
                  </Link>
                ))}
              </ContextMenuContent>
            </ContextMenu>

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
