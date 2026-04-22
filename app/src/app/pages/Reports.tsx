import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { FileText, TrendingUp, Users, DollarSign, Calendar, BarChart3, PieChart, Download, Share2, Eye } from 'lucide-react';
import { Badge } from '../components/ui/badge';

const reports = [
  { 
    id: 1, 
    name: 'Sales Performance Report', 
    category: 'Sales', 
    icon: TrendingUp, 
    color: 'bg-blue-100 text-blue-700',
    description: 'Comprehensive analysis of sales metrics, trends, and team performance',
    lastRun: '2026-03-24',
    frequency: 'Weekly'
  },
  { 
    id: 2, 
    name: 'Customer Acquisition Report', 
    category: 'Marketing', 
    icon: Users, 
    color: 'bg-green-100 text-green-700',
    description: 'Track new customer acquisition, sources, and conversion rates',
    lastRun: '2026-03-23',
    frequency: 'Monthly'
  },
  { 
    id: 3, 
    name: 'Revenue Forecast', 
    category: 'Finance', 
    icon: DollarSign, 
    color: 'bg-purple-100 text-purple-700',
    description: 'Projected revenue analysis with trend predictions and insights',
    lastRun: '2026-03-25',
    frequency: 'Monthly'
  },
  { 
    id: 4, 
    name: 'Pipeline Analysis', 
    category: 'Sales', 
    icon: FileText, 
    color: 'bg-orange-100 text-orange-700',
    description: 'Detailed breakdown of sales pipeline stages and conversion rates',
    lastRun: '2026-03-24',
    frequency: 'Daily'
  },
  { 
    id: 5, 
    name: 'Activity Summary', 
    category: 'Operations', 
    icon: Calendar, 
    color: 'bg-cyan-100 text-cyan-700',
    description: 'Overview of team activities, tasks, and productivity metrics',
    lastRun: '2026-03-25',
    frequency: 'Weekly'
  },
  { 
    id: 6, 
    name: 'Win/Loss Analysis', 
    category: 'Sales', 
    icon: BarChart3, 
    color: 'bg-red-100 text-red-700',
    description: 'Analysis of won and lost opportunities with key factors',
    lastRun: '2026-03-22',
    frequency: 'Monthly'
  },
  { 
    id: 7, 
    name: 'Lead Source Performance', 
    category: 'Marketing', 
    icon: PieChart, 
    color: 'bg-pink-100 text-pink-700',
    description: 'Performance metrics by lead source and channel effectiveness',
    lastRun: '2026-03-24',
    frequency: 'Weekly'
  },
  { 
    id: 8, 
    name: 'Customer Retention Report', 
    category: 'Customer Success', 
    icon: Users, 
    color: 'bg-indigo-100 text-indigo-700',
    description: 'Customer retention rates, churn analysis, and loyalty metrics',
    lastRun: '2026-03-23',
    frequency: 'Monthly'
  },
  { 
    id: 9, 
    name: 'Product Performance', 
    category: 'Sales', 
    icon: BarChart3, 
    color: 'bg-teal-100 text-teal-700',
    description: 'Product-wise sales analysis and performance comparison',
    lastRun: '2026-03-25',
    frequency: 'Weekly'
  },
];

const recentReports = [
  { name: 'Q1 Sales Summary', date: '2026-03-24', views: 142, category: 'Sales' },
  { name: 'Marketing ROI Analysis', date: '2026-03-23', views: 89, category: 'Marketing' },
  { name: 'Customer Engagement Metrics', date: '2026-03-22', views: 67, category: 'Customer Success' },
];

export default function Reports() {
  return (
    <div className="h-full bg-gray-50 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl mb-1">Reports & Analytics</h1>
              <p className="text-sm text-gray-600">Generate and view business intelligence reports</p>
            </div>
            <Button className="bg-[#0B71C7] hover:bg-[#106ebe]" disabled>
              <FileText className="w-4 h-4 mr-2" />
              Create Custom Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Reports</p>
                  <p className="text-2xl font-semibold">47</p>
                </div>
                <div className="bg-blue-100 text-blue-600 p-2.5 rounded">
                  <FileText className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Scheduled Reports</p>
                  <p className="text-2xl font-semibold">23</p>
                </div>
                <div className="bg-green-100 text-green-600 p-2.5 rounded">
                  <Calendar className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Reports This Month</p>
                  <p className="text-2xl font-semibold">156</p>
                </div>
                <div className="bg-purple-100 text-purple-600 p-2.5 rounded">
                  <BarChart3 className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Views</p>
                  <p className="text-2xl font-semibold">3.2K</p>
                </div>
                <div className="bg-orange-100 text-orange-600 p-2.5 rounded">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Reports */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="border-b border-gray-100 pb-4">
            <CardTitle className="text-base">Recently Generated Reports</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-gray-100">
              {recentReports.map((report, index) => (
                <div key={index} className="p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{report.name}</h4>
                        <Badge variant="secondary" className="text-xs">
                          {report.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(report.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {report.views} views
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <Share2 className="w-4 h-4 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Available Reports */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Available Reports</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <Card key={report.id} className="border border-gray-200 group">
                <CardHeader className="border-b border-gray-100 pb-4">
                  <CardTitle className="text-base flex items-center gap-2">
                    <div className={`p-2 rounded ${report.color}`}>
                      <report.icon className="w-4 h-4" />
                    </div>
                    <span className="flex-1">{report.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <p className="text-xs text-gray-600">{report.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs">{report.category}</Badge>
                    <span>{report.frequency}</span>
                  </div>
                  <div className="text-xs text-gray-500">
                    Last run: {new Date(report.lastRun).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1 bg-[#0B71C7] hover:bg-[#106ebe]">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Run Report
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
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
