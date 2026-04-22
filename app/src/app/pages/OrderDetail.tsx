import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  Calendar24Regular,
  Delete24Regular,
  Edit24Regular,
  Money24Regular,
  Person24Regular,
} from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockActivities, mockInvoices, mockOrders, mockQuotes } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { EntitySubgrid } from '../components/form/EntitySubgrid';
import { TimelinePane } from '../components/form/TimelinePane';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { usePersistentState } from '../components/form/usePersistentState';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

function getOrderStatusClass(status: string) {
  if (status === 'Delivered') return 'bg-green-100 text-green-700';
  if (status === 'Shipped') return 'bg-blue-100 text-blue-700';
  if (status === 'Cancelled') return 'bg-gray-100 text-gray-700';
  return 'bg-yellow-100 text-yellow-700';
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: orders, removeItem: removeOrder } = usePersistentCollection('dynamics-collection-orders', mockOrders);
  const baseOrder = orders.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [order, setOrder] = usePersistentState(`dynamics-record-order-${id}`, baseOrder);
  const [draftOrder, setDraftOrder] = useState(baseOrder);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!order) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Order Not Found</h1>
          <p className="text-gray-600 mb-4">The requested order does not exist.</p>
          <Button onClick={() => navigate('/orders')}>Back to Orders</Button>
        </div>
      </div>
    );
  }

  const activeOrder = isEditing && draftOrder ? draftOrder : order;

  const updateDraftOrder = <K extends keyof typeof order>(key: K, value: (typeof order)[K]) => {
    setDraftOrder((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveOrder = () => {
    if (!draftOrder) return;
    setOrder(draftOrder);
    setIsEditing(false);
    setIsDirty(false);
    setOrderTimelineEntries((current) => [
      {
        id: `order-save-${Date.now()}`,
        title: 'Order record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: 'Order Operations',
        regarding: draftOrder.customer,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseOrder = () => {
    handleSaveOrder();
    navigate('/orders');
  };

  const [orderTimelineEntries, setOrderTimelineEntries] = usePersistentState(
    `dynamics-timeline-order-${id}`,
    mockActivities
      .filter((entry) => entry.regarding.toLowerCase().includes(order.customer.toLowerCase()) || entry.owner === 'Sarah Johnson')
      .slice(0, 5)
      .map((entry) => ({
        id: entry.id,
        title: entry.subject,
        type: entry.type,
        status: entry.status,
        date: new Date(entry.dueDate).toLocaleDateString(),
        owner: entry.owner,
        regarding: entry.regarding,
      }))
  );
  const relatedQuotes = mockQuotes.filter((entry) => entry.account === order.customer);
  const relatedInvoices = mockInvoices.filter((entry) => entry.customer === order.customer);

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <FormSection title="Order Information">
          {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this order." /> : null}
          <FieldGrid columns={2}>
            <FieldDisplay label="Order Number" value={activeOrder.orderNumber} />
            <FieldDisplay label="Customer" icon={<Person24Regular className="w-5 h-5" />} value={activeOrder.customer} />
            <FieldDisplay
              label="Total"
              icon={<Money24Regular className="w-5 h-5" />}
              value={<span className="text-xl font-semibold">${activeOrder.total.toLocaleString()}</span>}
            />
            <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getOrderStatusClass(activeOrder.status)}`}>{activeOrder.status}</span>} />
            <FieldDisplay label="Order Date" icon={<Calendar24Regular className="w-5 h-5" />} value={new Date(activeOrder.orderDate).toLocaleDateString()} />
            <FieldDisplay label="Items" value={activeOrder.items} />
          </FieldGrid>
        </FormSection>
      ),
    },
    {
      value: 'details',
      label: 'Details',
      content: (
        <FormSection title="Order Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Order ID" value={<span className="text-gray-600 text-sm">{activeOrder.id}</span>} />
            <FieldDisplay label="Order Number" value={isEditing ? <EditableFieldControl value={draftOrder?.orderNumber ?? ''} onChange={(value) => updateDraftOrder('orderNumber', value)} /> : activeOrder.orderNumber} />
            <FieldDisplay label="Customer" value={isEditing ? <EditableFieldControl value={draftOrder?.customer ?? ''} onChange={(value) => updateDraftOrder('customer', value)} /> : activeOrder.customer} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftOrder?.status ?? 'Processing'} options={['Processing', 'Shipped', 'Delivered', 'Cancelled']} onChange={(value) => updateDraftOrder('status', value as typeof order.status)} /> : activeOrder.status} />
            <FieldDisplay label="Items Count" value={isEditing ? <EditableFieldControl type="number" value={draftOrder?.items ?? 0} onChange={(value) => updateDraftOrder('items', Number(value))} /> : activeOrder.items} />
            <FieldDisplay label="Order Date" value={isEditing ? <EditableFieldControl value={draftOrder?.orderDate ?? ''} onChange={(value) => updateDraftOrder('orderDate', value)} /> : new Date(activeOrder.orderDate).toLocaleDateString()} />
          </FieldGrid>
        </FormSection>
      ),
    },
    {
      value: 'timeline',
      label: 'Timeline',
      content: (
        <TimelinePane
          title="Order Timeline"
          entries={orderTimelineEntries}
          emptyLabel="No order activity recorded"
          onCreateEntry={(type, title) =>
            setOrderTimelineEntries((current) => [
              {
                id: `order-${order.id}-${Date.now()}`,
                title,
                type,
                status: 'Open',
                date: new Date().toLocaleDateString(),
                owner: 'Order Operations',
                regarding: order.customer,
              },
              ...current,
            ])
          }
          onUpdateEntry={(entry) =>
            setOrderTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
          }
        />
      ),
    },
    {
      value: 'related',
      label: 'Related',
      content: (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EntitySubgrid
            title="Related Quotes"
            rows={relatedQuotes}
            getRowId={(entry) => entry.id}
            emptyLabel="No related quotes"
            onRowClick={(entry) => navigate(`/quotes/${entry.id}`)}
            getFilterText={(entry) => `${entry.quoteNumber} ${entry.name} ${entry.status}`}
            views={[
              { label: 'All', filter: () => true },
              { label: 'Open', filter: (entry) => entry.status === 'Active' || entry.status === 'Draft' || entry.status === 'Revised' },
              { label: 'Closed', filter: (entry) => entry.status === 'Won' || entry.status === 'Lost' },
            ]}
            columns={[
              { key: 'quote', header: 'Quote', cell: (entry) => <span className="font-medium text-gray-900">{entry.quoteNumber}</span>, sortValue: (entry) => entry.quoteNumber },
              { key: 'status', header: 'Status', cell: (entry) => entry.status, sortValue: (entry) => entry.status },
              { key: 'amount', header: 'Amount', cell: (entry) => `$${entry.totalAmount.toLocaleString()}`, className: 'text-right', sortValue: (entry) => entry.totalAmount },
            ]}
          />
          <EntitySubgrid
            title="Related Invoices"
            rows={relatedInvoices}
            getRowId={(entry) => entry.id}
            emptyLabel="No related invoices"
            onRowClick={(entry) => navigate(`/invoices/${entry.id}`)}
            getFilterText={(entry) => `${entry.invoiceNumber} ${entry.customer} ${entry.status}`}
            views={[
              { label: 'All', filter: () => true },
              { label: 'Pending', filter: (entry) => entry.status === 'Pending' || entry.status === 'Overdue' },
              { label: 'Paid', filter: (entry) => entry.status === 'Paid' },
            ]}
            columns={[
              { key: 'invoice', header: 'Invoice', cell: (entry) => <span className="font-medium text-gray-900">{entry.invoiceNumber}</span>, sortValue: (entry) => entry.invoiceNumber },
              { key: 'status', header: 'Status', cell: (entry) => entry.status, sortValue: (entry) => entry.status },
              { key: 'amount', header: 'Amount', cell: (entry) => `$${entry.amount.toLocaleString()}`, className: 'text-right', sortValue: (entry) => entry.amount },
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[
          { label: 'Orders', onClick: () => navigate('/orders') },
          { label: order.orderNumber },
        ]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/orders')}
            entityType="order"
            entityId={order.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveOrder}
            onSaveAndClose={handleSaveAndCloseOrder}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? order.id,
                entityType: 'order',
                entity: order,
                onPatchEntity: (patch) => setOrder((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setOrderTimelineEntries((current) => [entry, ...current]),
                onOpenDelete: () => setShowDeleteDialog(true),
              })
            }
          >
            <Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={() => {
              if (isEditing) {
                setDraftOrder(order);
                setIsEditing(false);
                setIsDirty(false);
                return;
              }
              setDraftOrder(order);
              setIsEditing(true);
            }}>
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(true)} className="text-red-600 hover:text-red-700">
              <Delete24Regular className="w-4 h-4 mr-2" />
              Delete
            </Button>
          </FormCommandBar>
        }
        header={
          <FormHeader
            title={activeOrder.orderNumber}
            subtitle={activeOrder.customer}
            icon={activeOrder.orderNumber.slice(-2)}
            badges={[
              { label: activeOrder.status, className: `px-3 py-1 rounded-full text-sm ${getOrderStatusClass(activeOrder.status)}` },
            ]}
            keyFields={[
              { label: 'Customer', value: activeOrder.customer },
              { label: 'Total', value: `$${activeOrder.total.toLocaleString()}` },
              { label: 'Order Date', value: new Date(activeOrder.orderDate).toLocaleDateString() },
              { label: 'Items', value: activeOrder.items },
            ]}
          />
        }
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Delete Order</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete {order.orderNumber}? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShowDeleteDialog(false); removeOrder(order.id); window.localStorage.removeItem(`dynamics-record-order-${order.id}`); window.localStorage.removeItem(`dynamics-timeline-order-${order.id}`); navigate('/orders'); }}>
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
