
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, trending-up, trending-down, activity, chart-bar } from 'lucide-react';
import { useDashboardAnalytics } from '@/hooks/useDashboardAnalytics';

const DashboardOverview = () => {
  const { analytics, loading } = useDashboardAnalytics();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
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
    );
  }

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color,
    prefix = '',
    suffix = ''
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: any; 
    color: string;
    prefix?: string;
    suffix?: string;
  }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900 mb-1">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </div>
        {change !== undefined && (
          <div className="flex items-center text-sm">
            {change > 0 ? (
              <trending-up className="w-3 h-3 text-green-600 mr-1" />
            ) : change < 0 ? (
              <trending-down className="w-3 h-3 text-red-600 mr-1" />
            ) : null}
            {change !== 0 && (
              <>
                <span className={change > 0 ? 'text-green-600' : 'text-red-600'}>
                  {Math.abs(change).toFixed(1)}%
                </span>
                <span className="text-gray-500 ml-1">from last month</span>
              </>
            )}
            {change === 0 && (
              <span className="text-gray-500">No change from last month</span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Gym Overview</h2>
        <p className="text-gray-600">Key metrics and insights for your gym performance</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Members"
          value={analytics.totalMembers}
          change={analytics.memberGrowthRate}
          icon={Users}
          color="text-blue-600"
        />
        
        <StatCard
          title="Active Members"
          value={analytics.activeMembers}
          icon={activity}
          color="text-green-600"
        />
        
        <StatCard
          title="Monthly Revenue"
          value={Math.round(analytics.monthlyRevenue)}
          icon={chart-bar}
          color="text-emerald-600"
          prefix="₹"
        />
        
        <StatCard
          title="Membership Plans"
          value={analytics.totalPlans}
          icon={trending-up}
          color="text-purple-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Stats</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">New Members This Month:</span>
              <span className="font-semibold">{analytics.newMembersThisMonth}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Average Plan Price:</span>
              <span className="font-semibold">₹{Math.round(analytics.averagePlanPrice)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Member Retention:</span>
              <span className="font-semibold">
                {analytics.totalMembers > 0 ? Math.round((analytics.activeMembers / analytics.totalMembers) * 100) : 0}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Popular Plan</CardTitle>
          </CardHeader>
          <CardContent>
            {analytics.mostPopularPlan ? (
              <div className="text-center">
                <div className="text-2xl font-bold text-emerald-600 mb-2">
                  {analytics.mostPopularPlan}
                </div>
                <p className="text-sm text-gray-600">Most chosen by members</p>
              </div>
            ) : (
              <div className="text-center text-gray-500">
                <p>No membership data available</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Growth Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className={`text-2xl font-bold mb-2 ${
                analytics.memberGrowthRate > 0 ? 'text-green-600' : 
                analytics.memberGrowthRate < 0 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {analytics.memberGrowthRate > 0 ? '+' : ''}{analytics.memberGrowthRate.toFixed(1)}%
              </div>
              <p className="text-sm text-gray-600">Member growth this month</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardOverview;
