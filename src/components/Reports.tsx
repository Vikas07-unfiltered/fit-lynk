import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart3, Users } from 'lucide-react';
import { useState } from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAdvancedAnalytics } from '@/hooks/useAdvancedAnalytics';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';
import { usePayments } from '@/hooks/usePayments';
import { useMembers } from '@/hooks/useMembers';
import { exportToPDF, exportToExcel } from './reports/ExportUtils';
import ReportsTab from './reports/ReportsTab';
import AnalyticsTab from './reports/AnalyticsTab';
import MembersTab from './reports/MembersTab';

const Reports = () => {
  const [reportPeriod, setReportPeriod] = useState('weekly');
  const [activeTab, setActiveTab] = useState('reports');
  const isMobile = useIsMobile();
  const { analytics, loading: analyticsLoading } = useAdvancedAnalytics();
  const { analytics: dashboardData, loading: dashboardLoading } = useDashboardAnalytics();
  const { payments, loading: paymentsLoading } = usePayments();
  const { members, loading: membersLoading } = useMembers();
  
  const loading = analyticsLoading || dashboardLoading || paymentsLoading || membersLoading;
  
  // Calculate real-time statistics
  const currentMonthRevenue = payments
    .filter(p => new Date(p.payment_date).getMonth() === new Date().getMonth())
    .reduce((sum, p) => sum + p.amount, 0);
    
  const lastMonthRevenue = payments
    .filter(p => new Date(p.payment_date).getMonth() === new Date().getMonth() - 1)
    .reduce((sum, p) => sum + p.amount, 0);
    
  const revenueChange = lastMonthRevenue > 0 ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100) : 0;
  
  const weeklyData = {
    revenue: currentMonthRevenue,
    revenueChange: Math.round(revenueChange),
    members: dashboardData.totalMembers,
    memberChange: Math.round(dashboardData.memberGrowthRate),
    attendance: analytics.attendanceTrends.length > 0 ? analytics.attendanceTrends[analytics.attendanceTrends.length - 1].count : 0,
    attendanceChange: 0,
    retention: analytics.retentionAnalysis[0] ? Math.round(analytics.retentionAnalysis[0].retentionRate) : 0,
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

  const topPeakHours = analytics.peakHours.slice(0, 8);
  const topEngagedMembers = analytics.memberEngagement.slice(0, 5);
  const recentTrends = analytics.attendanceTrends.slice(-30);

  const handleExportPDF = () => {
    exportToPDF(activeTab, members, currentMonthRevenue, lastMonthRevenue, dashboardData);
  };

  const handleExportExcel = () => {
    exportToExcel(activeTab, members, currentMonthRevenue, lastMonthRevenue, dashboardData);
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
          
          <Button variant="outline" onClick={handleExportPDF} className="hover-scale">
            <Download className="w-4 h-4 mr-2" />
            PDF
          </Button>
          <Button variant="outline" onClick={handleExportExcel} className="hover-scale">
            <Download className="w-4 h-4 mr-2" />
            Excel
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
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

        <ReportsTab
          currentMonthRevenue={currentMonthRevenue}
          lastMonthRevenue={lastMonthRevenue}
          revenueChange={revenueChange}
          memberChange={weeklyData.memberChange}
          attendanceChange={weeklyData.attendanceChange}
          retentionChange={weeklyData.retentionChange}
          weeklyData={weeklyData}
          dashboardData={dashboardData}
          payments={payments}
        />

        <AnalyticsTab
          analytics={analytics}
          topPeakHours={topPeakHours}
          topEngagedMembers={topEngagedMembers}
          recentTrends={recentTrends}
          weeklyData={weeklyData}
          chartConfig={chartConfig}
        />

        <MembersTab members={members} />
      </Tabs>
    </div>
  );
};

export default Reports;