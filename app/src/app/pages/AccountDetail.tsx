import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Building24Regular,
  Delete24Regular,
  Edit24Regular,
  Globe24Regular,
  Money24Regular,
  People24Regular,
  Person24Regular,
  Phone24Regular,
} from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockAccounts } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { EntitySubgrid } from '../components/form/EntitySubgrid';
import { TimelinePane } from '../components/form/TimelinePane';
import { mockActivities, mockContacts, mockOpportunities } from '../data/mockData';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { usePersistentState } from '../components/form/usePersistentState';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function AccountDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: accounts, removeItem: removeAccount } = usePersistentCollection('dynamics-collection-accounts', mockAccounts);
  const baseAccount = accounts.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [account, setAccount] = usePersistentState(`dynamics-record-account-${id}`, baseAccount);
  const [draftAccount, setDraftAccount] = useState(baseAccount);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!account) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Account Not Found</h1>
          <p className="text-gray-600 mb-4">The requested account does not exist.</p>
          <Button onClick={() => navigate('/accounts')}>Back to Accounts</Button>
        </div>
      </div>
    );
  }

  const activeAccount = isEditing && draftAccount ? draftAccount : account;

  const updateDraftAccount = <K extends keyof typeof account>(key: K, value: (typeof account)[K]) => {
    setDraftAccount((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveAccount = () => {
    if (!draftAccount) return;
    setAccount(draftAccount);
    setIsEditing(false);
    setIsDirty(false);
    setAccountTimelineEntries((current) => [
      {
        id: `account-save-${Date.now()}`,
        title: 'Account record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftAccount.owner,
        regarding: draftAccount.name,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseAccount = () => {
    handleSaveAccount();
    navigate('/accounts');
  };

  const [accountTimelineEntries, setAccountTimelineEntries] = usePersistentState(
    `dynamics-timeline-account-${id}`,
    mockActivities
      .filter((entry) => entry.owner === account.owner || entry.regarding.toLowerCase().includes(account.name.toLowerCase()))
      .slice(0, 6)
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

  const relatedContacts = mockContacts.filter((entry) => entry.company === account.name);
  const relatedOpportunities = mockOpportunities.filter((entry) => entry.account === account.name);

  const summaryTab = (
    <>
      <FormSection title="Account Information">
        {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this account." /> : null}
        <FieldGrid columns={2}>
          <FieldDisplay
            label="Annual Revenue"
            icon={<Money24Regular className="w-5 h-5" />}
            value={<span className="text-xl font-semibold">${(activeAccount.revenue / 1000000).toFixed(1)}M</span>}
          />
          <FieldDisplay
            label="Website"
            icon={<Globe24Regular className="w-5 h-5" />}
            value={
              <a
                href={`https://${activeAccount.website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#0B71C7]"
              >
                {activeAccount.website}
              </a>
            }
          />
          <FieldDisplay
            label="Employees"
            icon={<People24Regular className="w-5 h-5" />}
            value={<span>{activeAccount.employees.toLocaleString()}</span>}
          />
          <FieldDisplay
            label="Industry"
            icon={<Building24Regular className="w-5 h-5" />}
            value={<span>{activeAccount.industry}</span>}
          />
          <FieldDisplay
            label="Phone"
            icon={<Phone24Regular className="w-5 h-5" />}
            value={
              <a href={`tel:${activeAccount.phone}`} className="hover:text-[#0B71C7]">
                {activeAccount.phone}
              </a>
            }
          />
          <FieldDisplay
            label="Owner"
            icon={<Person24Regular className="w-5 h-5" />}
            value={<span>{activeAccount.owner}</span>}
          />
        </FieldGrid>
      </FormSection>

      <FormSection title="Related Records">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EntitySubgrid
            title="Related Opportunities"
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
            title="Related Contacts"
            rows={relatedContacts}
            getRowId={(entry) => entry.id}
            emptyLabel="No related contacts"
            onRowClick={(entry) => navigate(`/contacts/${entry.id}`)}
            getFilterText={(entry) => `${entry.firstName} ${entry.lastName} ${entry.title} ${entry.email}`}
            views={[
              { label: 'All', filter: () => true },
              { label: 'Active', filter: (entry) => entry.status === 'Active' },
              { label: 'Inactive', filter: (entry) => entry.status === 'Inactive' },
            ]}
            columns={[
              {
                key: 'name',
                header: 'Contact',
                cell: (entry) => <span className="font-medium text-gray-900">{`${entry.firstName} ${entry.lastName}`}</span>,
                sortValue: (entry) => `${entry.firstName} ${entry.lastName}`,
              },
              {
                key: 'title',
                header: 'Title',
                cell: (entry) => entry.title,
                sortValue: (entry) => entry.title,
              },
              {
                key: 'email',
                header: 'Email',
                cell: (entry) => entry.email,
                sortValue: (entry) => entry.email,
              },
            ]}
          />
        </div>
      </FormSection>
    </>
  );

  const detailsTab = (
    <FormSection title="Details">
      <FieldGrid columns={2}>
        <FieldDisplay label="Account Name" value={isEditing ? <EditableFieldControl value={draftAccount?.name ?? ''} onChange={(value) => updateDraftAccount('name', value)} /> : activeAccount.name} />
        <FieldDisplay label="Account ID" value={<span className="text-gray-600 text-sm">{activeAccount.id}</span>} />
        <FieldDisplay label="Industry" value={isEditing ? <EditableFieldControl value={draftAccount?.industry ?? ''} onChange={(value) => updateDraftAccount('industry', value)} /> : activeAccount.industry} />
        <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftAccount?.status ?? 'Active'} options={['Active', 'Inactive']} onChange={(value) => updateDraftAccount('status', value as typeof account.status)} /> : activeAccount.status} />
        <FieldDisplay label="Owner" value={isEditing ? <EditableFieldControl value={draftAccount?.owner ?? ''} onChange={(value) => updateDraftAccount('owner', value)} /> : activeAccount.owner} />
        <FieldDisplay label="Employee Count" value={isEditing ? <EditableFieldControl type="number" value={draftAccount?.employees ?? 0} onChange={(value) => updateDraftAccount('employees', Number(value))} /> : activeAccount.employees.toLocaleString()} />
      </FieldGrid>
    </FormSection>
  );

  const timelineTab = (
    <TimelinePane
      title="Activity Timeline"
      entries={accountTimelineEntries}
      emptyLabel="No activity recorded"
      onCreateEntry={(type, title) =>
        setAccountTimelineEntries((current) => [
          {
            id: `account-${account.id}-${Date.now()}`,
            title,
            type,
            status: 'Open',
            date: new Date().toLocaleDateString(),
            owner: account.owner,
            regarding: account.name,
          },
          ...current,
        ])
      }
      onUpdateEntry={(entry) =>
        setAccountTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
      }
    />
  );

  const tabs: FormTabItem[] = [
    { value: 'summary', label: 'Summary', content: summaryTab },
    { value: 'details', label: 'Details', content: detailsTab },
    { value: 'timeline', label: 'Timeline', content: timelineTab },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[
          { label: 'Accounts', onClick: () => navigate('/accounts') },
          { label: account.name },
        ]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/accounts')}
            entityType="account"
            entityId={account.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveAccount}
            onSaveAndClose={handleSaveAndCloseAccount}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? account.id,
                entityType: 'account',
                entity: account,
                onPatchEntity: (patch) => setAccount((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setAccountTimelineEntries((current) => [entry, ...current]),
                onOpenDelete: () => setShowDeleteDialog(true),
              })
            }
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setDraftAccount(account);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }
                setDraftAccount(account);
                setIsEditing(true);
              }}
              className="text-gray-600 hover:text-gray-900"
            >
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDeleteDialog(true)}
              className="text-red-600 hover:text-red-700"
            >
              <Delete24Regular className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </FormCommandBar>
        }
        header={
          <FormHeader
            title={activeAccount.name}
            subtitle={activeAccount.industry}
            icon={<Building24Regular className="w-10 h-10" />}
            badges={[
              {
                label: activeAccount.status,
                className: `px-3 py-1 rounded-full text-sm ${
                  activeAccount.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`,
              },
            ]}
            keyFields={[
              { label: 'Owner', value: activeAccount.owner },
              { label: 'Phone', value: activeAccount.phone },
              { label: 'Revenue', value: `$${(activeAccount.revenue / 1000000).toFixed(1)}M` },
              { label: 'Website', value: activeAccount.website },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Account</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete {account.name}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeAccount(account.id);
                    window.localStorage.removeItem(`dynamics-record-account-${account.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-account-${account.id}`);
                    navigate('/accounts');
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
