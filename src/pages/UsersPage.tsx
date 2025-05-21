
import React from 'react';
import UserManagement from '@/components/UserManagement';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserRole } from '@/contexts/AuthContext';

const UsersPage = () => {
  // Only allow owners and admins to access this page
  return (
    <ProtectedRoute allowedRoles={[UserRole.OWNER, UserRole.ADMIN]}>
      <div className="min-h-screen bg-gray-50">
        <div className="py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">User Management</h1>
          <UserManagement />
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default UsersPage;
