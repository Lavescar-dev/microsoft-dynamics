import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockOrders } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Download, ChevronDown, RefreshCw, MoreVertical } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { downloadCsv } from '../components/form/exportData';

function getOrderStatusClass(status: string) {
  if (status === 'Delivered') return 'bg-green-100 text-green-700 hover:bg-green-100';
  if (status === 'Shipped') return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
  if (status === 'Cancelled') return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
  return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
}

export default function Orders() {
  const navigate = useNavigate();
  const { items: orders } = usePersistentCollection('dynamics-collection-orders', mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  const filteredOrders = orders.filter((order) =>
    order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleOrderSelection = (id: string) => {
    setSelectedOrders((prev) => (prev.includes(id) ? prev.filter((value) => value !== id) : [...prev, id]));
  };

  const toggleAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([]);
    } else {
      setSelectedOrders(filteredOrders.map((order) => order.id));
    }
  };

  const resetOrderFilters = () => {
    setSearchQuery('');
    setSelectedOrders([]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/orders/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Order
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={resetOrderFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => downloadCsv('orders.csv', filteredOrders)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-80 bg-[#f3f2f1] dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-gray-300 dark:focus:border-gray-500"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8" onClick={resetOrderFilters}>
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-gray-900 dark:text-white border-b-2 border-[#0B71C7] rounded-none px-2">
              Active Orders
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              All Orders
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{filteredOrders.length} records</span>
            <Button variant="ghost" size="sm" className="h-6">
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
        <Table>
          <TableHeader className="bg-[#faf9f8] dark:bg-gray-900 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-[#faf9f8] dark:hover:bg-gray-900">
              <TableHead className="w-12">
                <Checkbox checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0} onCheckedChange={toggleAllOrders} />
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Order Number</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Total</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Order Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Items</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id} onClick={() => navigate(`/orders/${order.id}`)} className="cursor-pointer hover:bg-[#f3f2f1] dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                <TableCell>
                  <Checkbox checked={selectedOrders.includes(order.id)} onCheckedChange={() => toggleOrderSelection(order.id)} onClick={(e) => e.stopPropagation()} />
                </TableCell>
                <TableCell className="text-sm font-medium text-[#0B71C7] hover:underline">{order.orderNumber}</TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{order.customer}</TableCell>
                <TableCell className="text-sm font-medium text-gray-900 dark:text-white">${order.total.toLocaleString()}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getOrderStatusClass(order.status)}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{order.items}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}>
                    <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Showing {filteredOrders.length} of {orders.length} records</span>
        </div>
      </div>
    </div>
  );
}
