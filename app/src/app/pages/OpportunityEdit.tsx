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
import OpportunityDetail from './OpportunityDetail';

export default function OpportunityEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-opportunities', []);

  if (!isNew) {
    return <OpportunityDetail />;
  }

  const [formData, setFormData] = useState({
    name: '',
    account: '',
    stage: 'Prospecting',
    probability: 10,
    amount: 0,
    closeDate: '',
    owner: 'You',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateOpportunity = () => {
    const nextId = `${Date.now()}`;
    upsertItem({
      id: nextId,
      ...formData,
    });
    navigate(`/opportunities/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Opportunity Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Opportunity Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Account" value={<EditableFieldControl value={formData.account} onChange={(value) => updateField('account', value)} />} />
            <FieldDisplay label="Stage" value={<EditableFieldControl type="select" value={formData.stage} options={['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won', 'Closed Lost']} onChange={(value) => updateField('stage', value)} />} />
            <FieldDisplay label="Probability" value={<EditableFieldControl type="number" value={formData.probability} onChange={(value) => updateField('probability', Number(value))} />} />
            <FieldDisplay label="Amount" value={<EditableFieldControl type="number" value={formData.amount} onChange={(value) => updateField('amount', Number(value))} />} />
            <FieldDisplay label="Close Date" value={<EditableFieldControl value={formData.closeDate} onChange={(value) => updateField('closeDate', value)} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Opportunities', onClick: () => navigate('/opportunities') }, { label: 'New Opportunity' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/opportunities')}>
          <Button variant="default" size="sm" onClick={handleCreateOpportunity}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/opportunities')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={
        <FormHeader
          title={formData.name || 'New Opportunity'}
          subtitle={formData.account || 'Create a new opportunity record'}
          icon="O"
          keyFields={[
            { label: 'Stage', value: formData.stage },
            { label: 'Probability', value: `${formData.probability}%` },
            { label: 'Amount', value: `$${formData.amount.toLocaleString()}` },
            { label: 'Owner', value: formData.owner },
          ]}
        />
      }
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
