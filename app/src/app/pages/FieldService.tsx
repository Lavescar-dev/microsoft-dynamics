import { Card } from '../components/ui/card';
import { Wrench, MapPin, Clock, CheckCircle, Calendar, User, Settings } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { useNavigate } from 'react-router';
import { HubMetricTile } from '../components/hub/HubMetricTile';
import { HubPanel } from '../components/hub/HubPanel';
import { formatDateForLocale, useLocale } from '../contexts/LocaleContext';

const mockWorkOrders = [
  { id: '1', workOrder: 'WO-2026-001', customer: 'Acme Corporation', technician: 'John Smith', status: 'In Progress', priority: 'High', scheduledDate: '2026-03-25', location: 'New York, NY' },
  { id: '2', workOrder: 'WO-2026-002', customer: 'TechStart Inc', technician: 'Emily Davis', status: 'Scheduled', priority: 'Normal', scheduledDate: '2026-03-26', location: 'San Francisco, CA' },
  { id: '3', workOrder: 'WO-2026-003', customer: 'Global Industries', technician: 'Michael Brown', status: 'Completed', priority: 'Low', scheduledDate: '2026-03-24', location: 'Chicago, IL' },
  { id: '4', workOrder: 'WO-2026-004', customer: 'Prime Solutions', technician: 'Sarah Wilson', status: 'In Progress', priority: 'High', scheduledDate: '2026-03-25', location: 'Boston, MA' },
  { id: '5', workOrder: 'WO-2026-005', customer: 'Synergy Corp', technician: 'James Taylor', status: 'Scheduled', priority: 'Normal', scheduledDate: '2026-03-27', location: 'Seattle, WA' },
];

export default function FieldService() {
  const navigate = useNavigate();
  const { tr } = useLocale();
  return (
    <div className="p-4 space-y-4 bg-[#f5f5f5] dark:bg-gray-900 min-h-full">
      <div>
        <h1 className="text-[28px] leading-tight mb-1 text-gray-900 dark:text-white">{tr('Field Service')}</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">{tr('Manage work orders, scheduling, and field resources')}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HubMetricTile title="Active Work Orders" value="24" icon={Wrench} toneClassName="bg-blue-100 text-blue-600" />
        <HubMetricTile title="Scheduled Today" value="18" icon={Clock} toneClassName="bg-purple-100 text-purple-600" />
        <HubMetricTile title="In Progress" value="12" icon={MapPin} toneClassName="bg-orange-100 text-orange-600" />
        <HubMetricTile title="Completed Today" value="32" icon={CheckCircle} toneClassName="bg-green-100 text-green-600" />
      </div>

      <HubPanel
        title="Work Orders"
        actions={
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="h-8" onClick={() => navigate('/field-service/schedule-board')}>
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
              <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/field-service/work-orders/new')}>
                New Work Order
              </Button>
            </div>
          </div>
        }
        contentClassName="p-0"
      >
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#faf9f8] dark:bg-gray-700">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Work Order</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Technician</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Location</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Scheduled Date</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Priority</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockWorkOrders.map((order) => (
                <TableRow key={order.id} onClick={() => navigate(`/field-service/work-orders/${order.workOrder}`)} className="cursor-pointer hover:bg-[#f3f2f1] border-b border-gray-100 dark:hover:bg-gray-700 dark:border-gray-600">
                  <TableCell className="text-sm font-medium text-[#0B71C7]">{order.workOrder}</TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">{order.customer}</TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      {order.technician}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      {order.location}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDateForLocale(order.scheduledDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      order.priority === 'High' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                      order.priority === 'Normal' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                      'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }>
                      {order.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      order.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      order.status === 'In Progress' ? 'bg-orange-100 text-orange-700 hover:bg-orange-100' :
                      'bg-blue-100 text-blue-700 hover:bg-blue-100'
                    }>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </HubPanel>
    </div>
  );
}
