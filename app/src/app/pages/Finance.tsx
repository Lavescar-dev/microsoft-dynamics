import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockInvoices } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Plus, Search, Filter, Download, MoreVertical, ChevronDown, RefreshCw, Trash2, Edit, DollarSign, FileText, AlertTriangle, CheckCircle } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { downloadCsv } from '../components/form/exportData';
import { HubMetricTile } from '../components/hub/HubMetricTile';
import { formatCurrencyForLocale, formatDateForLocale, useLocale } from '../contexts/LocaleContext';

export default function Finance() {
  const navigate = useNavigate();
  const { tr } = useLocale();
  const { items: invoices } = usePersistentCollection('dynamics-collection-invoices', mockInvoices);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);

  const filteredInvoices = invoices.filter((invoice) => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const resetFinanceFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedInvoices([]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Pending':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Overdue':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const toggleInvoiceSelection = (id: string) => {
    setSelectedInvoices(prev => 
      prev.includes(id) ? prev.filter(iid => iid !== id) : [...prev, id]
    );
  };

  const toggleAllInvoices = () => {
    if (selectedInvoices.length === filteredInvoices.length) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(filteredInvoices.map(i => i.id));
    }
  };

  // Calculate metrics
  const totalRevenue = invoices.filter(i => i.status === 'Paid').reduce((sum, inv) => sum + inv.amount, 0);
  const pendingRevenue = invoices.filter(i => i.status === 'Pending').reduce((sum, inv) => sum + inv.amount, 0);
  const overdueAmount = invoices.filter(i => i.status === 'Overdue').reduce((sum, inv) => sum + inv.amount, 0);
  const totalInvoices = invoices.length;

  const stats = [
    { title: 'Total Revenue (Paid)', value: `$${(totalRevenue / 1000).toFixed(0)}K`, icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Pending Revenue', value: `$${(pendingRevenue / 1000).toFixed(0)}K`, icon: FileText, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Overdue Amount', value: `$${(overdueAmount / 1000).toFixed(0)}K`, icon: AlertTriangle, color: 'text-red-600', bgColor: 'bg-red-100' },
    { title: 'Total Invoices', value: totalInvoices.toString(), icon: CheckCircle, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Summary Cards */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <HubMetricTile key={stat.title} title={stat.title} value={stat.value} icon={stat.icon} toneClassName={`${stat.bgColor} ${stat.color}`} />
          ))}
        </div>
      </div>

      {/* Command Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/invoices/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Invoice
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedInvoices.length === 0}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedInvoices.length === 0}>
              <DollarSign className="w-4 h-4 mr-2" />
              Mark as Paid
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedInvoices.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={resetFinanceFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => downloadCsv('finance-invoices.csv', filteredInvoices)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Find by invoice number or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-80 bg-[#f3f2f1] border-transparent focus:bg-white focus:border-gray-300"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8" onClick={resetFinanceFilters}>
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Options Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-gray-900 border-b-2 border-[#0B71C7] rounded-none px-2">
              All Invoices
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              Pending Payment
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              Overdue
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              Paid This Month
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{filteredInvoices.length} records</span>
            <Button variant="ghost" size="sm" className="h-6">
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
        <Table>
          <TableHeader className="bg-[#faf9f8] dark:bg-gray-900 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-[#faf9f8] dark:hover:bg-gray-900">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedInvoices.length === filteredInvoices.length && filteredInvoices.length > 0}
                  onCheckedChange={toggleAllInvoices}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Invoice Number</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Issue Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Due Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow 
                key={invoice.id} 
                onClick={() => navigate(`/invoices/${invoice.id}`)}
                className="cursor-pointer hover:bg-[#f3f2f1] dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedInvoices.includes(invoice.id)}
                    onCheckedChange={() => toggleInvoiceSelection(invoice.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-[#0B71C7] hover:underline">
                    {invoice.invoiceNumber}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{invoice.customer}</TableCell>
                <TableCell className="text-sm font-medium text-gray-900 dark:text-white">
                  {formatCurrencyForLocale(invoice.amount, 'USD')}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDateForLocale(invoice.issueDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDateForLocale(invoice.dueDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Showing {filteredInvoices.length} of {invoices.length} records</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-6 text-xs">Previous</Button>
            <span>1</span>
            <Button variant="ghost" size="sm" className="h-6 text-xs">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
