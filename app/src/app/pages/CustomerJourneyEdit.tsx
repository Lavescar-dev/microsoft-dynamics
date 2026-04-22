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
import CustomerJourneyDetail from './CustomerJourneyDetail';

export default function CustomerJourneyEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-journeys', []);

  if (!isNew) {
    return <CustomerJourneyDetail />;
  }

  const [formData, setFormData] = useState({
    name: '',
    status: 'Active',
    type: 'Automated',
    startTrigger: '',
    steps: 0,
    activeCust: 0,
    completed: 0,
    avgDuration: '',
    conversionRate: 0,
    owner: 'Jennifer Williams',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateJourney = () => {
    const nextId = `${Date.now()}`;
    upsertItem({ id: nextId, ...formData });
    navigate(`/marketing/customer-journeys/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Journey Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Type" value={<EditableFieldControl type="select" value={formData.type} options={['Automated', 'Semi-Automated', 'Manual']} onChange={(value) => updateField('type', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Active', 'Paused']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Start Trigger" value={<EditableFieldControl value={formData.startTrigger} onChange={(value) => updateField('startTrigger', value)} />} />
            <FieldDisplay label="Steps" value={<EditableFieldControl type="number" value={formData.steps} onChange={(value) => updateField('steps', Number(value))} />} />
            <FieldDisplay label="Active Customers" value={<EditableFieldControl type="number" value={formData.activeCust} onChange={(value) => updateField('activeCust', Number(value))} />} />
            <FieldDisplay label="Completed" value={<EditableFieldControl type="number" value={formData.completed} onChange={(value) => updateField('completed', Number(value))} />} />
            <FieldDisplay label="Conversion Rate" value={<EditableFieldControl type="number" value={formData.conversionRate} onChange={(value) => updateField('conversionRate', Number(value))} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Customer Journeys', onClick: () => navigate('/marketing/customer-journeys') }, { label: 'New Journey' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/marketing/customer-journeys')}>
          <Button variant="default" size="sm" onClick={handleCreateJourney}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/marketing/customer-journeys')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.name || 'New Journey'} subtitle={formData.type || 'Create a new customer journey'} icon="J" keyFields={[{ label: 'Status', value: formData.status }, { label: 'Steps', value: formData.steps }, { label: 'Conversion', value: `${formData.conversionRate}%` }, { label: 'Owner', value: formData.owner }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
