
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { BookOpen, ChevronRight, Gauge, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/context/AuthContext';

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24">
        {/* Hero Section */}
        <section className="container px-4 md:px-6 py-12 md:py-24 flex flex-col items-center text-center">
          <div className="inline-block p-2 rounded-xl glass-dark bg-primary/5 mb-6 animate-fade-in">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight animate-fade-in">
            Track Your Learning Journey
          </h1>
          
          <p className="mt-4 max-w-[700px] text-lg text-muted-foreground animate-fade-in animate-delay-100">
            A comprehensive system to monitor your progress across different courses,
            track completed topics, and stay on top of your educational journey.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-8 animate-fade-in animate-delay-200">
            {isAuthenticated ? (
              <Button 
                size="lg" 
                onClick={() => navigate('/dashboard')}
                className="gap-2"
              >
                Go to Dashboard
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <>
                <Button 
                  size="lg" 
                  onClick={() => navigate('/register')}
                  className="gap-2"
                >
                  Get Started
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
              </>
            )}
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container px-4 md:px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-12 animate-fade-in">
              Why Track Your Progress?
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-lg glass hover-lift animate-fade-in">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Stay Organized</h3>
                <p className="text-muted-foreground">
                  Keep all your courses and progress in one place, making it easy to pick up where you left off.
                </p>
              </div>
              
              <div className="p-6 rounded-lg glass hover-lift animate-fade-in animate-delay-100">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <Gauge className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Measure Progress</h3>
                <p className="text-muted-foreground">
                  Visualize your advancement through courses with comprehensive progress tracking.
                </p>
              </div>
              
              <div className="p-6 rounded-lg glass hover-lift animate-fade-in animate-delay-200">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Structured Learning</h3>
                <p className="text-muted-foreground">
                  Break down your education into manageable topics and subtopics for more effective learning.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="container px-4 md:px-6 py-16 md:py-24 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 animate-fade-in">
            Ready to Start Tracking Your Progress?
          </h2>
          
          <p className="max-w-[600px] mx-auto text-muted-foreground mb-8 animate-fade-in animate-delay-100">
            Join thousands of students who are maximizing their learning potential through 
            organized progress tracking and structured learning paths.
          </p>
          
          <Button 
            size="lg" 
            onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
            className="animate-fade-in animate-delay-200"
          >
            {isAuthenticated ? 'Go to Dashboard' : 'Create Your Account'}
          </Button>
        </section>
      </main>
      
      <footer className="border-t bg-secondary/30 py-6">
        <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © 2023 TrackEdu. All rights reserved.
          </p>
          
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Terms of Service
            </a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
