import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockOpportunities } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Plus, Search, Filter, Download, MoreVertical, ChevronDown, RefreshCw, Trash2, Edit, TrendingUp } from 'lucide-react';
import { Progress } from '../components/ui/progress';
import { Checkbox } from '../components/ui/checkbox';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { downloadCsv } from '../components/form/exportData';
import { formatCurrencyForLocale, formatDateForLocale } from '../contexts/LocaleContext';

export default function Opportunities() {
  const navigate = useNavigate();
  const { items: opportunities } = usePersistentCollection('dynamics-collection-opportunities', mockOpportunities);
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');
  const [selectedOpps, setSelectedOpps] = useState<string[]>([]);

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.account.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStage = stageFilter === 'all' || opp.stage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Prospecting':
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
      case 'Qualification':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Proposal':
        return 'bg-purple-100 text-purple-700 hover:bg-purple-100';
      case 'Negotiation':
        return 'bg-orange-100 text-orange-700 hover:bg-orange-100';
      case 'Closed Won':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'Closed Lost':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const toggleOppSelection = (id: string) => {
    setSelectedOpps(prev => 
      prev.includes(id) ? prev.filter(oid => oid !== id) : [...prev, id]
    );
  };

  const toggleAllOpps = () => {
    if (selectedOpps.length === filteredOpportunities.length) {
      setSelectedOpps([]);
    } else {
      setSelectedOpps(filteredOpportunities.map(o => o.id));
    }
  };

  const resetOpportunityFilters = () => {
    setSearchQuery('');
    setStageFilter('all');
    setSelectedOpps([]);
  };

  // Calculate pipeline metrics
  const totalValue = filteredOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const weightedValue = filteredOpportunities.reduce((sum, opp) => sum + (opp.amount * opp.probability / 100), 0);
  const avgDealSize = totalValue / filteredOpportunities.length || 0;

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Command Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/opportunities/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedOpps.length === 0}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedOpps.length === 0}>
              <TrendingUp className="w-4 h-4 mr-2" />
              Close as Won
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" disabled={selectedOpps.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={resetOpportunityFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => downloadCsv('opportunities.csv', filteredOpportunities)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Find by name or account..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-80 bg-[#f3f2f1] dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-gray-300 dark:focus:border-gray-500"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8" onClick={resetOpportunityFilters}>
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
              My Open Opportunities
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              All Opportunities
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              Closing This Month
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              Won Opportunities
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{filteredOpportunities.length} records</span>
            <Button variant="ghost" size="sm" className="h-6">
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Pipeline Summary Bar */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b border-blue-200 dark:border-blue-800 px-6 py-3">
        <div className="grid grid-cols-3 gap-6">
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Total Pipeline Value</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">${(totalValue / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Weighted Pipeline</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">${(weightedValue / 1000).toFixed(0)}K</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Average Deal Size</p>
            <p className="text-xl font-semibold text-gray-900 dark:text-white">${(avgDealSize / 1000).toFixed(0)}K</p>
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
                  checked={selectedOpps.length === filteredOpportunities.length && filteredOpportunities.length > 0}
                  onCheckedChange={toggleAllOpps}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Opportunity Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Account</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Sales Stage</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Probability</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Est. Revenue</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Est. Close Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Owner</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOpportunities.map((opp) => (
              <TableRow 
                key={opp.id} 
                onClick={() => navigate(`/opportunities/${opp.id}`)}
                className="cursor-pointer hover:bg-[#f3f2f1] dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700"
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedOpps.includes(opp.id)}
                    onCheckedChange={() => toggleOppSelection(opp.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-[#0B71C7] hover:underline">
                    {opp.name}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{opp.account}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStageColor(opp.stage)}>
                    {opp.stage}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress value={opp.probability} className="h-1.5 w-16" />
                    <span className="text-sm text-gray-700 dark:text-gray-300 w-10">{opp.probability}%</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrencyForLocale(opp.amount, 'USD')}</TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                  {formatDateForLocale(opp.closeDate, { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{opp.owner}</TableCell>
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
          <span>Showing {filteredOpportunities.length} of {opportunities.length} records</span>
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
