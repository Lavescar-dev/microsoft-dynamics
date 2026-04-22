import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { CalendarMonth24Regular, Edit24Regular, Person24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockWorkOrders } from '../data/mockData';
import { RecordFormFrame } from '../components/form/RecordFormFrame';
import { FormHeader } from '../components/form/FormHeader';
import { FormCommandBar } from '../components/form/FormCommandBar';
import { FormTabSet, type FormTabItem } from '../components/form/FormTabSet';
import { FormSection } from '../components/form/FormSection';
import { FieldGrid } from '../components/form/FieldGrid';
import { FieldDisplay } from '../components/form/FieldDisplay';
import { EditableFieldControl } from '../components/form/EditableFieldControl';
import { FormNotificationBar } from '../components/form/FormNotificationBar';
import { TimelinePane } from '../components/form/TimelinePane';
import { executeRecordCommand } from '../components/form/recordCommandRegistry';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { usePersistentState } from '../components/form/usePersistentState';

function getWorkOrderStatusClass(status: string) {
  if (status === 'In Progress') return 'bg-blue-100 text-blue-700';
  if (status === 'Scheduled') return 'bg-purple-100 text-purple-700';
  if (status === 'Completed') return 'bg-green-100 text-green-700';
  return 'bg-gray-100 text-gray-700';
}

