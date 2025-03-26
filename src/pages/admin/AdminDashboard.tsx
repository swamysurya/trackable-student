
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { getStudentAnalytics, getAllStudents } from '@/utils/adminApi';
import { Users, BookOpen, TrendingUp, Award } from 'lucide-react';

const AdminDashboard = () => {
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['studentAnalytics'],
    queryFn: getStudentAnalytics,
  });

  const { data: students, isLoading: isLoadingStudents } = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
  });
  
  const isLoading = isLoadingAnalytics || isLoadingStudents;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-16 mt-10">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <CardDescription>Overall registered students</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.totalStudents}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">Average Progress</CardTitle>
                    <CardDescription>Across all students</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.averageProgress}%</div>
                  <Progress value={analytics?.averageProgress} className="h-2 mt-2" />
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <CardDescription>Available in the platform</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.coursesBreakdown.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div className="space-y-1">
                    <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
                    <CardDescription>High achieving students</CardDescription>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Award className="h-5 w-5 text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{analytics?.topPerformers.length}</div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Course Progress</CardTitle>
                  <CardDescription>Average completion per course</CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analytics?.coursesBreakdown.map(course => ({
                        name: course.name,
                        progress: course.averageProgress,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={70}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="progress" fill="#3b82f6" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle>Student Highlights</CardTitle>
                  <CardDescription>Top performers and struggling students</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-green-600 flex items-center">
                        <Award className="h-4 w-4 mr-1" />
                        Top Performers
                      </h3>
                      <div className="space-y-2">
                        {analytics?.topPerformers.map(student => (
                          <div key={student.id} className="flex justify-between items-center p-2 rounded bg-green-50">
                            <span className="font-medium">{student.name}</span>
                            <div className="flex items-center">
                              <span className="font-medium text-green-600">{student.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-sm font-medium mb-2 text-amber-600 flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        Needs Attention
                      </h3>
                      <div className="space-y-2">
                        {analytics?.strugglingStudents.map(student => (
                          <div key={student.id} className="flex justify-between items-center p-2 rounded bg-amber-50">
                            <span className="font-medium">{student.name}</span>
                            <div className="flex items-center">
                              <span className="font-medium text-amber-600">{student.progress}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
