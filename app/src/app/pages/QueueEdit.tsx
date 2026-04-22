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
import QueueDetail from './QueueDetail';

export default function QueueEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-queues', []);

  if (!isNew) {
    return <QueueDetail />;
  }

  const [formData, setFormData] = useState({
    name: '',
    type: 'Case',
    activeItems: 0,
    owner: 'You',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateQueue = () => {
    const nextId = `${Date.now()}`;
    upsertItem({
      id: nextId,
      ...formData,
    });
    navigate(`/queues/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Queue Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Queue Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Type" value={<EditableFieldControl type="select" value={formData.type} options={['Case', 'Activity', 'Email']} onChange={(value) => updateField('type', value)} />} />
            <FieldDisplay label="Active Items" value={<EditableFieldControl type="number" value={formData.activeItems} onChange={(value) => updateField('activeItems', Number(value))} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Queues', onClick: () => navigate('/queues') }, { label: 'New Queue' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/queues')}>
          <Button variant="default" size="sm" onClick={handleCreateQueue}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/queues')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={
        <FormHeader
          title={formData.name || 'New Queue'}
          subtitle={formData.type || 'Create a new queue record'}
          icon="Q"
          keyFields={[
            { label: 'Type', value: formData.type },
            { label: 'Owner', value: formData.owner },
            { label: 'Active Items', value: formData.activeItems },
          ]}
        />
      }
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
