import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, Target, Award, ChevronDown, Filter, RefreshCw } from 'lucide-react';
import { mockOpportunities, mockLeads, mockContacts } from '../data/mockData';
import { Button } from '../components/ui/button';
import { HubMetricTile } from '../components/hub/HubMetricTile';
import { HubPanel } from '../components/hub/HubPanel';

const revenueData = [
  { id: 'oct-2025', month: 'Oct', revenue: 125000 },
  { id: 'nov-2025', month: 'Nov', revenue: 158000 },
  { id: 'dec-2025', month: 'Dec', revenue: 192000 },
  { id: 'jan-2026', month: 'Jan', revenue: 215000 },
  { id: 'feb-2026', month: 'Feb', revenue: 243000 },
  { id: 'mar-2026', month: 'Mar', revenue: 287000 },
];

const pipelineData = [
  { id: 'prospecting-stage', name: 'Prospecting', value: 350000, count: 12 },
  { id: 'qualification-stage', name: 'Qualification', value: 580000, count: 18 },
  { id: 'proposal-stage', name: 'Proposal', value: 720000, count: 15 },
  { id: 'negotiation-stage', name: 'Negotiation', value: 450000, count: 8 },
];

const leadSourceData = [
  { id: 'website-source', name: 'Website', value: 35 },
  { id: 'referral-source', name: 'Referral', value: 28 },
  { id: 'linkedin-source', name: 'LinkedIn', value: 20 },
  { id: 'tradeshow-source', name: 'Trade Show', value: 17 },
];

const COLORS = ['#0B71C7', '#37BEF3', '#94EFFF', '#7FBA00'];

export default function Dashboard() {
  const handleRefreshDashboard = () => window.localStorage.setItem('dynamics-dashboard-last-refresh', new Date().toISOString());
  const totalPipelineValue = mockOpportunities.reduce((sum, opp) => sum + opp.amount, 0);
  const activeLeads = mockLeads.filter(lead => lead.status !== 'Unqualified').length;
  const activeContacts = mockContacts.filter(contact => contact.status === 'Active').length;
  const wonOpportunities = mockOpportunities.filter(opp => opp.stage === 'Closed Won').length;

  const stats = [
    {
      title: 'Pipeline Value',
      value: `$${(totalPipelineValue / 1000).toFixed(0)}K`,
      change: '+12.5%',
      trend: 'up' as const,
      icon: DollarSign,
      color: 'text-[#7FBA00]',
      bgColor: 'bg-[#7FBA00]/10',
    },
    {
      title: 'Active Leads',
      value: activeLeads.toString(),
      change: '+8.2%',
      trend: 'up' as const,
      icon: Target,
      color: 'text-[#0B71C7]',
      bgColor: 'bg-[#0B71C7]/10',
    },
    {
      title: 'Active Contacts',
      value: activeContacts.toString(),
      change: '+5.3%',
      trend: 'up' as const,
      icon: Users,
      color: 'text-[#37BEF3]',
      bgColor: 'bg-[#37BEF3]/10',
    },
    {
      title: 'Won This Month',
      value: wonOpportunities.toString(),
      change: '-2.1%',
      trend: 'down' as const,
      icon: Award,
      color: 'text-[#FFB900]',
      bgColor: 'bg-[#FFB900]/10',
    },
  ];

  return (
    <div className="h-full bg-[#f5f5f5]">
      {/* Command Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white" onClick={handleRefreshDashboard}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
            <div className="h-6 w-px bg-gray-200 dark:bg-gray-600 mx-2" />
            <Button variant="ghost" size="sm" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
              Time Period
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 overflow-y-auto h-[calc(100%-61px)]">
        {/* Page Title */}
        <div>
          <h1 className="text-[28px] leading-tight mb-1 dark:text-white">Sales Dashboard</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Monitor your sales performance and key metrics</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.title} className="space-y-1">
              <HubMetricTile
                title={stat.title}
                value={stat.value}
                icon={stat.icon}
                toneClassName={`${stat.bgColor} ${stat.color}`}
              />
              <div className="flex items-center gap-1 px-1 text-[11px]">
                {stat.trend === 'up' ? (
                  <TrendingUp className="w-3 h-3 text-green-600 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-red-600 dark:text-red-400" />
                )}
                <span className={stat.trend === 'up' ? 'text-green-600 dark:text-green-400 font-semibold' : 'text-red-600 dark:text-red-400 font-semibold'}>
                  {stat.change}
                </span>
                <span className="text-gray-500 dark:text-gray-400">vs last month</span>
              </div>
            </div>
          ))}
        </div>

        {/* Charts Row 1 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HubPanel title="Revenue Trend">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '2px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="revenue" fill="#0B71C7" radius={[1, 1, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </HubPanel>

          <HubPanel title="Sales Pipeline by Stage">
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={pipelineData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#6b7280' }}
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ borderRadius: '2px', border: '1px solid #e5e7eb' }}
                  />
                  <Bar dataKey="value" fill="#0B71C7" radius={[1, 1, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
          </HubPanel>
        </div>

        {/* Charts Row 2 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <HubPanel title="Lead Sources">
              <ResponsiveContainer width="100%" height={280}>
                <PieChart>
                  <Pie
                    data={leadSourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={90}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {leadSourceData.map((entry, index) => (
                      <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '2px', border: '1px solid #e5e7eb' }} />
                </PieChart>
              </ResponsiveContainer>
          </HubPanel>

          <HubPanel title="Recent Opportunities">
              <div className="space-y-3">
                {mockOpportunities.slice(0, 5).map((opp) => (
                  <div key={opp.id} className="flex items-center justify-between py-2 px-3 rounded-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{opp.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{opp.account}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">${opp.amount.toLocaleString()}</p>
                      <span className={`text-xs px-2 py-0.5 rounded-full inline-block ${
                        opp.stage === 'Closed Won' ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300' :
                        opp.stage === 'Negotiation' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' :
                        opp.stage === 'Proposal' ? 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300' :
                        'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                      }`}>
                        {opp.stage}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
          </HubPanel>
        </div>
      </div>
    </div>
  );
}
