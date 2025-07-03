import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Download, FileText, BarChart3, Users, TrendingUp, TrendingDown, DollarSign, Calendar, Clock, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { ResponsiveContainer, BarChart, LineChart, XAxis, YAxis, Bar, Line } from 'recharts';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { usePayments } from '@/hooks/usePayments';
import { useMembers } from '@/hooks/useMembers';
import { exportToPDF, exportToExcel } from './reports/ExportUtils';
import ReportsTab from './reports/ReportsTab';
import AnalyticsTab from './reports/AnalyticsTab';
import MembersTab from './reports/MembersTab';
import StatCard from './reports/StatCard';

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const [activeTab, setActiveTab] = useState('reports');
  const isMobile = useIsMobile();
  const { analytics, loading } = useAdvancedAnalytics();
  const { analytics: dashboardData } = useDashboardAnalytics();
  const { members } = useMembers();
  
  const weeklyData = {
    revenue: 0,
    revenueChange: 0,
    members: 0,
    memberChange: 0,
    attendance: 0,
    attendanceChange: 0,
    retention: 0,
    retentionChange: 0,
  };

  const chartConfig = {
    count: {
      label: "Count",
      color: "#10b981",
    },
    revenue: {
      label: "Revenue",
      color: "#3b82f6",
    },
    forecast: {
      label: "Forecast",
      color: "#f59e0b",
    },
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const topPeakHours = analytics.peakHours.slice(0, 8);
  const topEngagedMembers = analytics.memberEngagement.slice(0, 5);
  const recentTrends = analytics.attendanceTrends.slice(-30);

  // Wrap export functions for use as button click handlers
  const handleExportPDFClick = () => {
    exportToPDF(
      activeTab,
      members,
      dashboardData.monthlyRevenue ?? 0,
      0, // Optionally compute lastMonthRevenue if available
      dashboardData
    );
  };
  const handleExportExcelClick = () => {
    exportToExcel(
      activeTab,
      members,
      dashboardData.monthlyRevenue ?? 0,
      0, // Optionally compute lastMonthRevenue if available
      dashboardData
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-full"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Comprehensive insights and performance tracking</p>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          <Select value={reportPeriod} onValueChange={(val) => setReportPeriod(val)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" onClick={handleExportPDFClick} className="hover-scale">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcelClick} className="hover-scale">
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reports" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Reports
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Analytics
          </TabsTrigger>
          <TabsTrigger value="members" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Members
          </TabsTrigger>
        </TabsList>

        {/* Reports Tab */}
        <TabsContent value="reports" className="space-y-6">
          {/* Basic Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`₹${weeklyData.revenue.toLocaleString()}`}
              change={weeklyData.revenueChange}
              icon={DollarSign}
              color="text-green-600"
            />
            <StatCard
              title="Active Members"
              value={weeklyData.members}
              change={weeklyData.memberChange}
              icon={Users}
              color="text-blue-600"
            />
            <StatCard
              title="Attendance"
              value={weeklyData.attendance}
              change={weeklyData.attendanceChange}
              icon={Calendar}
              color="text-purple-600"
            />
            <StatCard
              title="Retention Rate"
              value={`${weeklyData.retention}%`}
              change={weeklyData.retentionChange}
              icon={TrendingUp}
              color="text-emerald-600"
            />
          </div>

          {/* Reports Summary */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">This Month</span>
                  <span className="text-lg font-bold text-green-600">₹0</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Last Month</span>
                  <span className="text-lg font-bold">₹0</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Year to Date</span>
                  <span className="text-lg font-bold">₹0</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Membership Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">New Members</span>
                  <span className="text-lg font-bold text-blue-600">0</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Active Members</span>
                  <span className="text-lg font-bold">0</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <span className="text-sm font-medium">Expired Members</span>
                  <span className="text-lg font-bold text-red-600">0</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Financial Reports */}
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <DollarSign className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-gray-600">No financial data available</p>
                <p className="text-gray-500 text-sm">Start adding payment records to see financial reports</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Peak Hour"
              value={topPeakHours[0] ? `${topPeakHours[0].hour}:00` : 'N/A'}
              change={0}
              icon={Clock}
              color="text-green-600"
            />
            <StatCard
              title="Top Member"
              value={topEngagedMembers[0] ? topEngagedMembers[0].memberName.split(' ')[0] : 'N/A'}
              change={0}
              icon={UserCheck}
              color="text-blue-600"
            />
            <StatCard
              title="Avg Daily Visits"
              value={recentTrends.length > 0 ? Math.round(recentTrends.reduce((sum, t) => sum + t.count, 0) / recentTrends.length) : 0}
              change={weeklyData.attendanceChange}
              icon={Calendar}
              color="text-purple-600"
            />
            <StatCard
              title="Retention Rate"
              value={analytics.retentionAnalysis[0] ? `${Math.round(analytics.retentionAnalysis[0].retentionRate)}%` : '0%'}
              change={weeklyData.retentionChange}
              icon={TrendingUp}
              color="text-emerald-600"
            />
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Peak Hours Chart */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Peak Hours Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {topPeakHours.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={topPeakHours} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <XAxis 
                            dataKey="hour" 
                            tickFormatter={(value) => `${value}:00`}
                            fontSize={12}
                          />
                          <YAxis fontSize={12} />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            formatter={(value, name) => [`${value} visits`, `${name}:00`]}
                          />
                          <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Clock className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-600">No peak hours data available</p>
                      <p className="text-gray-500 text-sm">Data will appear here once you have attendance records</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Attendance Trends */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>30-Day Attendance Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {recentTrends.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={recentTrends} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <XAxis 
                            dataKey="date" 
                            tickFormatter={(value) => new Date(value).getDate().toString()}
                            fontSize={12}
                          />
                          <YAxis fontSize={12} />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            formatter={(value) => [`${value} visits`, 'Attendance']}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="count" 
                            stroke="var(--color-count)" 
                            strokeWidth={2}
                            dot={{ fill: 'var(--color-count)', strokeWidth: 2, r: 4 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Calendar className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-600">No attendance trends available</p>
                      <p className="text-gray-500 text-sm">Trends will appear here once you start tracking attendance</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Revenue Forecast */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Revenue Forecast</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {analytics.revenueForecast.length > 0 ? (
                    <ChartContainer config={chartConfig} className="h-full w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analytics.revenueForecast} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                          <XAxis dataKey="month" fontSize={12} />
                          <YAxis fontSize={12} />
                          <ChartTooltip 
                            content={<ChartTooltipContent />}
                            formatter={(value, name) => [`₹${Math.round(Number(value))}`, name === 'actualRevenue' ? 'Actual' : 'Forecast']}
                          />
                          <Bar dataKey="actualRevenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="forecastRevenue" fill="var(--color-forecast)" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </ChartContainer>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <TrendingUp className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-600">No revenue data available</p>
                      <p className="text-gray-500 text-sm">Revenue trends will appear here once you have payment data</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Member Engagement */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle>Top Member Engagement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px] w-full">
                  {topEngagedMembers.length > 0 ? (
                    <div className="space-y-4 pt-4">
                      {topEngagedMembers.slice(0, 5).map((member, index) => (
                        <div key={member.memberId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                            <div>
                              <span className="text-sm font-medium">{member.memberName}</span>
                              <p className="text-xs text-gray-500">{member.attendanceCount} visits</p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${member.score}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-600">{Math.round(member.score)}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <Users className="w-12 h-12 text-gray-400 mb-2" />
                      <p className="text-gray-600">No member engagement data</p>
                      <p className="text-gray-500 text-sm">Top performing members will appear here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Retention Analysis Table */}
          <Card>
            <CardHeader>
              <CardTitle>Member Retention Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {analytics.retentionAnalysis.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left text-sm font-medium text-gray-500 pb-3">Period</th>
                        <th className="text-left text-sm font-medium text-gray-500 pb-3">New Members</th>
                        <th className="text-left text-sm font-medium text-gray-500 pb-3">Active</th>
                        <th className="text-left text-sm font-medium text-gray-500 pb-3">Churned</th>
                        <th className="text-left text-sm font-medium text-gray-500 pb-3">Retention Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {analytics.retentionAnalysis.map((period, index) => (
                        <tr key={index} className="border-b last:border-b-0">
                          <td className="py-3 text-sm font-medium">{period.period}</td>
                          <td className="py-3 text-sm">{period.newMembers}</td>
                          <td className="py-3 text-sm">{period.activeMembers}</td>
                          <td className="py-3 text-sm">{period.churnedMembers}</td>
                          <td className="py-3 text-sm">
                            <span className={`font-medium px-2 py-1 rounded-full text-xs ${
                              period.retentionRate > 80 
                                ? 'bg-green-100 text-green-700' 
                                : period.retentionRate > 60 
                                ? 'bg-yellow-100 text-yellow-700' 
                                : 'bg-red-100 text-red-700'
                            }`}>
                              {Math.round(period.retentionRate)}%
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                  <p className="text-gray-600">No retention data available</p>
                  <p className="text-gray-500 text-sm">Retention analysis will appear here once you have member data</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reports;