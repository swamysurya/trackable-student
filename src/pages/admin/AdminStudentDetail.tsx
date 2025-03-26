
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Book, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { getStudentById } from '@/utils/adminApi';

const AdminStudentDetail = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId as string),
  });
  
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'text-red-500';
    if (progress < 70) return 'text-amber-500';
    return 'text-green-500';
  };
  
  const getProgressColorClass = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-16 mt-10">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/admin/students')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
          </div>
        ) : student ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{student.name}</h1>
                <p className="text-muted-foreground">{student.email}</p>
              </div>
              
              <div className="flex items-center p-4 bg-white rounded-lg shadow-sm">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Overall Progress</p>
                  <p className={`text-3xl font-bold ${getProgressColor(student.overallProgress)}`}>
                    {student.overallProgress}%
                  </p>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Progress Summary</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center p-4 bg-primary/5 rounded-lg">
                  <div className="rounded-full p-2 bg-primary/10 mr-4">
                    <Book className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                    <p className="text-2xl font-bold">{student.courses.length}</p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-green-500/5 rounded-lg">
                  <div className="rounded-full p-2 bg-green-500/10 mr-4">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Completed Courses</p>
                    <p className="text-2xl font-bold">
                      {student.courses.filter(c => c.progress === 100).length}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center p-4 bg-amber-500/5 rounded-lg">
                  <div className="rounded-full p-2 bg-amber-500/10 mr-4">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">In Progress Courses</p>
                    <p className="text-2xl font-bold">
                      {student.courses.filter(c => c.progress > 0 && c.progress < 100).length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <h2 className="text-2xl font-bold mt-8 mb-4">Course Progress</h2>
            <div className="grid gap-6">
              {student.courses.map(course => (
                <Card key={course.id} className="overflow-hidden">
                  <div className="relative">
                    <Progress 
                      value={course.progress} 
                      className="h-1 absolute top-0 left-0 right-0"
                      style={{
                        '--progress-foreground': getProgressColorClass(course.progress).replace('bg-', 'var(--')  + ')',
                      } as React.CSSProperties}
                    />
                  </div>
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-semibold">{course.name}</h3>
                        <div className="flex items-center mt-1">
                          <div 
                            className={`w-3 h-3 rounded-full ${getProgressColorClass(course.progress)} mr-2`}
                          ></div>
                          <span className="text-sm text-muted-foreground">
                            {course.progress === 100 ? 'Completed' : 
                              course.progress > 0 ? 'In Progress' : 'Not Started'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Progress</p>
                          <p className={`text-lg font-bold ${getProgressColor(course.progress)}`}>
                            {course.progress}%
                          </p>
                        </div>
                        
                        <Progress 
                          value={course.progress} 
                          className="w-24 h-2"
                          style={{
                            '--progress-foreground': getProgressColorClass(course.progress).replace('bg-', 'var(--')  + ')',
                          } as React.CSSProperties}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Student not found.</p>
            <Button 
              onClick={() => navigate('/admin/students')} 
              className="mt-4"
            >
              Return to Students
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminStudentDetail;
