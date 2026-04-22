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
import SegmentDetail from './SegmentDetail';

export default function SegmentEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-segments', []);

  if (!isNew) {
    return <SegmentDetail />;
  }

  const [formData, setFormData] = useState({
    name: '',
    type: 'Dynamic',
    criteria: '',
    memberCount: 0,
    status: 'Active',
    lastUpdated: new Date().toISOString().slice(0, 10),
    campaigns: 0,
    avgValue: 0,
    owner: 'Jennifer Williams',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateSegment = () => {
    const nextId = `${Date.now()}`;
    upsertItem({ id: nextId, ...formData });
    navigate(`/marketing/segments/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Segment Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Type" value={<EditableFieldControl type="select" value={formData.type} options={['Dynamic', 'Static']} onChange={(value) => updateField('type', value)} />} />
            <FieldDisplay label="Criteria" value={<EditableFieldControl value={formData.criteria} onChange={(value) => updateField('criteria', value)} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Active', 'Inactive']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Members" value={<EditableFieldControl type="number" value={formData.memberCount} onChange={(value) => updateField('memberCount', Number(value))} />} />
            <FieldDisplay label="Campaigns" value={<EditableFieldControl type="number" value={formData.campaigns} onChange={(value) => updateField('campaigns', Number(value))} />} />
            <FieldDisplay label="Average Value" value={<EditableFieldControl type="number" value={formData.avgValue} onChange={(value) => updateField('avgValue', Number(value))} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Segments', onClick: () => navigate('/marketing/segments') }, { label: 'New Segment' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/marketing/segments')}>
          <Button variant="default" size="sm" onClick={handleCreateSegment}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/marketing/segments')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.name || 'New Segment'} subtitle={formData.type || 'Create a new segment'} icon="S" keyFields={[{ label: 'Status', value: formData.status }, { label: 'Members', value: formData.memberCount }, { label: 'Campaigns', value: formData.campaigns }, { label: 'Owner', value: formData.owner }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
