
import React, { useEffect, useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { getCourses, getProgressForStudent } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';

interface Course {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  estimatedTime: string;
  topicsCount: number;
  subtopicsCount: number;
}

const Courses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [progressData, setProgressData] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const coursesData = await getCourses();
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        
        if (user) {
          const progress = await getProgressForStudent(user.id);
          
          // Calculate progress percentage for each course
          const progressBySubtopic = progress.reduce((acc: Record<string, string>, item) => {
            acc[item.subtopicId] = item.status;
            return acc;
          }, {});
          
          // Group subtopics by course and calculate progress
          const courseProgress: Record<string, number> = {};
          
          coursesData.forEach(course => {
            // This is a simplification - in reality, we would need to know which subtopics belong to which course
            // For this mock, we'll use the course ID prefix in the subtopic ID
            const courseSubtopicIds = Object.keys(progressBySubtopic).filter(id => 
              id.startsWith(course.id)
            );
            
            const completedCount = courseSubtopicIds.filter(id => 
              progressBySubtopic[id] === 'Completed'
            ).length;
            
            courseProgress[course.id] = course.subtopicsCount > 0 
              ? Math.round((completedCount / course.subtopicsCount) * 100) 
              : 0;
          });
          
          setProgressData(courseProgress);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [user]);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = courses.filter(course => 
        course.name.toLowerCase().includes(query) || 
        course.description.toLowerCase().includes(query)
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
            <p className="text-muted-foreground">Loading courses...</p>
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
              Available Courses
            </h1>
            <p className="text-muted-foreground mt-1 animate-fade-in animate-delay-100">
              Browse and track your progress across various learning paths
            </p>
          </header>
          
          <div className="relative mb-8 max-w-md mx-auto md:mx-0 animate-fade-in animate-delay-200">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          {filteredCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course, index) => (
                <CourseCard
                  key={course.id}
                  id={course.id}
                  title={course.name}
                  description={course.description}
                  estimatedTime={course.estimatedTime}
                  progress={progressData[course.id] || 0}
                  topics={course.topicsCount}
                  prerequisites={course.prerequisites}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 animate-fade-in">
              <h3 className="text-lg font-medium mb-2">No courses found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or check back later for new courses
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Courses;
