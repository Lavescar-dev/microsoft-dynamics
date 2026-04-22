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
import CompetitorDetail from './CompetitorDetail';

export default function CompetitorEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-competitors', []);

  if (!isNew) {
    return <CompetitorDetail />;
  }

  const [formData, setFormData] = useState({
    name: '',
    industry: '',
    strengths: '',
    weaknesses: '',
    winRate: 50,
    opportunities: 0,
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateCompetitor = () => {
    const nextId = `${Date.now()}`;
    upsertItem({ id: nextId, ...formData });
    navigate(`/competitors/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Competitor Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Industry" value={<EditableFieldControl value={formData.industry} onChange={(value) => updateField('industry', value)} />} />
            <FieldDisplay label="Strengths" value={<EditableFieldControl value={formData.strengths} onChange={(value) => updateField('strengths', value)} />} />
            <FieldDisplay label="Weaknesses" value={<EditableFieldControl value={formData.weaknesses} onChange={(value) => updateField('weaknesses', value)} />} />
            <FieldDisplay label="Win Rate" value={<EditableFieldControl type="number" value={formData.winRate} onChange={(value) => updateField('winRate', Number(value))} />} />
            <FieldDisplay label="Opportunities" value={<EditableFieldControl type="number" value={formData.opportunities} onChange={(value) => updateField('opportunities', Number(value))} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Competitors', onClick: () => navigate('/competitors') }, { label: 'New Competitor' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/competitors')}>
          <Button variant="default" size="sm" onClick={handleCreateCompetitor}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/competitors')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.name || 'New Competitor'} subtitle={formData.industry || 'Create a new competitor'} icon="C" keyFields={[{ label: 'Industry', value: formData.industry || '—' }, { label: 'Win Rate', value: `${formData.winRate}%` }, { label: 'Opportunities', value: formData.opportunities }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
