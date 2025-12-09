import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import { mockTasks, mockEmployeeUser } from '@/data/mockData';

const Dashboard = () => {
  const employeeTasks = mockTasks.filter(task => task.employeeId === '1');
  const completedTasks = employeeTasks.filter(task => task.status === 'completed').length;
  const pendingTasks = employeeTasks.filter(task => task.status === 'pending').length;
  const inProgressTasks = employeeTasks.filter(task => task.status === 'in_progress').length;

  const stats = [
    {
      title: 'Total Tasks',
      value: employeeTasks.length,
      icon: ClipboardList,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle2,
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: TrendingUp,
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      title: 'Pending',
      value: pendingTasks,
      icon: Clock,
      color: 'text-destructive',
      bgColor: 'bg-destructive/10',
    },
  ];

  const recentTasks = employeeTasks.slice(0, 5);

  return (
    <EmployeeLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Section */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Welcome back, {mockEmployeeUser.name.split(' ')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Here's an overview of your tasks today.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="glass-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                    <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Recent Tasks */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{task.customerName}</p>
                    <p className="text-sm text-muted-foreground">{task.description}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      task.status === 'completed' 
                        ? 'bg-success/10 text-success' 
                        : task.status === 'in_progress'
                        ? 'bg-warning/10 text-warning'
                        : 'bg-destructive/10 text-destructive'
                    }`}>
                      {task.status.replace('_', ' ').charAt(0).toUpperCase() + task.status.replace('_', ' ').slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default Dashboard;
