import { useEffect, useMemo, useState } from 'react';
import {
  Call24Regular,
  CheckmarkCircle24Regular,
  Edit24Regular,
  Mail24Regular,
  NoteAdd24Regular,
  TaskListSquareLtr24Regular,
} from '@fluentui/react-icons';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { useLocale } from '../../contexts/LocaleContext';

function buildUpdatedTitle(title: string) {
  return title.replace(/(?:\s*\(updated\))+$/i, '').concat(' (updated)');
}

export interface TimelineEntry {
  id: string;
  title: string;
  type: string;
  status?: string;
  date: string;
  owner?: string;
  regarding?: string;
}

interface TimelinePaneProps {
  title?: string;
  entries: TimelineEntry[];
  emptyLabel?: string;
  onCreateActivity?: (type: 'Note' | 'Email' | 'Call' | 'Task') => void;
  onCreateEntry?: (type: 'Note' | 'Email' | 'Call' | 'Task', title: string) => void;
  onUpdateEntry?: (entry: TimelineEntry) => void;
}

export function TimelinePane({
  title = 'Timeline',
  entries,
  emptyLabel = 'No activity recorded',
  onCreateActivity,
  onCreateEntry,
  onUpdateEntry,
}: TimelinePaneProps) {
  const { tr } = useLocale();
  const [filter, setFilter] = useState<'All' | 'Call' | 'Email' | 'Meeting' | 'Task' | 'Note'>('All');
  const [composerType, setComposerType] = useState<'Note' | 'Email' | 'Call' | 'Task'>('Note');
  const [composerValue, setComposerValue] = useState('');

  const filteredEntries = useMemo(() => {
    if (filter === 'All') return entries;
    return entries.filter((entry) => entry.type === filter);
  }, [entries, filter]);

  const canComposeInline = Boolean(onCreateEntry);

  useEffect(() => {
    if (!onUpdateEntry) {
      return;
    }

    for (const entry of entries) {
      const normalizedTitle = entry.title.replace(/(?:\s*\(updated\))+$/i, '');
      const updatedSuffixCount = (entry.title.match(/\(updated\)/gi) ?? []).length;

      if (updatedSuffixCount > 1) {
        onUpdateEntry({
          ...entry,
          title: `${normalizedTitle} (updated)`,
        });
      }
    }
  }, [entries, onUpdateEntry]);

  const handleCreate = (type: 'Note' | 'Email' | 'Call' | 'Task') => {
    if (canComposeInline) {
      if (!composerValue.trim()) return;
      onCreateEntry?.(type, composerValue.trim());
      setComposerValue('');
      return;
    }

    onCreateActivity?.(type);
  };

  return (
    <Card className="border border-gray-200">
      <CardHeader className="border-b border-gray-100 pb-3">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <CardTitle className="text-sm font-semibold">{tr(title)}</CardTitle>
          {onCreateActivity || onCreateEntry ? (
            <div className="flex items-center gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={() => handleCreate('Note')}>
                <NoteAdd24Regular className="w-4 h-4 mr-2" />
                {tr('Note')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCreate('Email')}>
                <Mail24Regular className="w-4 h-4 mr-2" />
                {tr('Email')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCreate('Call')}>
                <Call24Regular className="w-4 h-4 mr-2" />
                {tr('Call')}
              </Button>
              <Button variant="outline" size="sm" onClick={() => handleCreate('Task')}>
                <TaskListSquareLtr24Regular className="w-4 h-4 mr-2" />
                {tr('Task')}
              </Button>
            </div>
          ) : null}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {canComposeInline ? (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {(['Note', 'Email', 'Call', 'Task'] as const).map((item) => (
              <Button
                key={item}
                variant={composerType === item ? 'default' : 'outline'}
                size="sm"
                onClick={() => setComposerType(item)}
              >
                {tr(item)}
              </Button>
            ))}
            <Input
              value={composerValue}
              onChange={(event) => setComposerValue(event.target.value)}
              placeholder={tr(`Add ${composerType} entry`)}
              className="max-w-sm"
            />
            <Button size="sm" onClick={() => handleCreate(composerType)} disabled={!composerValue.trim()}>
              {tr('Add')}
            </Button>
          </div>
        ) : null}

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          {(['All', 'Call', 'Email', 'Meeting', 'Task', 'Note'] as const).map((item) => (
            <Button
              key={item}
              variant={filter === item ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(item)}
            >
              {tr(item)}
            </Button>
          ))}
        </div>

        {filteredEntries.length > 0 ? (
          <div className="space-y-3">
            {filteredEntries.map((entry, index) => (
              <div key={entry.id} className="flex gap-3">
                <div className="flex flex-col items-center pt-1">
                  <div className="w-2 h-2 rounded-full bg-[#0B71C7]" />
                  {index < filteredEntries.length - 1 ? <div className="w-px flex-1 bg-gray-200 mt-1.5" /> : null}
                </div>
                <div className="min-w-0 flex-1 pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{entry.title}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {tr(entry.type)}
                        {entry.regarding ? ` • ${entry.regarding}` : ''}
                        {entry.owner ? ` • ${entry.owner}` : ''}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-xs text-gray-500">{entry.date}</p>
                      {entry.status ? <p className="text-xs text-gray-600 mt-1">{tr(entry.status)}</p> : null}
                    </div>
                  </div>
                  {onUpdateEntry ? (
                    <div className="mt-2 flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={() => onUpdateEntry({ ...entry, status: entry.status === 'Completed' ? 'Open' : 'Completed' })}>
                        <CheckmarkCircle24Regular className="w-4 h-4 mr-2" />
                        {entry.status === 'Completed' ? tr('Reopen') : tr('Complete')}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => onUpdateEntry({ ...entry, title: buildUpdatedTitle(entry.title) })}>
                        <Edit24Regular className="w-4 h-4 mr-2" />
                        {tr('Quick Update')}
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            <p>{tr(emptyLabel)}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
