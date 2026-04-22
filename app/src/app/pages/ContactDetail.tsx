import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Building24Regular,
  Delete24Regular,
  Edit24Regular,
  Mail24Regular,
  Person24Regular,
  Phone24Regular,
} from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockActivities, mockContacts, mockOpportunities } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { TimelinePane } from '../components/form/TimelinePane';
import { EntitySubgrid } from '../components/form/EntitySubgrid';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { usePersistentState } from '../components/form/usePersistentState';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function ContactDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: contacts, removeItem: removeContact } = usePersistentCollection('dynamics-collection-contacts', mockContacts);
  const baseContact = contacts.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contact, setContact] = usePersistentState(`dynamics-record-contact-${id}`, baseContact);
  const [draftContact, setDraftContact] = useState(baseContact);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!contact) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Contact Not Found</h1>
          <p className="text-gray-600 mb-4">The requested contact does not exist.</p>
          <Button onClick={() => navigate('/contacts')}>Back to Contacts</Button>
        </div>
      </div>
    );
  }

  const [contactTimelineEntries, setContactTimelineEntries] = usePersistentState(
    `dynamics-timeline-contact-${id}`,
    mockActivities
        .filter((entry) => entry.owner === contact.owner || entry.regarding === contact.company)
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
  const relatedOpportunities = mockOpportunities.filter((entry) => entry.account === contact.company);

  const activeContact = isEditing && draftContact ? draftContact : contact;

  const updateDraftContact = <K extends keyof typeof contact>(key: K, value: (typeof contact)[K]) => {
    setDraftContact((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveContact = () => {
    if (!draftContact) return;
    setContact(draftContact);
    setIsEditing(false);
    setIsDirty(false);
    setContactTimelineEntries((current) => [
      {
        id: `contact-save-${Date.now()}`,
        title: 'Contact record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftContact.owner,
        regarding: draftContact.company,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseContact = () => {
    handleSaveContact();
    navigate('/contacts');
  };

  const summaryTab = (
    <>
      {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this contact." /> : null}
      <FormSection title="Contact Information">
        <FieldGrid columns={2}>
          <FieldDisplay
            label="Email Address"
            icon={<Mail24Regular className="w-5 h-5" />}
            value={
              <a href={`mailto:${contact.email}`} className="hover:text-[#0B71C7] break-all">
                {activeContact.email}
              </a>
            }
          />
          <FieldDisplay
            label="Job Title"
            icon={<Person24Regular className="w-5 h-5" />}
            value={activeContact.title}
          />
          <FieldDisplay
            label="Phone Number"
            icon={<Phone24Regular className="w-5 h-5" />}
            value={
              <a href={`tel:${contact.phone}`} className="hover:text-[#0B71C7]">
                {activeContact.phone}
              </a>
            }
          />
          <FieldDisplay
            label="Owner"
            icon={<Person24Regular className="w-5 h-5" />}
            value={activeContact.owner}
          />
          <FieldDisplay
            label="Company"
            icon={<Building24Regular className="w-5 h-5" />}
            value={activeContact.company}
          />
          <FieldDisplay label="Contact ID" value={<span className="text-gray-600 text-sm">{activeContact.id}</span>} />
        </FieldGrid>
      </FormSection>
    </>
  );

  const detailsTab = (
    <FormSection title="Details">
      <FieldGrid columns={2}>
        <FieldDisplay label="First Name" value={isEditing ? <EditableFieldControl value={draftContact?.firstName ?? ''} onChange={(value) => updateDraftContact('firstName', value)} /> : activeContact.firstName} />
        <FieldDisplay label="Last Name" value={isEditing ? <EditableFieldControl value={draftContact?.lastName ?? ''} onChange={(value) => updateDraftContact('lastName', value)} /> : activeContact.lastName} />
        <FieldDisplay label="Company" value={isEditing ? <EditableFieldControl value={draftContact?.company ?? ''} onChange={(value) => updateDraftContact('company', value)} /> : activeContact.company} />
        <FieldDisplay label="Title" value={isEditing ? <EditableFieldControl value={draftContact?.title ?? ''} onChange={(value) => updateDraftContact('title', value)} /> : activeContact.title} />
        <FieldDisplay label="Owner" value={isEditing ? <EditableFieldControl value={draftContact?.owner ?? ''} onChange={(value) => updateDraftContact('owner', value)} /> : activeContact.owner} />
        <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftContact?.status ?? 'Active'} options={['Active', 'Inactive']} onChange={(value) => updateDraftContact('status', value as typeof contact.status)} /> : activeContact.status} />
      </FieldGrid>
    </FormSection>
  );

  const timelineTab = (
    <TimelinePane
      title="Recent Activity"
      entries={contactTimelineEntries}
      emptyLabel="No recent activity"
      onCreateEntry={(type, title) =>
        setContactTimelineEntries((current) => [
          {
            id: `contact-${contact.id}-${Date.now()}`,
            title,
            type,
            status: 'Open',
            date: new Date().toLocaleDateString(),
            owner: contact.owner,
            regarding: contact.company,
          },
          ...current,
        ])
      }
      onUpdateEntry={(entry) =>
        setContactTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
      }
    />
  );

  const tabs: FormTabItem[] = [
    { value: 'summary', label: 'Summary', content: summaryTab },
    { value: 'details', label: 'Details', content: detailsTab },
    { value: 'timeline', label: 'Timeline', content: timelineTab },
    {
      value: 'related',
      label: 'Related',
      content: (
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
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[
          { label: 'Contacts', onClick: () => navigate('/contacts') },
          { label: `${contact.firstName} ${contact.lastName}` },
        ]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/contacts')}
            entityType="contact"
            entityId={contact.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveContact}
            onSaveAndClose={handleSaveAndCloseContact}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? contact.id,
                entityType: 'contact',
                entity: contact,
                onPatchEntity: (patch) => setContact((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setContactTimelineEntries((current) => [entry, ...current]),
                onOpenDelete: () => setShowDeleteDialog(true),
              })
            }
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (isEditing) {
                  setDraftContact(contact);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }
                setDraftContact(contact);
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
            title={`${activeContact.firstName} ${activeContact.lastName}`}
            subtitle={`${activeContact.title} at ${activeContact.company}`}
            icon={
              <>
                {activeContact.firstName[0]}
                {activeContact.lastName[0]}
              </>
            }
            badges={[
              {
                label: activeContact.status,
                className: `px-3 py-1 rounded-full text-sm ${
                  activeContact.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`,
              },
            ]}
            keyFields={[
              { label: 'Company', value: activeContact.company },
              { label: 'Owner', value: activeContact.owner },
              { label: 'Email', value: activeContact.email },
              { label: 'Phone', value: activeContact.phone },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Contact</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">
                Are you sure you want to delete {contact.firstName} {contact.lastName}? This action cannot be undone.
              </p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeContact(contact.id);
                    window.localStorage.removeItem(`dynamics-record-contact-${contact.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-contact-${contact.id}`);
                    navigate('/contacts');
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
