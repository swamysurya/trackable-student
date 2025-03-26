
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { login, register, getCurrentUser } from '@/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Student';
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const initAuth = async () => {
      try {
        // Check if token exists
        const token = localStorage.getItem('auth_token');
        if (token) {
          const userData = await getCurrentUser();
          // Ensure user data has the correct role type
          const userWithRole = {
            ...userData,
            role: userData.role as 'Admin' | 'Student'
          };
          setUser(userWithRole);
          localStorage.setItem('user_role', userWithRole.role);
        }
      } catch (error) {
        console.error('Authentication error:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_role');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const loginUser = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const response = await login(email, password);
      localStorage.setItem('auth_token', response.token);
      // Ensure user data has the correct role type
      const userWithRole = {
        ...response.user,
        role: response.user.role as 'Admin' | 'Student'
      };
      setUser(userWithRole);
      localStorage.setItem('user_role', userWithRole.role);

      // Redirect based on role
      if (userWithRole.role === 'Admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
      
      toast({
        title: 'Welcome back!',
        description: 'You have successfully logged in.',
      });
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const registerUser = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      const response = await register(name, email, password);
      localStorage.setItem('auth_token', response.token);
      // Ensure user data has the correct role type
      const userWithRole = {
        ...response.user,
        role: response.user.role as 'Admin' | 'Student'
      };
      setUser(userWithRole);
      localStorage.setItem('user_role', userWithRole.role);
      
      navigate('/dashboard');
      toast({
        title: 'Account created',
        description: 'Your account has been successfully created.',
      });
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'Could not create your account. Please try again.',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logoutUser = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_role');
    setUser(null);
    navigate('/');
    toast({
      title: 'Logged out',
      description: 'You have been successfully logged out.',
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: loginUser,
        register: registerUser,
        logout: logoutUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
