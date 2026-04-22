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
import InvoiceDetail from './InvoiceDetail';

export default function InvoiceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-invoices', []);

  if (!isNew) {
    return <InvoiceDetail />;
  }

  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customer: '',
    amount: 0,
    dueDate: '',
    status: 'Pending',
    issueDate: new Date().toISOString().slice(0, 10),
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateInvoice = () => {
    const nextId = `${Date.now()}`;
    upsertItem({
      id: nextId,
      ...formData,
    });
    navigate(`/invoices/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Invoice Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Invoice Number" value={<EditableFieldControl value={formData.invoiceNumber} onChange={(value) => updateField('invoiceNumber', value)} />} />
            <FieldDisplay label="Customer" value={<EditableFieldControl value={formData.customer} onChange={(value) => updateField('customer', value)} />} />
            <FieldDisplay label="Amount" value={<EditableFieldControl type="number" value={formData.amount} onChange={(value) => updateField('amount', Number(value))} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Paid', 'Pending', 'Overdue', 'Cancelled']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Issue Date" value={<EditableFieldControl value={formData.issueDate} onChange={(value) => updateField('issueDate', value)} />} />
            <FieldDisplay label="Due Date" value={<EditableFieldControl value={formData.dueDate} onChange={(value) => updateField('dueDate', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Invoices', onClick: () => navigate('/invoices') }, { label: 'New Invoice' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/invoices')}>
          <Button variant="default" size="sm" onClick={handleCreateInvoice}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/invoices')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={
        <FormHeader
          title={formData.invoiceNumber || 'New Invoice'}
          subtitle={formData.customer || 'Create a new invoice record'}
          icon="I"
          keyFields={[
            { label: 'Status', value: formData.status },
            { label: 'Customer', value: formData.customer || '—' },
            { label: 'Amount', value: `$${formData.amount.toLocaleString()}` },
            { label: 'Due', value: formData.dueDate || '—' },
          ]}
        />
      }
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
