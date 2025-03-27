
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check } from 'lucide-react';
import { getDatabase } from '@/utils/mongoDb';
import { useToast } from '@/hooks/use-toast';

const DatabaseSeeder = () => {
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedingResult, setSeedingResult] = useState<{ success: boolean; message: string } | null>(null);
  const { toast } = useToast();

  const sampleStudentsData = [
    {
      id: 'student-1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      password: 'password123',
      overallProgress: 75,
      courses: [
        { id: '1', name: 'Introduction to Web Development', progress: 85 },
        { id: '2', name: 'Advanced JavaScript', progress: 65 }
      ]
    },
    {
      id: 'student-2',
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      password: 'password123',
      overallProgress: 62,
      courses: [
        { id: '1', name: 'Introduction to Web Development', progress: 92 },
        { id: '3', name: 'React Fundamentals', progress: 32 }
      ]
    },
    {
      id: 'student-3',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      password: 'password123',
      overallProgress: 28,
      courses: [
        { id: '2', name: 'Advanced JavaScript', progress: 28 }
      ]
    },
    {
      id: 'student-4',
      name: 'Sarah Wilson',
      email: 'sarah.wilson@example.com',
      password: 'password123',
      overallProgress: 95,
      courses: [
        { id: '1', name: 'Introduction to Web Development', progress: 100 },
        { id: '2', name: 'Advanced JavaScript', progress: 88 },
        { id: '3', name: 'React Fundamentals', progress: 97 }
      ]
    },
    {
      id: 'student-5',
      name: 'David Lee',
      email: 'david.lee@example.com',
      password: 'password123',
      overallProgress: 15,
      courses: [
        { id: '1', name: 'Introduction to Web Development', progress: 15 }
      ]
    }
  ];

  const seedDatabase = async () => {
    setIsSeeding(true);
    setSeedingResult(null);

    try {
      const db = getDatabase();
      
      // Clear existing student data
      const existingStudents = await db.collection('students').find().toArray();
      for (const student of existingStudents) {
        await db.collection('students').deleteOne({ id: student.id });
      }

      // Insert sample students
      for (const student of sampleStudentsData) {
        await db.collection('students').insertOne(student);
      }

      // Update course stats
      const courses = await db.collection('courses').find().toArray();
      
      for (const course of courses) {
        const studentsInCourse = sampleStudentsData.filter(student => 
          student.courses.some(c => c.id === course.id)
        );
        
        const averageCourseProgress = studentsInCourse.length > 0
          ? Math.round(
              studentsInCourse.reduce((sum, student) => {
                const courseData = student.courses.find(c => c.id === course.id);
                return sum + (courseData?.progress || 0);
              }, 0) / studentsInCourse.length
            )
          : 0;
        
        await db.collection('courses').updateOne(
          { id: course.id },
          { 
            $set: { 
              averageProgress: averageCourseProgress,
              studentsCount: studentsInCourse.length 
            } 
          }
        );
      }

      setSeedingResult({
        success: true,
        message: 'Database successfully seeded with 5 sample students and updated course stats.'
      });
      
      toast({
        title: 'Database Seeded',
        description: 'Successfully added 5 sample students to the database.',
      });
    } catch (error) {
      console.error('Error seeding database:', error);
      setSeedingResult({
        success: false,
        message: `Failed to seed database: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
      
      toast({
        variant: 'destructive',
        title: 'Seeding Failed',
        description: 'There was an error seeding the database.',
      });
    } finally {
      setIsSeeding(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Database Seeder</CardTitle>
        <CardDescription>
          Populate the database with sample student data for testing purposes.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          This will add 5 sample students with various course progress levels to the database.
          This is useful for testing the admin dashboard and student management features.
        </p>
        
        {seedingResult && (
          <Alert className={seedingResult.success ? "border-green-500" : "border-destructive"}>
            <div className="flex items-center gap-2">
              {seedingResult.success ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-destructive" />
              )}
              <AlertTitle>{seedingResult.success ? 'Success' : 'Error'}</AlertTitle>
            </div>
            <AlertDescription>{seedingResult.message}</AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          onClick={seedDatabase} 
          disabled={isSeeding}
          variant="default"
          className="w-full"
        >
          {isSeeding ? 'Seeding Database...' : 'Seed Database with Sample Data'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DatabaseSeeder;
