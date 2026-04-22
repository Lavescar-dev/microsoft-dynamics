import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Wrench, User, MapPin, Clock, Calendar, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockWorkOrders } from '../data/mockData';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function WorkOrders() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { items: workOrders } = usePersistentCollection('dynamics-collection-workorders', mockWorkOrders);

  const filteredOrders = workOrders.filter((order) => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    total: workOrders.length,
    inProgress: workOrders.filter(w => w.status === 'In Progress').length,
    scheduled: workOrders.filter(w => w.status === 'Scheduled').length,
    unscheduled: workOrders.filter(w => w.status === 'Unscheduled').length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Urgent': return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'High': return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'Medium': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Low': return 'bg-green-100 text-green-700 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Scheduled': return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'Completed': return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Unscheduled': return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default: return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-1">Work Orders</h1>
              <p className="text-sm text-gray-600">Manage and track field service work orders</p>
            </div>
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe]" onClick={() => navigate('/field-service/work-orders/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Work Order
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Orders</p>
                    <p className="text-2xl font-semibold">{statusCounts.total}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-2 rounded">
                    <Wrench className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">In Progress</p>
                    <p className="text-2xl font-semibold">{statusCounts.inProgress}</p>
                  </div>
                  <div className="bg-green-100 text-green-600 p-2 rounded">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Scheduled</p>
                    <p className="text-2xl font-semibold">{statusCounts.scheduled}</p>
                  </div>
                  <div className="bg-purple-100 text-purple-600 p-2 rounded">
                    <Calendar className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Unscheduled</p>
                    <p className="text-2xl font-semibold">{statusCounts.unscheduled}</p>
                  </div>
                  <div className="bg-orange-100 text-orange-600 p-2 rounded">
                    <AlertCircle className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search work orders..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9 h-9 bg-[#f3f2f1] border-transparent focus:bg-white" 
              />
            </div>
            <div className="flex items-center gap-2">
              {['all', 'In Progress', 'Scheduled', 'Unscheduled', 'Completed'].map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  size="sm"
                  className={`h-8 text-xs whitespace-nowrap ${
                    statusFilter === status
                      ? 'bg-[#0B71C7] text-white hover:bg-[#106ebe] hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all' ? 'All' : status}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Work Order List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredOrders.map((order) => (
              <Card key={order.id} className="border border-gray-200 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/field-service/work-orders/${order.id}`)}>
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-gray-600">{order.id}</span>
                        <Badge variant="secondary" className={getPriorityColor(order.priority)}>
                          {order.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-sm mb-2">{order.title}</CardTitle>
                      <Badge variant="secondary" className={getStatusColor(order.status)}>
                        {order.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">Customer:</span>
                      <span>{order.customer}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">Location:</span>
                      <span>{order.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Wrench className="w-3 h-3 text-gray-400" />
                      <span className="font-medium">Technician:</span>
                      <span>{order.technician}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-gray-600 mb-1">Service Type</p>
                      <Badge variant="outline" className="text-xs">{order.serviceType}</Badge>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Duration</p>
                      <p className="font-medium">{order.estimatedDuration}</p>
                    </div>
                  </div>
                  {order.scheduledDate && (
                    <div className="text-xs pt-2 border-t border-gray-100">
                      <div className="flex items-center gap-2 text-gray-700">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="font-medium">Scheduled:</span>
                        <span>
                          {new Date(order.scheduledDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} at {order.scheduledTime}
                        </span>
                      </div>
                      {order.actualStart && (
                        <div className="flex items-center gap-2 text-gray-700 mt-1">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="font-medium">Started:</span>
                          <span>{order.actualStart}</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
