
// Mock data storage for MongoDB collections

// Storage for our mock data when not connected
let mockStudents: any[] = [];
let mockCourses: any[] = [];

// Sample courses data for initial setup when not connected
export const sampleCoursesData = [
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

/**
 * Initialize mock courses data if empty
 */
export const initializeMockCourses = () => {
  if (mockCourses.length === 0) {
    mockCourses = [...sampleCoursesData];
  }
  return mockCourses;
};

/**
 * Gets the mock students data
 */
export const getMockStudents = () => mockStudents;

/**
 * Updates the mock students data
 */
export const setMockStudents = (students: any[]) => {
  mockStudents = students;
};

/**
 * Gets the mock courses data
 */
export const getMockCourses = () => mockCourses;

/**
 * Updates the mock courses data
 */
export const setMockCourses = (courses: any[]) => {
  mockCourses = courses;
};
