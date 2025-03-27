
import { getDatabase, connectToMongoDB, isMongoDBConnected } from './mongoDb';

// Sample student data for database seeding
const testStudents = [
  {
    id: 'student-1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    overallProgress: 65,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 80 },
      { id: '2', name: 'Advanced JavaScript', progress: 50 },
    ]
  },
  {
    id: 'student-2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    overallProgress: 42,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 42 },
    ]
  },
  {
    id: 'student-3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    password: 'password123',
    overallProgress: 78,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 95 },
      { id: '3', name: 'React Fundamentals', progress: 60 },
    ]
  },
  {
    id: 'student-4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    overallProgress: 25,
    courses: [
      { id: '2', name: 'Advanced JavaScript', progress: 25 },
    ]
  },
  {
    id: 'student-5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    password: 'password123',
    overallProgress: 88,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 100 },
      { id: '2', name: 'Advanced JavaScript', progress: 85 },
      { id: '3', name: 'React Fundamentals', progress: 78 },
    ]
  }
];

/**
 * Seeds the MongoDB database with test student data
 * Only seeds if the database is connected and no students exist
 */
export const seedStudentData = async () => {
  if (!isMongoDBConnected()) {
    console.warn('MongoDB not connected. Cannot seed database.');
    return {
      success: false,
      message: 'MongoDB not connected. Please connect first.'
    };
  }

  try {
    const db = getDatabase();
    
    // Check if students already exist
    const existingStudentsCount = await db.collection('students').countDocuments();
    
    if (existingStudentsCount > 0) {
      console.log('Database already has students. Skipping seed operation.');
      return {
        success: false,
        message: 'Database already contains student data.'
      };
    }
    
    // Insert test students
    await db.collection('students').insertMany(testStudents);
    
    // Update course statistics based on student enrollments
    const courses = await db.collection('courses').find().toArray();
    
    for (const course of courses) {
      const studentsInCourse = testStudents.filter(student => 
        student.courses.some(c => c.id === course.id)
      );
      
      if (studentsInCourse.length > 0) {
        const averageProgress = Math.round(
          studentsInCourse.reduce((sum, student) => {
            const courseData = student.courses.find(c => c.id === course.id);
            return sum + (courseData?.progress || 0);
          }, 0) / studentsInCourse.length
        );
        
        await db.collection('courses').updateOne(
          { id: course.id },
          { $set: { 
              studentsCount: studentsInCourse.length,
              averageProgress: averageProgress
            } 
          }
        );
      }
    }
    
    console.log('Successfully seeded database with test student data.');
    return {
      success: true,
      message: 'Successfully seeded database with test student data.',
      students: testStudents
    };
  } catch (error) {
    console.error('Error seeding database:', error);
    return {
      success: false,
      message: `Error seeding database: ${error instanceof Error ? error.message : 'Unknown error'}`
    };
  }
};

/**
 * Provides login credentials for the test students
 */
export const getTestCredentials = () => {
  return testStudents.map(student => ({
    name: student.name,
    email: student.email,
    password: student.password
  }));
};
