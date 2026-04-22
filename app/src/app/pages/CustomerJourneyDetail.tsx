import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { ArrowTrendingLines24Regular, Edit24Regular, Person24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockCustomerJourneys } from '../data/mockData';
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

function getJourneyStatusClass(status: string) {
  if (status === 'Active') return 'bg-green-100 text-green-700';
  return 'bg-yellow-100 text-yellow-700';
}

export default function CustomerJourneyDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: journeys, removeItem } = usePersistentCollection('dynamics-collection-journeys', mockCustomerJourneys);
  const baseJourney = journeys.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [journey, setJourney] = usePersistentState(`dynamics-record-journey-${id}`, baseJourney);
  const [draftJourney, setDraftJourney] = useState(baseJourney);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!journey) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Journey Not Found</h1>
          <p className="text-gray-600 mb-4">The requested journey does not exist.</p>
          <Button onClick={() => navigate('/marketing/customer-journeys')}>Back to Journeys</Button>
        </div>
      </div>
    );
  }

  const activeJourney = isEditing && draftJourney ? draftJourney : journey;

  const updateDraftJourney = <K extends keyof typeof journey>(key: K, value: (typeof journey)[K]) => {
    setDraftJourney((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const [journeyTimelineEntries, setJourneyTimelineEntries] = usePersistentState(
    `dynamics-timeline-journey-${id}`,
    [
      {
        id: `journey-${journey.id}-created`,
        title: `${journey.name} automation reviewed`,
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: journey.owner,
        regarding: journey.type,
      },
    ]
  );

  const handleSaveJourney = () => {
    if (!draftJourney) return;
    setJourney(draftJourney);
    setIsEditing(false);
    setIsDirty(false);
    setJourneyTimelineEntries((current) => [
      {
        id: `journey-save-${Date.now()}`,
        title: 'Customer journey updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftJourney.owner,
        regarding: draftJourney.name,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseJourney = () => {
    handleSaveJourney();
    navigate('/marketing/customer-journeys');
  };

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <FormSection title="Journey Overview">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this journey." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Journey Type" value={activeJourney.type} />
              <FieldDisplay label="Owner" icon={<Person24Regular className="w-5 h-5" />} value={activeJourney.owner} />
              <FieldDisplay label="Start Trigger" value={activeJourney.startTrigger} />
              <FieldDisplay label="Steps" value={activeJourney.steps} />
              <FieldDisplay label="Active Customers" value={activeJourney.activeCust.toLocaleString()} />
              <FieldDisplay label="Completed" value={activeJourney.completed.toLocaleString()} />
              <FieldDisplay label="Average Duration" value={activeJourney.avgDuration} />
              <FieldDisplay label="Conversion Rate" icon={<ArrowTrendingLines24Regular className="w-5 h-5" />} value={`${activeJourney.conversionRate}%`} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Journey Timeline"
              entries={journeyTimelineEntries}
              emptyLabel="No journey activity recorded"
              onCreateEntry={(type, title) =>
                setJourneyTimelineEntries((current) => [
                  {
                    id: `journey-${activeJourney.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: activeJourney.owner,
                    regarding: activeJourney.name,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setJourneyTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
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
        <FormSection title="Journey Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Name" value={isEditing ? <EditableFieldControl value={draftJourney?.name ?? ''} onChange={(value) => updateDraftJourney('name', value)} /> : activeJourney.name} />
            <FieldDisplay label="Type" value={isEditing ? <EditableFieldControl type="select" value={draftJourney?.type ?? 'Automated'} options={['Automated', 'Semi-Automated', 'Manual']} onChange={(value) => updateDraftJourney('type', value as typeof journey.type)} /> : activeJourney.type} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftJourney?.status ?? 'Active'} options={['Active', 'Paused']} onChange={(value) => updateDraftJourney('status', value as typeof journey.status)} /> : activeJourney.status} />
            <FieldDisplay label="Start Trigger" value={isEditing ? <EditableFieldControl value={draftJourney?.startTrigger ?? ''} onChange={(value) => updateDraftJourney('startTrigger', value)} /> : activeJourney.startTrigger} />
            <FieldDisplay label="Steps" value={isEditing ? <EditableFieldControl type="number" value={draftJourney?.steps ?? 0} onChange={(value) => updateDraftJourney('steps', Number(value))} /> : activeJourney.steps} />
            <FieldDisplay label="Active Customers" value={isEditing ? <EditableFieldControl type="number" value={draftJourney?.activeCust ?? 0} onChange={(value) => updateDraftJourney('activeCust', Number(value))} /> : activeJourney.activeCust.toLocaleString()} />
            <FieldDisplay label="Completed" value={isEditing ? <EditableFieldControl type="number" value={draftJourney?.completed ?? 0} onChange={(value) => updateDraftJourney('completed', Number(value))} /> : activeJourney.completed.toLocaleString()} />
            <FieldDisplay label="Conversion Rate" value={isEditing ? <EditableFieldControl type="number" value={draftJourney?.conversionRate ?? 0} onChange={(value) => updateDraftJourney('conversionRate', Number(value))} /> : `${activeJourney.conversionRate}%`} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[{ label: 'Customer Journeys', onClick: () => navigate('/marketing/customer-journeys') }, { label: activeJourney.name }]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/marketing/customer-journeys')}
            entityType="journey"
            entityId={activeJourney.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveJourney}
            onSaveAndClose={handleSaveAndCloseJourney}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeJourney.id,
                entityType: 'journey',
                entity: activeJourney,
                onPatchEntity: (patch) => setJourney((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setJourneyTimelineEntries((current) => [entry, ...current]),
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
                  setDraftJourney(journey);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }
                setDraftJourney(journey);
                setIsEditing(true);
              }}
            >
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          </FormCommandBar>
        }
        header={<FormHeader title={activeJourney.name} subtitle={activeJourney.type} icon={activeJourney.name[0]} badges={[{ label: activeJourney.status, className: `px-3 py-1 rounded-full text-sm ${getJourneyStatusClass(activeJourney.status)}` }]} keyFields={[{ label: 'Steps', value: activeJourney.steps }, { label: 'Active Customers', value: activeJourney.activeCust }, { label: 'Conversion', value: `${activeJourney.conversionRate}%` }, { label: 'Owner', value: activeJourney.owner }]} />}
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4"><CardTitle className="text-base">Delete Journey</CardTitle></CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete {activeJourney.name}? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShowDeleteDialog(false); removeItem(activeJourney.id); window.localStorage.removeItem(`dynamics-record-journey-${activeJourney.id}`); window.localStorage.removeItem(`dynamics-timeline-journey-${activeJourney.id}`); navigate('/marketing/customer-journeys'); }}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
