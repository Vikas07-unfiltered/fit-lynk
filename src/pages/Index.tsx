
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, TrendingUp, DollarSign, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MemberManagement from '@/components/MemberManagement';
import PaymentTracking from '@/components/PaymentTracking';
import AttendanceTracker from '@/components/AttendanceTracker';
import Reports from '@/components/Reports';
import TrainerManagement from '@/components/TrainerManagement';
import { useMembers } from '@/hooks/useMembers';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const { members } = useMembers();

  // Calculate real stats from actual data
  const stats = {
    totalMembers: members.length,
    activeMembers: members.filter(member => member.status === 'active').length,
    monthlyRevenue: 0, // Would be calculated from payments
    todayAttendance: 0 // Would be calculated from attendance records
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50 p-4">
      <div className="mx-auto max-w-7xl">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">GymFlow Manager</h1>
          <p className="text-gray-600">Complete gym management solution</p>
        </header>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-6">
            <TabsTrigger value="dashboard" className="text-xs lg:text-sm">
              <TrendingUp className="w-4 h-4 mr-1" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="members" className="text-xs lg:text-sm">
              <Users className="w-4 h-4 mr-1" />
              Members
            </TabsTrigger>
            <TabsTrigger value="payments" className="text-xs lg:text-sm">
              <DollarSign className="w-4 h-4 mr-1" />
              Payments
            </TabsTrigger>
            <TabsTrigger value="attendance" className="text-xs lg:text-sm">
              <UserCheck className="w-4 h-4 mr-1" />
              Attendance
            </TabsTrigger>
            <TabsTrigger value="reports" className="text-xs lg:text-sm">
              <Calendar className="w-4 h-4 mr-1" />
              Reports
            </TabsTrigger>
            <TabsTrigger value="trainers" className="text-xs lg:text-sm">
              <Users className="w-4 h-4 mr-1" />
              Trainers
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalMembers}</div>
                  <p className="text-emerald-100 text-xs">Registered in system</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Members</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.activeMembers}</div>
                  <p className="text-blue-100 text-xs">Currently active</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">${stats.monthlyRevenue}</div>
                  <p className="text-green-100 text-xs">This month</p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Today's Attendance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.todayAttendance}</div>
                  <p className="text-purple-100 text-xs">Check-ins today</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    onClick={() => setActiveTab('members')} 
                    className="w-full justify-start bg-emerald-600 hover:bg-emerald-700"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Add New Member
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('payments')} 
                    className="w-full justify-start bg-blue-600 hover:bg-blue-700"
                  >
                    <DollarSign className="w-4 h-4 mr-2" />
                    Record Payment
                  </Button>
                  <Button 
                    onClick={() => setActiveTab('attendance')} 
                    className="w-full justify-start bg-green-600 hover:bg-green-700"
                  >
                    <UserCheck className="w-4 h-4 mr-2" />
                    Mark Attendance
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                    <p className="text-gray-600">No recent activity</p>
                    <p className="text-sm text-gray-500">Activity will appear here as you use the system</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="members">
            <MemberManagement />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentTracking />
          </TabsContent>

          <TabsContent value="attendance">
            <AttendanceTracker />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          <TabsContent value="trainers">
            <TrainerManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
