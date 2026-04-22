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
import WorkOrderDetail from './WorkOrderDetail';

export default function WorkOrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-workorders', []);

  if (!isNew) {
    return <WorkOrderDetail />;
  }

  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    location: '',
    technician: '',
    status: 'Scheduled',
    priority: 'Medium',
    serviceType: 'Repair',
    scheduledDate: '',
    scheduledTime: '',
    estimatedDuration: '',
    actualStart: null as string | null,
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateWorkOrder = () => {
    const nextId = `WO-${Date.now()}`;
    upsertItem({ id: nextId, ...formData, scheduledDate: formData.scheduledDate || null, scheduledTime: formData.scheduledTime || null });
    navigate(`/field-service/work-orders/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Work Order Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Title" value={<EditableFieldControl value={formData.title} onChange={(value) => updateField('title', value)} />} />
            <FieldDisplay label="Customer" value={<EditableFieldControl value={formData.customer} onChange={(value) => updateField('customer', value)} />} />
            <FieldDisplay label="Technician" value={<EditableFieldControl value={formData.technician} onChange={(value) => updateField('technician', value)} />} />
            <FieldDisplay label="Location" value={<EditableFieldControl value={formData.location} onChange={(value) => updateField('location', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['In Progress', 'Scheduled', 'Completed', 'Unscheduled']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Priority" value={<EditableFieldControl type="select" value={formData.priority} options={['Urgent', 'High', 'Medium', 'Low']} onChange={(value) => updateField('priority', value)} />} />
            <FieldDisplay label="Service Type" value={<EditableFieldControl type="select" value={formData.serviceType} options={['Repair', 'Maintenance', 'Installation', 'Emergency', 'Inspection']} onChange={(value) => updateField('serviceType', value)} />} />
            <FieldDisplay label="Estimated Duration" value={<EditableFieldControl value={formData.estimatedDuration} onChange={(value) => updateField('estimatedDuration', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Work Orders', onClick: () => navigate('/field-service/work-orders') }, { label: 'New Work Order' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/field-service/work-orders')}>
          <Button variant="default" size="sm" onClick={handleCreateWorkOrder}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/field-service/work-orders')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.title || 'New Work Order'} subtitle={formData.customer || 'Create a new work order'} icon="W" keyFields={[{ label: 'Technician', value: formData.technician || '—' }, { label: 'Priority', value: formData.priority }, { label: 'Status', value: formData.status }, { label: 'Service Type', value: formData.serviceType }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
