import { useState } from 'react';
import { mockEmployees } from '../data/mockData';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { Plus, Search, Filter, Download, MoreVertical, ChevronDown, RefreshCw, Trash2, Edit, Users, UserCheck, UserX, Award } from 'lucide-react';
import { Checkbox } from '../components/ui/checkbox';

export default function HumanResources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);

  const filteredEmployees = mockEmployees.filter((employee) => {
    const matchesSearch = 
      employee.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      employee.position.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 hover:bg-green-100';
      case 'On Leave':
        return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100';
      case 'Terminated':
        return 'bg-red-100 text-red-700 hover:bg-red-100';
      default:
        return 'bg-gray-100 text-gray-700 hover:bg-gray-100';
    }
  };

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  const toggleAllEmployees = () => {
    if (selectedEmployees.length === filteredEmployees.length) {
      setSelectedEmployees([]);
    } else {
      setSelectedEmployees(filteredEmployees.map(e => e.id));
    }
  };

  // Calculate metrics
  const activeEmployees = mockEmployees.filter(e => e.status === 'Active').length;
  const onLeave = mockEmployees.filter(e => e.status === 'On Leave').length;
  const totalEmployees = mockEmployees.length;
  const departments = new Set(mockEmployees.map(e => e.department)).size;

  const stats = [
    { title: 'Total Employees', value: totalEmployees.toString(), icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { title: 'Active', value: activeEmployees.toString(), icon: UserCheck, color: 'text-green-600', bgColor: 'bg-green-100' },
    { title: 'On Leave', value: onLeave.toString(), icon: UserX, color: 'text-yellow-600', bgColor: 'bg-yellow-100' },
    { title: 'Departments', value: departments.toString(), icon: Award, color: 'text-purple-600', bgColor: 'bg-purple-100' },
  ];

  return (
    <div className="h-full flex flex-col">
      {/* Command Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe] h-8 text-sm" disabled>
              <Plus className="w-4 h-4 mr-2" />
              New Employee
            </Button>
            <div className="h-6 w-px bg-gray-200" />
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:text-gray-900" disabled={selectedEmployees.length === 0}>
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="h-8 text-gray-600 hover:text-gray-900" disabled={selectedEmployees.length === 0}>
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
                placeholder="Find by name, position or email..."
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
              All Employees
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              Active Employees
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              New Hires
            </Button>
            <Button variant="ghost" size="sm" className="h-7 text-xs text-gray-600 hover:text-gray-900 px-2">
              By Department
            </Button>
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span>{filteredEmployees.length} records</span>
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
                  checked={selectedEmployees.length === filteredEmployees.length && filteredEmployees.length > 0}
                  onCheckedChange={toggleAllEmployees}
                />
              </TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Full Name</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Email</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Department</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Position</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Hire Date</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Manager</TableHead>
              <TableHead className="text-xs font-semibold text-gray-700">Status</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow 
                key={employee.id} 
                className="hover:bg-[#f3f2f1] border-b border-gray-100"
              >
                <TableCell>
                  <Checkbox 
                    checked={selectedEmployees.includes(employee.id)}
                    onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-[#0B71C7] text-white flex items-center justify-center text-xs font-semibold">
                      {employee.firstName[0]}{employee.lastName[0]}
                    </div>
                    <span className="text-sm font-medium text-[#0B71C7] hover:underline">
                      {employee.firstName} {employee.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-gray-700">{employee.email}</TableCell>
                <TableCell className="text-sm text-gray-700">{employee.department}</TableCell>
                <TableCell className="text-sm text-gray-700">{employee.position}</TableCell>
                <TableCell className="text-sm text-gray-700">
                  {new Date(employee.hireDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </TableCell>
                <TableCell className="text-sm text-gray-700">{employee.manager}</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getStatusColor(employee.status)}>
                    {employee.status}
                  </Badge>
                </TableCell>
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
          <span>Showing {filteredEmployees.length} of {mockEmployees.length} records</span>
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
