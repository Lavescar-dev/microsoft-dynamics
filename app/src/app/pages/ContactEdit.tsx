import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Dismiss24Regular, Save24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import ContactDetail from './ContactDetail';

export default function ContactEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-contacts', []);

  if (!isNew) {
    return <ContactDetail />;
  }

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    company: '',
    title: '',
    status: 'Active',
    owner: 'You',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateContact = () => {
    const nextId = `${Date.now()}`;
    upsertItem({
      id: nextId,
      ...formData,
    });
    navigate(`/contacts/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Contact Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="First Name" value={<EditableFieldControl value={formData.firstName} onChange={(value) => updateField('firstName', value)} />} />
            <FieldDisplay label="Last Name" value={<EditableFieldControl value={formData.lastName} onChange={(value) => updateField('lastName', value)} />} />
            <FieldDisplay label="Email" value={<EditableFieldControl type="email" value={formData.email} onChange={(value) => updateField('email', value)} />} />
            <FieldDisplay label="Phone" value={<EditableFieldControl type="tel" value={formData.phone} onChange={(value) => updateField('phone', value)} />} />
            <FieldDisplay label="Company" value={<EditableFieldControl value={formData.company} onChange={(value) => updateField('company', value)} />} />
            <FieldDisplay label="Title" value={<EditableFieldControl value={formData.title} onChange={(value) => updateField('title', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Active', 'Inactive']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Contacts', onClick: () => navigate('/contacts') }, { label: 'New Contact' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/contacts')}>
          <Button variant="default" size="sm" onClick={handleCreateContact}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/contacts')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={
        <FormHeader
          title={`${formData.firstName || 'New'} ${formData.lastName || 'Contact'}`.trim()}
          subtitle={formData.company || 'Create a new contact record'}
          icon="C"
          keyFields={[
            { label: 'Status', value: formData.status },
            { label: 'Owner', value: formData.owner },
            { label: 'Email', value: formData.email || '—' },
            { label: 'Phone', value: formData.phone || '—' },
          ]}
        />
      }
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
