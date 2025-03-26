
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ChevronLeft, Edit, Save, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import AdminNavbar from '@/components/admin/AdminNavbar';
import { getStudentAnalytics, updateCourse, deleteCourse } from '@/utils/adminApi';
import { useToast } from '@/hooks/use-toast';

const AdminCourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [courseData, setCourseData] = useState({
    name: '',
    description: '',
    prerequisites: '',
    estimatedTime: '',
  });
  
  const { data, isLoading } = useQuery({
    queryKey: ['courseDetails', courseId],
    queryFn: getStudentAnalytics
  });
  
  // Move the onSuccess logic to a useEffect that depends on the data
  useEffect(() => {
    if (data?.coursesBreakdown) {
      const course = data.coursesBreakdown.find((c: any) => c.id === courseId);
      if (course) {
        setCourseData({
          name: course.name,
          description: course.description || 'A comprehensive course for students',
          prerequisites: 'None',
          estimatedTime: '8 weeks',
        });
      }
    }
  }, [data, courseId]);
  
  const handleSave = async () => {
    try {
      await updateCourse(courseId as string, courseData);
      setIsEditing(false);
      toast({
        title: 'Course updated',
        description: 'The course has been successfully updated.',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update the course. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      try {
        await deleteCourse(courseId as string);
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
  
  const selectedCourse = data?.coursesBreakdown?.find((c: any) => c.id === courseId);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-16 mt-10">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/admin/courses')}
        >
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back to Courses
        </Button>
        
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-10 w-1/3 bg-gray-200 rounded mb-4"></div>
            <div className="h-40 bg-gray-200 rounded mb-6"></div>
            <div className="h-8 w-48 bg-gray-200 rounded"></div>
          </div>
        ) : selectedCourse ? (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">
                {isEditing ? (
                  <Input 
                    value={courseData.name}
                    onChange={e => setCourseData({...courseData, name: e.target.value})}
                    className="text-3xl font-bold h-auto py-1 px-2"
                  />
                ) : (
                  courseData.name
                )}
              </h1>
              
              <div className="flex space-x-2">
                {isEditing ? (
                  <Button onClick={handleSave}>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </Button>
                ) : (
                  <Button onClick={() => setIsEditing(true)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Course
                  </Button>
                )}
                <Button 
                  variant="destructive" 
                  onClick={handleDelete}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 space-y-6">
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Description</h2>
                  {isEditing ? (
                    <Textarea 
                      value={courseData.description}
                      onChange={e => setCourseData({...courseData, description: e.target.value})}
                      className="min-h-[150px]"
                    />
                  ) : (
                    <p className="text-gray-700">{courseData.description}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Prerequisites</h2>
                  {isEditing ? (
                    <Input 
                      value={courseData.prerequisites}
                      onChange={e => setCourseData({...courseData, prerequisites: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-700">{courseData.prerequisites}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">Estimated Time</h2>
                  {isEditing ? (
                    <Input 
                      value={courseData.estimatedTime}
                      onChange={e => setCourseData({...courseData, estimatedTime: e.target.value})}
                    />
                  ) : (
                    <p className="text-gray-700">{courseData.estimatedTime}</p>
                  )}
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm space-y-4">
                <h2 className="text-xl font-semibold">Course Stats</h2>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Enrolled Students</span>
                      <span className="text-sm font-medium">{selectedCourse.studentsCount}</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-muted-foreground">Average Progress</span>
                      <span className="text-sm font-medium">{selectedCourse.averageProgress}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Course not found.</p>
            <Button 
              onClick={() => navigate('/admin/courses')} 
              className="mt-4"
            >
              Return to Courses
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCourseDetail;
