import { useState } from 'react';
import { mockProjects } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Plus, Search, Filter, Download, MoreVertical, ChevronDown, RefreshCw, Trash2, Edit, Briefcase, DollarSign, TrendingUp, Activity } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';

export default function ProjectOperations() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);

  const filteredProjects = mockProjects.filter((project) => {
    const matchesSearch = 
      project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.client.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-100';
      case 'Completed':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Cancelled':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const toggleProjectSelection = (id: string) => {
    setSelectedProjects(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const toggleAllProjects = () => {
    if (selectedProjects.length === filteredProjects.length) {
      setSelectedProjects([]);
    } else {
      setSelectedProjects(filteredProjects.map(p => p.id));
    }
  };

  // Calculate metrics
  const activeProjects = mockProjects.filter(p => p.status === 'Active').length;
  const totalBudget = mockProjects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = mockProjects.reduce((sum, p) => sum + p.spent, 0);
  const avgProgress = Math.round(mockProjects.reduce((sum, p) => sum + p.progress, 0) / mockProjects.length);

  const stats = [
    { title: 'Active Projects', value: activeProjects.toString(), icon: Briefcase, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Total Budget', value: `$${(totalBudget / 1000000).toFixed(1)}M`, icon: DollarSign, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'Total Spent', value: `$${(totalSpent / 1000000).toFixed(1)}M`, icon: TrendingUp, color: 'text-purple-600', bgColor: 'bg-purple-100' },
    { title: 'Avg. Progress', value: `${avgProgress}%`, icon: Activity, color: 'text-orange-600', bgColor: 'bg-orange-100' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Command Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" disabled>
              <Plus className="w-4 h-4 mr-2" />
              New Project
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:text-gray-900" disabled={selectedProjects.length === 0}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:text-gray-900" disabled={selectedProjects.length === 0}>
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:text-gray-900">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:text-gray-900">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Find by project name or client..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 w-80 bg-[#f3f2f1] border-transparent focus:bg-white focus:border-gray-300"
              />
            </div>
            <Button variant="ghost" size="sm" className="h-8">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* View Options Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="h-7 text-xs font-semibold text-gray-900 border-b-2 border-[#0B71C7] rounded-none px-2">
              All Projects
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              Active Projects
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              My Projects
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              Ending This Month
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{filteredProjects.length} records</span>
            <Button variant="ghost" size="sm" className="h-6">
              <ChevronDown className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="bg-[#faf9f8] px-6 py-4 border-b border-gray-200">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border border-gray-200 shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl font-semibold">{stat.value}</p>
                  </div>
                  <div className={`${stat.bgColor} ${stat.color} p-2.5 rounded`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-white">
        <Table>
          <TableHeader className="bg-[#faf9f8] sticky top-0 z-10">
            <TableRow className="border-b border-gray-200 hover:bg-[#faf9f8]">
              <TableHead className="w-12">
                <Checkbox 
                  checked={selectedProjects.length === filteredProjects.length && filteredProjects.length > 0}
                  onCheckedChange={toggleAllProjects}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Project Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Client</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Budget</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Spent</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Progress</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Status</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">End Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Manager</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((project) => (
              <TableRow 
                key={project.id} 
                className="hover:bg-[#f3f2f1] border-b border-gray-100"
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedProjects.includes(project.id)}
                    onCheckedChange={() => toggleProjectSelection(project.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <span className="text-sm font-medium text-[#0B71C7] hover:underline">
                    {project.name}
                  </span>
                </TableCell>
                <TableCell className="text-sm text-gray-700">{project.client}</TableCell>
                <TableCell className="text-sm font-medium text-gray-900">
                  ${(project.budget / 1000).toFixed(0)}K
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  ${(project.spent / 1000).toFixed(0)}K
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Progress value={project.progress} className="h-1.5 w-20" />
                    <span className="text-sm text-gray-700 w-10">{project.progress}%</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-gray-700">
                  {new Date(project.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-sm text-gray-700">{project.manager}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="icon" className="h-6 w-6">
                    <MoreVertical className="w-4 h-4 text-gray-600" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Footer */}
      <div className="bg-white border-t border-gray-200 px-6 py-2">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Showing {filteredProjects.length} of {mockProjects.length} records</span>
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
