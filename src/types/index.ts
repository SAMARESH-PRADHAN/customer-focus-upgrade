export type CustomerType = 'job_seeker' | 'student' | 'gov_scheme' | 'booking';

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  customerType: CustomerType;
  createdAt: Date;
}

export interface Task {
  id: string;
  customerId: string;
  customerName: string;
  description: string;
  service: string;
  employeeId: string;
  employeeName: string;
  customerType: CustomerType;
  status: 'pending' | 'in_progress' | 'completed';
  createdAt: Date;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  completedTasks: number;
  pendingTasks: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'employee';
  avatar?: string;
}

export const customerTypeLabels: Record<CustomerType, string> = {
  job_seeker: 'Job Seeker',
  student: 'Student',
  gov_scheme: 'Gov Scheme',
  booking: 'Booking',
};

export const customerTypeColors: Record<CustomerType, string> = {
  job_seeker: 'bg-blue-100 text-blue-800',
  student: 'bg-green-100 text-green-800',
  gov_scheme: 'bg-purple-100 text-purple-800',
  booking: 'bg-orange-100 text-orange-800',
};
