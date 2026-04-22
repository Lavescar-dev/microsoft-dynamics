import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Map, Users, Mail, MessageSquare, Calendar, TrendingUp, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockCustomerJourneys } from '../data/mockData';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

const journeySteps = [
  { icon: Mail, label: 'Welcome Email', type: 'Email' },
  { icon: Calendar, label: 'Wait 2 Days', type: 'Wait' },
  { icon: MessageSquare, label: 'SMS Reminder', type: 'SMS' },
  { icon: Calendar, label: 'Wait 3 Days', type: 'Wait' },
  { icon: Mail, label: 'Feature Guide', type: 'Email' },
  { icon: Users, label: 'Sales Call', type: 'Task' },
  { icon: TrendingUp, label: 'Success Check', type: 'Survey' },
];

export default function CustomerJourneys() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { items: journeys } = usePersistentCollection('dynamics-collection-journeys', mockCustomerJourneys);

  const filteredJourneys = journeys.filter((journey) => {
    const matchesSearch = journey.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || journey.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalActive = journeys.filter(j => j.status === 'Active').length;
  const totalCustomers = journeys.reduce((sum, j) => sum + j.activeCust, 0);
  const avgConversion = Math.round(journeys.reduce((sum, j) => sum + j.conversionRate, 0) / journeys.length);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-1">Customer Journeys</h1>
              <p className="text-sm text-gray-600">Design and automate customer experiences</p>
            </div>
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe]" onClick={() => navigate('/marketing/customer-journeys/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Journey
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Journeys</p>
                    <p className="text-2xl font-semibold">{journeys.length}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-2 rounded">
                    <Map className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Active Journeys</p>
                    <p className="text-2xl font-semibold">{totalActive}</p>
                  </div>
                  <div className="bg-green-100 text-green-600 p-2 rounded">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Active Customers</p>
                    <p className="text-2xl font-semibold">{totalCustomers.toLocaleString()}</p>
                  </div>
                  <div className="bg-purple-100 text-purple-600 p-2 rounded">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Avg. Conversion</p>
                    <p className="text-2xl font-semibold">{avgConversion}%</p>
                  </div>
                  <div className="bg-orange-100 text-orange-600 p-2 rounded">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input 
                placeholder="Search journeys..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9 h-9 bg-[#f3f2f1] border-transparent focus:bg-white" 
              />
            </div>
            <div className="flex items-center gap-2">
              {['all', 'Active', 'Paused'].map((status) => (
                <Button
                  key={status}
                  variant="ghost"
                  size="sm"
                  className={`h-8 text-xs ${
                    statusFilter === status
                      ? 'bg-[#0B71C7] text-white hover:bg-[#106ebe] hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setStatusFilter(status)}
                >
                  {status === 'all' ? 'All' : status}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}>
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Journey List and Preview */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Example Journey Flow */}
          <Card className="border-2 border-[#0B71C7] shadow-lg">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base flex items-center gap-2">
                <Map className="w-5 h-5 text-[#0B71C7]" />
                Example: New Customer Onboarding Journey
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {journeySteps.map((step, index) => (
                  <div key={index} className="flex items-center gap-4">
                    <div className="flex flex-col items-center min-w-[120px]">
                      <div className="bg-blue-100 text-blue-600 p-3 rounded-lg mb-2">
                        <step.icon className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-medium text-center">{step.label}</p>
                      <Badge variant="outline" className="text-xs mt-1">{step.type}</Badge>
                    </div>
                    {index < journeySteps.length - 1 && (
                      <ArrowRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Journey Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredJourneys.map((journey) => (
              <Card key={journey.id} className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/marketing/customer-journeys/${journey.id}`)}>
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-2">{journey.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {journey.type}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={
                            journey.status === 'Active' 
                              ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                              : 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
                          }
                        >
                          {journey.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="text-xs">
                    <p className="text-gray-600 mb-1">Start Trigger</p>
                    <p className="font-medium">{journey.startTrigger}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-xs pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-gray-600 mb-1">Steps</p>
                      <p className="font-semibold text-base">{journey.steps}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Active</p>
                      <p className="font-semibold text-base">{journey.activeCust}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Completed</p>
                      <p className="font-semibold text-base">{journey.completed}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-gray-600 mb-1">Avg. Duration</p>
                      <p className="font-medium">{journey.avgDuration}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Conversion Rate</p>
                      <p className="font-semibold text-green-600">{journey.conversionRate}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
