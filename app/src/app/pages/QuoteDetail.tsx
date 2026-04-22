import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { Calendar24Regular, Delete24Regular, Edit24Regular, Money24Regular, Person24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockActivities, mockInvoices, mockOpportunities, mockQuotes } from '../data/mockData';
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

function getQuoteStatusClass(status: string) {
  if (status === 'Won') return 'bg-green-100 text-green-700';
  if (status === 'Lost') return 'bg-red-100 text-red-700';
  if (status === 'Active') return 'bg-blue-100 text-blue-700';
  if (status === 'Revised') return 'bg-purple-100 text-purple-700';
  return 'bg-yellow-100 text-yellow-700';
}

export default function QuoteDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: quotes, removeItem: removeQuote } = usePersistentCollection('dynamics-collection-quotes', mockQuotes);
  const baseQuote = quotes.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quote, setQuote] = usePersistentState(`dynamics-record-quote-${id}`, baseQuote);
  const [draftQuote, setDraftQuote] = useState(baseQuote);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!quote) {
    return <div className="flex items-center justify-center h-full"><div className="text-center"><h1 className="text-2xl mb-2">Quote Not Found</h1><p className="text-gray-600 mb-4">The requested quote does not exist.</p><Button onClick={() => navigate('/quotes')}>Back to Quotes</Button></div></div>;
  }

  const activeQuote = isEditing && draftQuote ? draftQuote : quote;

  const updateDraftQuote = <K extends keyof typeof quote>(key: K, value: (typeof quote)[K]) => {
    setDraftQuote((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const handleSaveQuote = () => {
    if (!draftQuote) return;
    setQuote(draftQuote);
    setIsEditing(false);
    setIsDirty(false);
    setQuoteTimelineEntries((current) => [
      {
        id: `quote-save-${Date.now()}`,
        title: 'Quote record updated',
        type: 'Note',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftQuote.owner,
        regarding: draftQuote.account,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseQuote = () => {
    handleSaveQuote();
    navigate('/quotes');
  };

  const [quoteTimelineEntries, setQuoteTimelineEntries] = usePersistentState(
    `dynamics-timeline-quote-${id}`,
    mockActivities
      .filter((entry) => entry.regarding.toLowerCase().includes(quote.account.toLowerCase()) || entry.owner === quote.owner)
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
  const relatedInvoices = mockInvoices.filter((entry) => entry.customer === quote.account);
  const relatedOpportunities = mockOpportunities.filter((entry) => entry.account === quote.account);

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: <FormSection title="Quote Information">{isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this quote." /> : null}<FieldGrid columns={2}>
        <FieldDisplay label="Quote Number" value={activeQuote.quoteNumber} />
        <FieldDisplay label="Account" icon={<Person24Regular className="w-5 h-5" />} value={activeQuote.account} />
        <FieldDisplay label="Name" value={activeQuote.name} />
        <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getQuoteStatusClass(activeQuote.status)}`}>{activeQuote.status}</span>} />
        <FieldDisplay label="Total Amount" icon={<Money24Regular className="w-5 h-5" />} value={<span className="text-xl font-semibold">${activeQuote.totalAmount.toLocaleString()}</span>} />
        <FieldDisplay label="Valid Until" icon={<Calendar24Regular className="w-5 h-5" />} value={new Date(activeQuote.validUntil).toLocaleDateString()} />
      </FieldGrid></FormSection>,
    },
    {
      value: 'details',
      label: 'Details',
      content: <FormSection title="Quote Details"><FieldGrid columns={2}>
        <FieldDisplay label="Quote ID" value={<span className="text-gray-600 text-sm">{activeQuote.id}</span>} />
        <FieldDisplay label="Owner" value={isEditing ? <EditableFieldControl value={draftQuote?.owner ?? ''} onChange={(value) => updateDraftQuote('owner', value)} /> : activeQuote.owner} />
        <FieldDisplay label="Created Date" value={isEditing ? <EditableFieldControl value={draftQuote?.createdDate ?? ''} onChange={(value) => updateDraftQuote('createdDate', value)} /> : new Date(activeQuote.createdDate).toLocaleDateString()} />
        <FieldDisplay label="Account" value={isEditing ? <EditableFieldControl value={draftQuote?.account ?? ''} onChange={(value) => updateDraftQuote('account', value)} /> : activeQuote.account} />
      </FieldGrid></FormSection>,
    },
    {
      value: 'timeline',
      label: 'Timeline',
      content: <TimelinePane title="Quote Timeline" entries={quoteTimelineEntries} emptyLabel="No quote activity recorded" onCreateEntry={(type, title) => setQuoteTimelineEntries((current) => [{ id: `quote-${quote.id}-${Date.now()}`, title, type, status: 'Open', date: new Date().toLocaleDateString(), owner: quote.owner, regarding: quote.account }, ...current])} onUpdateEntry={(entry) => setQuoteTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))} />,
    },
    {
      value: 'related',
      label: 'Related',
      content: <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <EntitySubgrid
          title="Related Opportunities"
          rows={relatedOpportunities}
          getRowId={(entry) => entry.id}
          emptyLabel="No related opportunities"
          onRowClick={(entry) => navigate(`/opportunities/${entry.id}`)}
          getFilterText={(entry) => `${entry.name} ${entry.stage} ${entry.account}`}
          views={[
            { label: 'All', filter: () => true },
            { label: 'Open', filter: (entry) => !entry.stage.startsWith('Closed') },
            { label: 'Closed', filter: (entry) => entry.stage.startsWith('Closed') },
          ]}
          columns={[
            { key: 'name', header: 'Opportunity', cell: (entry) => <span className="font-medium text-gray-900">{entry.name}</span>, sortValue: (entry) => entry.name },
            { key: 'stage', header: 'Stage', cell: (entry) => entry.stage, sortValue: (entry) => entry.stage },
            { key: 'amount', header: 'Amount', cell: (entry) => `$${entry.amount.toLocaleString()}`, className: 'text-right', sortValue: (entry) => entry.amount },
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
      </div>,
    },
  ];

  return <>
    <RecordFormFrame
      breadcrumbs={[{ label: 'Quotes', onClick: () => navigate('/quotes') }, { label: quote.quoteNumber }]}
      commandBar={<FormCommandBar onBack={() => navigate('/quotes')} entityType="quote" entityId={quote.id} showSaveActions={isEditing} isDirty={isDirty} onSave={handleSaveQuote} onSaveAndClose={handleSaveAndCloseQuote} onCommand={(intent, entityId) => executeRecordCommand({ intent, entityId: entityId ?? quote.id, entityType: 'quote', entity: quote, onPatchEntity: (patch) => setQuote((current) => (current ? { ...current, ...patch } : current)), onAppendTimeline: (entry) => setQuoteTimelineEntries((current) => [entry, ...current]), onOpenDelete: () => setShowDeleteDialog(true) })}><Button variant="ghost" size="sm" className="text-gray-600 hover:text-gray-900" onClick={() => { if (isEditing) { setDraftQuote(quote); setIsEditing(false); setIsDirty(false); return; } setDraftQuote(quote); setIsEditing(true); }}><Edit24Regular className="w-4 h-4 mr-2" />{isEditing ? 'Cancel Edit' : 'Edit'}</Button><Button variant="ghost" size="sm" onClick={() => setShowDeleteDialog(true)} className="text-red-600 hover:text-red-700"><Delete24Regular className="w-4 h-4 mr-2" />Delete</Button></FormCommandBar>}
      header={<FormHeader title={activeQuote.quoteNumber} subtitle={activeQuote.name} icon={activeQuote.quoteNumber.slice(-2)} badges={[{ label: activeQuote.status, className: `px-3 py-1 rounded-full text-sm ${getQuoteStatusClass(activeQuote.status)}` }]} keyFields={[{ label: 'Account', value: activeQuote.account }, { label: 'Owner', value: activeQuote.owner }, { label: 'Total', value: `$${activeQuote.totalAmount.toLocaleString()}` }, { label: 'Valid', value: new Date(activeQuote.validUntil).toLocaleDateString() }]} />}
      tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
    />
    {showDeleteDialog ? <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"><Card className="w-full max-w-md mx-4"><CardHeader className="border-b border-gray-100 pb-4"><CardTitle className="text-base">Delete Quote</CardTitle></CardHeader><CardContent className="p-6"><p className="mb-6 text-gray-700">Are you sure you want to delete {quote.quoteNumber}? This action cannot be undone.</p><div className="flex justify-end gap-3"><Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button><Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShowDeleteDialog(false); removeQuote(quote.id); window.localStorage.removeItem(`dynamics-record-quote-${quote.id}`); window.localStorage.removeItem(`dynamics-timeline-quote-${quote.id}`); navigate('/quotes'); }}>Delete</Button></div></CardContent></Card></div> : null}
  </>;
}
