import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Plus, Search, Filter, Mail, Send, Users, TrendingUp, Calendar, Eye } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { mockCampaigns } from '../data/mockData';
import { usePersistentCollection } from '../components/form/usePersistentCollection';

export default function Campaigns() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const { items: campaigns } = usePersistentCollection('dynamics-collection-campaigns', mockCampaigns);

  const filteredCampaigns = campaigns.filter((campaign) => {
    const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
  const totalSpent = campaigns.reduce((sum, c) => sum + c.spent, 0);
  const totalLeads = campaigns.reduce((sum, c) => sum + c.leads, 0);
  const totalRevenue = campaigns.reduce((sum, c) => sum + c.revenue, 0);

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl mb-1">Marketing Campaigns</h1>
              <p className="text-sm text-gray-600">Manage and track marketing campaigns</p>
            </div>
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe]" onClick={() => navigate('/marketing/campaigns/new')}>
              <Plus className="w-4 h-4 mr-2" />
              New Campaign
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Budget</p>
                    <p className="text-2xl font-semibold">${(totalBudget / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-blue-100 text-blue-600 p-2 rounded">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Spent</p>
                    <p className="text-2xl font-semibold">${(totalSpent / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-purple-100 text-purple-600 p-2 rounded">
                    <Send className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Leads</p>
                    <p className="text-2xl font-semibold">{totalLeads.toLocaleString()}</p>
                  </div>
                  <div className="bg-green-100 text-green-600 p-2 rounded">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-gray-200 shadow-sm">
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-600 mb-1">Total Revenue</p>
                    <p className="text-2xl font-semibold">${(totalRevenue / 1000).toFixed(0)}K</p>
                  </div>
                  <div className="bg-orange-100 text-orange-600 p-2 rounded">
                    <Mail className="w-4 h-4" />
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
                placeholder="Search campaigns..." 
                value={searchQuery} 
                onChange={(e) => setSearchQuery(e.target.value)} 
                className="pl-9 h-9 bg-[#f3f2f1] border-transparent focus:bg-white" 
              />
            </div>
            <div className="flex items-center gap-2">
              {['all', 'Active', 'Planning', 'Completed'].map((status) => (
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

      {/* Campaign List */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="border border-gray-200 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/marketing/campaigns/${campaign.id}`)}>
                <CardHeader className="border-b border-gray-100 pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-base mb-2">{campaign.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {campaign.type}
                        </Badge>
                        <Badge 
                          variant="secondary" 
                          className={
                            campaign.status === 'Active' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                            campaign.status === 'Planning' ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100' :
                            'bg-gray-100 text-gray-700 hover:bg-gray-100'
                          }
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <p className="text-gray-600 mb-1">Budget / Spent</p>
                      <p className="font-semibold">
                        ${(campaign.budget / 1000).toFixed(0)}K / ${(campaign.spent / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Leads / Responses</p>
                      <p className="font-semibold">{campaign.leads} / {campaign.responses}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">Revenue</p>
                      <p className="font-semibold text-green-600">
                        ${(campaign.revenue / 1000).toFixed(0)}K
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 mb-1">ROI</p>
                      <p className="font-semibold text-blue-600">
                        {campaign.spent > 0 ? (((campaign.revenue - campaign.spent) / campaign.spent) * 100).toFixed(0) : 0}%
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-2 border-t border-gray-100">
                    <div className="flex items-center gap-1 text-gray-600">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(campaign.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-7 text-xs">
                      <Eye className="w-3 h-3 mr-1" />
                      View Details
                    </Button>
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
