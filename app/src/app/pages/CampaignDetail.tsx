import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CalendarMonth24Regular, Edit24Regular, Money24Regular, Person24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockCampaigns } from '../data/mockData';
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

function getCampaignStatusClass(status: string) {
  if (status === 'Active') return 'bg-green-100 text-green-700';
  if (status === 'Planning') return 'bg-yellow-100 text-yellow-700';
  return 'bg-gray-100 text-gray-700';
}

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: campaigns, removeItem } = usePersistentCollection('dynamics-collection-campaigns', mockCampaigns);
  const baseCampaign = campaigns.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [campaign, setCampaign] = usePersistentState(`dynamics-record-campaign-${id}`, baseCampaign);
  const [draftCampaign, setDraftCampaign] = useState(baseCampaign);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!campaign) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Campaign Not Found</h1>
          <p className="text-gray-600 mb-4">The requested campaign does not exist.</p>
          <Button onClick={() => navigate('/marketing/campaigns')}>Back to Campaigns</Button>
        </div>
      </div>
    );
  }

  const activeCampaign = isEditing && draftCampaign ? draftCampaign : campaign;

  const updateDraftCampaign = <K extends keyof typeof campaign>(key: K, value: (typeof campaign)[K]) => {
    setDraftCampaign((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const [campaignTimelineEntries, setCampaignTimelineEntries] = usePersistentState(
    `dynamics-timeline-campaign-${id}`,
    [
      {
        id: `campaign-${campaign.id}-created`,
        title: `${campaign.name} campaign launched`,
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: campaign.owner,
        regarding: campaign.type,
      },
    ]
  );

  const handleSaveCampaign = () => {
    if (!draftCampaign) return;
    setCampaign(draftCampaign);
    setIsEditing(false);
    setIsDirty(false);
    setCampaignTimelineEntries((current) => [
      {
        id: `campaign-save-${Date.now()}`,
        title: 'Campaign profile updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftCampaign.owner,
        regarding: draftCampaign.name,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseCampaign = () => {
    handleSaveCampaign();
    navigate('/marketing/campaigns');
  };

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <FormSection title="Campaign Overview">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this campaign." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Campaign Type" value={activeCampaign.type} />
              <FieldDisplay label="Owner" icon={<Person24Regular className="w-5 h-5" />} value={activeCampaign.owner} />
              <FieldDisplay label="Budget" icon={<Money24Regular className="w-5 h-5" />} value={<span className="text-xl font-semibold">${activeCampaign.budget.toLocaleString()}</span>} />
              <FieldDisplay label="Spent" value={`$${activeCampaign.spent.toLocaleString()}`} />
              <FieldDisplay label="Revenue" value={`$${activeCampaign.revenue.toLocaleString()}`} />
              <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getCampaignStatusClass(activeCampaign.status)}`}>{activeCampaign.status}</span>} />
              <FieldDisplay label="Start Date" icon={<CalendarMonth24Regular className="w-5 h-5" />} value={new Date(activeCampaign.startDate).toLocaleDateString()} />
              <FieldDisplay label="End Date" value={new Date(activeCampaign.endDate).toLocaleDateString()} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Campaign Timeline"
              entries={campaignTimelineEntries}
              emptyLabel="No campaign activity recorded"
              onCreateEntry={(type, title) =>
                setCampaignTimelineEntries((current) => [
                  {
                    id: `campaign-${activeCampaign.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: activeCampaign.owner,
                    regarding: activeCampaign.name,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setCampaignTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
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
        <FormSection title="Campaign Metrics">
          <FieldGrid columns={2}>
            <FieldDisplay label="Name" value={isEditing ? <EditableFieldControl value={draftCampaign?.name ?? ''} onChange={(value) => updateDraftCampaign('name', value)} /> : activeCampaign.name} />
            <FieldDisplay label="Type" value={isEditing ? <EditableFieldControl type="select" value={draftCampaign?.type ?? 'Email'} options={['Email', 'Multi-Channel', 'Direct Mail', 'Social Media']} onChange={(value) => updateDraftCampaign('type', value as typeof campaign.type)} /> : activeCampaign.type} />
            <FieldDisplay label="Budget" value={isEditing ? <EditableFieldControl type="number" value={draftCampaign?.budget ?? 0} onChange={(value) => updateDraftCampaign('budget', Number(value))} /> : `$${activeCampaign.budget.toLocaleString()}`} />
            <FieldDisplay label="Spent" value={isEditing ? <EditableFieldControl type="number" value={draftCampaign?.spent ?? 0} onChange={(value) => updateDraftCampaign('spent', Number(value))} /> : `$${activeCampaign.spent.toLocaleString()}`} />
            <FieldDisplay label="Leads" value={isEditing ? <EditableFieldControl type="number" value={draftCampaign?.leads ?? 0} onChange={(value) => updateDraftCampaign('leads', Number(value))} /> : activeCampaign.leads.toLocaleString()} />
            <FieldDisplay label="Responses" value={isEditing ? <EditableFieldControl type="number" value={draftCampaign?.responses ?? 0} onChange={(value) => updateDraftCampaign('responses', Number(value))} /> : activeCampaign.responses.toLocaleString()} />
            <FieldDisplay label="Revenue" value={isEditing ? <EditableFieldControl type="number" value={draftCampaign?.revenue ?? 0} onChange={(value) => updateDraftCampaign('revenue', Number(value))} /> : `$${activeCampaign.revenue.toLocaleString()}`} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftCampaign?.status ?? 'Planning'} options={['Planning', 'Active', 'Completed']} onChange={(value) => updateDraftCampaign('status', value as typeof campaign.status)} /> : activeCampaign.status} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[{ label: 'Campaigns', onClick: () => navigate('/marketing/campaigns') }, { label: activeCampaign.name }]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/marketing/campaigns')}
            entityType="campaign"
            entityId={activeCampaign.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveCampaign}
            onSaveAndClose={handleSaveAndCloseCampaign}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeCampaign.id,
                entityType: 'campaign',
                entity: activeCampaign,
                onPatchEntity: (patch) => setCampaign((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setCampaignTimelineEntries((current) => [entry, ...current]),
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
                  setDraftCampaign(campaign);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }
                setDraftCampaign(campaign);
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
            title={activeCampaign.name}
            subtitle={activeCampaign.type}
            icon={activeCampaign.name[0]}
            badges={[{ label: activeCampaign.status, className: `px-3 py-1 rounded-full text-sm ${getCampaignStatusClass(activeCampaign.status)}` }]}
            keyFields={[
              { label: 'Budget', value: `$${activeCampaign.budget.toLocaleString()}` },
              { label: 'Leads', value: activeCampaign.leads },
              { label: 'Responses', value: activeCampaign.responses },
              { label: 'Owner', value: activeCampaign.owner },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Campaign</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete {activeCampaign.name}? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeItem(activeCampaign.id);
                    window.localStorage.removeItem(`dynamics-record-campaign-${activeCampaign.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-campaign-${activeCampaign.id}`);
                    navigate('/marketing/campaigns');
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
