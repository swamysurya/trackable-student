
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, User, BookOpen } from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { getStudentById } from '@/utils/adminApi';

const AdminStudentDetail = () => {
  const { studentId } = useParams<{ studentId: string }>();
  const navigate = useNavigate();
  
  const { data: student, isLoading } = useQuery({
    queryKey: ['student', studentId],
    queryFn: () => getStudentById(studentId!),
    enabled: !!studentId,
  });
  
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <main className="container mx-auto px-4 py-16 mt-10">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </main>
      </div>
    );
  }
  
  if (!student) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <main className="container mx-auto px-4 py-16 mt-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Student not found</h1>
            <Button onClick={() => navigate('/admin/students')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Button>
          </div>
        </main>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-16 mt-10">
        <Button 
          variant="ghost" 
          className="mb-6" 
          onClick={() => navigate('/admin/students')}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Students
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Student Profile</CardTitle>
                <CardDescription>Student information and progress</CardDescription>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Full Name</h3>
                  <p className="text-lg font-medium">{student.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Email Address</h3>
                  <p className="text-lg font-medium">{student.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Enrolled Courses</h3>
                  <p className="text-lg font-medium">{student.courses.length}</p>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Overall Progress</h3>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Completion Rate</span>
                    <span className="font-medium">{student.overallProgress}%</span>
                  </div>
                  <Progress 
                    value={student.overallProgress} 
                    className="h-2"
                    indicatorClassName={getProgressColor(student.overallProgress)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl font-bold">Course Progress</CardTitle>
                  <CardDescription>Detailed progress for each enrolled course</CardDescription>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Course Name</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {student.courses.map((course) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">{course.name}</TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{course.progress}%</span>
                          </div>
                          <Progress 
                            value={course.progress} 
                            className="h-2"
                            indicatorClassName={getProgressColor(course.progress)}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={`px-2 py-1 text-xs rounded-full text-center font-medium
                          ${course.progress === 100 
                            ? 'bg-green-100 text-green-800' 
                            : course.progress > 0 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {course.progress === 100 
                            ? 'Completed' 
                            : course.progress > 0 
                              ? 'In Progress' 
                              : 'Not Started'
                          }
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminStudentDetail;
