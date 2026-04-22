import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Users, TrendingUp, Target, Layers } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockSegments } from '../data/mockData';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function Segments() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const { items: segments } = usePersistentCollection('dynamics-collection-segments', mockSegments);

  const filteredSegments = segments.filter((segment) => {
    const matchesSearch = segment.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || segment.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalMembers = segments.reduce((sum, s) => sum + s.memberCount, 0);
  const activeSegments = segments.filter(s => s.status === 'Active').length;
  const avgSegmentSize = Math.round(totalMembers / segments.length);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-1">Customer Segments</h1>
              <p className="text-sm text-gray-600">Organize customers into targeted groups</p>
            </div>
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe]" onClick={() => navigate('/marketing/segments/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Segment
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Segments</p>
                    <p className="text-2xl font-semibold">{segments.length}</p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-2 rounded">
                    <Layers className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Active Segments</p>
                    <p className="text-2xl font-semibold">{activeSegments}</p>
                  </div>
                  <div className="bg-green-100 text-green-600 p-2 rounded">
                    <Target className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Members</p>
                    <p className="text-2xl font-semibold">{totalMembers.toLocaleString()}</p>
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
                    <p className="text-xs text-gray-600 mb-1">Avg. Segment Size</p>
                    <p className="text-2xl font-semibold">{avgSegmentSize}</p>
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
                placeholder="Search segments..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9 h-9 bg-[#f3f2f1] border-transparent focus:bg-white" 
              />
            </div>
            <div className="flex items-center gap-2">
              {['all', 'Dynamic', 'Static'].map((type) => (
                <Button
                  key={type}
                  variant="ghost"
                  size="sm"
                  className={`h-8 text-xs ${
                    typeFilter === type
                      ? 'bg-[#0B71C7] text-white hover:bg-[#106ebe] hover:text-white'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  onClick={() => setTypeFilter(type)}
                >
                  {type === 'all' ? 'All' : type}
                </Button>
              ))}
            </div>
            <Button variant="outline" size="sm" className="h-9" onClick={() => { setSearchQuery(''); setTypeFilter('all'); }}>
              <Filter className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </div>
        </div>
      </div>

      {/* Segment List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSegments.map((segment) => (
              <Card key={segment.id} className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/marketing/segments/${segment.id}`)}>
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-sm flex-1 pr-2">{segment.name}</CardTitle>
                    <Badge 
                      variant="secondary" 
                      className={
                        segment.status === 'Active' 
                          ? 'bg-green-100 text-green-700 hover:bg-green-100' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-100'
                      }
                    >
                      {segment.status}
                    </Badge>
                  </div>
                  <Badge variant="outline" className="text-xs w-fit">
                    {segment.type}
                  </Badge>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="text-xs text-gray-600">
                    <p className="mb-1 font-medium">Criteria:</p>
                    <p className="text-gray-800">{segment.criteria}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs pt-2 border-t border-gray-100">
                    <div>
                      <p className="text-gray-600 mb-1">Members</p>
                      <p className="font-semibold text-base">{segment.memberCount.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Campaigns</p>
                      <p className="font-semibold text-base">{segment.campaigns}</p>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-600 mb-1">Avg. Value</p>
                    <p className="font-semibold text-green-600">${(segment.avgValue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="text-xs text-gray-500 pt-2 border-t border-gray-100">
                    Updated: {new Date(segment.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
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
