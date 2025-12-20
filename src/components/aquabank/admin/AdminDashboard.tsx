import { Users, DollarSign, Building2, TrendingUp } from 'lucide-react';

const stats = [
  { label: 'Total Users', value: '1,234', change: '+12%', icon: Users, color: 'bg-blue-500' },
  { label: 'Total Deposits', value: '$2.4M', change: '+8%', icon: DollarSign, color: 'bg-green-500' },
  { label: 'Active Branches', value: '12', change: '0%', icon: Building2, color: 'bg-purple-500' },
  { label: 'Monthly Growth', value: '15%', change: '+3%', icon: TrendingUp, color: 'bg-orange-500' },
];

const recentActivity = [
  { id: 1, action: 'New user registered', user: 'john@example.com', time: '5 min ago' },
  { id: 2, action: 'Transfer completed', user: 'jane@example.com', time: '12 min ago' },
  { id: 3, action: 'Account verified', user: 'bob@example.com', time: '1 hour ago' },
  { id: 4, action: 'Password changed', user: 'alice@example.com', time: '2 hours ago' },
];

export function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to AquaBank Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-card rounded-xl p-6 shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
                  <p className="text-sm text-green-600 mt-1">{stat.change} from last month</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-foreground mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Chart visualization would go here</p>
          </div>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-foreground mb-4">Transaction Volume</h3>
          <div className="h-64 flex items-center justify-center bg-muted/50 rounded-lg">
            <p className="text-muted-foreground">Chart visualization would go here</p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold text-foreground mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-center justify-between py-3 border-b last:border-0">
              <div>
                <p className="font-medium text-foreground">{activity.action}</p>
                <p className="text-sm text-muted-foreground">{activity.user}</p>
              </div>
              <span className="text-sm text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
