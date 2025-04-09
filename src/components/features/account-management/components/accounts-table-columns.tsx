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
import { AccountsTableRowCell } from './accounts-table-row-cell';

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
    cell: ({ row }) => (
      <AccountsTableRowCell>{row.getValue('displayName')}</AccountsTableRowCell>
    ),
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
              <AccountsTableRowCell className="text-center">
                {regionCode}
              </AccountsTableRowCell>
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
              <AccountsTableRowCell className="text-center">
                {properties?.length ?? 0}
              </AccountsTableRowCell>
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
      return <AccountsTableRowCell>{createdAt}</AccountsTableRowCell>;
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
      return <AccountsTableRowCell>{updatedAt}</AccountsTableRowCell>;
    },
  },
  {
    accessorKey: 'deleted',
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="Is deleted" />
    ),
    cell: ({ row }) => (
      <AccountsTableRowCell className="text-center">
        {row.getValue('deleted')}
      </AccountsTableRowCell>
    ),
  },
  {
    accessorKey: 'gmpOrganization',
    header: ({ column }) => (
      <AccountsTableColumnHeader column={column} title="GMP Organization" />
    ),
    cell: ({ row }) => (
      <AccountsTableRowCell>
        {row.getValue('gmpOrganization')}
      </AccountsTableRowCell>
    ),
  },
];
