import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { TrendingUp, TrendingDown, Users, DollarSign, Calendar, Download } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const isMobile = useIsMobile();
  
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

  return (
    <div className="space-y-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-col sm:flex-row'} gap-4 items-start ${isMobile ? '' : 'sm:items-center'} justify-between`}>
        <div>
          <h2 className={`${isMobile ? 'text-xl' : 'text-2xl'} font-bold text-gray-900`}>Reports & Analytics</h2>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>Track your gym's performance</p>
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

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-3' : 'md:grid-cols-2 lg:grid-cols-4 gap-4'}`}>
        <StatCard
          title="Revenue"
          value={`₹${weeklyData.revenue}`}
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

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
        <Card>
          <CardHeader className={isMobile ? 'px-4 pt-4 pb-3' : ''}>
            <CardTitle className={isMobile ? 'text-base' : ''}>Daily Breakdown</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <Calendar className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
              <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No data available</p>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Analytics will appear here once you have attendance data</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={isMobile ? 'px-4 pt-4 pb-3' : ''}>
            <CardTitle className={isMobile ? 'text-base' : ''}>Top Members (This Month)</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <Users className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
              <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No member data available</p>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Top performing members will appear here</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className={`grid grid-cols-1 ${isMobile ? 'gap-4' : 'lg:grid-cols-2 gap-6'}`}>
        <Card>
          <CardHeader className={isMobile ? 'px-4 pt-4 pb-3' : ''}>
            <CardTitle className={isMobile ? 'text-base' : ''}>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <TrendingUp className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
              <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No revenue data available</p>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Revenue trends will appear here once you have payment data</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className={isMobile ? 'px-4 pt-4 pb-3' : ''}>
            <CardTitle className={isMobile ? 'text-base' : ''}>Attendance Patterns</CardTitle>
          </CardHeader>
          <CardContent className={isMobile ? 'px-4 pb-4' : ''}>
            <div className={`text-center ${isMobile ? 'py-6' : 'py-8'}`}>
              <Calendar className={`${isMobile ? 'w-16 h-16' : 'w-12 h-12'} mx-auto text-gray-400 mb-2`} />
              <p className={`text-gray-600 ${isMobile ? 'text-base' : ''}`}>No attendance data available</p>
              <p className={`text-gray-500 ${isMobile ? 'text-sm' : 'text-sm'}`}>Attendance patterns will appear here once you start tracking visits</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Reports;