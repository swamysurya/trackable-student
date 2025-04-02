// Mock API utility for the Student Progress Tracking System
// In a real application, this would connect to a backend server

import { toast } from '@/hooks/use-toast';
import { getDatabase, isMongoDBConnected } from '@/utils/mongoDb';

// Mock data for courses
const mockCourses = [
  {
    id: '1',
    name: 'Introduction to Web Development',
    description: 'Learn the basics of HTML, CSS, and JavaScript to build beautiful websites.',
    prerequisites: ['None'],
    estimatedTime: '6 weeks',
    topics: [
      {
        id: '1-1',
        name: 'HTML Basics',
        subtopics: [
          { id: '1-1-1', name: 'HTML Document Structure' },
          { id: '1-1-2', name: 'Working with Text' },
          { id: '1-1-3', name: 'HTML Lists' },
          { id: '1-1-4', name: 'HTML Links' },
        ],
      },
      {
        id: '1-2',
        name: 'CSS Fundamentals',
        subtopics: [
          { id: '1-2-1', name: 'CSS Selectors' },
          { id: '1-2-2', name: 'Box Model' },
          { id: '1-2-3', name: 'Flexbox' },
          { id: '1-2-4', name: 'CSS Grid' },
        ],
      },
      {
        id: '1-3',
        name: 'JavaScript Basics',
        subtopics: [
          { id: '1-3-1', name: 'Variables and Data Types' },
          { id: '1-3-2', name: 'Functions' },
          { id: '1-3-3', name: 'DOM Manipulation' },
          { id: '1-3-4', name: 'Events' },
        ],
      },
    ],
  },
  {
    id: '2',
    name: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts including asynchronous programming, closures, and the module pattern.',
    prerequisites: ['Introduction to Web Development'],
    estimatedTime: '8 weeks',
    topics: [
      {
        id: '2-1',
        name: 'Advanced JavaScript Concepts',
        subtopics: [
          { id: '2-1-1', name: 'Closures' },
          { id: '2-1-2', name: 'Prototypes' },
          { id: '2-1-3', name: 'This Keyword' },
          { id: '2-1-4', name: 'ES6+ Features' },
        ],
      },
      {
        id: '2-2',
        name: 'Asynchronous JavaScript',
        subtopics: [
          { id: '2-2-1', name: 'Callbacks' },
          { id: '2-2-2', name: 'Promises' },
          { id: '2-2-3', name: 'Async/Await' },
          { id: '2-2-4', name: 'Event Loop' },
        ],
      },
      {
        id: '2-3',
        name: 'JavaScript Design Patterns',
        subtopics: [
          { id: '2-3-1', name: 'Module Pattern' },
          { id: '2-3-2', name: 'Factory Pattern' },
          { id: '2-3-3', name: 'Observer Pattern' },
          { id: '2-3-4', name: 'MVC Pattern' },
        ],
      },
    ],
  },
  {
    id: '3',
    name: 'React Fundamentals',
    description: 'Learn how to build modern user interfaces with React, a popular JavaScript library.',
    prerequisites: ['Advanced JavaScript'],
    estimatedTime: '10 weeks',
    topics: [
      {
        id: '3-1',
        name: 'React Basics',
        subtopics: [
          { id: '3-1-1', name: 'JSX Syntax' },
          { id: '3-1-2', name: 'Components' },
          { id: '3-1-3', name: 'Props' },
          { id: '3-1-4', name: 'State' },
        ],
      },
      {
        id: '3-2',
        name: 'React Hooks',
        subtopics: [
          { id: '3-2-1', name: 'useState' },
          { id: '3-2-2', name: 'useEffect' },
          { id: '3-2-3', name: 'useContext' },
          { id: '3-2-4', name: 'Custom Hooks' },
        ],
      },
      {
        id: '3-3',
        name: 'React Router',
        subtopics: [
          { id: '3-3-1', name: 'Setting Up Routes' },
          { id: '3-3-2', name: 'Navigation' },
          { id: '3-3-3', name: 'Route Parameters' },
          { id: '3-3-4', name: 'Nested Routes' },
        ],
      },
    ],
  },
];

// Mock user data
const mockUsers = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'Student',
  },
  {
    id: '2',
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'admin123',
    role: 'Admin',
  },
];

// Mock progress data
let mockProgress: { 
  studentId: string; 
  subtopicId: string; 
  status: 'Not Started' | 'In Progress' | 'Completed';
}[] = [
  { studentId: '1', subtopicId: '1-1-1', status: 'Completed' },
  { studentId: '1', subtopicId: '1-1-2', status: 'Completed' },
  { studentId: '1', subtopicId: '1-1-3', status: 'In Progress' },
  { studentId: '1', subtopicId: '1-1-4', status: 'Not Started' },
  { studentId: '1', subtopicId: '1-2-1', status: 'Not Started' },
  { studentId: '1', subtopicId: '1-2-2', status: 'Not Started' },
  { studentId: '1', subtopicId: '1-2-3', status: 'Not Started' },
  { studentId: '1', subtopicId: '1-2-4', status: 'Not Started' },
];

