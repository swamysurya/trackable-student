
import { getDatabase } from './mongoDb';

// We need to define delay directly in this file instead of importing it
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Sample student data for initial setup if no data exists in MongoDB
const sampleStudentsData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    overallProgress: 35,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 60 },
      { id: '2', name: 'Advanced JavaScript', progress: 25 },
      { id: '3', name: 'React Fundamentals', progress: 10 },
    ],
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    overallProgress: 72,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 100 },
      { id: '2', name: 'Advanced JavaScript', progress: 85 },
      { id: '3', name: 'React Fundamentals', progress: 30 },
    ],
  },
  {
    id: '3',
    name: 'Robert Johnson',
    email: 'robert@example.com',
    password: 'password123',
    overallProgress: 45,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 75 },
      { id: '2', name: 'Advanced JavaScript', progress: 40 },
      { id: '3', name: 'React Fundamentals', progress: 20 },
    ],
  },
  {
    id: '4',
    name: 'Emily Davis',
    email: 'emily@example.com',
    password: 'password123',
    overallProgress: 90,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 100 },
      { id: '2', name: 'Advanced JavaScript', progress: 95 },
      { id: '3', name: 'React Fundamentals', progress: 75 },
    ],
  },
  {
    id: '5',
    name: 'Michael Wilson',
    email: 'michael@example.com',
    password: 'password123',
    overallProgress: 20,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 40 },
      { id: '2', name: 'Advanced JavaScript', progress: 15 },
      { id: '3', name: 'React Fundamentals', progress: 5 },
    ],
  },
];

// Sample courses data for initial setup
const sampleCoursesData = [
  { 
    id: '1', 
    name: 'Introduction to Web Development', 
    description: 'Learn the basics of web development including HTML, CSS, and JavaScript.',
    prerequisites: 'None',
    estimatedTime: '6 weeks',
    studentsCount: 5, 
    averageProgress: 75 
  },
  { 
    id: '2', 
    name: 'Advanced JavaScript', 
    description: 'Dive deeper into JavaScript with advanced concepts like closures, prototypes, and async programming.',
    prerequisites: 'Basic JavaScript knowledge',
    estimatedTime: '8 weeks',
    studentsCount: 5, 
    averageProgress: 52 
  },
  { 
    id: '3', 
    name: 'React Fundamentals', 
    description: 'Learn the fundamentals of React, including components, state, and props.',
    prerequisites: 'JavaScript proficiency',
    estimatedTime: '10 weeks',
    studentsCount: 5, 
    averageProgress: 28 
  },
];

// Helper function to ensure collections are setup
const ensureCollectionsSetup = async () => {
  const db = getDatabase();
  
  // Check if students collection exists and has data
  const studentsCount = await db.collection('students').countDocuments();
  if (studentsCount === 0) {
    await db.collection('students').insertMany(sampleStudentsData);
    console.log('Initialized students collection with sample data');
  }
  
  // Check if courses collection exists and has data
  const coursesCount = await db.collection('courses').countDocuments();
  if (coursesCount === 0) {
    await db.collection('courses').insertMany(sampleCoursesData);
    console.log('Initialized courses collection with sample data');
  }
};

// Admin API functions
export const getAllStudents = async () => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    const students = await db.collection('students').find({}).toArray();
    return students;
  } catch (error) {
    console.error('Error fetching students from MongoDB:', error);
    throw error;
  }
};

export const getStudentById = async (studentId: string) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    const student = await db.collection('students').findOne({ id: studentId });
    
    if (!student) {
      throw new Error('Student not found');
    }
    
    return student;
  } catch (error) {
    console.error('Error fetching student by ID from MongoDB:', error);
    throw error;
  }
};

export const adminLogin = async (email: string, password: string) => {
  try {
    // In a real app, this would verify against admin credentials stored in MongoDB
    if (email === 'admin@example.com' && password === 'admin123') {
      return {
        token: 'admin-mock-token-' + Date.now(),
        user: {
          id: 'admin1',
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'Admin',
        },
      };
    }
    
    throw new Error('Invalid admin credentials');
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};

// Function to get student analytics
export const getStudentAnalytics = async () => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    // Get all students
    const students = await db.collection('students').find({}).toArray();
    
    // Get all courses
    const courses = await db.collection('courses').find({}).toArray();
    
    // Calculate analytics
    const totalStudents = students.length;
    
    // Calculate average progress across all students
    const averageProgress = Math.round(
      students.reduce((sum, student) => sum + student.overallProgress, 0) / totalStudents
    );
    
    // Get top performers (top 2 students by progress)
    const topPerformers = students
      .sort((a, b) => b.overallProgress - a.overallProgress)
      .slice(0, 2)
      .map(student => ({
        id: student.id,
        name: student.name,
        progress: student.overallProgress
      }));
    
    // Get struggling students (students with progress < 30%)
    const strugglingStudents = students
      .filter(student => student.overallProgress < 30)
      .map(student => ({
        id: student.id,
        name: student.name,
        progress: student.overallProgress
      }));
    
    return {
      totalStudents,
      averageProgress,
      coursesBreakdown: courses.map(course => ({
        id: course.id,
        name: course.name,
        studentsCount: course.studentsCount || 0,
        averageProgress: course.averageProgress || 0,
        description: course.description,
        prerequisites: course.prerequisites,
        estimatedTime: course.estimatedTime
      })),
      topPerformers,
      strugglingStudents,
    };
  } catch (error) {
    console.error('Error getting student analytics from MongoDB:', error);
    throw error;
  }
};

