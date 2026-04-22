import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockCases } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Download, RefreshCw, MoreVertical } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { FileText } from 'lucide-react';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function Cases() {
  const navigate = useNavigate();
  const { items: cases } = usePersistentCollection('dynamics-collection-cases', mockCases);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.customer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Cases</h1>
          <Button className="bg-[#0B71C7] hover:bg-[#106ebe]" onClick={() => navigate('/cases/new')}>
            <Plus className="w-4 h-4 mr-2" />
            New Case
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
        <Table>
          <TableHeader className="bg-[#faf9f8] dark:bg-gray-900 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200 dark:border-gray-700">
              <TableHead className="w-12"><Checkbox /></TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Case Title</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Customer</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Priority</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Type</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Created Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Owner</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCases.map((caseItem) => (
              <TableRow key={caseItem.id} onClick={() => navigate(`/cases/${caseItem.id}`)} className="cursor-pointer hover:bg-[#f3f2f1] dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                <TableCell><Checkbox onClick={(e) => e.stopPropagation()} /></TableCell>
                <TableCell className="text-sm font-medium text-[#0B71C7]">{caseItem.title}</TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{caseItem.customer}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    caseItem.priority === 'High' ? 'bg-red-100 text-red-700' :
                    caseItem.priority === 'Normal' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }>{caseItem.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={
                    caseItem.status === 'Active' ? 'bg-blue-100 text-blue-700' :
                    caseItem.status === 'Resolved' ? 'bg-green-100 text-green-700' :
                    caseItem.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }>{caseItem.status}</Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{caseItem.caseType}</TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{new Date(caseItem.createdDate).toLocaleDateString()}</TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{caseItem.owner}</TableCell>
                <TableCell><Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => e.stopPropagation()}><MoreVertical className="w-4 h-4 dark:text-gray-400" /></Button></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="text-xs text-gray-600 dark:text-gray-400">Showing {filteredCases.length} of {cases.length} records</div>
      </div>
    </div>
  );
}
