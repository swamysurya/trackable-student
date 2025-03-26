
import { delay } from './api';

// Mock student data with progress
const mockStudentsProgress = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
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
    overallProgress: 20,
    courses: [
      { id: '1', name: 'Introduction to Web Development', progress: 40 },
      { id: '2', name: 'Advanced JavaScript', progress: 15 },
      { id: '3', name: 'React Fundamentals', progress: 5 },
    ],
  },
];

// Admin API functions
export const getAllStudents = async () => {
  await delay(700);
  
  return mockStudentsProgress;
};

export const getStudentById = async (studentId: string) => {
  await delay(500);
  
  const student = mockStudentsProgress.find(s => s.id === studentId);
  
  if (!student) {
    throw new Error('Student not found');
  }
  
  return student;
};

export const adminLogin = async (email: string, password: string) => {
  await delay(800);
  
  // In a real app, this would verify against admin credentials
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
};

// Mock function for student analytics
export const getStudentAnalytics = async () => {
  await delay(800);
  
  return {
    totalStudents: mockStudentsProgress.length,
    averageProgress: 52,
    coursesBreakdown: [
      { id: '1', name: 'Introduction to Web Development', studentsCount: 5, averageProgress: 75 },
      { id: '2', name: 'Advanced JavaScript', studentsCount: 5, averageProgress: 52 },
      { id: '3', name: 'React Fundamentals', studentsCount: 5, averageProgress: 28 },
    ],
    topPerformers: [
      { id: '4', name: 'Emily Davis', progress: 90 },
      { id: '2', name: 'Jane Smith', progress: 72 },
    ],
    strugglingStudents: [
      { id: '5', name: 'Michael Wilson', progress: 20 },
    ],
  };
};

// Mock function to update course details
export const updateCourse = async (courseId: string, courseData: any) => {
  await delay(600);
  
  // In a real app, this would update the course in the database
  console.log('Updating course:', courseId, courseData);
  
  return {
    success: true,
    message: 'Course updated successfully',
  };
};

// Mock function to create a new course
export const createCourse = async (courseData: any) => {
  await delay(800);
  
  // In a real app, this would create a new course in the database
  console.log('Creating new course:', courseData);
  
  return {
    success: true,
    message: 'Course created successfully',
    courseId: 'new-course-' + Date.now(),
  };
};

// Mock function to delete a course
export const deleteCourse = async (courseId: string) => {
  await delay(500);
  
  // In a real app, this would delete the course from the database
  console.log('Deleting course:', courseId);
  
  return {
    success: true,
    message: 'Course deleted successfully',
  };
};
