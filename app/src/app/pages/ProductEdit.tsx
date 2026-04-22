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
import ProductDetail from './ProductDetail';

export default function ProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNew = !id;
  const { upsertItem } = usePersistentCollection('dynamics-collection-products', []);

  if (!isNew) {
    return <ProductDetail />;
  }

  const [formData, setFormData] = useState({
    productId: '',
    name: '',
    category: '',
    unitPrice: 0,
    stock: 0,
    status: 'Active',
    vendor: 'Internal',
  });

  const updateField = <K extends keyof typeof formData>(key: K, value: (typeof formData)[K]) => {
    setFormData((current) => ({ ...current, [key]: value }));
  };

  const handleCreateProduct = () => {
    const nextId = `${Date.now()}`;
    upsertItem({ id: nextId, ...formData });
    navigate(`/products/${nextId}`);
  };

  const tabs: FormTabItem[] = [
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Product Information">
          <FieldGrid columns={2}>
            <FieldDisplay label="Product ID" value={<EditableFieldControl value={formData.productId} onChange={(value) => updateField('productId', value)} />} />
            <FieldDisplay label="Name" value={<EditableFieldControl value={formData.name} onChange={(value) => updateField('name', value)} />} />
            <FieldDisplay label="Category" value={<EditableFieldControl value={formData.category} onChange={(value) => updateField('category', value)} />} />
            <FieldDisplay label="Unit Price" value={<EditableFieldControl type="number" value={formData.unitPrice} onChange={(value) => updateField('unitPrice', Number(value))} />} />
            <FieldDisplay label="Stock" value={<EditableFieldControl type="number" value={formData.stock} onChange={(value) => updateField('stock', Number(value))} />} />
            <FieldDisplay label="Status" value={<EditableFieldControl type="select" value={formData.status} options={['Active', 'Inactive', 'Discontinued']} onChange={(value) => updateField('status', value)} />} />
            <FieldDisplay label="Vendor" value={<EditableFieldControl value={formData.vendor} onChange={(value) => updateField('vendor', value)} />} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <RecordFormFrame
      breadcrumbs={[{ label: 'Products', onClick: () => navigate('/products') }, { label: 'New Product' }]}
      commandBar={
        <FormCommandBar onBack={() => navigate('/products')}>
          <Button variant="default" size="sm" onClick={handleCreateProduct}>
            <Save24Regular className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={() => navigate('/products')}>
            <Dismiss24Regular className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </FormCommandBar>
      }
      header={<FormHeader title={formData.name || 'New Product'} subtitle={formData.category || 'Create a new product'} icon="P" keyFields={[{ label: 'Product ID', value: formData.productId || '—' }, { label: 'Status', value: formData.status }, { label: 'Vendor', value: formData.vendor }, { label: 'Price', value: `$${formData.unitPrice.toLocaleString()}` }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="details" />}
    />
  );
}