// Function to update course details
export const updateCourse = async (courseId: string, courseData: any) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    const result = await db.collection('courses').updateOne(
      { id: courseId },
      { $set: courseData }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('Course not found');
    }
    
    return {
      success: true,
      message: 'Course updated successfully',
    };
  } catch (error) {
    console.error('Error updating course in MongoDB:', error);
    throw error;
  }
};

// Function to create a new course
export const createCourse = async (courseData: any) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    // Generate a unique ID
    const courseId = 'course-' + Date.now();
    
    const newCourse = {
      id: courseId,
      ...courseData,
      studentsCount: 0,
      averageProgress: 0
    };
    
    await db.collection('courses').insertOne(newCourse);
    
    return {
      success: true,
      message: 'Course created successfully',
      courseId,
    };
  } catch (error) {
    console.error('Error creating course in MongoDB:', error);
    throw error;
  }
};

// Function to delete a course
export const deleteCourse = async (courseId: string) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    const result = await db.collection('courses').deleteOne({ id: courseId });
    
    if (result.deletedCount === 0) {
      throw new Error('Course not found');
    }
    
    return {
      success: true,
      message: 'Course deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting course from MongoDB:', error);
    throw error;
  }
};

// New function to add a student
export const addStudent = async (studentData: any) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    // Generate a unique ID
    const studentId = 'student-' + Date.now();
    
    const newStudent = {
      id: studentId,
      ...studentData,
      overallProgress: 0,
      courses: []
    };
    
    await db.collection('students').insertOne(newStudent);
    
    return {
      success: true,
      message: 'Student added successfully',
      studentId,
    };
  } catch (error) {
    console.error('Error adding student to MongoDB:', error);
    throw error;
  }
};

// Function to update student progress
export const updateStudentProgress = async (studentId: string, courseId: string, progress: number) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    // First, check if the student exists
    const student = await db.collection('students').findOne({ id: studentId });
    
    if (!student) {
      throw new Error('Student not found');
    }
    
    // Check if the student already has progress for this course
    const courseIndex = student.courses.findIndex((c: any) => c.id === courseId);
    
    if (courseIndex >= 0) {
      // Update existing course progress
      await db.collection('students').updateOne(
        { id: studentId, "courses.id": courseId },
        { $set: { "courses.$.progress": progress } }
      );
    } else {
      // Get course name
      const course = await db.collection('courses').findOne({ id: courseId });
      
      if (!course) {
        throw new Error('Course not found');
      }
      
      // Add new course progress
      await db.collection('students').updateOne(
        { id: studentId },
        { $push: { courses: { id: courseId, name: course.name, progress } } }
      );
    }
    
    // Update overall progress (average of all courses)
    const updatedStudent = await db.collection('students').findOne({ id: studentId });
    const overallProgress = Math.round(
      updatedStudent.courses.reduce((sum: number, c: any) => sum + c.progress, 0) / 
      updatedStudent.courses.length
    );
    
    await db.collection('students').updateOne(
      { id: studentId },
      { $set: { overallProgress } }
    );
    
    // Update course's average progress
    const allStudentsForCourse = await db.collection('students')
      .find({ "courses.id": courseId })
      .toArray();
    
    const courseAverageProgress = Math.round(
      allStudentsForCourse.reduce((sum, s) => {
        const courseProgress = s.courses.find((c: any) => c.id === courseId)?.progress || 0;
        return sum + courseProgress;
      }, 0) / allStudentsForCourse.length
    );
    
    await db.collection('courses').updateOne(
      { id: courseId },
      { 
        $set: { 
          averageProgress: courseAverageProgress,
          studentsCount: allStudentsForCourse.length 
        } 
      }
    );
    
    return {
      success: true,
      message: 'Student progress updated successfully',
    };
  } catch (error) {
    console.error('Error updating student progress in MongoDB:', error);
    throw error;
  }
};
