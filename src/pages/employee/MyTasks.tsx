import { useState } from 'react';
import EmployeeLayout from '@/components/layouts/EmployeeLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { mockTasks } from '@/data/mockData';
import { customerTypeLabels, customerTypeColors } from '@/types';
import { ListTodo, Filter } from 'lucide-react';
import { format } from 'date-fns';

const MyTasks = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Filter tasks for current employee
  const employeeTasks = mockTasks.filter(task => task.employeeId === '1');
  
  const filteredTasks = statusFilter === 'all' 
    ? employeeTasks 
    : employeeTasks.filter(task => task.status === statusFilter);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-success/10 text-success hover:bg-success/20">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-warning/10 text-warning hover:bg-warning/20">In Progress</Badge>;
      case 'pending':
        return <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">Pending</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <EmployeeLayout>
      <div className="space-y-6 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <ListTodo className="h-7 w-7 text-primary" />
              My Tasks
            </h1>
            <p className="text-muted-foreground mt-1">
              View and manage your assigned tasks
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Task List ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Type of Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No tasks found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.customerName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{task.description}</TableCell>
                        <TableCell>{task.service}</TableCell>
                        <TableCell>
                          <Badge className={customerTypeColors[task.customerType]}>
                            {customerTypeLabels[task.customerType]}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {format(task.createdAt, 'dd MMM yyyy')}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </EmployeeLayout>
  );
};

export default MyTasks;
