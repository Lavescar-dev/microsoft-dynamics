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
import ActivityDetail from './ActivityDetail';

export default function ActivityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-activities', []);

  if (!isNew) {
    return <ActivityDetail />;
  }

  const [formData, setFormData] = useState({
    subject: '',
    type: 'Task',
    regarding: '',
    priority: 'Normal',
    status: 'Open',
    dueDate: new Date().toISOString().slice(0, 10),
    owner: 'You',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateActivity = () => {
    const nextId = `${Date.now()}`;
    upsertItem({ id: nextId, ...formData });
    navigate(`/activities/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Activity Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Subject" value={<EditableFieldControl value={formData.subject} onChange={(value) => updateField('subject', value)} />} />
            <FieldDisplay label="Type" value={<EditableFieldControl type="select" value={formData.type} options={['Call', 'Email', 'Meeting', 'Task']} onChange={(value) => updateField('type', value)} />} />
            <FieldDisplay label="Regarding" value={<EditableFieldControl value={formData.regarding} onChange={(value) => updateField('regarding', value)} />} />
            <FieldDisplay label="Priority" value={<EditableFieldControl type="select" value={formData.priority} options={['High', 'Normal', 'Low']} onChange={(value) => updateField('priority', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Open', 'Completed', 'Cancelled']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Due Date" value={<EditableFieldControl value={formData.dueDate} onChange={(value) => updateField('dueDate', value)} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Activities', onClick: () => navigate('/activities') }, { label: 'New Activity' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/activities')}>
          <Button variant="default" size="sm" onClick={handleCreateActivity}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/activities')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.subject || 'New Activity'} subtitle={formData.regarding || 'Create a new activity'} icon="A" keyFields={[{ label: 'Type', value: formData.type }, { label: 'Priority', value: formData.priority }, { label: 'Status', value: formData.status }, { label: 'Owner', value: formData.owner }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
