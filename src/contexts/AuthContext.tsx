
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from "@/components/ui/sonner";

// Define user roles
export enum UserRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  EDITOR = 'editor',
}

// User type definition
export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  createdBy?: string;
}

// Auth context type definition
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  createUser: (userData: Omit<User, 'id' | 'createdAt'> & { password: string }) => Promise<boolean>;
  users: User[];
  getCurrentUser: () => User | null;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }

    // Load users list
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
      setUsers(JSON.parse(storedUsers));
    } else {
      // If no users exist, check if we should create a default owner
      const hasDefaultOwner = localStorage.getItem('hasDefaultOwner');
      if (!hasDefaultOwner) {
        // We don't auto-create a user here since we want the setup process
        // to guide creation of the first owner
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Simulate login API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In a real app, you would validate against the database
      // Here we check against our simulated users array
      const usersList = localStorage.getItem('users');
      if (!usersList) {
        toast.error("No users found. Please set up the system first.");
        return false;
      }
      
      const parsedUsers: User[] = JSON.parse(usersList);
      // In a real app, passwords would be hashed! This is just for demo
      const userPasswords = localStorage.getItem('userPasswords') ? 
        JSON.parse(localStorage.getItem('userPasswords')!) : {};
      
      const matchedUser = parsedUsers.find(u => u.email === email);
      
      if (matchedUser && userPasswords[matchedUser.id] === password) {
        // Login successful
        setUser(matchedUser);
        setIsAuthenticated(true);
        localStorage.setItem('currentUser', JSON.stringify(matchedUser));
        toast.success("Login successful!");
        return true;
      } else {
        toast.error("Invalid email or password.");
        return false;
      }
    } catch (error) {
      console.error("Error during login:", error);
      toast.error("An error occurred during login.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('currentUser');
    toast.info("Logged out successfully.");
  };

  const createUser = async (userData: Omit<User, 'id' | 'createdAt'> & { password: string }): Promise<boolean> => {
    try {
      // Simulate user creation API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Check if email is already in use
      const existingUsers = localStorage.getItem('users') ? 
        JSON.parse(localStorage.getItem('users')!) : [];
      
      if (existingUsers.some((u: User) => u.email === userData.email)) {
        toast.error("Email is already in use.");
        return false;
      }

      // Create new user
      const newUser: User = {
        id: `user_${Date.now()}`,
        username: userData.username,
        email: userData.email,
        role: userData.role,
        createdAt: new Date(),
        createdBy: user?.id,
      };

      // Update users list
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);

      // Store password separately (in a real app, you would hash passwords)
      const userPasswords = localStorage.getItem('userPasswords') ? 
        JSON.parse(localStorage.getItem('userPasswords')!) : {};
      userPasswords[newUser.id] = userData.password;
      localStorage.setItem('userPasswords', JSON.stringify(userPasswords));

      // If this is the first owner, set flag
      if (userData.role === UserRole.OWNER && !localStorage.getItem('hasDefaultOwner')) {
        localStorage.setItem('hasDefaultOwner', 'true');
      }

      toast.success(`User ${userData.username} created successfully.`);
      return true;
    } catch (error) {
      console.error("Error creating user:", error);
      toast.error("An error occurred while creating the user.");
      return false;
    }
  };

  const getCurrentUser = (): User | null => {
    return user;
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    createUser,
    users,
    getCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
