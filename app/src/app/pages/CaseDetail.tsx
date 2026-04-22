import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Calendar24Regular,
  Edit24Regular,
  Person24Regular,
} from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockActivities, mockCases, mockKnowledgeArticles, mockQueues } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { BusinessProcessFlowHeader } from '../components/form/BusinessProcessFlowHeader';
import { TimelinePane } from '../components/form/TimelinePane';
import { EntitySubgrid } from '../components/form/EntitySubgrid';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';
import { usePersistentState } from '../components/form/usePersistentState';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';

function getCasePriorityClass(priority: string) {
  if (priority === 'High') return 'bg-red-100 text-red-700';
  if (priority === 'Normal') return 'bg-blue-100 text-blue-700';
  return 'bg-gray-100 text-gray-700';
}

function getCaseStatusClass(status: string) {
  if (status === 'Resolved') return 'bg-green-100 text-green-700';
  if (status === 'Pending') return 'bg-yellow-100 text-yellow-700';
  if (status === 'Cancelled') return 'bg-gray-100 text-gray-700';
  return 'bg-blue-100 text-blue-700';
}

export default function CaseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: cases, removeItem } = usePersistentCollection('dynamics-collection-cases', mockCases);
  const baseCase = cases.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [caseItem, setCaseItem] = usePersistentState(`dynamics-record-case-${id}`, baseCase);
  const [draftCaseItem, setDraftCaseItem] = useState(baseCase);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const caseStages = ['Identify', 'Research', 'Resolve'];

  if (!caseItem) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Case Not Found</h1>
          <p className="text-gray-600 mb-4">The requested case does not exist.</p>
          <Button onClick={() => navigate('/cases')}>Back to Cases</Button>
        </div>
      </div>
    );
  }

  const activeCase = isEditing && draftCaseItem ? draftCaseItem : caseItem;

  const updateDraftCase = <K extends keyof typeof caseItem>(key: K, value: (typeof caseItem)[K]) => {
    setDraftCaseItem((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveCase = () => {
    if (!draftCaseItem) return;
    setCaseItem(draftCaseItem);
    setIsEditing(false);
    setIsDirty(false);
    setCaseTimelineEntries((current) => [
      {
        id: `case-save-${Date.now()}`,
        title: 'Case record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftCaseItem.owner,
        regarding: draftCaseItem.customer,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseCase = () => {
    handleSaveCase();
    navigate('/cases');
  };

  const [caseTimelineEntries, setCaseTimelineEntries] = usePersistentState(
    `dynamics-timeline-case-${id}`,
    mockActivities
      .filter(
        (activity) =>
          activity.owner === caseItem.owner ||
          activity.regarding.toLowerCase().includes(caseItem.customer.toLowerCase()) ||
          activity.subject.toLowerCase().includes(caseItem.caseType.toLowerCase())
      )
      .slice(0, 4)
      .map((activity) => ({
        id: activity.id,
        title: activity.subject,
        type: activity.type,
        status: activity.status,
        date: new Date(activity.dueDate).toLocaleDateString(),
        owner: activity.owner,
        regarding: activity.regarding,
      }))
  );

  const relatedQueue = mockQueues.filter((queue) => queue.type === 'Case').slice(0, 2);
  const relatedArticles = mockKnowledgeArticles
    .filter((article) => article.category === 'Technical' || article.category === 'Account Management')
    .slice(0, 3);

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <BusinessProcessFlowHeader
            title="Case Resolution Flow"
            stages={caseStages}
            activeStage={activeCase.status === 'Resolved' ? 'Resolve' : activeCase.status === 'Pending' ? 'Research' : 'Identify'}
          />

          <FormSection title="Case Information">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this case." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Customer" icon={<Person24Regular className="w-5 h-5" />} value={activeCase.customer} />
              <FieldDisplay label="Case Type" value={activeCase.caseType} />
              <FieldDisplay label="Priority" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getCasePriorityClass(activeCase.priority)}`}>{activeCase.priority}</span>} />
              <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getCaseStatusClass(activeCase.status)}`}>{activeCase.status}</span>} />
              <FieldDisplay label="Created Date" icon={<Calendar24Regular className="w-5 h-5" />} value={new Date(activeCase.createdDate).toLocaleDateString()} />
              <FieldDisplay label="Owner" value={activeCase.owner} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Timeline"
              entries={caseTimelineEntries}
              emptyLabel="No case activity recorded"
              onCreateEntry={(type, title) =>
                setCaseTimelineEntries((current) => [
                  {
                    id: `case-${activeCase.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: activeCase.owner,
                    regarding: activeCase.customer,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setCaseTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
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
        <FormSection title="Case Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Case ID" value={<span className="text-gray-600 text-sm">{activeCase.id}</span>} />
            <FieldDisplay label="Title" value={isEditing ? <EditableFieldControl value={draftCaseItem?.title ?? ''} onChange={(value) => updateDraftCase('title', value)} /> : activeCase.title} />
            <FieldDisplay label="Customer" value={isEditing ? <EditableFieldControl value={draftCaseItem?.customer ?? ''} onChange={(value) => updateDraftCase('customer', value)} /> : activeCase.customer} />
            <FieldDisplay label="Owner" value={isEditing ? <EditableFieldControl value={draftCaseItem?.owner ?? ''} onChange={(value) => updateDraftCase('owner', value)} /> : activeCase.owner} />
            <FieldDisplay label="Priority" value={isEditing ? <EditableFieldControl type="select" value={draftCaseItem?.priority ?? 'Normal'} options={['High', 'Normal', 'Low']} onChange={(value) => updateDraftCase('priority', value as typeof caseItem.priority)} /> : activeCase.priority} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftCaseItem?.status ?? 'Active'} options={['Active', 'Pending', 'Resolved', 'Cancelled']} onChange={(value) => updateDraftCase('status', value as typeof caseItem.status)} /> : activeCase.status} />
            <FieldDisplay label="Case Type" value={isEditing ? <EditableFieldControl value={draftCaseItem?.caseType ?? ''} onChange={(value) => updateDraftCase('caseType', value)} /> : activeCase.caseType} />
            <FieldDisplay label="Created Date" value={new Date(activeCase.createdDate).toLocaleDateString()} />
          </FieldGrid>
        </FormSection>
      ),
    },
    {
      value: 'related',
      label: 'Related',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EntitySubgrid
            title="Queues"
            rows={relatedQueue}
            getRowId={(queue) => queue.id}
            emptyLabel="No queue assigned"
            onRowClick={(queue) => navigate(`/queues/${queue.id}`)}
            getFilterText={(queue) => `${queue.name} ${queue.type} ${queue.owner}`}
            views={[
              { label: 'All', filter: () => true },
              { label: 'Cases', filter: (queue) => queue.type === 'Case' },
            ]}
            columns={[
              {
                key: 'name',
                header: 'Queue',
                cell: (queue) => <span className="font-medium text-gray-900">{queue.name}</span>,
                sortValue: (queue) => queue.name,
              },
              {
                key: 'type',
                header: 'Type',
                cell: (queue) => queue.type,
                sortValue: (queue) => queue.type,
              },
              {
                key: 'items',
                header: 'Active',
                cell: (queue) => queue.activeItems,
                className: 'text-right',
                sortValue: (queue) => queue.activeItems,
              },
            ]}
          />
          <EntitySubgrid
            title="Knowledge Articles"
            rows={relatedArticles}
            getRowId={(article) => article.id}
            emptyLabel="No related articles"
            onRowClick={(article) => navigate(`/knowledge/${article.id}`)}
            getFilterText={(article) => `${article.title} ${article.category} ${article.author}`}
            views={[
              { label: 'All', filter: () => true },
              { label: 'Published', filter: (article) => article.status === 'Published' },
              { label: 'Draft', filter: (article) => article.status === 'Draft' },
            ]}
            columns={[
              {
                key: 'title',
                header: 'Article',
                cell: (article) => <span className="font-medium text-gray-900">{article.title}</span>,
                sortValue: (article) => article.title,
              },
              {
                key: 'category',
                header: 'Category',
                cell: (article) => article.category,
                sortValue: (article) => article.category,
              },
              {
                key: 'rating',
                header: 'Rating',
                cell: (article) => article.rating.toFixed(1),
                className: 'text-right',
                sortValue: (article) => article.rating,
              },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[
          { label: 'Cases', onClick: () => navigate('/cases') },
          { label: activeCase.title },
        ]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/cases')}
            entityType="case"
            entityId={activeCase.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveCase}
            onSaveAndClose={handleSaveAndCloseCase}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeCase.id,
                entityType: 'case',
                entity: activeCase,
                onPatchEntity: (patch) => setCaseItem((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setCaseTimelineEntries((current) => [entry, ...current]),
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
                  setDraftCaseItem(caseItem);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }

                setDraftCaseItem(caseItem);
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
            title={activeCase.title}
            subtitle={activeCase.customer}
            icon={activeCase.id}
            badges={[
              { label: activeCase.status, className: `px-3 py-1 rounded-full text-sm ${getCaseStatusClass(activeCase.status)}` },
              { label: activeCase.priority, className: `px-3 py-1 rounded-full text-sm ${getCasePriorityClass(activeCase.priority)}` },
            ]}
            keyFields={[
              { label: 'Customer', value: activeCase.customer },
              { label: 'Type', value: activeCase.caseType },
              { label: 'Owner', value: activeCase.owner },
              { label: 'Created', value: new Date(activeCase.createdDate).toLocaleDateString() },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Case</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete this case? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeItem(activeCase.id);
                    window.localStorage.removeItem(`dynamics-record-case-${activeCase.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-case-${activeCase.id}`);
                    navigate('/cases');
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
