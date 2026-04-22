import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Building24Regular,
  Calendar24Regular,
  Edit24Regular,
  Money24Regular,
  Person24Regular,
  Target24Regular,
} from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockOpportunities } from '../data/mockData';
import { mockActivities, mockQuotes } from '../data/mockData';
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
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { usePersistentState } from '../components/form/usePersistentState';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

function getStageClass(stage: string) {
  if (stage === 'Closed Won') return 'bg-green-100 text-green-700';
  if (stage === 'Closed Lost') return 'bg-red-100 text-red-700';
  if (stage === 'Negotiation') return 'bg-blue-100 text-blue-700';
  if (stage === 'Proposal') return 'bg-purple-100 text-purple-700';
  return 'bg-gray-100 text-gray-700';
}

const stages = ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'];

export default function OpportunityDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: opportunities, removeItem: removeOpportunity } = usePersistentCollection('dynamics-collection-opportunities', mockOpportunities);
  const baseOpportunity = opportunities.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [opportunity, setOpportunity] = usePersistentState(`dynamics-record-opportunity-${id}`, baseOpportunity);
  const [draftOpportunity, setDraftOpportunity] = useState(baseOpportunity);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!opportunity) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Opportunity Not Found</h1>
          <p className="text-gray-600 mb-4">The requested opportunity does not exist.</p>
          <Button onClick={() => navigate('/opportunities')}>Back to Opportunities</Button>
        </div>
      </div>
    );
  }

  const activeOpportunity = isEditing && draftOpportunity ? draftOpportunity : opportunity;

  const updateDraftOpportunity = <K extends keyof typeof opportunity>(key: K, value: (typeof opportunity)[K]) => {
    setDraftOpportunity((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveOpportunity = () => {
    if (!draftOpportunity) return;
    setOpportunity(draftOpportunity);
    setIsEditing(false);
    setIsDirty(false);
    setOpportunityTimelineEntries((current) => [
      {
        id: `opp-save-${Date.now()}`,
        title: 'Opportunity record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftOpportunity.owner,
        regarding: draftOpportunity.name,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseOpportunity = () => {
    handleSaveOpportunity();
    navigate('/opportunities');
  };

  const [opportunityTimelineEntries, setOpportunityTimelineEntries] = usePersistentState(
    `dynamics-timeline-opportunity-${id}`,
    mockActivities
      .filter(
        (activity) =>
          activity.owner === opportunity.owner ||
          activity.regarding.toLowerCase().includes(opportunity.name.toLowerCase()) ||
          activity.regarding.toLowerCase().includes(opportunity.account.toLowerCase())
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

  const relatedQuotes = mockQuotes
    .filter((quote) => quote.account === opportunity.account || quote.name.toLowerCase().includes(opportunity.name.toLowerCase()))
    .slice(0, 3);

  const summaryTab = (
    <>
      <BusinessProcessFlowHeader title="Sales Process" stages={stages} activeStage={activeOpportunity.stage} />
      {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this opportunity." /> : null}

      <FormSection title="Opportunity Information">
        <FieldGrid columns={2}>
          <FieldDisplay
            label="Account"
            icon={<Building24Regular className="w-5 h-5" />}
            value={activeOpportunity.account}
          />
          <FieldDisplay
            label="Stage"
            value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getStageClass(activeOpportunity.stage)}`}>{activeOpportunity.stage}</span>}
          />
          <FieldDisplay
            label="Amount"
            icon={<Money24Regular className="w-5 h-5" />}
            value={<span className="text-xl font-semibold">${activeOpportunity.amount.toLocaleString()}</span>}
          />
          <FieldDisplay
            label="Probability"
            value={
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div className="bg-[#0B71C7] h-2 rounded-full transition-all" style={{ width: `${activeOpportunity.probability}%` }} />
                </div>
                <span className="text-sm font-semibold text-gray-900">{activeOpportunity.probability}%</span>
              </div>
            }
          />
          <FieldDisplay
            label="Close Date"
            icon={<Calendar24Regular className="w-5 h-5" />}
            value={new Date(activeOpportunity.closeDate).toLocaleDateString()}
          />
          <FieldDisplay
            label="Owner"
            icon={<Person24Regular className="w-5 h-5" />}
            value={activeOpportunity.owner}
          />
        </FieldGrid>
      </FormSection>

      <FormSection title="Sales Process">
        <FieldGrid columns={3}>
          <FieldDisplay label="Current Stage" value={activeOpportunity.stage} />
          <FieldDisplay label="Probability" value={`${activeOpportunity.probability}%`} />
          <FieldDisplay label="Expected Revenue" value={`$${activeOpportunity.amount.toLocaleString()}`} />
        </FieldGrid>
      </FormSection>

      <TimelinePane
        title="Recent Timeline"
        entries={opportunityTimelineEntries}
        emptyLabel="No activity recorded"
        onCreateEntry={(type, title) =>
          setOpportunityTimelineEntries((current) => [
            {
              id: `opp-${opportunity.id}-${Date.now()}`,
              title,
              type,
              status: 'Open',
              date: new Date().toLocaleDateString(),
              owner: opportunity.owner,
              regarding: opportunity.name,
            },
            ...current,
          ])
        }
        onUpdateEntry={(entry) =>
          setOpportunityTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
        }
      />
    </>
  );

  const detailsTab = (
    <FormSection title="Details">
      <FieldGrid columns={2}>
        <FieldDisplay label="Opportunity Name" value={isEditing ? <EditableFieldControl value={draftOpportunity?.name ?? ''} onChange={(value) => updateDraftOpportunity('name', value)} /> : activeOpportunity.name} />
        <FieldDisplay label="Opportunity ID" value={<span className="text-gray-600 text-sm">{activeOpportunity.id}</span>} />
        <FieldDisplay label="Account" value={isEditing ? <EditableFieldControl value={draftOpportunity?.account ?? ''} onChange={(value) => updateDraftOpportunity('account', value)} /> : activeOpportunity.account} />
        <FieldDisplay label="Owner" value={isEditing ? <EditableFieldControl value={draftOpportunity?.owner ?? ''} onChange={(value) => updateDraftOpportunity('owner', value)} /> : activeOpportunity.owner} />
        <FieldDisplay label="Estimated Revenue" value={isEditing ? <EditableFieldControl type="number" value={draftOpportunity?.amount ?? 0} onChange={(value) => updateDraftOpportunity('amount', Number(value))} /> : `$${activeOpportunity.amount.toLocaleString()}`} />
        <FieldDisplay label="Close Date" value={isEditing ? <EditableFieldControl type="text" value={draftOpportunity?.closeDate ?? ''} onChange={(value) => updateDraftOpportunity('closeDate', value)} /> : new Date(activeOpportunity.closeDate).toLocaleDateString()} />
      </FieldGrid>
    </FormSection>
  );

  const timelineTab = (
    <TimelinePane
      title="Activity Timeline"
      entries={opportunityTimelineEntries}
      emptyLabel="No activity recorded"
      onCreateEntry={(type, title) =>
        setOpportunityTimelineEntries((current) => [
          {
            id: `opp-${opportunity.id}-${Date.now()}`,
            title,
            type,
            status: 'Open',
            date: new Date().toLocaleDateString(),
            owner: opportunity.owner,
            regarding: opportunity.name,
          },
          ...current,
        ])
      }
      onUpdateEntry={(entry) =>
        setOpportunityTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
      }
    />
  );

  const relatedTab = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EntitySubgrid
        title="Related Quotes"
        rows={relatedQuotes}
        getRowId={(quote) => quote.id}
        emptyLabel="No related quotes"
        onRowClick={(quote) => navigate(`/quotes/${quote.id}`)}
        getFilterText={(quote) => `${quote.quoteNumber} ${quote.name} ${quote.status}`}
        views={[
          { label: 'All', filter: () => true },
          { label: 'Open', filter: (quote) => quote.status === 'Active' || quote.status === 'Draft' || quote.status === 'Revised' },
          { label: 'Closed', filter: (quote) => quote.status === 'Won' || quote.status === 'Lost' },
        ]}
        columns={[
          {
            key: 'number',
            header: 'Quote',
            cell: (quote) => <span className="font-medium text-gray-900">{quote.quoteNumber}</span>,
            sortValue: (quote) => quote.quoteNumber,
          },
          {
            key: 'status',
            header: 'Status',
            cell: (quote) => quote.status,
            sortValue: (quote) => quote.status,
          },
          {
            key: 'amount',
            header: 'Total',
            cell: (quote) => `$${quote.totalAmount.toLocaleString()}`,
            className: 'text-right',
            sortValue: (quote) => quote.totalAmount,
          },
        ]}
      />
      <EntitySubgrid
        title="Activity Feed"
        rows={opportunityTimelineEntries}
        getRowId={(entry) => entry.id}
        emptyLabel="No activity recorded"
        getFilterText={(entry) => `${entry.title} ${entry.type} ${entry.owner ?? ''}`}
        views={[
          { label: 'All', filter: () => true },
          { label: 'Open', filter: (entry) => entry.status !== 'Completed' },
          { label: 'Completed', filter: (entry) => entry.status === 'Completed' },
        ]}
        columns={[
          {
            key: 'subject',
            header: 'Subject',
            cell: (entry) => <span className="font-medium text-gray-900">{entry.title}</span>,
            sortValue: (entry) => entry.title,
          },
          {
            key: 'type',
            header: 'Type',
            cell: (entry) => entry.type,
            sortValue: (entry) => entry.type,
          },
          {
            key: 'date',
            header: 'Date',
            cell: (entry) => entry.date,
            sortValue: (entry) => entry.date,
          },
        ]}
      />
    </div>
  );

  const tabs: FormTabItem[] = [
    { value: 'summary', label: 'Summary', content: summaryTab },
    { value: 'details', label: 'Details', content: detailsTab },
    { value: 'timeline', label: 'Timeline', content: timelineTab },
    { value: 'related', label: 'Related', content: relatedTab },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[
          { label: 'Opportunities', onClick: () => navigate('/opportunities') },
          { label: opportunity.name },
        ]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/opportunities')}
            entityType="opportunity"
            entityId={opportunity.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveOpportunity}
            onSaveAndClose={handleSaveAndCloseOpportunity}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? opportunity.id,
                entityType: 'opportunity',
                entity: opportunity,
                onPatchEntity: (patch) => setOpportunity((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setOpportunityTimelineEntries((current) => [entry, ...current]),
                onOpenDelete: () => setShowDeleteDialog(true),
              })
            }
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setDraftOpportunity(opportunity);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }
                setDraftOpportunity(opportunity);
                setIsEditing(true);
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          </FormCommandBar>
        }
        header={
          <FormHeader
            title={activeOpportunity.name}
            subtitle={activeOpportunity.account}
            icon={<Target24Regular className="w-10 h-10" />}
            badges={[
              {
                label: activeOpportunity.stage,
                className: `px-3 py-1 rounded-full text-sm ${getStageClass(activeOpportunity.stage)}`,
              },
              {
                label: `$${activeOpportunity.amount.toLocaleString()}`,
                className: 'text-2xl font-semibold text-[#0B71C7]',
              },
            ]}
            keyFields={[
              { label: 'Owner', value: activeOpportunity.owner },
              { label: 'Close Date', value: new Date(activeOpportunity.closeDate).toLocaleDateString() },
              { label: 'Probability', value: `${activeOpportunity.probability}%` },
              { label: 'Account', value: activeOpportunity.account },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Opportunity</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete {opportunity.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeOpportunity(opportunity.id);
                    window.localStorage.removeItem(`dynamics-record-opportunity-${opportunity.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-opportunity-${opportunity.id}`);
                    navigate('/opportunities');
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
