import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Calendar24Regular,
  Edit24Regular,
  Person24Regular,
} from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockActivities } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { usePersistentState } from '../components/form/usePersistentState';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { TimelinePane } from '../components/form/TimelinePane';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';

function getActivityPriorityClass(priority: string) {
  if (priority === 'High') return 'bg-red-100 text-red-700';
  if (priority === 'Normal') return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-700';
}

function getActivityStatusClass(status: string) {
  if (status === 'Completed') return 'bg-green-100 text-green-700';
  if (status === 'Cancelled') return 'bg-gray-100 text-gray-700';
  return 'bg-blue-100 text-blue-700';
}

export default function ActivityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: activities, removeItem } = usePersistentCollection('dynamics-collection-activities', mockActivities);
  const baseActivity = activities.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [activity, setActivity] = usePersistentState(`dynamics-record-activity-${id}`, baseActivity);
  const [draftActivity, setDraftActivity] = useState(baseActivity);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!activity) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Activity Not Found</h1>
          <p className="text-gray-600 mb-4">The requested activity does not exist.</p>
          <Button onClick={() => navigate('/activities')}>Back to Activities</Button>
        </div>
      </div>
    );
  }

  const activeActivity = isEditing && draftActivity ? draftActivity : activity;

  const updateDraftActivity = <K extends keyof typeof activity>(key: K, value: (typeof activity)[K]) => {
    setDraftActivity((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const [activityTimelineEntries, setActivityTimelineEntries] = usePersistentState(
    `dynamics-timeline-activity-${id}`,
    [
      {
        id: `activity-${activity.id}-created`,
        title: activity.subject,
        type: activity.type,
        status: activity.status,
        date: new Date(activity.dueDate).toLocaleDateString(),
        owner: activity.owner,
        regarding: activity.regarding,
      },
    ]
  );

  const handleSaveActivity = () => {
    if (!draftActivity) return;
    setActivity(draftActivity);
    setIsEditing(false);
    setIsDirty(false);
    setActivityTimelineEntries((current) => [
      {
        id: `activity-save-${Date.now()}`,
        title: 'Activity updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftActivity.owner,
        regarding: draftActivity.regarding,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseActivity = () => {
    handleSaveActivity();
    navigate('/activities');
  };

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <FormSection title="Activity Information">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this activity." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Type" value={activeActivity.type} />
              <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getActivityStatusClass(activeActivity.status)}`}>{activeActivity.status}</span>} />
              <FieldDisplay label="Regarding" icon={<Person24Regular className="w-5 h-5" />} value={activeActivity.regarding} />
              <FieldDisplay label="Priority" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getActivityPriorityClass(activeActivity.priority)}`}>{activeActivity.priority}</span>} />
              <FieldDisplay label="Due Date" icon={<Calendar24Regular className="w-5 h-5" />} value={new Date(activeActivity.dueDate).toLocaleDateString()} />
              <FieldDisplay label="Owner" value={activeActivity.owner} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Activity Timeline"
              entries={activityTimelineEntries}
              emptyLabel="No activity updates recorded"
              onCreateEntry={(type, title) =>
                setActivityTimelineEntries((current) => [
                  {
                    id: `activity-${activeActivity.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: activeActivity.owner,
                    regarding: activeActivity.regarding,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setActivityTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
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
        <FormSection title="Activity Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Activity ID" value={<span className="text-gray-600 text-sm">{activeActivity.id}</span>} />
            <FieldDisplay label="Subject" value={isEditing ? <EditableFieldControl value={draftActivity?.subject ?? ''} onChange={(value) => updateDraftActivity('subject', value)} /> : activeActivity.subject} />
            <FieldDisplay label="Type" value={isEditing ? <EditableFieldControl type="select" value={draftActivity?.type ?? 'Call'} options={['Call', 'Email', 'Task', 'Meeting', 'Note']} onChange={(value) => updateDraftActivity('type', value as typeof activity.type)} /> : activeActivity.type} />
            <FieldDisplay label="Regarding" value={isEditing ? <EditableFieldControl value={draftActivity?.regarding ?? ''} onChange={(value) => updateDraftActivity('regarding', value)} /> : activeActivity.regarding} />
            <FieldDisplay label="Priority" value={isEditing ? <EditableFieldControl type="select" value={draftActivity?.priority ?? 'Normal'} options={['High', 'Normal', 'Low']} onChange={(value) => updateDraftActivity('priority', value as typeof activity.priority)} /> : activeActivity.priority} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftActivity?.status ?? 'Open'} options={['Open', 'Completed', 'Cancelled']} onChange={(value) => updateDraftActivity('status', value as typeof activity.status)} /> : activeActivity.status} />
            <FieldDisplay label="Owner" value={isEditing ? <EditableFieldControl value={draftActivity?.owner ?? ''} onChange={(value) => updateDraftActivity('owner', value)} /> : activeActivity.owner} />
            <FieldDisplay label="Due Date" value={isEditing ? <EditableFieldControl value={draftActivity?.dueDate ?? ''} onChange={(value) => updateDraftActivity('dueDate', value)} /> : new Date(activeActivity.dueDate).toLocaleDateString()} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[
          { label: 'Activities', onClick: () => navigate('/activities') },
          { label: activeActivity.subject },
        ]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/activities')}
            entityType="activity"
            entityId={activeActivity.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveActivity}
            onSaveAndClose={handleSaveAndCloseActivity}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeActivity.id,
                entityType: 'activity',
                entity: activeActivity,
                onPatchEntity: (patch) => setActivity((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setActivityTimelineEntries((current) => [entry, ...current]),
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
                  setDraftActivity(activity);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }

                setDraftActivity(activity);
                setIsEditing(true);
              }}
            >
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          </FormCommandBar>
        }
        header={
          <FormHeader
            title={activeActivity.subject}
            subtitle={activeActivity.regarding}
            icon={activeActivity.type[0]}
            badges={[
              { label: activeActivity.status, className: `px-3 py-1 rounded-full text-sm ${getActivityStatusClass(activeActivity.status)}` },
              { label: activeActivity.priority, className: `px-3 py-1 rounded-full text-sm ${getActivityPriorityClass(activeActivity.priority)}` },
            ]}
            keyFields={[
              { label: 'Type', value: activeActivity.type },
              { label: 'Owner', value: activeActivity.owner },
              { label: 'Due', value: new Date(activeActivity.dueDate).toLocaleDateString() },
              { label: 'Regarding', value: activeActivity.regarding },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Activity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete this activity? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeItem(activeActivity.id);
                    window.localStorage.removeItem(`dynamics-record-activity-${activeActivity.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-activity-${activeActivity.id}`);
                    navigate('/activities');
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
