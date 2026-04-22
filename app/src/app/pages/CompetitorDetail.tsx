import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Edit24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockCompetitors } from '../data/mockData';
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

export default function CompetitorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: competitors, removeItem } = usePersistentCollection('dynamics-collection-competitors', mockCompetitors);
  const baseCompetitor = competitors.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [competitor, setCompetitor] = usePersistentState(`dynamics-record-competitor-${id}`, baseCompetitor);
  const [draftCompetitor, setDraftCompetitor] = useState(baseCompetitor);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!competitor) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Competitor Not Found</h1>
          <p className="text-gray-600 mb-4">The requested competitor does not exist.</p>
          <Button onClick={() => navigate('/competitors')}>Back to Competitors</Button>
        </div>
      </div>
    );
  }

  const activeCompetitor = isEditing && draftCompetitor ? draftCompetitor : competitor;

  const updateDraftCompetitor = <K extends keyof typeof competitor>(key: K, value: (typeof competitor)[K]) => {
    setDraftCompetitor((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const [competitorTimelineEntries, setCompetitorTimelineEntries] = usePersistentState(
    `dynamics-timeline-competitor-${id}`,
    [
      {
        id: `competitor-${competitor.id}-created`,
        title: `${competitor.name} benchmark reviewed`,
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: 'Strategy Team',
        regarding: competitor.industry,
      },
    ]
  );

  const handleSaveCompetitor = () => {
    if (!draftCompetitor) return;
    setCompetitor(draftCompetitor);
    setIsEditing(false);
    setIsDirty(false);
    setCompetitorTimelineEntries((current) => [
      {
        id: `competitor-save-${Date.now()}`,
        title: 'Competitor profile updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: 'Strategy Team',
        regarding: draftCompetitor.name,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseCompetitor = () => {
    handleSaveCompetitor();
    navigate('/competitors');
  };

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <FormSection title="Competitor Information">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this competitor." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Industry" value={activeCompetitor.industry} />
              <FieldDisplay label="Win Rate" value={`${activeCompetitor.winRate}%`} />
              <FieldDisplay label="Strengths" value={activeCompetitor.strengths} />
              <FieldDisplay label="Weaknesses" value={activeCompetitor.weaknesses} />
              <FieldDisplay label="Open Opportunities" value={activeCompetitor.opportunities} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Competitive Activity"
              entries={competitorTimelineEntries}
              emptyLabel="No competitive activity recorded"
              onCreateEntry={(type, title) =>
                setCompetitorTimelineEntries((current) => [
                  {
                    id: `competitor-${activeCompetitor.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: 'Strategy Team',
                    regarding: activeCompetitor.name,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setCompetitorTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
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
        <FormSection title="Competitive Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Competitor ID" value={<span className="text-gray-600 text-sm">{activeCompetitor.id}</span>} />
            <FieldDisplay label="Name" value={isEditing ? <EditableFieldControl value={draftCompetitor?.name ?? ''} onChange={(value) => updateDraftCompetitor('name', value)} /> : activeCompetitor.name} />
            <FieldDisplay label="Industry" value={isEditing ? <EditableFieldControl value={draftCompetitor?.industry ?? ''} onChange={(value) => updateDraftCompetitor('industry', value)} /> : activeCompetitor.industry} />
            <FieldDisplay label="Win Rate" value={isEditing ? <EditableFieldControl type="number" value={draftCompetitor?.winRate ?? 0} onChange={(value) => updateDraftCompetitor('winRate', Number(value))} /> : `${activeCompetitor.winRate}%`} />
            <FieldDisplay label="Strengths" value={isEditing ? <EditableFieldControl type="textarea" value={draftCompetitor?.strengths ?? ''} onChange={(value) => updateDraftCompetitor('strengths', value)} /> : activeCompetitor.strengths} />
            <FieldDisplay label="Weaknesses" value={isEditing ? <EditableFieldControl type="textarea" value={draftCompetitor?.weaknesses ?? ''} onChange={(value) => updateDraftCompetitor('weaknesses', value)} /> : activeCompetitor.weaknesses} />
            <FieldDisplay label="Open Opportunities" value={isEditing ? <EditableFieldControl type="number" value={draftCompetitor?.opportunities ?? 0} onChange={(value) => updateDraftCompetitor('opportunities', Number(value))} /> : activeCompetitor.opportunities} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[{ label: 'Competitors', onClick: () => navigate('/competitors') }, { label: activeCompetitor.name }]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/competitors')}
            entityType="competitor"
            entityId={activeCompetitor.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveCompetitor}
            onSaveAndClose={handleSaveAndCloseCompetitor}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeCompetitor.id,
                entityType: 'competitor',
                entity: activeCompetitor,
                onPatchEntity: (patch) => setCompetitor((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setCompetitorTimelineEntries((current) => [entry, ...current]),
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
                  setDraftCompetitor(competitor);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }

                setDraftCompetitor(competitor);
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
            title={activeCompetitor.name}
            subtitle={activeCompetitor.industry}
            icon={activeCompetitor.name[0]}
            keyFields={[
              { label: 'Win Rate', value: `${activeCompetitor.winRate}%` },
              { label: 'Opportunities', value: activeCompetitor.opportunities },
              { label: 'Industry', value: activeCompetitor.industry },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Competitor</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete {activeCompetitor.name}? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeItem(activeCompetitor.id);
                    window.localStorage.removeItem(`dynamics-record-competitor-${activeCompetitor.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-competitor-${activeCompetitor.id}`);
                    navigate('/competitors');
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
