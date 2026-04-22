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
import CaseDetail from './CaseDetail';

export default function CaseEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-cases', []);

  if (!isNew) {
    return <CaseDetail />;
  }

  const [formData, setFormData] = useState({
    title: '',
    customer: '',
    priority: 'Normal',
    status: 'Active',
    caseType: 'Question',
    createdDate: new Date().toISOString().slice(0, 10),
    owner: 'You',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateCase = () => {
    const nextId = `${Date.now()}`;
    upsertItem({ id: nextId, ...formData });
    navigate(`/cases/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Case Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Title" value={<EditableFieldControl value={formData.title} onChange={(value) => updateField('title', value)} />} />
            <FieldDisplay label="Customer" value={<EditableFieldControl value={formData.customer} onChange={(value) => updateField('customer', value)} />} />
            <FieldDisplay label="Priority" value={<EditableFieldControl type="select" value={formData.priority} options={['High', 'Normal', 'Low']} onChange={(value) => updateField('priority', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Active', 'Resolved', 'Pending', 'Cancelled']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Case Type" value={<EditableFieldControl type="select" value={formData.caseType} options={['Question', 'Problem', 'Request']} onChange={(value) => updateField('caseType', value)} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Cases', onClick: () => navigate('/cases') }, { label: 'New Case' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/cases')}>
          <Button variant="default" size="sm" onClick={handleCreateCase}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/cases')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.title || 'New Case'} subtitle={formData.customer || 'Create a new case record'} icon="C" keyFields={[{ label: 'Priority', value: formData.priority }, { label: 'Status', value: formData.status }, { label: 'Type', value: formData.caseType }, { label: 'Owner', value: formData.owner }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
