
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Calendar, BarChart, Home, Settings } from 'lucide-react';
import MemberManagement from '@/components/MemberManagement';
import AttendanceTracker from '@/components/AttendanceTracker';
import PaymentTracking from '@/components/PaymentTracking';
import Reports from '@/components/Reports';
import TrainerManagement from '@/components/TrainerManagement';
import GymHeader from '@/components/GymHeader';
import DashboardOverview from '@/components/DashboardOverview';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-blue-50">
      <GymHeader />
      
      <div className={`container mx-auto ${isMobile ? 'px-2 py-4' : 'px-4 py-6'}`}>
        <div className={`mb-${isMobile ? '6' : '8'}`}>
          <h1 className={`${isMobile ? 'text-2xl' : 'text-3xl'} font-bold text-gray-900 mb-2`}>
            {isMobile ? 'Dashboard' : 'Gym Management Dashboard'}
          </h1>
          <p className={`text-gray-600 ${isMobile ? 'text-sm' : ''}`}>
            {isMobile ? 'Manage your gym efficiently' : 'Manage your gym operations efficiently'}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {isMobile ? (
            <TabsList className="grid w-full grid-cols-3 gap-1">
              <TabsTrigger value="overview" className="flex flex-col items-center gap-1 py-3">
                <Home className="w-4 h-4" />
                <span className="text-xs">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex flex-col items-center gap-1 py-3">
                <Users className="w-4 h-4" />
                <span className="text-xs">Members</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex flex-col items-center gap-1 py-3">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Attendance</span>
              </TabsTrigger>
            </TabsList>
          ) : (
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 gap-1">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="members" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Members</span>
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Attendance</span>
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                <span className="hidden sm:inline">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex items-center gap-2">
                <BarChart className="w-4 h-4" />
                <span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="trainers" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Trainers</span>
              </TabsTrigger>
            </TabsList>
          )}

          {/* Mobile-specific secondary navigation for additional tabs */}
          {isMobile && activeTab !== 'overview' && activeTab !== 'members' && activeTab !== 'attendance' && (
            <TabsList className="grid w-full grid-cols-3 gap-1">
              <TabsTrigger value="payments" className="flex flex-col items-center gap-1 py-3">
                <BarChart className="w-4 h-4" />
                <span className="text-xs">Payments</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="flex flex-col items-center gap-1 py-3">
                <BarChart className="w-4 h-4" />
                <span className="text-xs">Reports</span>
              </TabsTrigger>
              <TabsTrigger value="trainers" className="flex flex-col items-center gap-1 py-3">
                <Users className="w-4 h-4" />
                <span className="text-xs">Trainers</span>
              </TabsTrigger>
            </TabsList>
          )}

          <TabsContent value="overview">
            <DashboardOverview />
          </TabsContent>

          <TabsContent value="members">
            <Card>
              <CardHeader className={isMobile ? 'pb-4' : ''}>
                <CardTitle className={isMobile ? 'text-lg' : ''}>Member Management</CardTitle>
                <CardDescription className={isMobile ? 'text-sm' : ''}>
                  {isMobile ? 'Manage your gym members' : 'Add, edit, and manage your gym members'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MemberManagement />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="attendance">
            <Card>
              <CardHeader className={isMobile ? 'pb-4' : ''}>
                <CardTitle className={isMobile ? 'text-lg' : ''}>Attendance Tracking</CardTitle>
                <CardDescription className={isMobile ? 'text-sm' : ''}>
                  {isMobile ? 'Track member check-ins' : 'Track member attendance and check-ins'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceTracker />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="payments">
            <Card>
              <CardHeader className={isMobile ? 'pb-4' : ''}>
                <CardTitle className={isMobile ? 'text-lg' : ''}>Payment Management</CardTitle>
                <CardDescription className={isMobile ? 'text-sm' : ''}>
                  {isMobile ? 'Track payments and billing' : 'Track payments and manage billing'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <PaymentTracking />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <Card>
              <CardHeader className={isMobile ? 'pb-4' : ''}>
                <CardTitle className={isMobile ? 'text-lg' : ''}>Reports & Analytics</CardTitle>
                <CardDescription className={isMobile ? 'text-sm' : ''}>
                  {isMobile ? 'View performance metrics' : 'View performance metrics and generate reports'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Reports />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trainers">
            <Card>
              <CardHeader className={isMobile ? 'pb-4' : ''}>
                <CardTitle className={isMobile ? 'text-lg' : ''}>Trainer Management</CardTitle>
                <CardDescription className={isMobile ? 'text-sm' : ''}>
                  {isMobile ? 'Manage gym trainers' : 'Manage gym trainers and their schedules'}
                </CardDescription>
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
