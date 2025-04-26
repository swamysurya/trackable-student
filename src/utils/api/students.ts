
import { getDatabase } from '../mongodb';
import { ensureCollectionsSetup } from './analytics';

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
      // Update existing course progress
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
