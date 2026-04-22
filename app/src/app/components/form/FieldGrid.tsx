import * as React from 'react';
import { cn } from '../ui/utils';

interface FieldGridProps extends React.ComponentProps<'div'> {
  columns?: 1 | 2 | 3;
}

export function FieldGrid({ columns = 2, className, ...props }: FieldGridProps) {
  const columnClasses =
    columns === 3 ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3' : columns === 1 ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2';

  return <div className={cn('grid gap-x-6 gap-y-5', columnClasses, className)} {...props} />;
}
