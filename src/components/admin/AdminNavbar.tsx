
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Home, LogOut, Users, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

const AdminNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path);

  return (
    <header className="w-full fixed top-0 left-0 z-50 bg-sidebar border-b border-gray-200">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          <Link 
            to="/admin/dashboard" 
            className="flex items-center space-x-2 text-primary font-semibold text-xl"
          >
            <BookOpen className="h-6 w-6" />
            <span>TrackEdu Admin</span>
          </Link>
          
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/admin/dashboard" 
              className={`text-sm font-medium transition-colors flex items-center space-x-1 hover:text-primary ${isActive('/admin/dashboard') ? 'text-primary' : 'text-foreground/70'}`}
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>Dashboard</span>
            </Link>
            
            <Link 
              to="/admin/students" 
              className={`text-sm font-medium transition-colors flex items-center space-x-1 hover:text-primary ${isActive('/admin/students') ? 'text-primary' : 'text-foreground/70'}`}
            >
              <Users className="h-4 w-4" />
              <span>Students</span>
            </Link>
            
            <Link 
              to="/admin/courses" 
              className={`text-sm font-medium transition-colors flex items-center space-x-1 hover:text-primary ${isActive('/admin/courses') ? 'text-primary' : 'text-foreground/70'}`}
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </Link>
            
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors flex items-center space-x-1 hover:text-primary`}
            >
              <Home className="h-4 w-4" />
              <span>Main Site</span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
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
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;
