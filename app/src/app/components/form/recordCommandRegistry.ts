import type { EntityType } from './EntityConfig';
import type { TimelineEntry } from './TimelinePane';
import { formatDateForLocale } from '../../contexts/LocaleContext';

interface ExecuteRecordCommandArgs<T> {
  intent: string;
  entityId: string;
  entityType: EntityType;
  entity: T;
  onPatchEntity: (patch: Partial<T>) => void;
  onAppendTimeline: (entry: TimelineEntry) => void;
  onOpenDelete?: () => void;
}

function buildTimelineEntry(entityId: string, type: TimelineEntry['type'], title: string, owner?: string): TimelineEntry {
  return {
    id: `${entityId}-${type.toLowerCase()}-${Date.now()}`,
    title,
    type,
    status: 'Completed',
    date: formatDateForLocale(new Date()),
    owner,
  };
}

export function executeRecordCommand<T>({
  intent,
  entityId,
  entityType,
  entity,
  onPatchEntity,
  onAppendTimeline,
  onOpenDelete,
}: ExecuteRecordCommandArgs<T>) {
  if (intent === 'delete') {
    onOpenDelete?.();
    return;
  }

  if (intent === 'assign') {
    onAppendTimeline(buildTimelineEntry(entityId, 'Task', 'Record reassigned in command bar', (entity as { owner?: string }).owner));
    return;
  }

  if (intent === 'share') {
    onAppendTimeline(buildTimelineEntry(entityId, 'Email', 'Record shared with team members', (entity as { owner?: string }).owner));
    return;
  }

  if (entityType === 'lead') {
    if (intent === 'qualify') {
      onPatchEntity({ status: 'Qualified', rating: 'Hot' } as Partial<T>);
      onAppendTimeline(buildTimelineEntry(entityId, 'Task', 'Lead qualified and promoted to pipeline', (entity as { owner?: string }).owner));
      return;
    }

    if (intent === 'disqualify') {
      onPatchEntity({ status: 'Unqualified' } as Partial<T>);
      onAppendTimeline(buildTimelineEntry(entityId, 'Task', 'Lead disqualified from current cycle', (entity as { owner?: string }).owner));
      return;
    }
  }

  if (entityType === 'opportunity') {
    if (intent === 'closewon') {
      onPatchEntity({ stage: 'Closed Won', probability: 100 } as Partial<T>);
      onAppendTimeline(buildTimelineEntry(entityId, 'Task', 'Opportunity closed as won', (entity as { owner?: string }).owner));
      return;
    }

    if (intent === 'closelost') {
      onPatchEntity({ stage: 'Closed Lost', probability: 0 } as Partial<T>);
      onAppendTimeline(buildTimelineEntry(entityId, 'Task', 'Opportunity closed as lost', (entity as { owner?: string }).owner));
      return;
    }

    if (intent === 'createquote') {
      onAppendTimeline(buildTimelineEntry(entityId, 'Note', 'Quote creation initiated from record command bar', (entity as { owner?: string }).owner));
      return;
    }
  }

  if (entityType === 'case') {
    if (intent === 'resolve') {
      onPatchEntity({ status: 'Resolved' } as Partial<T>);
      onAppendTimeline(buildTimelineEntry(entityId, 'Task', 'Case resolved by support workflow', (entity as { owner?: string }).owner));
      return;
    }

    if (intent === 'route') {
      onPatchEntity({ owner: 'Escalation Queue' } as Partial<T>);
      onAppendTimeline(buildTimelineEntry(entityId, 'Task', 'Case routed to escalation queue', 'Escalation Queue'));
    }
  }
}
