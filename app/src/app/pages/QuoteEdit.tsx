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
import QuoteDetail from './QuoteDetail';

export default function QuoteEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-quotes', []);

  if (!isNew) {
    return <QuoteDetail />;
  }

  const [formData, setFormData] = useState({
    quoteNumber: '',
    name: '',
    account: '',
    totalAmount: 0,
    status: 'Draft',
    validUntil: '',
    createdDate: new Date().toISOString().slice(0, 10),
    owner: 'You',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateQuote = () => {
    const nextId = `${Date.now()}`;
    upsertItem({
      id: nextId,
      ...formData,
    });
    navigate(`/quotes/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Quote Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Quote Number" value={<EditableFieldControl value={formData.quoteNumber} onChange={(value) => updateField('quoteNumber', value)} />} />
            <FieldDisplay label="Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Account" value={<EditableFieldControl value={formData.account} onChange={(value) => updateField('account', value)} />} />
            <FieldDisplay label="Total Amount" value={<EditableFieldControl type="number" value={formData.totalAmount} onChange={(value) => updateField('totalAmount', Number(value))} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Draft', 'Active', 'Won', 'Lost', 'Revised']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Valid Until" value={<EditableFieldControl value={formData.validUntil} onChange={(value) => updateField('validUntil', value)} />} />
            <FieldDisplay label="Owner" value={<EditableFieldControl value={formData.owner} onChange={(value) => updateField('owner', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Quotes', onClick: () => navigate('/quotes') }, { label: 'New Quote' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/quotes')}>
          <Button variant="default" size="sm" onClick={handleCreateQuote}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/quotes')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={
        <FormHeader
          title={formData.quoteNumber || 'New Quote'}
          subtitle={formData.name || 'Create a new quote record'}
          icon="Q"
          keyFields={[
            { label: 'Status', value: formData.status },
            { label: 'Owner', value: formData.owner },
            { label: 'Account', value: formData.account || '—' },
            { label: 'Amount', value: `$${formData.totalAmount.toLocaleString()}` },
          ]}
        />
      }
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
