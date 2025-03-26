
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BookOpen, Users, Edit, Trash2 } from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { getCourseById, getStudentAnalytics } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';
import { deleteCourse } from '@/utils/adminApi';

const AdminCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: course, isLoading: isLoadingCourse } = useQuery({
    queryKey: ['course', courseId],
    queryFn: () => getCourseById(courseId || ''),
    enabled: !!courseId,
  });
  
  const { data: analytics, isLoading: isLoadingAnalytics } = useQuery({
    queryKey: ['courseAnalytics'],
    queryFn: getStudentAnalytics,
  });
  
  const isLoading = isLoadingCourse || isLoadingAnalytics;
  
  const courseAnalytics = analytics?.coursesBreakdown?.find(c => c.id === courseId);
  
  const handleDeleteCourse = async () => {
    if (!courseId) return;
    
    if (confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      try {
        await deleteCourse(courseId);
        toast({
          title: 'Course deleted',
          description: 'The course has been successfully deleted.',
        });
        navigate('/admin/courses');
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to delete the course. Please try again.',
          variant: 'destructive',
        });
      }
    }
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
  
  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />
        <main className="container mx-auto px-4 py-16 mt-10">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Course not found</h1>
            <Button onClick={() => navigate('/admin/courses')}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Courses
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/courses')}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Courses
          </Button>
          
          <div className="flex items-center gap-3 mt-4 md:mt-0">
            <Button 
              variant="outline" 
              onClick={() => navigate(`/admin/courses/${courseId}/edit`)}
            >
              <Edit className="mr-2 h-4 w-4" />
              Edit Course
            </Button>
            
            <Button 
              variant="destructive" 
              onClick={handleDeleteCourse}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Course
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader className="flex flex-row items-start justify-between pb-2">
              <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Course Details</CardTitle>
                <CardDescription>Information about this course</CardDescription>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Course Name</h3>
                  <p className="text-lg font-medium">{course.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Description</h3>
                  <p className="text-base">{course.description}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Prerequisites</h3>
                  {course.prerequisites.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-1">
                      {course.prerequisites.map((prereq, index) => (
                        <li key={index} className="text-base">{prereq}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-base">None</p>
                  )}
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Estimated Time</h3>
                  <p className="text-base">{course.estimatedTime}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Student Enrollment</h3>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-primary" />
                    <p className="text-base">{courseAnalytics?.studentsCount || 0} students enrolled</p>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">Average Progress</h3>
                  <p className="text-base">{courseAnalytics?.averageProgress || 0}% completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Topic Structure</CardTitle>
              <CardDescription>All topics and subtopics in this course</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {course.topics.map((topic, topicIndex) => (
                  <div key={topic.id} className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4">
                      {topicIndex + 1}. {topic.name}
                    </h3>
                    
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50px]">No.</TableHead>
                          <TableHead>Subtopic Name</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topic.subtopics.map((subtopic, subtopicIndex) => (
                          <TableRow key={subtopic.id}>
                            <TableCell className="font-medium">{subtopicIndex + 1}</TableCell>
                            <TableCell>{subtopic.name}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default AdminCourseDetail;
