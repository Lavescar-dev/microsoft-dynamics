import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockActivities } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Download, ChevronDown, RefreshCw, MoreVertical } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';
import { usePersistentCollection } from '../components/form/usePersistentCollection';
import { downloadCsv } from '../components/form/exportData';

export default function Activities() {
  const navigate = useNavigate();
  const { items: activities } = usePersistentCollection('dynamics-collection-activities', mockActivities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);

  const filteredActivities = activities.filter((activity) => {
    const matchesSearch = 
      activity.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.regarding.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.owner.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  const toggleActivitySelection = (id: string) => {
    setSelectedActivities(prev => 
      prev.includes(id) ? prev.filter(aid => aid !== id) : [...prev, id]
    );
  };

  const toggleAllActivities = () => {
    if (selectedActivities.length === filteredActivities.length) {
      setSelectedActivities([]);
    } else {
      setSelectedActivities(filteredActivities.map(a => a.id));
    }
  };

  const resetActivityFilters = () => {
    setSearchQuery('');
    setSelectedActivities([]);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Command Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" onClick={() => navigate('/activities/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Activity
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={resetActivityFilters}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={() => downloadCsv('activities.csv', filteredActivities)}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-80 bg-[#f3f2f1] dark:bg-gray-700 border-transparent focus:bg-white dark:focus:bg-gray-600 focus:border-gray-300 dark:focus:border-gray-500"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8" onClick={resetActivityFilters}>
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
              My Activities
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              Open Activities
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white px-2">
              Overdue
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <span>{filteredActivities.length} records</span>
            <Button variant="ghost" size="sm" className="h-6">
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white dark:bg-gray-800">
        <Table>
          <TableHeader className="bg-[#faf9f8] dark:bg-gray-700 sticky top-0 z-10">
            <TableRow className="border-b border-gray-200 dark:border-gray-700 hover:bg-[#faf9f8] dark:hover:bg-gray-700">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedActivities.length === filteredActivities.length && filteredActivities.length > 0}
                  onCheckedChange={toggleAllActivities}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Subject</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Type</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Regarding</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Priority</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Due Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700 dark:text-gray-300">Owner</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredActivities.map((activity) => (
              <TableRow key={activity.id} onClick={() => navigate(`/activities/${activity.id}`)} className="cursor-pointer hover:bg-[#f3f2f1] dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700">
                <TableCell>
                  <Checkbox 
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={() => toggleActivitySelection(activity.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell className="text-sm font-medium text-[#0B71C7]">
                  {activity.subject}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{activity.type}</TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{activity.regarding}</TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={
                      activity.priority === 'High' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                      activity.priority === 'Normal' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                      'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {activity.priority}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge 
                    variant="secondary"
                    className={
                      activity.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                      activity.status === 'Open' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' :
                      'bg-gray-100 text-gray-700 hover:bg-gray-100'
                    }
                  >
                    {activity.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">
                  {new Date(activity.dueDate).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-sm text-gray-700 dark:text-gray-300">{activity.owner}</TableCell>
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
          <span>Showing {filteredActivities.length} of {activities.length} records</span>
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
