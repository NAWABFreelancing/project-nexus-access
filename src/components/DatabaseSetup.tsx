
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDatabase, DatabaseConfig, ConnectionStatus } from '@/contexts/DatabaseContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { AlertCircle, Database, CheckCircle2 } from 'lucide-react';

const DatabaseSetup: React.FC = () => {
  const navigate = useNavigate();
  const { status, config, setConfig, connectToDatabase, createDatabase } = useDatabase();
  const [formValues, setFormValues] = useState<DatabaseConfig>(config || {
    host: 'localhost',
    port: 5432,
    username: '',
    password: '',
    dbName: 'projectmanager',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({
      ...prev,
      [name]: name === 'port' ? parseInt(value, 10) || 0 : value,
    }));
  };

  const handleConnect = async () => {
    setLoading(true);
    try {
      const success = await connectToDatabase(formValues);
      if (success) {
        navigate('/register');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    setLoading(true);
    try {
      const success = await createDatabase(formValues);
      if (success) {
        navigate('/register');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-6 w-6 text-brand-600" /> Database Setup
        </CardTitle>
        <CardDescription>
          Configure your database connection
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === ConnectionStatus.NOT_INSTALLED && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-700">Database system is not installed on the server.</p>
            </div>
          </div>
        )}

        {status === ConnectionStatus.NOT_RUNNING && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4 rounded">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-amber-500 mr-2" />
              <p className="text-amber-700">Database server is not running.</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="host">Host</Label>
          <Input
            id="host"
            name="host"
            value={formValues.host}
            onChange={handleChange}
            placeholder="localhost"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="port">Port</Label>
          <Input
            id="port"
            name="port"
            type="number"
            value={formValues.port}
            onChange={handleChange}
            placeholder="5432"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            name="username"
            value={formValues.username}
            onChange={handleChange}
            placeholder="Database username"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formValues.password}
            onChange={handleChange}
            placeholder="Database password"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dbName">Database Name</Label>
          <Input
            id="dbName"
            name="dbName"
            value={formValues.dbName}
            onChange={handleChange}
            placeholder="projectmanager"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleConnect}
          disabled={loading || status === ConnectionStatus.NOT_INSTALLED || status === ConnectionStatus.NOT_RUNNING}
        >
          {loading ? 'Connecting...' : 'Connect to Existing'}
        </Button>
        <Button
          onClick={handleCreate}
          disabled={loading || status === ConnectionStatus.NOT_INSTALLED || status === ConnectionStatus.NOT_RUNNING}
        >
          {loading ? 'Creating...' : 'Create New Database'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseSetup;
