
// This file provides MongoDB implementation for the browser environment
// In production, you would use a serverless function or API endpoint

// Storage for our mock data
let mockStudents: any[] = [];
let mockCourses: any[] = [];
let connectionString = '';
let isConnected = false;

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
    
    // Initialize course data if not already done
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

// Function to get registered users from localStorage
const getRegisteredUsers = () => {
  try {
    // Get registered users from localStorage
    const users = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('user_')) {
        const userData = JSON.parse(localStorage.getItem(key) || '{}');
        if (userData.id && userData.name && userData.email) {
          users.push({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            password: userData.password || 'password123',
            overallProgress: userData.overallProgress || 0,
            courses: userData.courses || []
          });
        }
      }
    }
    
    // If no registered users found, return empty array
    return users;
  } catch (error) {
    console.error("Error getting registered users:", error);
    return [];
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
            toArray: async () => {
              const registeredUsers = getRegisteredUsers();
              
              // If we have registered users, return them, otherwise return empty array
              if (registeredUsers.length > 0) {
                return registeredUsers;
              }
              return mockStudents;
            }
          }),
          findOne: async ({ id }: { id: string }) => {
            const registeredUsers = getRegisteredUsers();
            const user = registeredUsers.find(student => student.id === id);
            return user || mockStudents.find(student => student.id === id) || null;
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
            const registeredUsers = getRegisteredUsers();
            const index = registeredUsers.findIndex(student => student.id === filter.id);
            
            if (index !== -1) {
              // Update the registered user in localStorage
              if (update.$set) {
                const updatedUser = { ...registeredUsers[index], ...update.$set };
                localStorage.setItem(`user_${updatedUser.id}`, JSON.stringify(updatedUser));
                return { matchedCount: 1, modifiedCount: 1 };
              } else if (update.$push && filter.id) {
                const user = registeredUsers[index];
                if (update.$push.courses) {
                  if (!user.courses) user.courses = [];
                  user.courses.push(update.$push.courses);
                  localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
                  return { matchedCount: 1, modifiedCount: 1 };
                }
              }
            }
            
            // Fall back to mock data if no registered user found
            const mockIndex = mockStudents.findIndex(student => student.id === filter.id);
            if (mockIndex !== -1) {
              if (update.$set) {
                mockStudents[mockIndex] = { ...mockStudents[mockIndex], ...update.$set };
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
          countDocuments: async () => {
            const registeredUsers = getRegisteredUsers();
            return registeredUsers.length > 0 ? registeredUsers.length : mockStudents.length;
          }
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
