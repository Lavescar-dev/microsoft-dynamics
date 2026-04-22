import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockCases } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Search, Filter, Download, MoreVertical, ChevronDown, RefreshCw, Trash2, Edit, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { downloadCsv } from '../components/form/exportData';
import { HubMetricTile } from '../components/hub/HubMetricTile';
import { formatDateForLocale, useLocale } from '../contexts/LocaleContext';

export default function CustomerService() {
  const navigate = useNavigate();
  const { tr } = useLocale();
  const { items: cases } = usePersistentCollection('dynamics-collection-cases', mockCases);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCases, setSelectedCases] = useState<string[]>([]);

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch = 
      caseItem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      caseItem.customer.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const resetCaseFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setSelectedCases([]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      case 'Normal':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Low':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Resolved':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Cancelled':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const toggleCaseSelection = (id: string) => {
    setSelectedCases(prev => 
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const toggleAllCases = () => {
    if (selectedCases.length === filteredCases.length) {
      setSelectedCases([]);
    } else {
      setSelectedCases(filteredCases.map(c => c.id));
    }
  };

  // Calculate metrics
  const activeCases = cases.filter(c => c.status === 'Active').length;
  const resolvedCases = cases.filter(c => c.status === 'Resolved').length;
  const pendingCases = cases.filter(c => c.status === 'Pending').length;
  const highPriorityCases = cases.filter(c => c.priority === 'High').length;

  const stats = [
    { title: 'Active Cases', value: activeCases.toString(), icon: AlertCircle, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Resolved', value: resolvedCases.toString(), icon: CheckCircle2, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Pending', value: pendingCases.toString(), icon: Clock, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { title: 'High Priority', value: highPriorityCases.toString(), icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-100' },
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
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/cases/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Case
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedCases.length === 0}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedCases.length === 0}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Resolve
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedCases.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={resetCaseFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => downloadCsv('customer-service-cases.csv', filteredCases)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Find by title or customer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-80 bg-[#f3f2f1] border-transparent focus:bg-white focus:border-gray-300"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8" onClick={resetCaseFilters}>
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
              All Active Cases
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              My Cases
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              High Priority
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              Pending Cases
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{filteredCases.length} records</span>
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
                  checked={selectedCases.length === filteredCases.length && filteredCases.length > 0}
                  onCheckedChange={toggleAllCases}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Case Title</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Case Type</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Priority</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Created Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Owner</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow 
                key={caseItem.id} 
                onClick={() => navigate(`/cases/${caseItem.id}`)}
                className="cursor-pointer hover:bg-[#f3f2f1] dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedCases.includes(caseItem.id)}
                    onCheckedChange={() => toggleCaseSelection(caseItem.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-[#0B71C7] hover:underline">
                    {caseItem.title}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{caseItem.customer}</TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{caseItem.caseType}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getPriorityColor(caseItem.priority)}>
                    {caseItem.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(caseItem.status)}>
                    {caseItem.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                    {formatDateForLocale(caseItem.createdDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{caseItem.owner}</TableCell>
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
          <span>Showing {filteredCases.length} of {cases.length} records</span>
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
