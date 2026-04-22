import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

export interface RelatedRecordsGroup {
  title: string;
  records: Array<{
    id: string;
    primary: string;
    secondary?: string;
    tertiary?: string;
  }>;
  emptyLabel: string;
}

interface RelatedRecordsPaneProps {
  groups: RelatedRecordsGroup[];
}

export function RelatedRecordsPane({ groups }: RelatedRecordsPaneProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {groups.map((group) => (
        <Card key={group.title} className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base">{group.title}</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {group.records.length > 0 ? (
              <div className="space-y-4">
                {group.records.map((record) => (
                  <div key={record.id} className="pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                    <p className="text-sm font-medium text-gray-900">{record.primary}</p>
                    {record.secondary ? <p className="text-sm text-gray-600 mt-1">{record.secondary}</p> : null}
                    {record.tertiary ? <p className="text-xs text-gray-500 mt-1">{record.tertiary}</p> : null}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>{group.emptyLabel}</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
