
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import AuthForm from '@/components/AuthForm';
import Navbar from '@/components/Navbar';

const Register = () => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    setIsLoading(true);
    try {
      await register(data.name, data.email, data.password);
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center pt-16">
        <div className="w-full max-w-md p-6 md:p-10 glass rounded-xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold">Create an Account</h1>
            <p className="text-muted-foreground mt-2">
              Sign up to start tracking your educational progress
            </p>
          </div>
          
          <AuthForm 
            type="register" 
            onSubmit={handleSubmit} 
            isLoading={isLoading} 
          />
          
          <div className="mt-6 text-center text-sm">
            <p className="text-muted-foreground">
              Already have an account?{' '}
              <Link 
                to="/login" 
                className="text-primary font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Register;
