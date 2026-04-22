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
import OrderDetail from './OrderDetail';

export default function OrderEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-orders', []);

  if (!isNew) {
    return <OrderDetail />;
  }

  const [formData, setFormData] = useState({
    orderNumber: '',
    customer: '',
    total: 0,
    status: 'Processing',
    orderDate: new Date().toISOString().slice(0, 10),
    items: 1,
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateOrder = () => {
    const nextId = `${Date.now()}`;
    upsertItem({
      id: nextId,
      ...formData,
    });
    navigate(`/orders/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Order Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Order Number" value={<EditableFieldControl value={formData.orderNumber} onChange={(value) => updateField('orderNumber', value)} />} />
            <FieldDisplay label="Customer" value={<EditableFieldControl value={formData.customer} onChange={(value) => updateField('customer', value)} />} />
            <FieldDisplay label="Total" value={<EditableFieldControl type="number" value={formData.total} onChange={(value) => updateField('total', Number(value))} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Processing', 'Shipped', 'Delivered', 'Cancelled']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Order Date" value={<EditableFieldControl value={formData.orderDate} onChange={(value) => updateField('orderDate', value)} />} />
            <FieldDisplay label="Items" value={<EditableFieldControl type="number" value={formData.items} onChange={(value) => updateField('items', Number(value))} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Orders', onClick: () => navigate('/orders') }, { label: 'New Order' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/orders')}>
          <Button variant="default" size="sm" onClick={handleCreateOrder}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/orders')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={
        <FormHeader
          title={formData.orderNumber || 'New Order'}
          subtitle={formData.customer || 'Create a new order record'}
          icon="O"
          keyFields={[
            { label: 'Status', value: formData.status },
            { label: 'Customer', value: formData.customer || '—' },
            { label: 'Total', value: `$${formData.total.toLocaleString()}` },
            { label: 'Items', value: formData.items },
          ]}
        />
      }
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
