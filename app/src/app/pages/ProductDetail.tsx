import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Edit24Regular, Money24Regular, Person24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockProducts } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { usePersistentState } from '../components/form/usePersistentState';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { TimelinePane } from '../components/form/TimelinePane';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';

function getProductStatusClass(status: string) {
  if (status === 'Active') return 'bg-green-100 text-green-700';
  if (status === 'Discontinued') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: products, removeItem } = usePersistentCollection('dynamics-collection-products', mockProducts);
  const baseProduct = products.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [product, setProduct] = usePersistentState(`dynamics-record-product-${id}`, baseProduct);
  const [draftProduct, setDraftProduct] = useState(baseProduct);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!product) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Product Not Found</h1>
          <p className="text-gray-600 mb-4">The requested product does not exist.</p>
          <Button onClick={() => navigate('/products')}>Back to Products</Button>
        </div>
      </div>
    );
  }

  const activeProduct = isEditing && draftProduct ? draftProduct : product;

  const updateDraftProduct = <K extends keyof typeof product>(key: K, value: (typeof product)[K]) => {
    setDraftProduct((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const [productTimelineEntries, setProductTimelineEntries] = usePersistentState(
    `dynamics-timeline-product-${id}`,
    [
      {
        id: `product-${product.id}-created`,
        title: `${product.name} catalog item reviewed`,
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: product.vendor,
        regarding: product.category,
      },
    ]
  );

  const handleSaveProduct = () => {
    if (!draftProduct) return;
    setProduct(draftProduct);
    setIsEditing(false);
    setIsDirty(false);
    setProductTimelineEntries((current) => [
      {
        id: `product-save-${Date.now()}`,
        title: 'Product profile updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftProduct.vendor,
        regarding: draftProduct.category,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseProduct = () => {
    handleSaveProduct();
    navigate('/products');
  };

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <FormSection title="Product Information">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this product." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Product ID" value={activeProduct.productId} />
              <FieldDisplay label="Category" value={activeProduct.category} />
              <FieldDisplay label="Unit Price" icon={<Money24Regular className="w-5 h-5" />} value={<span className="text-xl font-semibold">${activeProduct.unitPrice.toLocaleString()}</span>} />
              <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getProductStatusClass(activeProduct.status)}`}>{activeProduct.status}</span>} />
              <FieldDisplay label="Stock" value={activeProduct.stock} />
              <FieldDisplay label="Vendor" icon={<Person24Regular className="w-5 h-5" />} value={activeProduct.vendor} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Product Timeline"
              entries={productTimelineEntries}
              emptyLabel="No product activity recorded"
              onCreateEntry={(type, title) =>
                setProductTimelineEntries((current) => [
                  {
                    id: `product-${activeProduct.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: activeProduct.vendor,
                    regarding: activeProduct.name,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setProductTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
              }
            />
          </FormSection>
        </>
      ),
    },
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Product Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Name" value={isEditing ? <EditableFieldControl value={draftProduct?.name ?? ''} onChange={(value) => updateDraftProduct('name', value)} /> : activeProduct.name} />
            <FieldDisplay label="Internal ID" value={<span className="text-gray-600 text-sm">{activeProduct.id}</span>} />
            <FieldDisplay label="Category" value={isEditing ? <EditableFieldControl value={draftProduct?.category ?? ''} onChange={(value) => updateDraftProduct('category', value)} /> : activeProduct.category} />
            <FieldDisplay label="Vendor" value={isEditing ? <EditableFieldControl value={draftProduct?.vendor ?? ''} onChange={(value) => updateDraftProduct('vendor', value)} /> : activeProduct.vendor} />
            <FieldDisplay label="Price" value={isEditing ? <EditableFieldControl type="number" value={draftProduct?.unitPrice ?? 0} onChange={(value) => updateDraftProduct('unitPrice', Number(value))} /> : `$${activeProduct.unitPrice.toLocaleString()}`} />
            <FieldDisplay label="Stock" value={isEditing ? <EditableFieldControl type="number" value={draftProduct?.stock ?? 0} onChange={(value) => updateDraftProduct('stock', Number(value))} /> : activeProduct.stock.toLocaleString()} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftProduct?.status ?? 'Active'} options={['Active', 'Discontinued']} onChange={(value) => updateDraftProduct('status', value as typeof product.status)} /> : activeProduct.status} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[{ label: 'Products', onClick: () => navigate('/products') }, { label: activeProduct.name }]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/products')}
            entityType="product"
            entityId={activeProduct.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveProduct}
            onSaveAndClose={handleSaveAndCloseProduct}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeProduct.id,
                entityType: 'product',
                entity: activeProduct,
                onPatchEntity: (patch) => setProduct((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setProductTimelineEntries((current) => [entry, ...current]),
                onOpenDelete: () => setShowDeleteDialog(true),
              })
            }
          >
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900"
              onClick={() => {
                if (isEditing) {
                  setDraftProduct(product);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }

                setDraftProduct(product);
                setIsEditing(true);
              }}
            >
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          </FormCommandBar>
        }
        header={
          <FormHeader
            title={activeProduct.name}
            subtitle={activeProduct.category}
            icon={activeProduct.name[0]}
            badges={[{ label: activeProduct.status, className: `px-3 py-1 rounded-full text-sm ${getProductStatusClass(activeProduct.status)}` }]}
            keyFields={[
              { label: 'Product ID', value: activeProduct.productId },
              { label: 'Vendor', value: activeProduct.vendor },
              { label: 'Price', value: `$${activeProduct.unitPrice.toLocaleString()}` },
              { label: 'Stock', value: activeProduct.stock },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Product</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete {activeProduct.name}? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={() => {
                    setShowDeleteDialog(false);
                    removeItem(activeProduct.id);
                    window.localStorage.removeItem(`dynamics-record-product-${activeProduct.id}`);
                    window.localStorage.removeItem(`dynamics-timeline-product-${activeProduct.id}`);
                    navigate('/products');
                  }}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
