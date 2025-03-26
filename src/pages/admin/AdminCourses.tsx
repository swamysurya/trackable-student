
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '@/components/admin/AdminNavbar';
import AdminCourseCard from '@/components/admin/AdminCourseCard';
import { getStudentAnalytics } from '@/utils/adminApi';

const AdminCourses = () => {
  const navigate = useNavigate();
  
  const { data, isLoading } = useQuery({
    queryKey: ['courseAnalytics'],
    queryFn: getStudentAnalytics,
  });
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-16 mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Courses</h1>
          
          <Button onClick={() => navigate('/admin/courses/new')}>
            <Plus className="mr-2 h-4 w-4" />
            Add New Course
          </Button>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : data?.coursesBreakdown && data.coursesBreakdown.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.coursesBreakdown.map(course => (
              <AdminCourseCard
                key={course.id}
                id={course.id}
                name={course.name}
                description={`A comprehensive course with ${course.studentsCount} enrolled students`}
                studentsCount={course.studentsCount}
                averageProgress={course.averageProgress}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">No courses found.</p>
            <Button onClick={() => navigate('/admin/courses/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Course
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminCourses;
