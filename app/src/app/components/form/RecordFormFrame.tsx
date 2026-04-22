import * as React from 'react';
import { ChevronRight24Regular } from '@fluentui/react-icons';
import { useLocale } from '../../contexts/LocaleContext';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface RecordFormFrameProps {
  breadcrumbs: BreadcrumbItem[];
  commandBar: React.ReactNode;
  header: React.ReactNode;
  tabs: React.ReactNode;
}

export function RecordFormFrame({
  breadcrumbs,
  commandBar,
  header,
  tabs,
}: RecordFormFrameProps) {
  const { tr } = useLocale();
  return (
    <div className="h-full flex flex-col">
      <div className="bg-white border-b border-gray-200 px-4 py-2.5">
        <div className="flex items-center gap-1.5 text-sm text-gray-600 flex-wrap">
          {breadcrumbs.map((item, index) => (
            <React.Fragment key={`${item.label}-${index}`}>
              {index > 0 ? <ChevronRight24Regular className="w-4 h-4" /> : null}
              <span
                className={item.onClick ? 'hover:text-[#0B71C7] cursor-pointer' : 'text-gray-900'}
                onClick={item.onClick}
              >
                {tr(item.label)}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {commandBar}

      <div className="flex-1 overflow-y-auto p-4 bg-[#f5f5f5]">
        <div className="max-w-6xl mx-auto space-y-4">
          {header}
          {tabs}
        </div>
      </div>
    </div>
  );
}
