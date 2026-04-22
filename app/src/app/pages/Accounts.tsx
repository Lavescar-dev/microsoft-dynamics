import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockAccounts } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Download, Building2, ExternalLink, MoreVertical, ChevronDown, RefreshCw, Trash2, Edit } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { downloadCsv } from '../components/form/exportData';

export default function Accounts() {
  const navigate = useNavigate();
  const { items: accounts } = usePersistentCollection('dynamics-collection-accounts', mockAccounts);
  const [searchQuery, setSearchQuery] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);

  const filteredAccounts = accounts.filter((account) => {
    const matchesSearch = 
      account.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      account.industry.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesIndustry = industryFilter === 'all' || account.industry === industryFilter;
    
    return matchesSearch && matchesIndustry;
  });

  const toggleAccountSelection = (id: string) => {
    setSelectedAccounts(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleAllAccounts = () => {
    if (selectedAccounts.length === filteredAccounts.length) {
      setSelectedAccounts([]);
    } else {
      setSelectedAccounts(filteredAccounts.map(a => a.id));
    }
  };

  const resetAccountFilters = () => {
    setSearchQuery('');
    setIndustryFilter('all');
    setSelectedAccounts([]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Command Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/accounts/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedAccounts.length === 0}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedAccounts.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={resetAccountFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => downloadCsv('accounts.csv', filteredAccounts)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Find by name or industry..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-80 bg-[#f3f2f1] dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-gray-300 dark:focus:border-gray-500"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8" onClick={resetAccountFilters}>
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Options Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-gray-900 dark:text-white border-b-2 border-[#0B71C7] rounded-none px-2">
              My Active Accounts
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              All Accounts
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              Key Accounts
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              Recently Created
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{filteredAccounts.length} records</span>
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
                  checked={selectedAccounts.length === filteredAccounts.length && filteredAccounts.length > 0}
                  onCheckedChange={toggleAllAccounts}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Account Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Industry</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Annual Revenue</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Employees</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Main Phone</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Website</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Owner</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAccounts.map((account) => (
              <TableRow 
                key={account.id} 
                onClick={() => navigate(`/accounts/${account.id}`)}
                className="cursor-pointer hover:bg-[#f3f2f1] dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedAccounts.includes(account.id)}
                    onCheckedChange={() => toggleAccountSelection(account.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-blue-500 to-blue-600 text-white flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-[#0B71C7] hover:underline">
                      {account.name}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{account.industry}</TableCell>
                <TableCell className="text-sm font-medium text-gray-900 dark:text-gray-300">
                  ${(account.revenue / 1000000).toFixed(1)}M
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                  {account.employees.toLocaleString()}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{account.phone}</TableCell>
                <TableCell>
                  <a 
                    href={`https://${account.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm text-[#0B71C7] hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {account.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{account.owner}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={account.status === 'Active' 
                      ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {account.status}
                  </Badge>
                </TableCell>
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

      {/* Footer */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
          <span>Showing {filteredAccounts.length} of {accounts.length} records</span>
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
