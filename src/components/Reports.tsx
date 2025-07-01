
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, LineChart, Line, PieChart, Cell, Pie, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Download, Clock, UserCheck } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const isMobile = useIsMobile();
  const { analytics, loading } = useAdvancedAnalytics();
  
  // Empty states - real data would come from API/database
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

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color 
  }: { 
    title: string; 
    value: string | number; 
    change: number; 
    icon: any; 
    color: string; 
  }) => (
    <Card>
      <CardHeader className={`${isMobile ? 'pb-2 px-4 pt-3' : 'pb-2'}`}>
        <div className="flex items-center justify-between">
          <CardTitle className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>{title}</CardTitle>
          <Icon className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} ${color}`} />
        </div>
      </CardHeader>
      <CardContent className={isMobile ? 'px-4 pb-3' : ''}>
        <div className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold mb-1`}>{value}</div>
        <div className={`flex items-center ${isMobile ? 'text-xs' : 'text-xs'}`}>
          {change > 0 ? (
            <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
          ) : change < 0 ? (
            <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
          ) : null}
          {change !== 0 && (
            <>
              <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
                {Math.abs(change)}%
              </span>
              <span className="text-gray-500 ml-1">from last {reportPeriod}</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-full"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 items-start ${isMobile ? '' : 'sm:items-center'} justify-between`}>
        <div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>Reports & Analytics</h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Comprehensive insights and performance tracking</p>
        </div>
        
        <div className={`flex gap-2 ${isMobile ? 'w-full' : ''}`}>
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className={`${isMobile ? 'flex-1 h-12' : 'w-32'}`}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline" className={isMobile ? 'h-12 px-4' : ''}>
            <Download className={`${isMobile ? 'w-5 h-5' : 'w-4 h-4'} ${isMobile ? 'mr-2' : 'mr-2'}`} />
            {isMobile ? 'Export' : 'Export'}
          </Button>
        </div>
      </div>

      {/* Enhanced Summary Cards */}
      <div className={`grid grid-cols-1 ${isMobile ? 'sm:grid-cols-2 gap-3' : 'md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
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
      <div className={`grid grid-cols-1 ${isMobile ? 'gap-6' : 'lg:grid-cols-2 gap-6'}`}>
        {/* Peak Hours Chart */}
        <Card>
          <CardHeader>
            <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Peak Hours Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {topPeakHours.length > 0 ? (
              <ChartContainer config={chartConfig} className={`${isMobile ? 'h-[200px]' : 'h-[300px]'}`}>
                <BarChart data={topPeakHours}>
                  <XAxis 
                    dataKey="hour" 
                    tickFormatter={(value) => `${value}:00`}
                    fontSize={isMobile ? 10 : 12}
                  />
                  <YAxis fontSize={isMobile ? 10 : 12} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`${value} visits`, `${name}:00`]}
                  />
                  <Bar dataKey="count" fill="var(--color-count)" radius={2} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
                <Clock className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
                <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No peak hours data available</p>
                <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Data will appear here once you have attendance records</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Attendance Trends */}
        <Card>
          <CardHeader>
            <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>30-Day Attendance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTrends.length > 0 ? (
              <ChartContainer config={chartConfig} className={`${isMobile ? 'h-[200px]' : 'h-[300px]'}`}>
                <LineChart data={recentTrends}>
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(value) => new Date(value).getDate().toString()}
                    fontSize={isMobile ? 10 : 12}
                  />
                  <YAxis fontSize={isMobile ? 10 : 12} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value) => [`${value} visits`, 'Attendance']}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="var(--color-count)" 
                    strokeWidth={2}
                    dot={{ fill: 'var(--color-count)', strokeWidth: 2, r: 3 }}
                  />
                </LineChart>
              </ChartContainer>
            ) : (
              <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
                <Calendar className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
                <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No attendance trends available</p>
                <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Trends will appear here once you start tracking attendance</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Revenue Forecast */}
        <Card>
          <CardHeader>
            <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Revenue Forecast</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.revenueForecast.length > 0 ? (
              <ChartContainer config={chartConfig} className={`${isMobile ? 'h-[200px]' : 'h-[300px]'}`}>
                <BarChart data={analytics.revenueForecast}>
                  <XAxis dataKey="month" fontSize={isMobile ? 9 : 12} />
                  <YAxis fontSize={isMobile ? 10 : 12} />
                  <ChartTooltip 
                    content={<ChartTooltipContent />}
                    formatter={(value, name) => [`₹${Math.round(Number(value))}`, name === 'actualRevenue' ? 'Actual' : 'Forecast']}
                  />
                  <Bar dataKey="actualRevenue" fill="var(--color-revenue)" radius={2} />
                  <Bar dataKey="forecastRevenue" fill="var(--color-forecast)" radius={2} />
                </BarChart>
              </ChartContainer>
            ) : (
              <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
                <TrendingUp className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
                <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No revenue data available</p>
                <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Revenue trends will appear here once you have payment data</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Member Engagement */}
        <Card>
          <CardHeader>
            <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Top Member Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            {topEngagedMembers.length > 0 ? (
              <div className="space-y-4">
                {topEngagedMembers.slice(0, 5).map((member, index) => (
                  <div key={member.memberId} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full`} style={{ backgroundColor: COLORS[index] }}></div>
                      <span className={`${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>
                        {member.memberName}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`${isMobile ? 'text-xs' : 'text-sm'} text-gray-500`}>
                        {member.attendanceCount} visits
                      </span>
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${member.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
                <Users className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
                <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No member engagement data</p>
                <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Top performing members will appear here</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Retention Analysis Table */}
      <Card>
        <CardHeader>
          <CardTitle className={isMobile ? 'text-base' : 'text-lg'}>Member Retention Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.retentionAnalysis.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className={`text-left ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500 pb-2`}>Period</th>
                    <th className={`text-left ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500 pb-2`}>New Members</th>
                    <th className={`text-left ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500 pb-2`}>Active</th>
                    <th className={`text-left ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500 pb-2`}>Churned</th>
                    <th className={`text-left ${isMobile ? 'text-xs' : 'text-sm'} font-medium text-gray-500 pb-2`}>Retention Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analytics.retentionAnalysis.map((period, index) => (
                    <tr key={index} className="border-b last:border-b-0">
                      <td className={`py-2 ${isMobile ? 'text-sm' : 'text-sm'} font-medium`}>{period.period}</td>
                      <td className={`py-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>{period.newMembers}</td>
                      <td className={`py-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>{period.activeMembers}</td>
                      <td className={`py-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>{period.churnedMembers}</td>
                      <td className={`py-2 ${isMobile ? 'text-sm' : 'text-sm'}`}>
                        <span className={`font-medium ${period.retentionRate > 80 ? 'text-green-600' : period.retentionRate > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {Math.round(period.retentionRate)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <Users className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
              <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No retention data available</p>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Retention analysis will appear here once you have member data</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
