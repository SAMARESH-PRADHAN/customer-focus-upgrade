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
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { mockCustomers } from '@/data/mockData';
import { CustomerType, customerTypeLabels, customerTypeColors } from '@/types';
import { Users, Download, Bell, CalendarIcon, Filter } from 'lucide-react';
import { format, isWithinInterval } from 'date-fns';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const Customers = () => {
  const [activeType, setActiveType] = useState<CustomerType | 'all'>('all');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();

  const customerTypes: { value: CustomerType | 'all'; label: string }[] = [
    { value: 'all', label: 'All Customers' },
    { value: 'job_seeker', label: 'Job Seeker' },
    { value: 'student', label: 'Student' },
    { value: 'gov_scheme', label: 'Gov Scheme' },
  ];

  const filteredCustomers = mockCustomers.filter(customer => {
    const typeMatch = activeType === 'all' || customer.customerType === activeType;
    
    let dateMatch = true;
    if (fromDate && toDate) {
      dateMatch = isWithinInterval(customer.createdAt, { start: fromDate, end: toDate });
    } else if (fromDate) {
      dateMatch = customer.createdAt >= fromDate;
    } else if (toDate) {
      dateMatch = customer.createdAt <= toDate;
    }
    
    return typeMatch && dateMatch;
  });

  const handleNotifyAll = () => {
    const phoneNumbers = filteredCustomers.map(c => c.phone);
    toast.success(`WhatsApp notification sent to ${phoneNumbers.length} customers`);
  };

  const handleDownloadExcel = () => {
    // Create CSV content
    const headers = ['Name', 'Phone', 'Email', 'Type', 'Created Date', 'Created Time'];
    const rows = filteredCustomers.map(c => [
      c.name,
      c.phone,
      c.email || '',
      customerTypeLabels[c.customerType],
      format(c.createdAt, 'dd/MM/yyyy'),
      format(c.createdAt, 'HH:mm'),
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `customers_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    
    toast.success('Excel file downloaded successfully');
  };

  const clearFilters = () => {
    setFromDate(undefined);
    setToDate(undefined);
  };

  return (
    <AdminLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Users className="h-7 w-7 text-primary" />
            Customers
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage and view customer information
          </p>
        </div>

        {/* Customer Type Buttons */}
        <div className="flex flex-wrap gap-2">
          {customerTypes.map((type) => (
            <Button
              key={type.value}
              variant={activeType === type.value ? 'default' : 'outline'}
              onClick={() => setActiveType(type.value)}
              className={activeType === type.value ? 'gradient-primary text-primary-foreground' : ''}
            >
              {type.label}
            </Button>
          ))}
        </div>

        {/* Filters and Actions */}
        <Card className="glass-card">
          <CardContent className="p-4">
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-end justify-between">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
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
                          "w-[180px] justify-start text-left font-normal",
                          !fromDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {fromDate ? format(fromDate, "PPP") : "Select date"}
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

                <div className="space-y-2">
                  <Label>To Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-[180px] justify-start text-left font-normal",
                          !toDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {toDate ? format(toDate, "PPP") : "Select date"}
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

                {(fromDate || toDate) && (
                  <Button variant="ghost" onClick={clearFilters}>
                    Clear
                  </Button>
                )}
              </div>

              <div className="flex gap-2">
                <Button onClick={handleNotifyAll} className="gap-2">
                  <Bell className="h-4 w-4" />
                  Notify All
                </Button>
                <Button variant="outline" onClick={handleDownloadExcel} className="gap-2">
                  <Download className="h-4 w-4" />
                  Download Excel
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Table */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle>
              {activeType === 'all' ? 'All Customers' : customerTypeLabels[activeType]} ({filteredCustomers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Contact Details</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Created Time</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                        No customers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <p className="text-sm">{customer.phone}</p>
                            {customer.email && (
                              <p className="text-xs text-muted-foreground">{customer.email}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={customerTypeColors[customer.customerType]}>
                            {customerTypeLabels[customer.customerType]}
                          </Badge>
                        </TableCell>
                        <TableCell>{format(customer.createdAt, 'dd MMM yyyy')}</TableCell>
                        <TableCell>{format(customer.createdAt, 'HH:mm')}</TableCell>
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

export default Customers;
