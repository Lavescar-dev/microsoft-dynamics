import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { cn } from '../ui/utils';
import { useLocale } from '../../contexts/LocaleContext';

interface FormSectionProps {
  title: string;
  description?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export function FormSection({
  title,
  description,
  children,
  className,
  contentClassName,
}: FormSectionProps) {
  const { tr } = useLocale();
  return (
    <Card className={cn('border border-gray-200', className)}>
      <CardHeader className="border-b border-gray-100 pb-3">
        <CardTitle className="text-sm font-semibold">{tr(title)}</CardTitle>
        {description ? <p className="text-sm text-gray-500 mt-1">{typeof description === 'string' ? tr(description) : description}</p> : null}
      </CardHeader>
      <CardContent className={cn('p-4', contentClassName)}>{children}</CardContent>
    </Card>
  );
}
