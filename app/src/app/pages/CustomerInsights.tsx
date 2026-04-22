import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const segmentData = [
  { id: 'segment-enterprise', name: 'Enterprise', value: 45 },
  { id: 'segment-midmarket', name: 'Mid-Market', value: 30 },
  { id: 'segment-smb', name: 'SMB', value: 25 },
];

const engagementData = [
  { id: 'eng-jan', month: 'Jan', score: 65 },
  { id: 'eng-feb', month: 'Feb', score: 72 },
  { id: 'eng-mar', month: 'Mar', score: 78 },
  { id: 'eng-apr', month: 'Apr', score: 85 },
  { id: 'eng-may', month: 'May', score: 82 },
];

const COLORS = ['#0B71C7', '#37BEF3', '#94EFFF'];

export default function CustomerInsights() {
  return (
    <div className="h-full p-6 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl mb-6">Customer Insights</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Customer Segments</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie data={segmentData} cx="50%" cy="50%" labelLine={false} label={(entry) => entry.name} outerRadius={80} fill="#8884d8" dataKey="value">
                    {segmentData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="border border-gray-200">
            <CardHeader className="border-b border-gray-100 pb-4">
              <CardTitle className="text-base">Engagement Score Trend</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={engagementData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="score" fill="#0B71C7" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Total Customers</div>
              <div className="text-3xl font-semibold text-gray-900">2,847</div>
              <div className="text-sm text-green-600 mt-1">+12% from last month</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Active Customers</div>
              <div className="text-3xl font-semibold text-gray-900">1,923</div>
              <div className="text-sm text-green-600 mt-1">+8% from last month</div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-sm text-gray-600 mb-1">Churn Rate</div>
              <div className="text-3xl font-semibold text-gray-900">3.2%</div>
              <div className="text-sm text-red-600 mt-1">-1.5% from last month</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}