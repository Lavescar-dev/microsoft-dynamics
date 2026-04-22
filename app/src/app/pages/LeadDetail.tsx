import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Building24Regular,
  Edit24Regular,
  Mail24Regular,
  Money24Regular,
  Person24Regular,
  Phone24Regular,
  Star24Regular,
} from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockActivities, mockLeads, mockOpportunities } from '../data/mockData';
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

function getLeadStatusClass(status: string) {
  if (status === 'Qualified') return 'bg-green-100 text-green-700';
  if (status === 'Contacted') return 'bg-blue-100 text-blue-700';
  if (status === 'Unqualified') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

function getLeadRatingClass(rating: string) {
  if (rating === 'Hot') return 'bg-red-100 text-red-700';
  if (rating === 'Warm') return 'bg-yellow-100 text-yellow-700';
  return 'bg-blue-100 text-blue-700';
}

export default function LeadDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: leads, removeItem: removeLead } = usePersistentCollection('dynamics-collection-leads', mockLeads);
  const baseLead = leads.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [lead, setLead] = usePersistentState(`dynamics-record-lead-${id}`, baseLead);
  const [draftLead, setDraftLead] = useState(baseLead);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const leadStages = ['Identify', 'Develop', 'Contact', 'Qualify'];

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Lead Not Found</h1>
          <p className="text-gray-600 mb-4">The requested lead does not exist.</p>
          <Button onClick={() => navigate('/leads')}>Back to Leads</Button>
        </div>
      </div>
    );
  }

  const activeLead = isEditing && draftLead ? draftLead : lead;

  const updateDraftLead = <K extends keyof typeof lead>(key: K, value: (typeof lead)[K]) => {
    setDraftLead((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveLead = () => {
    if (!draftLead) return;
    setLead(draftLead);
    setIsEditing(false);
    setIsDirty(false);
    setLeadTimelineEntries((current) => [
      {
        id: `lead-save-${Date.now()}`,
        title: 'Lead record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftLead.owner,
        regarding: draftLead.company,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseLead = () => {
    handleSaveLead();
    navigate('/leads');
  };

  const [leadTimelineEntries, setLeadTimelineEntries] = usePersistentState(
    `dynamics-timeline-lead-${id}`,
    mockActivities
      .filter(
        (activity) =>
          activity.owner === lead.owner ||
          activity.regarding.toLowerCase().includes(lead.company.toLowerCase()) ||
          activity.regarding.toLowerCase().includes(lead.name.split(' ')[0].toLowerCase())
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

  const relatedOpportunities = mockOpportunities
    .filter((entry) => entry.account === lead.company || entry.name.toLowerCase().includes(lead.company.toLowerCase()))
    .slice(0, 3);

  const summaryTab = (
    <>
      <BusinessProcessFlowHeader
        title="Qualification Process"
        stages={leadStages}
        activeStage={activeLead.status === 'Qualified' ? 'Qualify' : activeLead.status === 'Contacted' ? 'Contact' : 'Develop'}
      />
      {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this lead." /> : null}

      <FormSection title="Lead Information">
        <FieldGrid columns={2}>
          <FieldDisplay
            label="Email Address"
            icon={<Mail24Regular className="w-5 h-5" />}
            value={
              <a href={`mailto:${lead.email}`} className="hover:text-[#0B71C7] break-all">
                {activeLead.email}
              </a>
            }
          />
          <FieldDisplay
            label="Estimated Value"
            icon={<Money24Regular className="w-5 h-5" />}
            value={<span className="text-lg font-semibold">${activeLead.estimatedValue.toLocaleString()}</span>}
          />
          <FieldDisplay
            label="Phone Number"
            icon={<Phone24Regular className="w-5 h-5" />}
            value={
              <a href={`tel:${lead.phone}`} className="hover:text-[#0B71C7]">
                {activeLead.phone}
              </a>
            }
          />
          <FieldDisplay
            label="Rating"
            value={
              <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${getLeadRatingClass(activeLead.rating)}`}>
                <Star24Regular className="w-3 h-3" />
                {activeLead.rating}
              </span>
            }
          />
          <FieldDisplay
            label="Company"
            icon={<Building24Regular className="w-5 h-5" />}
            value={<span>{activeLead.company}</span>}
          />
          <FieldDisplay
            label="Owner"
            icon={<Person24Regular className="w-5 h-5" />}
            value={<span>{activeLead.owner}</span>}
          />
        </FieldGrid>
      </FormSection>

      <FormSection title="Qualification Snapshot">
        <FieldGrid columns={3}>
          <FieldDisplay label="Source" value={activeLead.source} />
          <FieldDisplay
            label="Status"
            value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getLeadStatusClass(activeLead.status)}`}>{activeLead.status}</span>}
          />
          <FieldDisplay label="Lead ID" value={<span className="text-gray-600 text-sm">{activeLead.id}</span>} />
        </FieldGrid>
      </FormSection>

      <TimelinePane
        title="Recent Timeline"
        entries={leadTimelineEntries}
        emptyLabel="No activity recorded"
        onCreateEntry={(type, title) =>
          setLeadTimelineEntries((current) => [
            {
              id: `lead-${lead.id}-${Date.now()}`,
              title,
              type,
              status: 'Open',
              date: new Date().toLocaleDateString(),
              owner: lead.owner,
              regarding: lead.company,
            },
            ...current,
          ])
        }
        onUpdateEntry={(entry) =>
          setLeadTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
        }
      />
    </>
  );

  const detailsTab = (
    <FormSection title="Details">
      <FieldGrid columns={2}>
        <FieldDisplay label="Full Name" value={isEditing ? <EditableFieldControl value={draftLead?.name ?? ''} onChange={(value) => updateDraftLead('name', value)} /> : activeLead.name} />
        <FieldDisplay label="Owning User" value={isEditing ? <EditableFieldControl value={draftLead?.owner ?? ''} onChange={(value) => updateDraftLead('owner', value)} /> : activeLead.owner} />
        <FieldDisplay label="Primary Company" value={isEditing ? <EditableFieldControl value={draftLead?.company ?? ''} onChange={(value) => updateDraftLead('company', value)} /> : activeLead.company} />
        <FieldDisplay label="Lead Source" value={isEditing ? <EditableFieldControl type="select" value={draftLead?.source ?? ''} options={['Website', 'Referral', 'Trade Show', 'LinkedIn', 'Cold Call', 'Email Campaign']} onChange={(value) => updateDraftLead('source', value)} /> : activeLead.source} />
        <FieldDisplay label="Estimated Revenue" value={isEditing ? <EditableFieldControl type="number" value={draftLead?.estimatedValue ?? 0} onChange={(value) => updateDraftLead('estimatedValue', Number(value))} /> : `$${activeLead.estimatedValue.toLocaleString()}`} />
        <FieldDisplay label="Lifecycle Status" value={isEditing ? <EditableFieldControl type="select" value={draftLead?.status ?? 'New'} options={['New', 'Contacted', 'Qualified', 'Unqualified']} onChange={(value) => updateDraftLead('status', value as typeof lead.status)} /> : activeLead.status} />
      </FieldGrid>
    </FormSection>
  );

  const timelineTab = (
    <TimelinePane
      title="Timeline"
      entries={leadTimelineEntries}
      emptyLabel="No activity recorded"
      onCreateEntry={(type, title) =>
        setLeadTimelineEntries((current) => [
          {
            id: `lead-${lead.id}-${Date.now()}`,
            title,
            type,
            status: 'Open',
            date: new Date().toLocaleDateString(),
            owner: lead.owner,
            regarding: lead.company,
          },
          ...current,
        ])
      }
      onUpdateEntry={(entry) =>
        setLeadTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
      }
    />
  );

  const relatedTab = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <EntitySubgrid
        title="Open Opportunities"
        rows={relatedOpportunities}
        getRowId={(entry) => entry.id}
        emptyLabel="No related opportunities"
        onRowClick={(entry) => navigate(`/opportunities/${entry.id}`)}
        getFilterText={(entry) => `${entry.name} ${entry.stage} ${entry.account}`}
        views={[
          { label: 'All', filter: () => true },
          { label: 'Open', filter: (entry) => !entry.stage.startsWith('Closed') },
          { label: 'Closed', filter: (entry) => entry.stage.startsWith('Closed') },
        ]}
        columns={[
          {
            key: 'name',
            header: 'Opportunity',
            cell: (entry) => <span className="font-medium text-gray-900">{entry.name}</span>,
            sortValue: (entry) => entry.name,
          },
          {
            key: 'stage',
            header: 'Stage',
            cell: (entry) => entry.stage,
            sortValue: (entry) => entry.stage,
          },
          {
            key: 'amount',
            header: 'Amount',
            cell: (entry) => `$${entry.amount.toLocaleString()}`,
            className: 'text-right',
            sortValue: (entry) => entry.amount,
          },
        ]}
      />
      <EntitySubgrid
        title="Recent Activities"
        rows={leadTimelineEntries}
        getRowId={(entry) => entry.id}
        emptyLabel="No recent activity"
        getFilterText={(entry) => `${entry.title} ${entry.type} ${entry.owner ?? ''}`}
        views={[
          { label: 'All', filter: () => true },
          { label: 'Open', filter: (entry) => entry.status !== 'Completed' },
          { label: 'Completed', filter: (entry) => entry.status === 'Completed' },
        ]}
        columns={[
          {
            key: 'title',
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
          { label: 'Leads', onClick: () => navigate('/leads') },
          { label: lead.name },
        ]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/leads')}
            entityType="lead"
            entityId={lead.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveLead}
            onSaveAndClose={handleSaveAndCloseLead}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? lead.id,
                entityType: 'lead',
                entity: lead,
                onPatchEntity: (patch) => setLead((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setLeadTimelineEntries((current) => [entry, ...current]),
                onOpenDelete: () => setShowDeleteDialog(true),
              })
            }
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setDraftLead(lead);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }
                setDraftLead(lead);
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
            title={activeLead.name}
            subtitle={activeLead.company}
            icon={activeLead.name[0]}
            badges={[
              {
                label: activeLead.status,
                className: `px-3 py-1 rounded-full text-sm ${getLeadStatusClass(activeLead.status)}`,
              },
              {
                label: (
                  <>
                    <Star24Regular className="w-3 h-3 inline mr-1" />
                    {activeLead.rating}
                  </>
                ),
                className: `px-3 py-1 rounded-full text-sm ${getLeadRatingClass(activeLead.rating)}`,
              },
            ]}
            keyFields={[
              { label: 'Owner', value: activeLead.owner },
              { label: 'Source', value: activeLead.source },
              { label: 'Email', value: activeLead.email },
              { label: 'Phone', value: activeLead.phone },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Lead</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete {lead.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeLead(lead.id);
                    window.localStorage.removeItem(`dynamics-record-lead-${lead.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-lead-${lead.id}`);
                    navigate('/leads');
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
