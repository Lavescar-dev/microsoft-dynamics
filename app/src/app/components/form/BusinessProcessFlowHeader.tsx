import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useLocale } from '../../contexts/LocaleContext';

interface BusinessProcessFlowHeaderProps {
  title?: string;
  stages: string[];
  activeStage: string;
}

export function BusinessProcessFlowHeader({
  title = 'Business Process Flow',
  stages,
  activeStage,
}: BusinessProcessFlowHeaderProps) {
  const { tr } = useLocale();
  const activeIndex = Math.max(stages.indexOf(activeStage), 0);

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-100 pb-3">
        <CardTitle className="text-sm font-semibold">{tr(title)}</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="flex justify-between gap-2 overflow-x-auto">
          {stages.map((stage, index) => {
            const complete = index <= activeIndex;
            const isActive = index === activeIndex;

            return (
              <div key={stage} className="min-w-[7rem] flex-1 text-center">
                <div className="flex items-center">
                  <div
                    className={`w-7 h-7 rounded-sm flex items-center justify-center text-xs font-semibold shrink-0 ${
                      complete ? 'bg-[#0B71C7] text-white' : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {index + 1}
                  </div>
                  {index < stages.length - 1 ? (
                    <div className={`h-px flex-1 mx-2 ${complete ? 'bg-[#0B71C7]' : 'bg-gray-200'}`} />
                  ) : null}
                </div>
                <p className={`text-[11px] mt-2 ${isActive ? 'text-gray-900 font-semibold' : 'text-gray-600'}`}>{tr(stage)}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
