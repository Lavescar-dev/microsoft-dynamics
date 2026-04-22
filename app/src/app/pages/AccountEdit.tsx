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
import AccountDetail from './AccountDetail';

export default function AccountEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-accounts', []);

  if (!isNew) {
    return <AccountDetail />;
  }

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    revenue: 0,
    employees: 0,
    phone: '',
    website: '',
    status: 'Active',
    owner: 'You',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateAccount = () => {
    const nextId = `${Date.now()}`;
    upsertItem({
      id: nextId,
      ...formData,
    });
    navigate(`/accounts/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Account Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Account Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Industry" value={<EditableFieldControl value={formData.industry} onChange={(value) => updateField('industry', value)} />} />
            <FieldDisplay label="Annual Revenue" value={<EditableFieldControl type="number" value={formData.revenue} onChange={(value) => updateField('revenue', Number(value))} />} />
            <FieldDisplay label="Employees" value={<EditableFieldControl type="number" value={formData.employees} onChange={(value) => updateField('employees', Number(value))} />} />
            <FieldDisplay label="Phone" value={<EditableFieldControl type="tel" value={formData.phone} onChange={(value) => updateField('phone', value)} />} />
            <FieldDisplay label="Website" value={<EditableFieldControl value={formData.website} onChange={(value) => updateField('website', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Active', 'Inactive']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Accounts', onClick: () => navigate('/accounts') }, { label: 'New Account' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/accounts')}>
          <Button variant="default" size="sm" onClick={handleCreateAccount}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/accounts')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={
        <FormHeader
          title={formData.name || 'New Account'}
          subtitle={formData.industry || 'Create a new account record'}
          icon="A"
          keyFields={[
            { label: 'Status', value: formData.status },
            { label: 'Owner', value: formData.owner },
            { label: 'Revenue', value: `$${formData.revenue.toLocaleString()}` },
            { label: 'Employees', value: formData.employees },
          ]}
        />
      }
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