// Helper for simulating API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Auth API functions
export const login = async (email: string, password: string) => {
  await delay(800);
  
  // First check if MongoDB is connected
  if (isMongoDBConnected()) {
    try {
      // Check MongoDB for the user - email filter only, no ID needed
      const db = getDatabase();
      const user = await db.collection('students').findOne({ email });
      
      if (user && user.password === password) {
        // Create a clean user object (without password)
        const { password: _, ...cleanUser } = user;
        
        return {
          token: 'mongodb-token-' + Date.now(),
          user: {
            ...cleanUser,
            role: 'Student'
          },
        };
      }
    } catch (error) {
      console.error('MongoDB login error:', error);
      // Fall back to mock data if MongoDB login fails
    }
  }
  
  // Fall back to mock users if MongoDB is not connected or user not found
  const user = mockUsers.find(u => u.email === email && u.password === password);
  
  if (!user) {
    throw new Error('Invalid credentials');
  }
  
  // Create a clean user object (without password)
  const { password: _, ...cleanUser } = user;
  
  return {
    token: 'mock-token-' + Date.now(),
    user: cleanUser,
  };
};

export const register = async (name: string, email: string, password: string) => {
  await delay(1000);
  
  // Check if user already exists
  if (mockUsers.some(u => u.email === email)) {
    throw new Error('Email already exists');
  }
  
  // Create new user
  const newUser = {
    id: (mockUsers.length + 1).toString(),
    name,
    email,
    password,
    role: 'Student' as const,
  };
  
  mockUsers.push(newUser);
  
  // Create a clean user object (without password)
  const { password: _, ...cleanUser } = newUser;
  
  return {
    token: 'mock-token-' + Date.now(),
    user: cleanUser,
  };
};

export const getCurrentUser = async () => {
  await delay(300);
  
  // In a real app, this would verify the token and return the user
  // Here we'll just return a mock user
  const { password: _, ...cleanUser } = mockUsers[0];
  return cleanUser;
};

// Course API functions
export const getCourses = async () => {
  await delay(500);
  return mockCourses.map(course => ({
    id: course.id,
    name: course.name,
    description: course.description,
    prerequisites: course.prerequisites,
    estimatedTime: course.estimatedTime,
    topicsCount: course.topics.length,
    subtopicsCount: course.topics.reduce(
      (count, topic) => count + topic.subtopics.length, 
      0
    ),
  }));
};

export const getCourseById = async (courseId: string) => {
  await delay(500);
  const course = mockCourses.find(c => c.id === courseId);
  
  if (!course) {
    throw new Error('Course not found');
  }
  
  return course;
};

// Progress API functions
export const getProgressForStudent = async (studentId: string) => {
  await delay(500);
  return mockProgress.filter(p => p.studentId === studentId);
};

export const updateProgress = async (
  studentId: string,
  subtopicId: string,
  status: 'Not Started' | 'In Progress' | 'Completed'
) => {
  await delay(300);
  
  // Find if there's existing progress for this subtopic
  const existingIndex = mockProgress.findIndex(
    p => p.studentId === studentId && p.subtopicId === subtopicId
  );
  
  // Update or create progress entry
  if (existingIndex >= 0) {
    mockProgress[existingIndex].status = status;
  } else {
    mockProgress.push({ studentId, subtopicId, status });
  }
  
  return { success: true };
};

// Dashboard stats API function
export const getStudentStats = async (studentId: string) => {
  await delay(700);
  
  const progress = mockProgress.filter(p => p.studentId === studentId);
  
  // Count subtopics across all courses
  const totalSubtopics = mockCourses.reduce(
    (count, course) => count + course.topics.reduce(
      (topicCount, topic) => topicCount + topic.subtopics.length,
      0
    ),
    0
  );
  
  const completedCount = progress.filter(p => p.status === 'Completed').length;
  const inProgressCount = progress.filter(p => p.status === 'In Progress').length;
  
  // Calculate per-course progress
  const courseProgress = mockCourses.map(course => {
    // Get all subtopic IDs for this course
    const subtopicIds = course.topics.flatMap(topic => 
      topic.subtopics.map(subtopic => subtopic.id)
    );
    
    // Filter progress entries for this course
    const courseProgressEntries = progress.filter(p => 
      subtopicIds.includes(p.subtopicId)
    );
    
    const totalCourseSubtopics = subtopicIds.length;
    const completedCourseSubtopics = courseProgressEntries.filter(
      p => p.status === 'Completed'
    ).length;
    const inProgressCourseSubtopics = courseProgressEntries.filter(
      p => p.status === 'In Progress'
    ).length;
    
    const progressPercentage = totalCourseSubtopics > 0 
      ? Math.round((completedCourseSubtopics / totalCourseSubtopics) * 100) 
      : 0;
    
    return {
      id: course.id,
      name: course.name,
      totalSubtopics: totalCourseSubtopics,
      completedSubtopics: completedCourseSubtopics,
      inProgressSubtopics: inProgressCourseSubtopics,
      progressPercentage,
    };
  });
  
  return {
    totalSubtopics,
    completedCount,
    inProgressCount,
    notStartedCount: totalSubtopics - completedCount - inProgressCount,
    overallProgress: totalSubtopics > 0 
      ? Math.round((completedCount / totalSubtopics) * 100) 
      : 0,
    courseProgress,
  };
};