export default function WorkOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: workOrders, removeItem } = usePersistentCollection('dynamics-collection-workorders', mockWorkOrders);
  const baseWorkOrder = workOrders.find((entry) => entry.id === id);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [workOrder, setWorkOrder] = usePersistentState(`dynamics-record-workorder-${id}`, baseWorkOrder);
  const [draftWorkOrder, setDraftWorkOrder] = useState(baseWorkOrder);
  const [isEditing, setIsEditing] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  if (!workOrder) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h1 className="text-2xl mb-2">Work Order Not Found</h1>
          <p className="text-gray-600 mb-4">The requested work order does not exist.</p>
          <Button onClick={() => navigate('/field-service/work-orders')}>Back to Work Orders</Button>
        </div>
      </div>
    );
  }

  const activeWorkOrder = isEditing && draftWorkOrder ? draftWorkOrder : workOrder;

  const updateDraftWorkOrder = <K extends keyof typeof workOrder>(key: K, value: (typeof workOrder)[K]) => {
    setDraftWorkOrder((current) => (current ? { ...current, [key]: value } : current));
    setIsDirty(true);
  };

  const [workOrderTimelineEntries, setWorkOrderTimelineEntries] = usePersistentState(
    `dynamics-timeline-workorder-${id}`,
    [
      {
        id: `workorder-${workOrder.id}-created`,
        title: `${workOrder.title} dispatched`,
        type: 'Task',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: workOrder.technician,
        regarding: workOrder.customer,
      },
    ]
  );

  const handleSaveWorkOrder = () => {
    if (!draftWorkOrder) return;
    setWorkOrder(draftWorkOrder);
    setIsEditing(false);
    setIsDirty(false);
    setWorkOrderTimelineEntries((current) => [
      {
        id: `workorder-save-${Date.now()}`,
        title: 'Work order updated',
        type: 'Task',
        status: 'Completed',
        date: new Date().toLocaleDateString(),
        owner: draftWorkOrder.technician,
        regarding: draftWorkOrder.customer,
      },
      ...current,
    ]);
  };

  const handleSaveAndCloseWorkOrder = () => {
    handleSaveWorkOrder();
    navigate('/field-service/work-orders');
  };

  const tabs: FormTabItem[] = [
    {
      value: 'summary',
      label: 'Summary',
      content: (
        <>
          <FormSection title="Work Order Overview">
            {isEditing && isDirty ? <FormNotificationBar message="You have unsaved changes on this work order." /> : null}
            <FieldGrid columns={2}>
              <FieldDisplay label="Customer" value={activeWorkOrder.customer} />
              <FieldDisplay label="Technician" icon={<Person24Regular className="w-5 h-5" />} value={activeWorkOrder.technician} />
              <FieldDisplay label="Location" value={activeWorkOrder.location} />
              <FieldDisplay label="Service Type" value={activeWorkOrder.serviceType} />
              <FieldDisplay label="Scheduled Date" icon={<CalendarMonth24Regular className="w-5 h-5" />} value={activeWorkOrder.scheduledDate ? new Date(activeWorkOrder.scheduledDate).toLocaleDateString() : 'Not scheduled'} />
              <FieldDisplay label="Scheduled Time" value={activeWorkOrder.scheduledTime ?? '—'} />
              <FieldDisplay label="Estimated Duration" value={activeWorkOrder.estimatedDuration} />
              <FieldDisplay label="Status" value={<span className={`inline-flex px-3 py-1 rounded-full text-sm ${getWorkOrderStatusClass(activeWorkOrder.status)}`}>{activeWorkOrder.status}</span>} />
            </FieldGrid>
          </FormSection>

          <FormSection title="Timeline">
            <TimelinePane
              title="Work Order Timeline"
              entries={workOrderTimelineEntries}
              emptyLabel="No work order activity recorded"
              onCreateEntry={(type, title) =>
                setWorkOrderTimelineEntries((current) => [
                  {
                    id: `workorder-${activeWorkOrder.id}-${Date.now()}`,
                    title,
                    type,
                    status: 'Open',
                    date: new Date().toLocaleDateString(),
                    owner: activeWorkOrder.technician,
                    regarding: activeWorkOrder.customer,
                  },
                  ...current,
                ])
              }
              onUpdateEntry={(entry) =>
                setWorkOrderTimelineEntries((current) => current.map((item) => (item.id === entry.id ? entry : item)))
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
        <FormSection title="Work Order Details">
          <FieldGrid columns={2}>
            <FieldDisplay label="Title" value={isEditing ? <EditableFieldControl value={draftWorkOrder?.title ?? ''} onChange={(value) => updateDraftWorkOrder('title', value)} /> : activeWorkOrder.title} />
            <FieldDisplay label="Customer" value={isEditing ? <EditableFieldControl value={draftWorkOrder?.customer ?? ''} onChange={(value) => updateDraftWorkOrder('customer', value)} /> : activeWorkOrder.customer} />
            <FieldDisplay label="Technician" value={isEditing ? <EditableFieldControl value={draftWorkOrder?.technician ?? ''} onChange={(value) => updateDraftWorkOrder('technician', value)} /> : activeWorkOrder.technician} />
            <FieldDisplay label="Location" value={isEditing ? <EditableFieldControl value={draftWorkOrder?.location ?? ''} onChange={(value) => updateDraftWorkOrder('location', value)} /> : activeWorkOrder.location} />
            <FieldDisplay label="Service Type" value={isEditing ? <EditableFieldControl type="select" value={draftWorkOrder?.serviceType ?? 'Repair'} options={['Repair', 'Maintenance', 'Installation', 'Emergency', 'Inspection']} onChange={(value) => updateDraftWorkOrder('serviceType', value as typeof workOrder.serviceType)} /> : activeWorkOrder.serviceType} />
            <FieldDisplay label="Priority" value={isEditing ? <EditableFieldControl type="select" value={draftWorkOrder?.priority ?? 'Medium'} options={['Urgent', 'High', 'Medium', 'Low']} onChange={(value) => updateDraftWorkOrder('priority', value as typeof workOrder.priority)} /> : activeWorkOrder.priority} />
            <FieldDisplay label="Status" value={isEditing ? <EditableFieldControl type="select" value={draftWorkOrder?.status ?? 'Scheduled'} options={['In Progress', 'Scheduled', 'Completed', 'Unscheduled']} onChange={(value) => updateDraftWorkOrder('status', value as typeof workOrder.status)} /> : activeWorkOrder.status} />
            <FieldDisplay label="Estimated Duration" value={isEditing ? <EditableFieldControl value={draftWorkOrder?.estimatedDuration ?? ''} onChange={(value) => updateDraftWorkOrder('estimatedDuration', value)} /> : activeWorkOrder.estimatedDuration} />
          </FieldGrid>
        </FormSection>
      ),
    },
  ];

  return (
    <>
      <RecordFormFrame
        breadcrumbs={[{ label: 'Work Orders', onClick: () => navigate('/field-service/work-orders') }, { label: activeWorkOrder.id }]}
        commandBar={
          <FormCommandBar
            onBack={() => navigate('/field-service/work-orders')}
            entityType="workorder"
            entityId={activeWorkOrder.id}
            showSaveActions={isEditing}
            isDirty={isDirty}
            onSave={handleSaveWorkOrder}
            onSaveAndClose={handleSaveAndCloseWorkOrder}
            onCommand={(intent, entityId) =>
              executeRecordCommand({
                intent,
                entityId: entityId ?? activeWorkOrder.id,
                entityType: 'workorder',
                entity: activeWorkOrder,
                onPatchEntity: (patch) => setWorkOrder((current) => (current ? { ...current, ...patch } : current)),
                onAppendTimeline: (entry) => setWorkOrderTimelineEntries((current) => [entry, ...current]),
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
                  setDraftWorkOrder(workOrder);
                  setIsEditing(false);
                  setIsDirty(false);
                  return;
                }
                setDraftWorkOrder(workOrder);
                setIsEditing(true);
              }}
            >
              <Edit24Regular className="w-4 h-4 mr-2" />
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </Button>
          </FormCommandBar>
        }
        header={<FormHeader title={activeWorkOrder.title} subtitle={activeWorkOrder.customer} icon="W" badges={[{ label: activeWorkOrder.status, className: `px-3 py-1 rounded-full text-sm ${getWorkOrderStatusClass(activeWorkOrder.status)}` }]} keyFields={[{ label: 'Work Order', value: activeWorkOrder.id }, { label: 'Technician', value: activeWorkOrder.technician }, { label: 'Priority', value: activeWorkOrder.priority }, { label: 'Service Type', value: activeWorkOrder.serviceType }]} />}
        tabs={<FormTabSet tabs={tabs} defaultValue="summary" />}
      />

      {showDeleteDialog ? (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader className="border-b border-gray-100 pb-4"><CardTitle className="text-base">Delete Work Order</CardTitle></CardHeader>
            <CardContent className="p-6">
              <p className="mb-6 text-gray-700">Are you sure you want to delete {activeWorkOrder.id}? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => { setShowDeleteDialog(false); removeItem(activeWorkOrder.id); window.localStorage.removeItem(`dynamics-record-workorder-${activeWorkOrder.id}`); window.localStorage.removeItem(`dynamics-timeline-workorder-${activeWorkOrder.id}`); navigate('/field-service/work-orders'); }}>Delete</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </>
  );
}
