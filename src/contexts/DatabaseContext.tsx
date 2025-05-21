
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

// Define connection statuses
export enum ConnectionStatus {
  CHECKING = 'checking',
  NOT_INSTALLED = 'not-installed',
  NOT_RUNNING = 'not-running',
  NOT_CONNECTED = 'not-connected',
  CONNECTED = 'connected',
}

// Define database config type
export interface DatabaseConfig {
  host: string;
  port: number;
  username: string;
  password: string;
  dbName: string;
}

// Context type definition
interface DatabaseContextType {
  status: ConnectionStatus;
  config: DatabaseConfig | null;
  setConfig: (config: DatabaseConfig) => void;
  checkConnection: () => Promise<ConnectionStatus>;
  connectToDatabase: (config: DatabaseConfig) => Promise<boolean>;
  createDatabase: (config: DatabaseConfig) => Promise<boolean>;
  isConfigured: boolean;
}

// Default database config
const defaultConfig: DatabaseConfig = {
  host: 'localhost',
  port: 5432,
  username: '',
  password: '',
  dbName: 'projectmanager',
};

// Create context
const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.CHECKING);
  const [config, setConfigState] = useState<DatabaseConfig | null>(null);
  const [isConfigured, setIsConfigured] = useState<boolean>(false);

  // Load config from localStorage on component mount
  useEffect(() => {
    const storedConfig = localStorage.getItem('databaseConfig');
    if (storedConfig) {
      const parsedConfig = JSON.parse(storedConfig);
      setConfigState(parsedConfig);
      setIsConfigured(true);
      // Check connection status with the stored configuration
      checkConnectionStatus(parsedConfig);
    } else {
      // If no config is found, set status to not connected
      setStatus(ConnectionStatus.NOT_CONNECTED);
    }
  }, []);

  // Check if database is installed, running and connected
  const checkConnectionStatus = async (dbConfig: DatabaseConfig): Promise<ConnectionStatus> => {
    try {
      // In a real app, you would make actual API calls to check database status
      // For this demo, we'll simulate the checks
      
      // Simulate checking if database system is installed
      const isInstalled = await simulateDbCheck('installed', dbConfig);
      if (!isInstalled) {
        setStatus(ConnectionStatus.NOT_INSTALLED);
        return ConnectionStatus.NOT_INSTALLED;
      }

      // Simulate checking if database server is running
      const isRunning = await simulateDbCheck('running', dbConfig);
      if (!isRunning) {
        setStatus(ConnectionStatus.NOT_RUNNING);
        return ConnectionStatus.NOT_RUNNING;
      }

      // Simulate checking if we can connect with credentials
      const isConnected = await simulateDbCheck('connected', dbConfig);
      if (!isConnected) {
        setStatus(ConnectionStatus.NOT_CONNECTED);
        return ConnectionStatus.NOT_CONNECTED;
      }

      // All checks passed
      setStatus(ConnectionStatus.CONNECTED);
      return ConnectionStatus.CONNECTED;
    } catch (error) {
      console.error("Error checking database status:", error);
      setStatus(ConnectionStatus.NOT_CONNECTED);
      return ConnectionStatus.NOT_CONNECTED;
    }
  };

  // Simulate database checks (in a real app, these would be actual API calls)
  const simulateDbCheck = async (check: 'installed' | 'running' | 'connected', config: DatabaseConfig): Promise<boolean> => {
    // This is a simulation - in a real app you'd make actual database connections
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
    
    // For the demo, we'll assume the database is always installed and running
    // In a real app, this would check if the database is actually installed/running
    if (check === 'installed') return true;
    if (check === 'running') return true;
    
    // For connection, we'll check if we have the configuration
    if (check === 'connected') {
      return Boolean(config.username && config.password);
    }

    return false;
  };

  const checkConnection = async (): Promise<ConnectionStatus> => {
    if (!config) {
      setStatus(ConnectionStatus.NOT_CONNECTED);
      return ConnectionStatus.NOT_CONNECTED;
    }
    return await checkConnectionStatus(config);
  };

  const connectToDatabase = async (dbConfig: DatabaseConfig): Promise<boolean> => {
    try {
      // Simulate connection attempt
      const connectionStatus = await checkConnectionStatus(dbConfig);
      
      if (connectionStatus === ConnectionStatus.CONNECTED) {
        // Save config to localStorage
        localStorage.setItem('databaseConfig', JSON.stringify(dbConfig));
        setConfigState(dbConfig);
        setIsConfigured(true);
        toast.success("Successfully connected to database.");
        return true;
      } else {
        toast.error("Failed to connect to the database. Please check your credentials.");
        return false;
      }
    } catch (error) {
      console.error("Error connecting to database:", error);
      toast.error("An error occurred while connecting to the database.");
      return false;
    }
  };

  const createDatabase = async (dbConfig: DatabaseConfig): Promise<boolean> => {
    try {
      // Simulate database creation
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // In a real app, you would create the database here
      toast.success(`Database '${dbConfig.dbName}' created successfully.`);
      
      // After creating, connect to it
      return await connectToDatabase(dbConfig);
    } catch (error) {
      console.error("Error creating database:", error);
      toast.error("Failed to create database.");
      return false;
    }
  };

  const setConfig = (newConfig: DatabaseConfig) => {
    setConfigState(newConfig);
  };

  const value = {
    status,
    config,
    setConfig,
    checkConnection,
    connectToDatabase,
    createDatabase,
    isConfigured,
  };

  return <DatabaseContext.Provider value={value}>{children}</DatabaseContext.Provider>;
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (context === undefined) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
