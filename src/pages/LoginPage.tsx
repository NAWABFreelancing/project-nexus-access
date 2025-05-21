
import React from 'react';
import Login from '@/components/Login';

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-lg mb-8 text-center">
        <h1 className="text-3xl font-bold text-brand-800 mb-2">Sign In</h1>
        <p className="text-gray-600">Welcome back! Please sign in to continue.</p>
      </div>
      <Login />
    </div>
  );
};

export default LoginPage;
