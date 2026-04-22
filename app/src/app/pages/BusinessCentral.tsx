import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { AppGeneric24Regular } from '@fluentui/react-icons';
import { Button } from '../components/ui/button';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, TrendingUp, Users, Package, ShoppingCart, FileText, Briefcase, Calendar } from 'lucide-react';

const financialData = [
  { id: 'fin-jan', month: 'Jan', revenue: 125000, expenses: 95000 },
  { id: 'fin-feb', month: 'Feb', revenue: 138000, expenses: 102000 },
  { id: 'fin-mar', month: 'Mar', revenue: 156000, expenses: 108000 },
  { id: 'fin-apr', month: 'Apr', revenue: 142000, expenses: 98000 },
  { id: 'fin-may', month: 'May', revenue: 165000, expenses: 112000 },
  { id: 'fin-jun', month: 'Jun', revenue: 178000, expenses: 118000 },
];

const salesData = [
  { id: 'sales-jan', month: 'Jan', sales: 45 },
  { id: 'sales-feb', month: 'Feb', sales: 52 },
  { id: 'sales-mar', month: 'Mar', sales: 61 },
  { id: 'sales-apr', month: 'Apr', sales: 58 },
  { id: 'sales-may', month: 'May', sales: 67 },
  { id: 'sales-jun', month: 'Jun', sales: 73 },
];

export default function BusinessCentral() {
  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-[#0B71C7] to-[#37BEF3] text-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <AppGeneric24Regular className="w-12 h-12" />
            </div>
            <div>
              <h1 className="text-3xl font-semibold mb-1">Business Central</h1>
              <p className="text-blue-100">
                Comprehensive business management solution for operations and finances
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                  <p className="text-2xl font-semibold">$904K</p>
                  <p className="text-xs text-green-600 mt-1">+18% from last period</p>
                </div>
                <div className="bg-green-100 text-green-600 p-2.5 rounded">
                  <DollarSign className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Expenses</p>
                  <p className="text-2xl font-semibold">$633K</p>
                  <p className="text-xs text-gray-600 mt-1">70% of revenue</p>
                </div>
                <div className="bg-red-100 text-red-600 p-2.5 rounded">
                  <TrendingUp className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Active Customers</p>
                  <p className="text-2xl font-semibold">1,247</p>
                  <p className="text-xs text-blue-600 mt-1">+124 this month</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-2.5 rounded">
                  <Users className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Inventory Items</p>
                  <p className="text-2xl font-semibold">3,456</p>
                  <p className="text-xs text-gray-600 mt-1">Across 8 warehouses</p>
                </div>
                <div className="bg-purple-100 text-purple-600 p-2.5 rounded">
                  <Package className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Financial Performance</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={financialData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`} />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Bar dataKey="revenue" fill="#0B71C7" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="expenses" fill="#F25022" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Sales Trend</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
                  <Line type="monotone" dataKey="sales" stroke="#7FBA00" strokeWidth={3} dot={{ fill: '#7FBA00', r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Feature Modules */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="bg-blue-100 text-blue-600 p-2 rounded">
                  <DollarSign className="w-4 h-4" />
                </div>
                Financial Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-3">Manage general ledger, accounts payable/receivable, and cash flow</p>
              <Button variant="outline" size="sm" className="w-full">Access Module</Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="bg-green-100 text-green-600 p-2 rounded">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                Sales & Purchase
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-3">Handle sales orders, purchase orders, and vendor management</p>
              <Button variant="outline" size="sm" className="w-full">Access Module</Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="bg-purple-100 text-purple-600 p-2 rounded">
                  <Package className="w-4 h-4" />
                </div>
                Inventory Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-3">Track inventory levels, warehouse operations, and stock movements</p>
              <Button variant="outline" size="sm" className="w-full">Access Module</Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="bg-orange-100 text-orange-600 p-2 rounded">
                  <Briefcase className="w-4 h-4" />
                </div>
                Project Management
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-3">Plan, execute, and monitor projects with resource allocation</p>
              <Button variant="outline" size="sm" className="w-full">Access Module</Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="bg-cyan-100 text-cyan-600 p-2 rounded">
                  <FileText className="w-4 h-4" />
                </div>
                Reporting & Analytics
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-3">Generate insights with comprehensive reports and dashboards</p>
              <Button variant="outline" size="sm" className="w-full">Access Module</Button>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <div className="bg-pink-100 text-pink-600 p-2 rounded">
                  <Calendar className="w-4 h-4" />
                </div>
                Resource Planning
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <p className="text-sm text-gray-600 mb-3">Optimize resources, capacity planning, and scheduling</p>
              <Button variant="outline" size="sm" className="w-full">Access Module</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
