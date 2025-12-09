import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (role: 'admin' | 'employee') => {
    setIsLoading(true);
    // Simulate login
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Logged in as ${role === 'admin' ? 'Admin' : 'Employee'}`);
    
    if (role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/employee/dashboard');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <span className="text-primary-foreground font-bold text-3xl">C</span>
          </div>
          <h1 className="text-2xl font-bold text-foreground">CafeConnect Pro</h1>
          <p className="text-muted-foreground mt-2">Sign in to your account</p>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Choose your role to continue</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="employee" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="employee">Employee</TabsTrigger>
                <TabsTrigger value="admin">Admin</TabsTrigger>
              </TabsList>
              
              <TabsContent value="employee">
                <form onSubmit={(e) => { e.preventDefault(); handleLogin('employee'); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee-email">Email</Label>
                    <Input 
                      id="employee-email" 
                      type="email" 
                      placeholder="john@cafeconnect.com"
                      defaultValue="john@cafeconnect.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employee-password">Password</Label>
                    <Input 
                      id="employee-password" 
                      type="password" 
                      placeholder="••••••••"
                      defaultValue="password"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in as Employee'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="admin">
                <form onSubmit={(e) => { e.preventDefault(); handleLogin('admin'); }} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-email">Email</Label>
                    <Input 
                      id="admin-email" 
                      type="email" 
                      placeholder="admin@cafeconnect.com"
                      defaultValue="admin@cafeconnect.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="admin-password">Password</Label>
                    <Input 
                      id="admin-password" 
                      type="password" 
                      placeholder="••••••••"
                      defaultValue="password"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full gradient-primary text-primary-foreground"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign in as Admin'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
