
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, chart-bar, bar-chart, Settings } from 'lucide-react';
import MemberManagement from '@/components/MemberManagement';
import AttendanceTracker from '@/components/AttendanceTracker';
import PaymentTracking from '@/components/PaymentTracking';
import Reports from '@/components/Reports';
import TrainerManagement from '@/components/TrainerManagement';
import PlanManagement from '@/components/PlanManagement';
import GymHeader from '@/components/GymHeader';
import DashboardOverview from '@/components/DashboardOverview';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <GymHeader />
      
      <div className="container mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gym Management Dashboard</h1>
          <p className="text-gray-600">Manage your gym operations efficiently</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-7 gap-1">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <home className="w-4 h-4" />
              <span className="hidden sm:inline">Overview</span>
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Members</span>
            </TabsTrigger>
            <TabsTrigger value="plans" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Plans</span>
            </TabsTrigger>
            <TabsTrigger value="attendance" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span className="hidden sm:inline">Attendance</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <chart-bar className="w-4 h-4" />
              <span className="hidden sm:inline">Payments</span>
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <bar-chart className="w-4 h-4" />
              <span className="hidden sm:inline">Reports</span>
            </TabsTrigger>
            <TabsTrigger value="trainers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Trainers</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader>
                <CardTitle>Member Management</CardTitle>
                <CardDescription>Add, edit, and manage your gym members</CardDescription>
              </CardHeader>
              <CardContent>
                <MemberManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plans">
            <Card>
              <CardHeader>
                <CardTitle>Membership Plans</CardTitle>
                <CardDescription>Create and manage membership plans and pricing</CardDescription>
              </CardHeader>
              <CardContent>
                <PlanManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader>
                <CardTitle>Attendance Tracking</CardTitle>
                <CardDescription>Track member attendance and check-ins</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTracker />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader>
                <CardTitle>Payment Management</CardTitle>
                <CardDescription>Track payments and manage billing</CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentTracking />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader>
                <CardTitle>Reports & Analytics</CardTitle>
                <CardDescription>View performance metrics and generate reports</CardDescription>
              </CardHeader>
              <CardContent>
                <Reports />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trainers">
            <Card>
              <CardHeader>
                <CardTitle>Trainer Management</CardTitle>
                <CardDescription>Manage gym trainers and their schedules</CardDescription>
              </CardHeader>
              <CardContent>
                <TrainerManagement />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
