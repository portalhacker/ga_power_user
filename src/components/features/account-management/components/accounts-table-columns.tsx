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

import { sortArrayByProperty } from '@/src/lib/utils';
import { AccountsTableColumnHeader } from './accounts-table-column-header';

type Account = protos.google.analytics.admin.v1alpha.IAccount &
  protos.google.analytics.admin.v1alpha.IAccountSummary;

export const accounts_table_columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => (
      <BadgeClipboard variant={'secondary'}>
        {((row.getValue('name') as Account['name']) ?? '').split('/')[1]}
      </BadgeClipboard>
    ),
  },
  {
    accessorKey: 'displayName',
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => <p className="mx-3">{row.getValue('displayName')}</p>,
  },
  {
    accessorKey: 'regionCode',
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="Country" />
    ),
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
              <p className="text-center mx-3">{regionCode}</p>
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
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="Properties" />
    ),
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
              <p className="text-center mx-3">{properties?.length ?? 0}</p>
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
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(
        Number(
          (row.getValue('createTime') as Account['createTime'])?.seconds ?? 0
        ) * 1000
      ).toISOString();
      return <p className="mx-3">{createdAt}</p>;
    },
  },
  {
    accessorKey: 'updateTime',
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="Updated at" />
    ),
    cell: ({ row }) => {
      const updatedAt = new Date(
        Number(
          (row.getValue('updateTime') as Account['updateTime'])?.seconds ?? 0
        ) * 1000
      ).toISOString();
      return <p className="mx-3">{updatedAt}</p>;
    },
  },
  {
    accessorKey: 'deleted',
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="Is deleted" />
    ),
    cell: ({ row }) => <p className="mx-3">{row.getValue('deleted')}</p>,
  },
  {
    accessorKey: 'gmpOrganization',
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="GMP Organization" />
    ),
    cell: ({ row }) => (
      <p className="mx-3">{row.getValue('gmpOrganization')}</p>
    ),
  },
];
