import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Edit24Regular, People24Regular, Person24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockSegments } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { TimelinePane } from '../components/form/TimelinePane';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { usePersistentState } from '../components/form/usePersistentState';

function getSegmentStatusClass(status: string) {
  if (status === 'Active') return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-700';
}

export default function SegmentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: segments, removeItem } = usePersistentCollection('dynamics-collection-segments', mockSegments);
  const baseSegment = segments.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [segment, setSegment] = usePersistentState(`dynamics-record-segment-${id}`, baseSegment);
  const [draftSegment, setDraftSegment] = useState(baseSegment);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!segment) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Segment Not Found</h1>
          <p className="text-gray-600 mb-4">The requested segment does not exist.</p>
          <Button onClick={() => navigate('/marketing/segments')}>Back to Segments</Button>
        </div>
      </div>
    );
  }

  const activeSegment = isEditing && draftSegment ? draftSegment : segment;

  const updateDraftSegment = <K extends keyof typeof segment>(key: K, value: (typeof segment)[K]) => {
    setDraftSegment((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const [segmentTimelineEntries, setSegmentTimelineEntries] = usePersistentState(
    `dynamics-timeline-segment-${id}`,
    [
      {
        id: `segment-${segment.id}-created`,
        title: `${segment.name} segment refreshed`,
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: segment.owner,
        regarding: segment.type,
      },
    ]
  );

  const handleSaveSegment = () => {
    if (!draftSegment) return;
    setSegment(draftSegment);
    setIsEditing(false);
    setIsDirty(false);
    setSegmentTimelineEntries((current) => [
      {
        id: `segment-save-${Date.now()}`,
        title: 'Segment criteria updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftSegment.owner,
        regarding: draftSegment.name,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseSegment = () => {
    handleSaveSegment();
    navigate('/marketing/segments');
  };

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <FormSection title="Segment Overview">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this segment." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Segment Type" value={activeSegment.type} />
              <FieldDisplay label="Owner" icon={<Person24Regular className="w-5 h-5" />} value={activeSegment.owner} />
              <FieldDisplay label="Members" icon={<People24Regular className="w-5 h-5" />} value={<span className="text-xl font-semibold">{activeSegment.memberCount.toLocaleString()}</span>} />
              <FieldDisplay label="Campaigns" value={activeSegment.campaigns} />
              <FieldDisplay label="Average Value" value={`$${activeSegment.avgValue.toLocaleString()}`} />
              <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getSegmentStatusClass(activeSegment.status)}`}>{activeSegment.status}</span>} />
              <FieldDisplay label="Last Updated" value={new Date(activeSegment.lastUpdated).toLocaleDateString()} />
              <FieldDisplay label="Criteria" value={activeSegment.criteria} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Segment Timeline"
              entries={segmentTimelineEntries}
              emptyLabel="No segment activity recorded"
              onCreateEntry={(type, title) =>
                setSegmentTimelineEntries((current) => [
                  {
                    id: `segment-${activeSegment.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: activeSegment.owner,
                    regarding: activeSegment.name,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setSegmentTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
              }
            />
          </FormSection>
        </>
      ),
    },
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Segment Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Name" value={isEditing ? <EditableFieldControl value={draftSegment?.name ?? ''} onChange={(value) => updateDraftSegment('name', value)} /> : activeSegment.name} />
            <FieldDisplay label="Type" value={isEditing ? <EditableFieldControl type="select" value={draftSegment?.type ?? 'Dynamic'} options={['Dynamic', 'Static']} onChange={(value) => updateDraftSegment('type', value as typeof segment.type)} /> : activeSegment.type} />
            <FieldDisplay label="Criteria" value={isEditing ? <EditableFieldControl value={draftSegment?.criteria ?? ''} onChange={(value) => updateDraftSegment('criteria', value)} /> : activeSegment.criteria} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftSegment?.status ?? 'Active'} options={['Active', 'Inactive']} onChange={(value) => updateDraftSegment('status', value as typeof segment.status)} /> : activeSegment.status} />
            <FieldDisplay label="Members" value={isEditing ? <EditableFieldControl type="number" value={draftSegment?.memberCount ?? 0} onChange={(value) => updateDraftSegment('memberCount', Number(value))} /> : activeSegment.memberCount.toLocaleString()} />
            <FieldDisplay label="Campaigns" value={isEditing ? <EditableFieldControl type="number" value={draftSegment?.campaigns ?? 0} onChange={(value) => updateDraftSegment('campaigns', Number(value))} /> : activeSegment.campaigns} />
            <FieldDisplay label="Average Value" value={isEditing ? <EditableFieldControl type="number" value={draftSegment?.avgValue ?? 0} onChange={(value) => updateDraftSegment('avgValue', Number(value))} /> : `$${activeSegment.avgValue.toLocaleString()}`} />
            <FieldDisplay label="Owner" value={isEditing ? <EditableFieldControl value={draftSegment?.owner ?? ''} onChange={(value) => updateDraftSegment('owner', value)} /> : activeSegment.owner} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[{ label: 'Segments', onClick: () => navigate('/marketing/segments') }, { label: activeSegment.name }]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/marketing/segments')}
            entityType="segment"
            entityId={activeSegment.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveSegment}
            onSaveAndClose={handleSaveAndCloseSegment}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeSegment.id,
                entityType: 'segment',
                entity: activeSegment,
                onPatchEntity: (patch) => setSegment((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setSegmentTimelineEntries((current) => [entry, ...current]),
                onOpenDelete: () => setShowDeleteDialog(true),
              })
            }
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => {
                if (isEditing) {
                  setDraftSegment(segment);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }
                setDraftSegment(segment);
                setIsEditing(true);
              }}
            >
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          </FormCommandBar>
        }
        header={<FormHeader title={activeSegment.name} subtitle={activeSegment.type} icon={activeSegment.name[0]} badges={[{ label: activeSegment.status, className: `px-3 py-1 rounded-full text-sm ${getSegmentStatusClass(activeSegment.status)}` }]} keyFields={[{ label: 'Members', value: activeSegment.memberCount }, { label: 'Campaigns', value: activeSegment.campaigns }, { label: 'Average Value', value: `$${activeSegment.avgValue.toLocaleString()}` }, { label: 'Owner', value: activeSegment.owner }]} />}
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4"><CardTitle className="text-base">Delete Segment</CardTitle></CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete {activeSegment.name}? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShowDeleteDialog(false); removeItem(activeSegment.id); window.localStorage.removeItem(`dynamics-record-segment-${activeSegment.id}`); window.localStorage.removeItem(`dynamics-timeline-segment-${activeSegment.id}`); navigate('/marketing/segments'); }}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
