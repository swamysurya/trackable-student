
import { getDatabase } from '../mongodb';

// Helper function to ensure collections are setup
export const ensureCollectionsSetup = async () => {
  const db = getDatabase();
  
  // Check if courses collection exists and has data
  const coursesCount = await db.collection('courses').countDocuments();
  if (coursesCount === 0) {
    // Sample courses data for initial setup
    const sampleCoursesData = [
      { 
        id: '1', 
        name: 'Introduction to Web Development', 
        description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
        prerequisites: 'None',
        estimatedTime: '6 weeks',
        studentsCount: 0, 
        averageProgress: 0 
      },
      { 
        id: '2', 
        name: 'Advanced JavaScript', 
        description: 'Dive deeper into JavaScript with advanced concepts like closures, prototypes, and async programming.',
        prerequisites: 'Basic JavaScript knowledge',
        estimatedTime: '8 weeks',
        studentsCount: 0, 
        averageProgress: 0 
      },
      { 
        id: '3', 
        name: 'React Fundamentals', 
        description: 'Learn the fundamentals of React, including components, state, and props.',
        prerequisites: 'JavaScript proficiency',
        estimatedTime: '10 weeks',
        studentsCount: 0, 
        averageProgress: 0 
      },
    ];
    
    await db.collection('courses').insertMany(sampleCoursesData);
    console.log('Initialized courses collection with sample data');
  }
};

export const getStudentAnalytics = async () => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    // Get all students
    const students = await db.collection('students').find().toArray();
    
    // Get all courses
    const courses = await db.collection('courses').find().toArray();
    
    // Calculate analytics
    const totalStudents = students.length;
    
    // Calculate average progress across all students
    const averageProgress = totalStudents > 0 
      ? Math.round(
          students.reduce((sum, student) => sum + (student.overallProgress || 0), 0) / totalStudents
        )
      : 0;
    
    // Get top performers (top 2 students by progress)
    const topPerformers = students
      .sort((a, b) => (b.overallProgress || 0) - (a.overallProgress || 0))
      .slice(0, 2)
      .map(student => ({
        id: student.id,
        name: student.name,
        progress: student.overallProgress || 0
      }));
    
    // Get struggling students (students with progress < 30%)
    const strugglingStudents = students
      .filter(student => (student.overallProgress || 0) < 30)
      .map(student => ({
        id: student.id,
        name: student.name,
        progress: student.overallProgress || 0
      }));
    
    // Calculate course statistics
    const coursesBreakdown = courses.map(course => {
      // Get all students enrolled in this course
      const studentsInCourse = students.filter(student => 
        (student.courses || []).some((c: any) => c.id === course.id)
      );
      
      // Calculate average progress for this course
      const averageCourseProgress = studentsInCourse.length > 0
        ? Math.round(
            studentsInCourse.reduce((sum, student) => {
              const courseData = (student.courses || []).find((c: any) => c.id === course.id);
              return sum + (courseData?.progress || 0);
            }, 0) / studentsInCourse.length
          )
        : 0;
      
      return {
        id: course.id,
        name: course.name,
        studentsCount: studentsInCourse.length,
        averageProgress: averageCourseProgress,
        description: course.description,
        prerequisites: course.prerequisites,
        estimatedTime: course.estimatedTime
      };
    });
    
    return {
      totalStudents,
      averageProgress,
      coursesBreakdown,
      topPerformers,
      strugglingStudents,
    };
  } catch (error) {
    console.error('Error getting student analytics from MongoDB:', error);
    throw error;
  }
};
