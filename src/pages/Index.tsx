
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useDatabase, ConnectionStatus } from '@/contexts/DatabaseContext';
import DatabaseSetup from '@/components/DatabaseSetup';
import RegisterOwner from '@/components/RegisterOwner';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { status, isConfigured, checkConnection } = useDatabase();
  
  const [checking, setChecking] = React.useState(true);
  const [hasOwner, setHasOwner] = React.useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      // Check if there's an owner account
      const hasDefaultOwner = localStorage.getItem('hasDefaultOwner') === 'true';
      setHasOwner(hasDefaultOwner);

      // Check database connection
      await checkConnection();
      setChecking(false);

      // If user is authenticated, redirect to dashboard
      if (isAuthenticated) {
        navigate('/dashboard');
        return;
      }

      // If database is configured and has owner, redirect to login
      if (isConfigured && hasDefaultOwner) {
        navigate('/login');
      }
    };

    checkStatus();
  }, [checkConnection, isAuthenticated, isConfigured, navigate]);

  // Show loading state while checking
  if (checking) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-10 w-10 text-brand-500 animate-spin mb-4" />
        <h2 className="text-xl font-semibold">Checking System Status...</h2>
      </div>
    );
  }

  // Show database setup if not configured
  if (!isConfigured) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-lg mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-800 mb-2">Welcome to Project Manager</h1>
          <p className="text-gray-600">Let's set up your database connection.</p>
        </div>
        <DatabaseSetup />
      </div>
    );
  }

  // Show register owner form if database is configured but no owner account exists
  if (isConfigured && !hasOwner) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-lg mb-8 text-center">
          <h1 className="text-3xl font-bold text-brand-800 mb-2">Create Owner Account</h1>
          <p className="text-gray-600">Create the first administrator account for your system.</p>
        </div>
        <RegisterOwner />
      </div>
    );
  }

  // Navigate to login page if everything is set up
  useEffect(() => {
    if (isConfigured && hasOwner && !isAuthenticated) {
      navigate('/login');
    }
  }, [isConfigured, hasOwner, isAuthenticated, navigate]);

  return null;
};

export default Index;
