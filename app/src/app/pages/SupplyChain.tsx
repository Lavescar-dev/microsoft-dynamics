import { Card, CardContent } from '../components/ui/card';
import { Package, TrendingUp, Truck, Warehouse, AlertTriangle, CheckCircle } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';

const mockInventoryItems = [
  { id: '1', sku: 'PRD-001', name: 'Enterprise CRM License', warehouse: 'Warehouse A', quantity: 150, reorderPoint: 100, status: 'In Stock' },
  { id: '2', sku: 'PRD-002', name: 'Cloud Storage - 1TB', warehouse: 'Warehouse B', quantity: 45, reorderPoint: 50, status: 'Low Stock' },
  { id: '3', sku: 'PRD-003', name: 'Security Suite Pro', warehouse: 'Warehouse A', quantity: 220, reorderPoint: 80, status: 'In Stock' },
  { id: '4', sku: 'PRD-004', name: 'AI Analytics Module', warehouse: 'Warehouse C', quantity: 12, reorderPoint: 30, status: 'Critical' },
  { id: '5', sku: 'PRD-005', name: 'Mobile App Builder', warehouse: 'Warehouse B', quantity: 180, reorderPoint: 75, status: 'In Stock' },
];

export default function SupplyChain() {
  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-full">
      <div>
        <h1 className="text-2xl mb-1 text-gray-900 dark:text-white">Supply Chain Management</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Monitor inventory, logistics, and procurement</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Total Inventory</p>
                <p className="text-2xl font-semibold">12,450</p>
              </div>
              <div className="bg-blue-100 text-blue-600 p-2.5 rounded">
                <Package className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Warehouses</p>
                <p className="text-2xl font-semibold">8</p>
              </div>
              <div className="bg-purple-100 text-purple-600 p-2.5 rounded">
                <Warehouse className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">In Transit</p>
                <p className="text-2xl font-semibold">342</p>
              </div>
              <div className="bg-orange-100 text-orange-600 p-2.5 rounded">
                <Truck className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-600 mb-1">Stock Value</p>
                <p className="text-2xl font-semibold">$2.4M</p>
              </div>
              <div className="bg-green-100 text-green-600 p-2.5 rounded">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <div className="border-b border-gray-200 px-6 py-3">
          <h3 className="font-semibold">Inventory Levels</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#faf9f8] dark:bg-gray-700">
              <TableRow className="border-b border-gray-200 dark:border-gray-600">
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">SKU</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Product Name</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Warehouse</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Quantity</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Reorder Point</TableHead>
                <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockInventoryItems.map((item) => (
                <TableRow key={item.id} className="hover:bg-[#f3f2f1] border-b border-gray-100 dark:hover:bg-gray-700 dark:border-gray-600">
                  <TableCell className="text-sm font-medium text-[#0B71C7]">{item.sku}</TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">{item.name}</TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    <div className="flex items-center gap-1">
                      <Warehouse className="w-3 h-3 text-gray-400" />
                      {item.warehouse}
                    </div>
                  </TableCell>
                  <TableCell className="text-sm font-semibold text-gray-900 dark:text-gray-300">{item.quantity}</TableCell>
                  <TableCell className="text-sm text-gray-700 dark:text-gray-300">{item.reorderPoint}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={
                      item.status === 'In Stock' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      item.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                      'bg-red-100 text-red-700 hover:bg-red-100'
                    }>
                      <div className="flex items-center gap-1">
                        {item.status === 'In Stock' ? <CheckCircle className="w-3 h-3" /> :
                         <AlertTriangle className="w-3 h-3" />}
                        {item.status}
                      </div>
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}