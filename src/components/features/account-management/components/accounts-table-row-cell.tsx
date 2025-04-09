'use client';

import { cn } from '@/lib/utils';

interface DataTableRowCellProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function AccountsTableRowCell({
  children,
  className,
}: DataTableRowCellProps) {
  return <div className={cn('mx-3', className)}>{children}</div>;
}
