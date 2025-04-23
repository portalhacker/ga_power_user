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

import { DataTableColumnHeader } from '@/components/common/data-table-column-header';
import { DataTableRowCell } from '@/components/common/data-table-row-cell';
import { sortArrayByProperty } from '@/src/lib/utils';

type Account = protos.google.analytics.admin.v1alpha.IAccount &
  protos.google.analytics.admin.v1alpha.IAccountSummary;

export const accounts_table_columns: ColumnDef<Account>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
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
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <DataTableRowCell>{row.getValue('displayName')}</DataTableRowCell>
    ),
  },
  {
    accessorKey: 'regionCode',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Country" />
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
              <p className="mx-3 text-center">{regionCode}</p>
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
      <DataTableColumnHeader column={column} title="Properties" />
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
              <p className="mx-3 text-center">{properties?.length ?? 0}</p>
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
      <DataTableColumnHeader column={column} title="Created at" />
    ),
    cell: ({ row }) => {
      const createdAt = new Date(
        Number(
          (row.getValue('createTime') as Account['createTime'])?.seconds ?? 0
        ) * 1000
      ).toISOString();
      return <DataTableRowCell>{createdAt}</DataTableRowCell>;
    },
  },
  {
    accessorKey: 'updateTime',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Updated at" />
    ),
    cell: ({ row }) => {
      const updatedAt = new Date(
        Number(
          (row.getValue('updateTime') as Account['updateTime'])?.seconds ?? 0
        ) * 1000
      ).toISOString();
      return <DataTableRowCell>{updatedAt}</DataTableRowCell>;
    },
  },
  {
    accessorKey: 'deleted',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Is deleted" />
    ),
    cell: ({ row }) => (
      <DataTableRowCell className="text-center">
        {row.getValue('deleted')}
      </DataTableRowCell>
    ),
  },
  {
    accessorKey: 'gmpOrganization',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="GMP Organization" />
    ),
    cell: ({ row }) => (
      <DataTableRowCell>{row.getValue('gmpOrganization')}</DataTableRowCell>
    ),
  },
];

export const accounts_table_columns_initial_visibility = {
  name: true,
  displayName: true,
  regionCode: true,
  createTime: false,
  updateTime: false,
  deleted: false,
  gmpOrganization: false,
  propertySummaries: true,
};
