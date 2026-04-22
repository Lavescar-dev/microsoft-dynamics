import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Mail, Target, TrendingUp, Users } from 'lucide-react';
import { HubMetricTile } from '../components/hub/HubMetricTile';
import { HubPanel } from '../components/hub/HubPanel';

const campaignData = [
  { id: 'email', name: 'Email', value: 45 },
  { id: 'social', name: 'Social', value: 30 },
  { id: 'direct', name: 'Direct', value: 15 },
  { id: 'referral', name: 'Referral', value: 10 },
];

const COLORS = ['#0B71C7', '#37BEF3', '#94EFFF', '#7FBA00'];

export default function Marketing() {
  return (
    <div className="p-4 space-y-4 bg-[#f5f5f5] dark:bg-gray-900 min-h-full">
      <div>
        <h1 className="text-[28px] leading-tight mb-1 text-gray-900 dark:text-white">Marketing Dashboard</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Campaign performance and lead generation metrics</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <HubMetricTile title="Active Campaigns" value="12" icon={Target} href="/marketing/campaigns" toneClassName="bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300" />
        <HubMetricTile title="Email Campaigns" value="8" icon={Mail} href="/marketing/campaigns" toneClassName="bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300" />
        <HubMetricTile title="Leads Generated" value="342" icon={Users} href="/marketing/segments" toneClassName="bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300" />
        <HubMetricTile title="Conversion Rate" value="24%" icon={TrendingUp} href="/customer-insights" toneClassName="bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300" />
      </div>

      <HubPanel title="Lead Sources Distribution">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={campaignData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {campaignData.map((entry, index) => (
                  <Cell key={`cell-${entry.id}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '2px', border: '1px solid #e5e7eb' }} />
            </PieChart>
          </ResponsiveContainer>
      </HubPanel>
    </div>
  );
}
