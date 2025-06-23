
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Download } from 'lucide-react';
import { useState } from 'react';

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('weekly');
  
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
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No data available</p>
              <p className="text-sm text-gray-500">Analytics will appear here once you have attendance data</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Members (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Users className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No member data available</p>
              <p className="text-sm text-gray-500">Top performing members will appear here</p>
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
            <div className="text-center py-8">
              <TrendingUp className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No revenue data available</p>
              <p className="text-sm text-gray-500">Revenue trends will appear here once you have payment data</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Attendance Patterns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
              <p className="text-gray-600">No attendance data available</p>
              <p className="text-sm text-gray-500">Attendance patterns will appear here once you start tracking visits</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;
