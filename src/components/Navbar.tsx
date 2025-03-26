
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Home, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full fixed top-0 left-0 z-50 glass border-b border-gray-200/50">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-primary font-semibold text-xl"
          >
            <BookOpen className="h-6 w-6" />
            <span>TrackEdu</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors flex items-center space-x-1 hover:text-primary ${isActive('/') ? 'text-primary' : 'text-foreground/70'}`}
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors flex items-center space-x-1 hover:text-primary ${isActive('/dashboard') ? 'text-primary' : 'text-foreground/70'}`}
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                
                <Link 
                  to="/courses" 
                  className={`text-sm font-medium transition-colors flex items-center space-x-1 hover:text-primary ${isActive('/courses') ? 'text-primary' : 'text-foreground/70'}`}
                >
                  <BookOpen className="h-4 w-4" />
                  <span>Courses</span>
                </Link>
              </>
            )}
          </nav>
          
          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <div className="hidden md:block">
                  <span className="text-sm font-medium text-foreground/70">
                    {user?.name}
                  </span>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => logout()}
                  className="text-sm font-medium transition-colors flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden md:inline">Logout</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium"
                >
                  Login
                </Button>
                
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => navigate('/register')}
                  className="text-sm font-medium"
                >
                  Register
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
