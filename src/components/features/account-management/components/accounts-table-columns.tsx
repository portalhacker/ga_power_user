'use client';

import { protos } from '@google-analytics/admin';

import { ColumnDef } from '@tanstack/react-table';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import BadgeClipboard from '@/src/components/ui/badge-clipboard';

type Account = protos.google.analytics.admin.v1alpha.IAccount &
  protos.google.analytics.admin.v1alpha.IAccountSummary;

export const accounts_table_columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
    header: 'Id',
    cell: ({ row }) => {
      return (
        <BadgeClipboard variant={'secondary'}>
          {((row.getValue('name') as Account['name']) ?? '').split('/')[1]}
        </BadgeClipboard>
      );
    },
  },
  {
    accessorKey: 'displayName',
    header: 'Display Name',
  },
  {
    accessorKey: 'regionCode',
    header: 'Region Code',
    cell: ({ row }) => {
      let regionCode;
      switch (row.getValue('regionCode') as Account['regionCode']) {
        case 'CA':
          regionCode = '🇨🇦';
          break;
        case 'US':
          regionCode = '🇺🇸';
          break;
        default:
          regionCode = row.getValue('regionCode') as Account['regionCode'];
      }
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{regionCode}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue('regionCode')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
  {
    accessorKey: 'createTime',
    header: 'Created at',
    cell: ({ row }) => {
      return new Date(
        Number(
          (row.getValue('createTime') as Account['createTime'])?.seconds ?? 0
        ) * 1000
      ).toISOString();
    },
  },
  {
    accessorKey: 'updateTime',
    header: 'Updated at',
    cell: ({ row }) => {
      return new Date(
        Number(
          (row.getValue('updateTime') as Account['updateTime'])?.seconds ?? 0
        ) * 1000
      ).toISOString();
    },
  },
  {
    accessorKey: 'deleted',
    header: 'Is Deleted',
  },
  {
    accessorKey: 'gmpOrganization',
    header: 'GMP Organization',
  },
  {
    accessorKey: 'propertySummaries',
    header: 'Properties count',
    cell: ({ row }) => {
      const properties = row.getValue(
        'propertySummaries'
      ) as Account['propertySummaries'];
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{properties?.length ?? 0}</p>
            </TooltipTrigger>
            <TooltipContent>
              {properties?.length === 0 ? (
                <p>No properties found</p>
              ) : (
                <ul>
                  {properties?.map((property) => {
                    return (
                      <li key={property.property}>
                        {property.property?.split('/')[1]} -{' '}
                        {property.displayName}
                      </li>
                    );
                  })}
                </ul>
              )}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];
