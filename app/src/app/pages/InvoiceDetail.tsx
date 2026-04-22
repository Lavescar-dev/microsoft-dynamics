import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Calendar24Regular, Delete24Regular, Edit24Regular, Money24Regular, Person24Regular } from '@fluentui/react-icons';
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

function getInvoiceStatusClass(status: string) {
  if (status === 'Paid') return 'bg-green-100 text-green-700';
  if (status === 'Pending') return 'bg-blue-100 text-blue-700';
  if (status === 'Overdue') return 'bg-red-100 text-red-700';
  return 'bg-gray-100 text-gray-700';
}

export default function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: invoices, removeItem: removeInvoice } = usePersistentCollection('dynamics-collection-invoices', mockInvoices);
  const baseInvoice = invoices.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [invoice, setInvoice] = usePersistentState(`dynamics-record-invoice-${id}`, baseInvoice);
  const [draftInvoice, setDraftInvoice] = useState(baseInvoice);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  if (!invoice) return <div className="flex items-center justify-center h-full"><div className="text-center"><h1 className="text-2xl mb-2">Invoice Not Found</h1><p className="text-gray-600 mb-4">The requested invoice does not exist.</p><Button onClick={() => navigate('/invoices')}>Back to Invoices</Button></div></div>;

  const activeInvoice = isEditing && draftInvoice ? draftInvoice : invoice;

  const updateDraftInvoice = <K extends keyof typeof invoice>(key: K, value: (typeof invoice)[K]) => {
    setDraftInvoice((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveInvoice = () => {
    if (!draftInvoice) return;
    setInvoice(draftInvoice);
    setIsEditing(false);
    setIsDirty(false);
    setInvoiceTimelineEntries((current) => [
      {
        id: `invoice-save-${Date.now()}`,
        title: 'Invoice record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: 'Finance Team',
        regarding: draftInvoice.customer,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseInvoice = () => {
    handleSaveInvoice();
    navigate('/invoices');
  };
  const [invoiceTimelineEntries, setInvoiceTimelineEntries] = usePersistentState(
    `dynamics-timeline-invoice-${id}`,
    mockActivities
      .filter((entry) => entry.regarding.toLowerCase().includes(invoice.customer.toLowerCase()) || entry.owner === 'Finance Team')
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
  const relatedOrders = mockOrders.filter((entry) => entry.customer === invoice.customer);
  const relatedQuotes = mockQuotes.filter((entry) => entry.account === invoice.customer);

  const tabs: FormTabItem[] = [
    { value: 'summary', label: 'Summary', content: <FormSection title="Invoice Information">{isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this invoice." /> : null}<FieldGrid columns={2}>
      <FieldDisplay label="Invoice Number" value={activeInvoice.invoiceNumber} />
      <FieldDisplay label="Customer" icon={<Person24Regular className="w-5 h-5" />} value={activeInvoice.customer} />
      <FieldDisplay label="Amount" icon={<Money24Regular className="w-5 h-5" />} value={<span className="text-xl font-semibold">${activeInvoice.amount.toLocaleString()}</span>} />
      <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getInvoiceStatusClass(activeInvoice.status)}`}>{activeInvoice.status}</span>} />
      <FieldDisplay label="Issue Date" icon={<Calendar24Regular className="w-5 h-5" />} value={new Date(activeInvoice.issueDate).toLocaleDateString()} />
      <FieldDisplay label="Due Date" icon={<Calendar24Regular className="w-5 h-5" />} value={new Date(activeInvoice.dueDate).toLocaleDateString()} />
    </FieldGrid></FormSection> },
    { value: 'details', label: 'Details', content: <FormSection title="Invoice Details"><FieldGrid columns={2}>
      <FieldDisplay label="Invoice ID" value={<span className="text-gray-600 text-sm">{activeInvoice.id}</span>} />
      <FieldDisplay label="Customer" value={isEditing ? <EditableFieldControl value={draftInvoice?.customer ?? ''} onChange={(value) => updateDraftInvoice('customer', value)} /> : activeInvoice.customer} />
      <FieldDisplay label="Payment Status" value={isEditing ? <EditableFieldControl type="select" value={draftInvoice?.status ?? 'Pending'} options={['Paid', 'Pending', 'Overdue', 'Cancelled']} onChange={(value) => updateDraftInvoice('status', value as typeof invoice.status)} /> : activeInvoice.status} />
      <FieldDisplay label="Issue Date" value={isEditing ? <EditableFieldControl value={draftInvoice?.issueDate ?? ''} onChange={(value) => updateDraftInvoice('issueDate', value)} /> : new Date(activeInvoice.issueDate).toLocaleDateString()} />
    </FieldGrid></FormSection> },
    { value: 'timeline', label: 'Timeline', content: <TimelinePane title="Invoice Timeline" entries={invoiceTimelineEntries} emptyLabel="No invoice activity recorded" onCreateEntry={(type, title) => setInvoiceTimelineEntries((current) => [{ id: `invoice-${invoice.id}-${Date.now()}`, title, type, status: 'Open', date: new Date().toLocaleDateString(), owner: 'Finance Team', regarding: invoice.customer }, ...current])} onUpdateEntry={(entry) => setInvoiceTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))} /> },
    {
      value: 'related',
      label: 'Related',
      content: <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EntitySubgrid
          title="Related Orders"
          rows={relatedOrders}
          getRowId={(entry) => entry.id}
          emptyLabel="No related orders"
          onRowClick={(entry) => navigate(`/orders/${entry.id}`)}
          getFilterText={(entry) => `${entry.orderNumber} ${entry.customer} ${entry.status}`}
          views={[
            { label: 'All', filter: () => true },
            { label: 'Open', filter: (entry) => entry.status === 'Processing' || entry.status === 'Shipped' },
            { label: 'Closed', filter: (entry) => entry.status === 'Delivered' || entry.status === 'Cancelled' },
          ]}
          columns={[
            { key: 'order', header: 'Order', cell: (entry) => <span className="font-medium text-gray-900">{entry.orderNumber}</span>, sortValue: (entry) => entry.orderNumber },
            { key: 'status', header: 'Status', cell: (entry) => entry.status, sortValue: (entry) => entry.status },
            { key: 'total', header: 'Total', cell: (entry) => `$${entry.total.toLocaleString()}`, className: 'text-right', sortValue: (entry) => entry.total },
          ]}
        />
        <EntitySubgrid
          title="Related Quotes"
          rows={relatedQuotes}
          getRowId={(entry) => entry.id}
          emptyLabel="No related quotes"
          onRowClick={(entry) => navigate(`/quotes/${entry.id}`)}
          getFilterText={(entry) => `${entry.quoteNumber} ${entry.account} ${entry.status}`}
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
      </div>,
    },
  ];

  return <>
    <RecordFormFrame
      breadcrumbs={[{ label: 'Invoices', onClick: () => navigate('/invoices') }, { label: invoice.invoiceNumber }]}
      commandBar={<FormCommandBar onBack={() => navigate('/invoices')} entityType="invoice" entityId={invoice.id} showSaveActions={isEditing} isDirty={isDirty} onSave={handleSaveInvoice} onSaveAndClose={handleSaveAndCloseInvoice} onCommand={(intent, entityId) => executeRecordCommand({ intent, entityId: entityId ?? invoice.id, entityType: 'invoice', entity: invoice, onPatchEntity: (patch) => setInvoice((current) => (current ? { ...current, ...patch } : current)), onAppendTimeline: (entry) => setInvoiceTimelineEntries((current) => [entry, ...current]), onOpenDelete: () => setShowDeleteDialog(true) })}><Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={() => { if (isEditing) { setDraftInvoice(invoice); setIsEditing(false); setIsDirty(false); return; } setDraftInvoice(invoice); setIsEditing(true); }}><Edit24Regular className="w-4 h-4 mr-2" />{isEditing ? 'Cancel Edit' : 'Edit'}</Button><Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(true)} className="text-red-600 hover:text-red-700"><Delete24Regular className="w-4 h-4 mr-2" />Delete</Button></FormCommandBar>}
      header={<FormHeader title={activeInvoice.invoiceNumber} subtitle={activeInvoice.customer} icon={activeInvoice.invoiceNumber.slice(-2)} badges={[{ label: activeInvoice.status, className: `px-3 py-1 rounded-full text-sm ${getInvoiceStatusClass(activeInvoice.status)}` }]} keyFields={[{ label: 'Customer', value: activeInvoice.customer }, { label: 'Amount', value: `$${activeInvoice.amount.toLocaleString()}` }, { label: 'Issued', value: new Date(activeInvoice.issueDate).toLocaleDateString() }, { label: 'Due', value: new Date(activeInvoice.dueDate).toLocaleDateString() }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
    />
    {showDeleteDialog ? <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><Card className="w-full max-w-md mx-4"><CardHeader className="border-b border-gray-100 pb-4"><CardTitle className="text-base">Delete Invoice</CardTitle></CardHeader><CardContent className="p-6"><p className="mb-6 text-gray-700">Are you sure you want to delete {invoice.invoiceNumber}? This action cannot be undone.</p><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button><Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShowDeleteDialog(false); removeInvoice(invoice.id); window.localStorage.removeItem(`dynamics-record-invoice-${invoice.id}`); window.localStorage.removeItem(`dynamics-timeline-invoice-${invoice.id}`); navigate('/invoices'); }}>Delete</Button></div></CardContent></Card></div> : null}
  </>;
}
