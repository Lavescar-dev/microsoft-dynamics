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
import CampaignDetail from './CampaignDetail';

export default function CampaignEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-campaigns', []);

  if (!isNew) {
    return <CampaignDetail />;
  }

  const [formData, setFormData] = useState({
    name: '',
    type: 'Email',
    status: 'Planning',
    startDate: '',
    endDate: '',
    budget: 0,
    spent: 0,
    leads: 0,
    responses: 0,
    revenue: 0,
    owner: 'Jennifer Williams',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateCampaign = () => {
    const nextId = `${Date.now()}`;
    upsertItem({ id: nextId, ...formData });
    navigate(`/marketing/campaigns/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Campaign Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Type" value={<EditableFieldControl type="select" value={formData.type} options={['Email', 'Multi-Channel', 'Direct Mail', 'Social Media']} onChange={(value) => updateField('type', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Planning', 'Active', 'Completed']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
            <FieldDisplay label="Start Date" value={<EditableFieldControl value={formData.startDate} onChange={(value) => updateField('startDate', value)} />} />
            <FieldDisplay label="End Date" value={<EditableFieldControl value={formData.endDate} onChange={(value) => updateField('endDate', value)} />} />
            <FieldDisplay label="Budget" value={<EditableFieldControl type="number" value={formData.budget} onChange={(value) => updateField('budget', Number(value))} />} />
            <FieldDisplay label="Revenue" value={<EditableFieldControl type="number" value={formData.revenue} onChange={(value) => updateField('revenue', Number(value))} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Campaigns', onClick: () => navigate('/marketing/campaigns') }, { label: 'New Campaign' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/marketing/campaigns')}>
          <Button variant="default" size="sm" onClick={handleCreateCampaign}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/marketing/campaigns')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.name || 'New Campaign'} subtitle={formData.type || 'Create a new marketing campaign'} icon="C" keyFields={[{ label: 'Status', value: formData.status }, { label: 'Owner', value: formData.owner }, { label: 'Budget', value: `$${formData.budget.toLocaleString()}` }, { label: 'Revenue', value: `$${formData.revenue.toLocaleString()}` }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
