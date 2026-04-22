import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, Users, DollarSign, Target } from 'lucide-react';
import { mockOpportunities, mockLeads } from '../data/mockData';
import { HubMetricTile } from '../components/hub/HubMetricTile';
import { HubPanel } from '../components/hub/HubPanel';

const salesData = [
  { id: 'jan', month: 'Jan', value: 215000 },
  { id: 'feb', month: 'Feb', value: 243000 },
  { id: 'mar', month: 'Mar', value: 287000 },
];

export default function Sales() {
  const activePipeline = mockOpportunities.filter(o => o.stage !== 'Closed Lost' && o.stage !== 'Closed Won');
  const hotLeads = mockLeads.filter(l => l.rating === 'Hot');

  return (
    <div className="p-4 space-y-4 bg-[#f5f5f5] min-h-full">
      <div>
        <h1 className="text-[28px] leading-tight mb-1 dark:text-white">Sales Overview</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Comprehensive sales performance and analytics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HubMetricTile title="Active Pipeline" value={String(activePipeline.length)} icon={Target} href="/opportunities" toneClassName="bg-blue-100 text-blue-600" />
        <HubMetricTile title="Hot Leads" value={String(hotLeads.length)} icon={TrendingUp} href="/leads" toneClassName="bg-red-100 text-red-600" />
        <HubMetricTile title="Active Contacts" value="18" icon={Users} href="/contacts" toneClassName="bg-green-100 text-green-600" />
        <HubMetricTile title="Q1 Revenue" value="$745K" icon={DollarSign} href="/reports" toneClassName="bg-purple-100 text-purple-600" />
      </div>

      <HubPanel title="Sales Performance - Q1 2026">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
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
              <Bar dataKey="value" fill="#0B71C7" radius={[1, 1, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
      </HubPanel>
    </div>
  );
}
