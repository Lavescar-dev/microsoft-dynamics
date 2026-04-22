import { Link } from 'react-router';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { cn } from '../ui/utils';
import { useLocale } from '../../contexts/LocaleContext';

interface HubMetricTileProps {
  title: string;
  value: string;
  icon: LucideIcon;
  href?: string;
  toneClassName?: string;
  className?: string;
}

export function HubMetricTile({
  title,
  value,
  icon: Icon,
  href,
  toneClassName = 'bg-[#0B71C7]/10 text-[#0B71C7]',
  className,
}: HubMetricTileProps) {
  const { tr } = useLocale();

  const content = (
    <Card className={cn('border border-gray-200 bg-white', className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-medium text-gray-600 mb-1">{tr(title)}</p>
            <p className="text-[28px] leading-none font-semibold text-gray-900">{value}</p>
          </div>
          <div className={cn('flex h-8 w-8 items-center justify-center rounded-sm', toneClassName)}>
            <Icon className="w-4 h-4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (!href) {
    return content;
  }

  return (
    <Link to={href} className="block">
      {content}
    </Link>
  );
}
