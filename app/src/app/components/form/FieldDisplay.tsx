import * as React from 'react';
import { cn } from '../ui/utils';
import { useLocale } from '../../contexts/LocaleContext';

interface FieldDisplayProps {
  label: string;
  value?: React.ReactNode;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export function FieldDisplay({
  label,
  value,
  icon,
  action,
  className,
  valueClassName,
}: FieldDisplayProps) {
  const { tr } = useLocale();
  return (
    <div className={cn('space-y-1.5', className)}>
      <label className="text-xs text-gray-500 uppercase tracking-wide block">{tr(label)}</label>
      <div className={cn('min-h-6 text-gray-900', valueClassName)}>
        {value ? (
          <div className="flex items-start gap-2">
            {icon ? <span className="text-gray-400 mt-0.5">{icon}</span> : null}
            <div className="min-w-0 flex-1">{typeof value === 'string' ? tr(value) : value}</div>
          </div>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </div>
      {action}
    </div>
  );
}
