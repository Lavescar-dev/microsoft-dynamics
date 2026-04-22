import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../ui/utils';

interface HubPanelProps {
  title: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function HubPanel({
  title,
  actions,
  children,
  className,
  contentClassName,
}: HubPanelProps) {
  return (
    <Card className={cn('border border-gray-200 bg-white', className)}>
      <CardHeader className="border-b border-gray-100 pb-3">
        <div className="flex items-center justify-between gap-3">
          <CardTitle className="text-sm font-semibold text-gray-900">{title}</CardTitle>
          {actions}
        </div>
      </CardHeader>
      <CardContent className={cn('p-4', contentClassName)}>{children}</CardContent>
    </Card>
  );
}
