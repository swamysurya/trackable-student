import { getDatabase } from './mongoDb';

// We need to define delay directly in this file instead of importing it
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper function to ensure collections are setup
const ensureCollectionsSetup = async () => {
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

// Admin API functions
export const getAllStudents = async () => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    const students = await db.collection('students').find().toArray();
    
    // Process students to ensure they have courses
    const processedStudents = await Promise.all(students.map(async (student) => {
      // If student doesn't have courses, assign empty array
      if (!student.courses) {
        student.courses = [];
      }
      
      // If student doesn't have overall progress, calculate it
      if (student.overallProgress === undefined) {
        const courses = student.courses || [];
        student.overallProgress = courses.length > 0 
          ? Math.round(courses.reduce((sum: number, c: any) => sum + (c.progress || 0), 0) / courses.length) 
          : 0;
      }
      
      return student;
    }));
    
    return processedStudents;
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
    
    // Ensure student has courses
    if (!student.courses) {
      student.courses = [];
    }
    
    // If student doesn't have overall progress, calculate it
    if (student.overallProgress === undefined) {
      const courses = student.courses || [];
      student.overallProgress = courses.length > 0 
        ? Math.round(courses.reduce((sum: number, c: any) => sum + (c.progress || 0), 0) / courses.length) 
        : 0;
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

// Function to add a student
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
    const courseIndex = (student.courses || []).findIndex((c: any) => c.id === courseId);
    
    if (courseIndex >= 0) {
      // Update existing course progress - using filter with id property only
      await db.collection('students').updateOne(
        { id: studentId },
        { $set: { [`courses.${courseIndex}.progress`]: progress } }
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
    const courses = updatedStudent.courses || [];
    const overallProgress = courses.length > 0
      ? Math.round(
          courses.reduce((sum: number, c: any) => sum + c.progress, 0) / 
          courses.length
        )
      : 0;
    
    await db.collection('students').updateOne(
      { id: studentId },
      { $set: { overallProgress } }
    );
    
    // Update course's average progress
    const allStudentsForCourse = await db.collection('students')
      .find()
      .toArray();
    
    const studentsWithThisCourse = allStudentsForCourse.filter(s => 
      (s.courses || []).some((c: any) => c.id === courseId)
    );
    
    const courseAverageProgress = studentsWithThisCourse.length > 0
      ? Math.round(
          studentsWithThisCourse.reduce((sum, s) => {
            const courseProgress = (s.courses || []).find((c: any) => c.id === courseId)?.progress || 0;
            return sum + courseProgress;
          }, 0) / studentsWithThisCourse.length
        )
      : 0;
    
    await db.collection('courses').updateOne(
      { id: courseId },
      { 
        $set: { 
          averageProgress: courseAverageProgress,
          studentsCount: studentsWithThisCourse.length 
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
