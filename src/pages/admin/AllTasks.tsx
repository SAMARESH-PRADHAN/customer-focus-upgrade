import { useState } from 'react';
import AdminLayout from '@/components/layouts/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { mockTasks } from '@/data/mockData';
import { customerTypeLabels, customerTypeColors } from '@/types';
import { ClipboardList, Download, CalendarIcon, Filter, Search } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const AllTasks = () => {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const filteredTasks = mockTasks.filter(task => {
    const statusMatch = statusFilter === 'all' || task.status === statusFilter;
    
    const searchMatch = searchQuery === '' || 
      task.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    let dateMatch = true;
    if (fromDate && toDate) {
      dateMatch = isWithinInterval(task.createdAt, { start: fromDate, end: toDate });
    } else if (fromDate) {
      dateMatch = task.createdAt >= fromDate;
    } else if (toDate) {
      dateMatch = task.createdAt <= toDate;
    }
    
    return statusMatch && searchMatch && dateMatch;
  });

  const handleDownloadExcel = () => {
    const headers = ['Customer Name', 'Description', 'Service', 'Employee', 'Type of Customer', 'Status', 'Date'];
    const rows = filteredTasks.map(t => [
      t.customerName,
      t.description,
      t.service,
      t.employeeName,
      customerTypeLabels[t.customerType],
      t.status,
      format(t.createdAt, 'dd/MM/yyyy'),
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `all_tasks_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    
    toast.success('Excel file downloaded successfully');
  };

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
    setStatusFilter('all');
    setSearchQuery('');
  };

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
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-7 w-7 text-primary" />
            All Tasks
          </h1>
          <p className="text-muted-foreground mt-1">
            View and manage all tasks across employees
          </p>
        </div>

        {/* Status Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('all')}
            className={statusFilter === 'all' ? 'gradient-primary text-primary-foreground' : ''}
          >
            All Status
          </Button>
          <Button
            variant={statusFilter === 'pending' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('pending')}
            className={statusFilter === 'pending' ? 'bg-destructive/80 text-destructive-foreground hover:bg-destructive' : ''}
          >
            Pending
          </Button>
          <Button
            variant={statusFilter === 'in_progress' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('in_progress')}
            className={statusFilter === 'in_progress' ? 'bg-warning text-warning-foreground hover:bg-warning/90' : ''}
          >
            In Progress
          </Button>
          <Button
            variant={statusFilter === 'completed' ? 'default' : 'outline'}
            onClick={() => setStatusFilter('completed')}
            className={statusFilter === 'completed' ? 'bg-success text-success-foreground hover:bg-success/90' : ''}
          >
            Completed
          </Button>
        </div>

        {/* Filters and Actions */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end flex-wrap">
                {/* Search */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Search className="h-4 w-4" />
                    Search
                  </Label>
                  <Input
                    placeholder="Search by name, employee..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-[200px]"
                  />
                </div>

                {/* From Date */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    From Date
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[160px] justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PP") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={fromDate}
                        onSelect={setFromDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* To Date */}
                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[160px] justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PP") : "Select"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={toDate}
                        onSelect={setToDate}
                        initialFocus
                        className="pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {(fromDate || toDate || searchQuery) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear All
                  </Button>
                )}
              </div>

              <Button variant="outline" onClick={handleDownloadExcel} className="gap-2">
                <Download className="h-4 w-4" />
                Download Excel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tasks Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>All Tasks ({filteredTasks.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Employee</TableHead>
                    <TableHead>Type of Customer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTasks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No tasks found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredTasks.map((task) => (
                      <TableRow key={task.id}>
                        <TableCell className="font-medium">{task.customerName}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{task.description}</TableCell>
                        <TableCell>{task.service}</TableCell>
                        <TableCell>{task.employeeName}</TableCell>
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
    </AdminLayout>
  );
};

export default AllTasks;
