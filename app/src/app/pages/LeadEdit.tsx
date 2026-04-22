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
import LeadDetail from './LeadDetail';

export default function LeadEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-leads', []);

  if (!isNew) {
    return <LeadDetail />;
  }

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    source: 'Website',
    status: 'New',
    rating: 'Warm',
    estimatedValue: 0,
    owner: 'You',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateLead = () => {
    const nextId = `${Date.now()}`;
    upsertItem({
      id: nextId,
      ...formData,
    });
    navigate(`/leads/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Lead Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Lead Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Company" value={<EditableFieldControl value={formData.company} onChange={(value) => updateField('company', value)} />} />
            <FieldDisplay label="Email" value={<EditableFieldControl type="email" value={formData.email} onChange={(value) => updateField('email', value)} />} />
            <FieldDisplay label="Phone" value={<EditableFieldControl type="tel" value={formData.phone} onChange={(value) => updateField('phone', value)} />} />
            <FieldDisplay label="Source" value={<EditableFieldControl type="select" value={formData.source} options={['Website', 'Referral', 'Trade Show', 'LinkedIn', 'Cold Call', 'Email Campaign']} onChange={(value) => updateField('source', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['New', 'Contacted', 'Qualified', 'Unqualified']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Rating" value={<EditableFieldControl type="select" value={formData.rating} options={['Hot', 'Warm', 'Cold']} onChange={(value) => updateField('rating', value)} />} />
            <FieldDisplay label="Estimated Value" value={<EditableFieldControl type="number" value={formData.estimatedValue} onChange={(value) => updateField('estimatedValue', Number(value))} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Leads', onClick: () => navigate('/leads') }, { label: 'New Lead' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/leads')}>
          <Button variant="default" size="sm" onClick={handleCreateLead}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/leads')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={
        <FormHeader
          title={formData.name || 'New Lead'}
          subtitle={formData.company || 'Create a new lead record'}
          icon="L"
          keyFields={[
            { label: 'Source', value: formData.source },
            { label: 'Status', value: formData.status },
            { label: 'Rating', value: formData.rating },
            { label: 'Owner', value: formData.owner },
          ]}
        />
      }
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
