'use client';

import { protos } from '@google-analytics/admin';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import BadgeClipboard from '@/src/components/ui/badge-clipboard';

import { Button } from '@/src/components/ui/button';
import { sortArrayByProperty } from '@/src/lib/utils';

type Account = protos.google.analytics.admin.v1alpha.IAccount &
  protos.google.analytics.admin.v1alpha.IAccountSummary;

export const accounts_table_columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Id
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: 'regionCode',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Country
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      let regionCode = '';
      switch (row.getValue('regionCode') as Account['regionCode']) {
        case 'CA':
          regionCode = '🇨🇦';
          break;
        case 'US':
          regionCode = '🇺🇸';
          break;
        default:
          regionCode =
            (row.getValue('regionCode') as Account['regionCode']) ?? '';
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
    accessorKey: 'propertySummaries',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Properties count
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const properties = row.getValue(
        'propertySummaries'
      ) as Account['propertySummaries'];
      if (!properties) {
        return <p>0</p>;
      }
      const sortedProperties = sortArrayByProperty(properties, 'displayName');
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <p>{properties?.length ?? 0}</p>
            </TooltipTrigger>
            <TooltipContent>
              {properties?.length == 0 ? (
                <p>No properties found</p>
              ) : (
                <ul>
                  {sortedProperties?.map((property) => {
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
  {
    accessorKey: 'createTime',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Created at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Updated at
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
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
];
