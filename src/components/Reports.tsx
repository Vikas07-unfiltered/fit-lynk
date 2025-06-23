
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Download } from 'lucide-react';
import { useState } from 'react';

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('weekly');
  
  const weeklyData = {
    revenue: 2450,
    revenueChange: 8.2,
    members: 156,
    memberChange: 12,
    attendance: 892,
    attendanceChange: -3.1,
    retention: 91.5,
    retentionChange: 2.3,
  };

  const dailyBreakdown = [
    { day: 'Monday', attendance: 145, revenue: 420 },
    { day: 'Tuesday', attendance: 132, revenue: 380 },
    { day: 'Wednesday', attendance: 156, revenue: 450 },
    { day: 'Thursday', attendance: 129, revenue: 370 },
    { day: 'Friday', attendance: 168, revenue: 480 },
    { day: 'Saturday', attendance: 142, revenue: 410 },
    { day: 'Sunday', attendance: 120, revenue: 340 },
  ];

  const topMembers = [
    { name: 'John Doe', visits: 28, plan: 'Premium' },
    { name: 'Jane Smith', visits: 26, plan: 'VIP' },
    { name: 'Mike Johnson', visits: 24, plan: 'Premium' },
    { name: 'Sarah Wilson', visits: 22, plan: 'Basic' },
    { name: 'Tom Brown', visits: 20, plan: 'Premium' },
  ];

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
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className={`w-4 h-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold mb-1">{value}</div>
        <div className="flex items-center text-xs">
          {change > 0 ? (
            <TrendingUp className="w-3 h-3 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="w-3 h-3 text-red-600 mr-1" />
          )}
          <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
            {Math.abs(change)}%
          </span>
          <span className="text-gray-500 ml-1">from last {reportPeriod}</span>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
          <p className="text-gray-600">Track your gym's performance</p>
        </div>
        
        <div className="flex gap-2">
          <Select value={reportPeriod} onValueChange={setReportPeriod}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
            </SelectContent>
          </Select>
          
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Revenue"
          value={`$${weeklyData.revenue}`}
          change={weeklyData.revenueChange}
          icon={DollarSign}
          color="text-green-600"
        />
        <StatCard
          title="Total Members"
          value={weeklyData.members}
          change={weeklyData.memberChange}
          icon={Users}
          color="text-blue-600"
        />
        <StatCard
          title="Weekly Visits"
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Daily Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dailyBreakdown.map((day, index) => (
                <div key={day.day} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-8 bg-gradient-to-b from-emerald-400 to-blue-400 rounded-full"></div>
                    <span className="font-medium">{day.day}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{day.attendance} visits</div>
                    <div className="text-sm text-gray-600">${day.revenue} revenue</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Members (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topMembers.map((member, index) => (
                <div key={member.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-emerald-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium">{member.name}</div>
                      <div className="text-sm text-gray-600">{member.plan} Plan</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">{member.visits} visits</div>
                    <div className="text-xs text-gray-500">this month</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-48 flex items-end justify-between space-x-2">
              {[65, 45, 78, 52, 89, 67, 95].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-gradient-to-t from-emerald-500 to-emerald-400 rounded-t"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][index]}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Morning (6-12 PM)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-3/4 h-2 bg-blue-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">75%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Afternoon (12-6 PM)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-1/2 h-2 bg-emerald-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">50%</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Evening (6-11 PM)</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 h-2 bg-gray-200 rounded-full">
                    <div className="w-full h-2 bg-purple-500 rounded-full"></div>
                  </div>
                  <span className="text-sm text-gray-600">100%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
