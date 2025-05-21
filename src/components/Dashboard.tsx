
import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useDatabase } from '@/contexts/DatabaseContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { config } = useDatabase();

  const handleManageUsers = () => {
    navigate('/users');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button variant="outline" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome, {user?.username}</CardTitle>
            <CardDescription>You are logged in as {user?.role}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Your account has been successfully authenticated.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Database Connection</CardTitle>
            <CardDescription>Current database status</CardDescription>
          </CardHeader>
          <CardContent>
            <p><span className="font-semibold">Host:</span> {config?.host}</p>
            <p><span className="font-semibold">Database:</span> {config?.dbName}</p>
            <p><span className="font-semibold">Status:</span> <span className="text-green-500">Connected</span></p>
          </CardContent>
        </Card>
        
        {(user?.role === UserRole.OWNER || user?.role === UserRole.ADMIN) && (
          <Card>
            <CardHeader>
              <CardTitle>Administration</CardTitle>
              <CardDescription>Administrative tools</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Manage users and system settings.</p>
            </CardContent>
            <CardFooter>
              <Button onClick={handleManageUsers} className="w-full">
                Manage Users
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
