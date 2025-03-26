
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart3, BookOpen, Layers } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import ProgressCard from '@/components/ProgressCard';
import { useAuth } from '@/context/AuthContext';
import { getStudentStats } from '@/utils/api';

interface CourseProgress {
  id: string;
  name: string;
  totalSubtopics: number;
  completedSubtopics: number;
  inProgressSubtopics: number;
  progressPercentage: number;
}

interface StudentStats {
  totalSubtopics: number;
  completedCount: number;
  inProgressCount: number;
  notStartedCount: number;
  overallProgress: number;
  courseProgress: CourseProgress[];
}

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<StudentStats | null>(null);
  
  useEffect(() => {
    const fetchStats = async () => {
      if (user) {
        try {
          const data = await getStudentStats(user.id);
          setStats(data);
        } catch (error) {
          console.error('Error fetching stats:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    fetchStats();
  }, [user]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-24 pb-16">
        <div className="container px-4 md:px-6">
          <header className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">
              Welcome back, {user?.name}
            </h1>
            <p className="text-muted-foreground mt-1 animate-fade-in animate-delay-100">
              Here's an overview of your learning progress
            </p>
          </header>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ProgressCard
              title="Overall Progress"
              totalItems={stats?.totalSubtopics || 0}
              completedItems={stats?.completedCount || 0}
              inProgressItems={stats?.inProgressCount || 0}
              icon={<BarChart3 className="h-5 w-5" />}
            />
            
            <Card className="glass hover-lift animate-fade-in animate-delay-100">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Active Courses</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[140px]">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-primary">
                      {stats?.courseProgress.length || 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Courses in progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass hover-lift animate-fade-in animate-delay-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Total Learning Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-[140px]">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl font-bold text-primary">
                      {stats?.totalSubtopics || 0}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Subtopics available</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Course Progress */}
          <h2 className="text-xl font-semibold mb-4 animate-fade-in">Course Progress</h2>
          
          {stats?.courseProgress && stats.courseProgress.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 animate-fade-in">
              {stats.courseProgress.map((course, index) => (
                <Card key={course.id} className="glass hover-lift overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                      <div className="mb-4 md:mb-0">
                        <h3 className="text-lg font-medium">{course.name}</h3>
                        <div className="flex items-center text-sm text-muted-foreground mt-1">
                          <Layers className="h-3 w-3 mr-1" />
                          <span>
                            {course.completedSubtopics} of {course.totalSubtopics} subtopics completed
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div className="w-32 hidden md:block">
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="font-medium">{course.progressPercentage}%</span>
                          </div>
                          <Progress value={course.progressPercentage} className="h-2" />
                        </div>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/courses/${course.id}`)}
                          className="ml-auto md:ml-0"
                        >
                          View Course
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-3 md:hidden">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">{course.progressPercentage}%</span>
                      </div>
                      <Progress value={course.progressPercentage} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="glass p-6 text-center animate-fade-in">
              <div className="flex flex-col items-center py-6">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">No courses started yet</h3>
                <p className="text-muted-foreground mb-4">
                  Explore available courses and start tracking your progress
                </p>
                <Button onClick={() => navigate('/courses')}>
                  Browse Courses
                </Button>
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
