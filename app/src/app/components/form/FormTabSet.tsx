import * as React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { cn } from '../ui/utils';
import { useLocale } from '../../contexts/LocaleContext';

export interface FormTabItem {
  value: string;
  label: string;
  content: React.ReactNode;
}

interface FormTabSetProps {
  tabs: FormTabItem[];
  defaultValue?: string;
  className?: string;
  listClassName?: string;
  contentClassName?: string;
}

export function FormTabSet({
  tabs,
  defaultValue,
  className,
  listClassName,
  contentClassName,
}: FormTabSetProps) {
  const { tr } = useLocale();
  const fallbackValue = defaultValue ?? tabs[0]?.value;

  return (
    <Tabs defaultValue={fallbackValue} className={cn('gap-4', className)}>
      <div className="bg-white border border-gray-200 px-4 pt-3">
        <TabsList className={cn('h-auto w-full flex-wrap justify-start rounded-none bg-transparent p-0 gap-1', listClassName)}>
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex-none rounded-none border-x-0 border-t-0 border-b-2 border-transparent px-4 py-2 text-sm text-gray-600 data-[state=active]:border-[#0B71C7] data-[state=active]:bg-transparent data-[state=active]:text-gray-900 shadow-none"
            >
              {tr(tab.label)}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className={cn('space-y-6', contentClassName)}>
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
