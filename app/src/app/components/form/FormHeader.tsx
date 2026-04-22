import * as React from 'react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../ui/utils';
import { useLocale } from '../../contexts/LocaleContext';

interface FormHeaderBadge {
  label: React.ReactNode;
  className?: string;
}

interface FormHeaderKeyField {
  label: string;
  value: React.ReactNode;
}

interface FormHeaderProps {
  title: string;
  subtitle?: React.ReactNode;
  icon: React.ReactNode;
  badges?: FormHeaderBadge[];
  keyFields?: FormHeaderKeyField[];
  className?: string;
}

export function FormHeader({
  title,
  subtitle,
  icon,
  badges = [],
  keyFields = [],
  className,
}: FormHeaderProps) {
  const { tr } = useLocale();
  return (
    <Card className={cn('border border-gray-200', className)}>
      <CardContent className="p-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="flex items-start gap-4 min-w-0">
            <div className="w-10 h-10 rounded-sm bg-[#0B71C7] text-white flex items-center justify-center text-lg shrink-0">
              {icon}
            </div>
            <div className="min-w-0">
              <h1 className="text-[28px] leading-tight font-semibold mb-1 break-words">{tr(title)}</h1>
              {subtitle ? <p className="text-gray-600 text-sm mb-2">{typeof subtitle === 'string' ? tr(subtitle) : subtitle}</p> : null}
              {badges.length ? (
                <div className="flex items-center gap-2 flex-wrap">
                  {badges.map((badge, index) => (
                    <span key={index} className={badge.className}>
                      {badge.label}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          {keyFields.length ? (
            <div className="grid grid-cols-2 gap-x-6 gap-y-2 min-w-0 lg:min-w-[22rem]">
              {keyFields.map((field) => (
                <div key={field.label} className="min-w-0">
                  <label className="text-[11px] text-gray-500 uppercase tracking-wide mb-0.5 block">{tr(field.label)}</label>
                  <div className="text-sm text-gray-900 truncate">{typeof field.value === 'string' ? tr(field.value) : field.value}</div>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
