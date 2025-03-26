
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, Clock, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import SubtopicItem from '@/components/SubtopicItem';
import { getCourseById, getProgressForStudent, updateProgress } from '@/utils/api';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Subtopic {
  id: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
}

interface Topic {
  id: string;
  name: string;
  subtopics: Subtopic[];
}

interface Course {
  id: string;
  name: string;
  description: string;
  prerequisites: string[];
  estimatedTime: string;
  topics: Topic[];
}

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState({
    totalSubtopics: 0,
    completedSubtopics: 0,
    inProgressSubtopics: 0,
    notStartedSubtopics: 0,
    progressPercentage: 0,
  });
  
  useEffect(() => {
    const fetchData = async () => {
      if (!courseId || !user) return;
      
      try {
        const courseData = await getCourseById(courseId);
        const progressData = await getProgressForStudent(user.id);
        
        // Create a map of subtopic status from progress data
        const subtopicStatusMap: Record<string, 'Not Started' | 'In Progress' | 'Completed'> = {};
        progressData.forEach(item => {
          subtopicStatusMap[item.subtopicId] = item.status;
        });
        
        // Add status to each subtopic
        const courseWithStatus = {
          ...courseData,
          topics: courseData.topics.map(topic => ({
            ...topic,
            subtopics: topic.subtopics.map(subtopic => ({
              ...subtopic,
              status: subtopicStatusMap[subtopic.id] || 'Not Started',
            })),
          })),
        };
        
        setCourse(courseWithStatus);
        
        // Calculate progress statistics
        const totalSubtopics = courseWithStatus.topics.reduce(
          (count, topic) => count + topic.subtopics.length, 
          0
        );
        
        const completedSubtopics = courseWithStatus.topics.reduce(
          (count, topic) => count + topic.subtopics.filter(
            subtopic => subtopic.status === 'Completed'
          ).length, 
          0
        );
        
        const inProgressSubtopics = courseWithStatus.topics.reduce(
          (count, topic) => count + topic.subtopics.filter(
            subtopic => subtopic.status === 'In Progress'
          ).length, 
          0
        );
        
        const notStartedSubtopics = totalSubtopics - completedSubtopics - inProgressSubtopics;
        const progressPercentage = totalSubtopics > 0 
          ? Math.round((completedSubtopics / totalSubtopics) * 100) 
          : 0;
        
        setProgress({
          totalSubtopics,
          completedSubtopics,
          inProgressSubtopics,
          notStartedSubtopics,
          progressPercentage,
        });
      } catch (error) {
        console.error('Error fetching course:', error);
        toast({
          title: 'Error',
          description: 'Failed to load the course. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [courseId, user, toast]);
  
  const handleStatusChange = async (
    subtopicId: string, 
    status: 'Not Started' | 'In Progress' | 'Completed'
  ) => {
    if (!user) return;
    
    try {
      await updateProgress(user.id, subtopicId, status);
      
      // Update local state
      if (course) {
        const updatedCourse = {
          ...course,
          topics: course.topics.map(topic => ({
            ...topic,
            subtopics: topic.subtopics.map(subtopic => 
              subtopic.id === subtopicId 
                ? { ...subtopic, status } 
                : subtopic
            ),
          })),
        };
        
        setCourse(updatedCourse);
        
        // Recalculate progress statistics
        const totalSubtopics = updatedCourse.topics.reduce(
          (count, topic) => count + topic.subtopics.length, 
          0
        );
        
        const completedSubtopics = updatedCourse.topics.reduce(
          (count, topic) => count + topic.subtopics.filter(
            subtopic => subtopic.status === 'Completed'
          ).length, 
          0
        );
        
        const inProgressSubtopics = updatedCourse.topics.reduce(
          (count, topic) => count + topic.subtopics.filter(
            subtopic => subtopic.status === 'In Progress'
          ).length, 
          0
        );
        
        const notStartedSubtopics = totalSubtopics - completedSubtopics - inProgressSubtopics;
        const progressPercentage = totalSubtopics > 0 
          ? Math.round((completedSubtopics / totalSubtopics) * 100) 
          : 0;
        
        setProgress({
          totalSubtopics,
          completedSubtopics,
          inProgressSubtopics,
          notStartedSubtopics,
          progressPercentage,
        });
        
        toast({
          title: 'Progress updated',
          description: `Item marked as ${status}`,
        });
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      toast({
        title: 'Error',
        description: 'Failed to update progress. Please try again.',
        variant: 'destructive',
      });
    }
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-2"></div>
            <p className="text-muted-foreground">Loading course details...</p>
          </div>
        </main>
      </div>
    );
  }
  
  if (!course) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Course Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The course you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate('/courses')}>
              Back to Courses
            </Button>
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
          <div className="mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => navigate('/courses')}
              className="mb-4 -ml-2"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Courses
            </Button>
            
            <h1 className="text-3xl font-bold tracking-tight animate-fade-in">
              {course.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 mt-3 animate-fade-in animate-delay-100">
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="h-4 w-4 mr-1" />
                <span>{course.estimatedTime}</span>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground">
                <BookOpen className="h-4 w-4 mr-1" />
                <span>{course.topics.length} Topics</span>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="col-span-2 animate-fade-in animate-delay-100">
              <div className="glass p-6 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-2">Course Description</h2>
                <p className="text-muted-foreground">{course.description}</p>
                
                {course.prerequisites.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium mb-2">Prerequisites:</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.prerequisites.map((prerequisite, index) => (
                        <Badge key={index} variant="outline">
                          {prerequisite}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="glass rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Course Content</h2>
                
                <Accordion type="multiple" className="space-y-2">
                  {course.topics.map((topic) => (
                    <AccordionItem 
                      key={topic.id} 
                      value={topic.id}
                      className="border border-border rounded-md overflow-hidden bg-white/50 backdrop-blur-sm"
                    >
                      <AccordionTrigger className="px-4 py-3 hover:no-underline">
                        <div className="flex justify-between items-center w-full pr-4">
                          <span className="font-medium">{topic.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {topic.subtopics.filter(s => s.status === 'Completed').length} / {topic.subtopics.length} completed
                          </span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="space-y-2">
                          {topic.subtopics.map((subtopic) => (
                            <SubtopicItem
                              key={subtopic.id}
                              id={subtopic.id}
                              name={subtopic.name}
                              status={subtopic.status}
                              onStatusChange={handleStatusChange}
                            />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
            
            <div className="animate-fade-in animate-delay-200">
              <div className="glass rounded-lg p-6 sticky top-24">
                <h2 className="text-xl font-semibold mb-4">Your Progress</h2>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Overall Completion</span>
                      <span className="font-medium">{progress.progressPercentage}%</span>
                    </div>
                    <Progress value={progress.progressPercentage} className="h-2" />
                  </div>
                  
                  <Separator />
                  
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Completed</span>
                      <Badge variant="outline" className="progress-completed">
                        {progress.completedSubtopics} of {progress.totalSubtopics}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">In Progress</span>
                      <Badge variant="outline" className="progress-in-progress">
                        {progress.inProgressSubtopics} of {progress.totalSubtopics}
                      </Badge>
                    </div>
                    
                    <div className="flex justify-between py-2">
                      <span className="text-sm text-muted-foreground">Not Started</span>
                      <Badge variant="outline" className="progress-not-started">
                        {progress.notStartedSubtopics} of {progress.totalSubtopics}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseDetail;
