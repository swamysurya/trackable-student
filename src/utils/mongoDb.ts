
// This file provides a mock implementation for MongoDB in the browser
// In production, you would use a serverless function or API endpoint

// Storage for our mock data
let mockStudents: any[] = [];
let mockCourses: any[] = [];
let connectionString = '';
let isConnected = false;

// Sample data initialization
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

// Function to set MongoDB connection string at runtime
export const setMongoConnectionString = (newConnectionString: string) => {
  connectionString = newConnectionString;
  console.log("MongoDB connection string set (mock)");
};

// Function to connect to MongoDB
export const connectToMongoDB = async () => {
  try {
    // In a real app, this would connect to MongoDB
    console.log("Connected to MongoDB (mock)");
    
    // Initialize data if not already done
    if (mockStudents.length === 0) {
      mockStudents = [...sampleStudentsData];
    }
    
    if (mockCourses.length === 0) {
      mockCourses = [...sampleCoursesData];
    }
    
    isConnected = true;
    return { connected: true };
  } catch (error) {
    console.error("Failed to connect to MongoDB (mock)", error);
    throw error;
  }
};

// Function to close MongoDB connection
export const closeMongoDBConnection = async () => {
  try {
    // In a real app, this would close the MongoDB connection
    console.log("MongoDB connection closed (mock)");
    isConnected = false;
  } catch (error) {
    console.error("Error closing MongoDB connection (mock)", error);
  }
};

// Function to get MongoDB database
export const getDatabase = () => {
  // In a browser environment, we'll use our mock implementation
  return {
    collection: (collectionName: string) => {
      if (collectionName === 'students') {
        return {
          find: () => ({
            toArray: async () => [...mockStudents]
          }),
          findOne: async ({ id }: { id: string }) => {
            return mockStudents.find(student => student.id === id) || null;
          },
          insertOne: async (document: any) => {
            mockStudents.push(document);
            return { insertedId: document.id };
          },
          insertMany: async (documents: any[]) => {
            mockStudents.push(...documents);
            return { insertedCount: documents.length };
          },
          updateOne: async (filter: any, update: any) => {
            const index = mockStudents.findIndex(student => student.id === filter.id);
            if (index !== -1) {
              if (update.$set) {
                mockStudents[index] = { ...mockStudents[index], ...update.$set };
              } else if (update.$push && filter.id) {
                const studentIndex = mockStudents.findIndex(s => s.id === filter.id);
                if (studentIndex !== -1 && update.$push.courses) {
                  mockStudents[studentIndex].courses.push(update.$push.courses);
                }
              }
              return { matchedCount: 1, modifiedCount: 1 };
            }
            return { matchedCount: 0, modifiedCount: 0 };
          },
          deleteOne: async (filter: any) => {
            const initialLength = mockStudents.length;
            mockStudents = mockStudents.filter(student => student.id !== filter.id);
            return { deletedCount: initialLength - mockStudents.length };
          },
          countDocuments: async () => mockStudents.length
        };
      } else if (collectionName === 'courses') {
        return {
          find: () => ({
            toArray: async () => [...mockCourses]
          }),
          findOne: async ({ id }: { id: string }) => {
            return mockCourses.find(course => course.id === id) || null;
          },
          insertOne: async (document: any) => {
            mockCourses.push(document);
            return { insertedId: document.id };
          },
          insertMany: async (documents: any[]) => {
            mockCourses.push(...documents);
            return { insertedCount: documents.length };
          },
          updateOne: async (filter: any, update: any) => {
            const index = mockCourses.findIndex(course => course.id === filter.id);
            if (index !== -1) {
              if (update.$set) {
                mockCourses[index] = { ...mockCourses[index], ...update.$set };
              }
              return { matchedCount: 1, modifiedCount: 1 };
            }
            return { matchedCount: 0, modifiedCount: 0 };
          },
          deleteOne: async (filter: any) => {
            const initialLength = mockCourses.length;
            mockCourses = mockCourses.filter(course => course.id !== filter.id);
            return { deletedCount: initialLength - mockCourses.length };
          },
          countDocuments: async () => mockCourses.length
        };
      }
      
      // Default empty collection
      return {
        find: () => ({ toArray: async () => [] }),
        findOne: async () => null,
        insertOne: async () => ({ insertedId: null }),
        updateOne: async () => ({ matchedCount: 0, modifiedCount: 0 }),
        deleteOne: async () => ({ deletedCount: 0 }),
        countDocuments: async () => 0
      };
    }
  };
};

// Function to check if MongoDB is connected
export const isMongoDBConnected = () => isConnected;
