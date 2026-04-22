import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Delete24Regular, Edit24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockActivities, mockCases, mockQueues } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { EntitySubgrid } from '../components/form/EntitySubgrid';
import { TimelinePane } from '../components/form/TimelinePane';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { usePersistentState } from '../components/form/usePersistentState';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function QueueDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: queues, removeItem: removeQueue } = usePersistentCollection('dynamics-collection-queues', mockQueues);
  const baseQueue = queues.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [queue, setQueue] = usePersistentState(`dynamics-record-queue-${id}`, baseQueue);
  const [draftQueue, setDraftQueue] = useState(baseQueue);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  if (!queue) return <div className="flex items-center justify-center h-full"><div className="text-center"><h1 className="text-2xl mb-2">Queue Not Found</h1><p className="text-gray-600 mb-4">The requested queue does not exist.</p><Button onClick={() => navigate('/queues')}>Back to Queues</Button></div></div>;

  const activeQueue = isEditing && draftQueue ? draftQueue : queue;

  const updateDraftQueue = <K extends keyof typeof queue>(key: K, value: (typeof queue)[K]) => {
    setDraftQueue((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveQueue = () => {
    if (!draftQueue) return;
    setQueue(draftQueue);
    setIsEditing(false);
    setIsDirty(false);
    setQueueTimelineEntries((current) => [
      {
        id: `queue-save-${Date.now()}`,
        title: 'Queue record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftQueue.owner,
        regarding: draftQueue.name,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseQueue = () => {
    handleSaveQueue();
    navigate('/queues');
  };
  const [queueTimelineEntries, setQueueTimelineEntries] = usePersistentState(
    `dynamics-timeline-queue-${id}`,
    mockActivities
      .filter((entry) => queue.type === 'Activity' || queue.type === 'Email')
      .slice(0, Math.min(queue.activeItems, 6))
      .map((entry) => ({
        id: entry.id,
        title: entry.subject,
        type: entry.type,
        status: entry.status,
        date: new Date(entry.dueDate).toLocaleDateString(),
        owner: entry.owner,
        regarding: entry.regarding,
      }))
  );
  const relatedCases = mockCases.filter((entry) => queue.type === 'Case').slice(0, queue.activeItems);
  const relatedActivities = mockActivities.filter((entry) => queue.type === 'Activity' || queue.type === 'Email').slice(0, queue.activeItems);
  const tabs: FormTabItem[] = [
    { value: 'summary', label: 'Summary', content: <FormSection title="Queue Information">{isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this queue." /> : null}<FieldGrid columns={2}>
      <FieldDisplay label="Type" value={activeQueue.type} />
      <FieldDisplay label="Owner" value={activeQueue.owner} />
      <FieldDisplay label="Active Items" value={activeQueue.activeItems} />
      <FieldDisplay label="Queue ID" value={<span className="text-gray-600 text-sm">{activeQueue.id}</span>} />
    </FieldGrid></FormSection> },
    { value: 'timeline', label: 'Timeline', content: <TimelinePane title="Queue Timeline" entries={queueTimelineEntries} emptyLabel="No queue activity recorded" onCreateEntry={(type, title) => setQueueTimelineEntries((current) => [{ id: `queue-${queue.id}-${Date.now()}`, title, type, status: 'Open', date: new Date().toLocaleDateString(), owner: queue.owner, regarding: queue.name }, ...current])} onUpdateEntry={(entry) => setQueueTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))} /> },
    {
      value: 'related',
      label: 'Related',
      content: <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EntitySubgrid
          title="Related Cases"
          rows={relatedCases}
          getRowId={(entry) => entry.id}
          emptyLabel="No related cases"
          onRowClick={(entry) => navigate(`/cases/${entry.id}`)}
          getFilterText={(entry) => `${entry.title} ${entry.status} ${entry.priority} ${entry.customer}`}
          views={[
            { label: 'All', filter: () => true },
            { label: 'Active', filter: (entry) => entry.status === 'Active' || entry.status === 'Pending' },
            { label: 'Resolved', filter: (entry) => entry.status === 'Resolved' },
          ]}
          columns={[
            { key: 'title', header: 'Case', cell: (entry) => <span className="font-medium text-gray-900">{entry.title}</span>, sortValue: (entry) => entry.title },
            { key: 'status', header: 'Status', cell: (entry) => entry.status, sortValue: (entry) => entry.status },
            { key: 'priority', header: 'Priority', cell: (entry) => entry.priority, sortValue: (entry) => entry.priority },
          ]}
        />
        <EntitySubgrid
          title="Related Activities"
          rows={relatedActivities}
          getRowId={(entry) => entry.id}
          emptyLabel="No related activities"
          onRowClick={(entry) => navigate(`/activities/${entry.id}`)}
          getFilterText={(entry) => `${entry.subject} ${entry.type} ${entry.status} ${entry.owner}`}
          views={[
            { label: 'All', filter: () => true },
            { label: 'Open', filter: (entry) => entry.status === 'Open' },
            { label: 'Completed', filter: (entry) => entry.status === 'Completed' },
          ]}
          columns={[
            { key: 'subject', header: 'Subject', cell: (entry) => <span className="font-medium text-gray-900">{entry.subject}</span>, sortValue: (entry) => entry.subject },
            { key: 'type', header: 'Type', cell: (entry) => entry.type, sortValue: (entry) => entry.type },
            { key: 'status', header: 'Status', cell: (entry) => entry.status, sortValue: (entry) => entry.status },
          ]}
        />
      </div>,
    },
  ];
  return <>
    <RecordFormFrame
      breadcrumbs={[{ label: 'Queues', onClick: () => navigate('/queues') }, { label: queue.name }]}
      commandBar={<FormCommandBar onBack={() => navigate('/queues')} entityType="queue" entityId={queue.id} showSaveActions={isEditing} isDirty={isDirty} onSave={handleSaveQueue} onSaveAndClose={handleSaveAndCloseQueue} onCommand={(intent, entityId) => executeRecordCommand({ intent, entityId: entityId ?? queue.id, entityType: 'queue', entity: queue, onPatchEntity: (patch) => setQueue((current) => (current ? { ...current, ...patch } : current)), onAppendTimeline: (entry) => setQueueTimelineEntries((current) => [entry, ...current]), onOpenDelete: () => setShowDeleteDialog(true) })}><Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={() => { if (isEditing) { setDraftQueue(queue); setIsEditing(false); setIsDirty(false); return; } setDraftQueue(queue); setIsEditing(true); }}><Edit24Regular className="w-4 h-4 mr-2" />{isEditing ? 'Cancel Edit' : 'Edit'}</Button><Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(true)} className="text-red-600 hover:text-red-700"><Delete24Regular className="w-4 h-4 mr-2" />Delete</Button></FormCommandBar>}
      header={<FormHeader title={activeQueue.name} subtitle={activeQueue.type} icon={activeQueue.name[0]} keyFields={[{ label: 'Type', value: activeQueue.type }, { label: 'Owner', value: activeQueue.owner }, { label: 'Active Items', value: activeQueue.activeItems }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
    />
    {showDeleteDialog ? <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><Card className="w-full max-w-md mx-4"><CardHeader className="border-b border-gray-100 pb-4"><CardTitle className="text-base">Delete Queue</CardTitle></CardHeader><CardContent className="p-6"><p className="mb-6 text-gray-700">Are you sure you want to delete {queue.name}? This action cannot be undone.</p><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button><Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShowDeleteDialog(false); removeQueue(queue.id); window.localStorage.removeItem(`dynamics-record-queue-${queue.id}`); window.localStorage.removeItem(`dynamics-timeline-queue-${queue.id}`); navigate('/queues'); }}>Delete</Button></div></CardContent></Card></div> : null}
  </>;
}
