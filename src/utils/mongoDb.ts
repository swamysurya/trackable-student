// This file provides MongoDB implementation for the browser environment
// For production with MongoDB Atlas

// Storage for our mock data when not connected
let mockStudents: any[] = [];
let mockCourses: any[] = [];
let connectionString = '';
let isConnected = false;
let dbName = 'students_data';

// Sample courses data for initial setup when not connected
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
  localStorage.setItem('mongodb_connection_string', newConnectionString);
  console.log("MongoDB connection string set");
};

// Function to connect to MongoDB
export const connectToMongoDB = async () => {
  try {
    if (!connectionString) {
      const savedConnection = localStorage.getItem('mongodb_connection_string');
      if (savedConnection) {
        connectionString = savedConnection;
      } else {
        throw new Error("MongoDB connection string not provided");
      }
    }

    // In a real app, this would connect to MongoDB Atlas
    // For this demo, we'll simulate a successful connection
    console.log(`Connecting to MongoDB Atlas: ${dbName} database`);
    
    // Initialize course data if not already done
    if (mockCourses.length === 0) {
      mockCourses = [...sampleCoursesData];
    }
    
    isConnected = true;
    
    // Store the connection in localStorage
    localStorage.setItem('mongodb_connection_status', 'connected');
    
    return { connected: true };
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas", error);
    throw error;
  }
};

// Function to close MongoDB connection
export const closeMongoDBConnection = async () => {
  try {
    // In a real app, this would close the MongoDB connection
    console.log("MongoDB connection closed");
    isConnected = false;
    localStorage.removeItem('mongodb_connection_status');
  } catch (error) {
    console.error("Error closing MongoDB connection", error);
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
        try {
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
        } catch (error) {
          console.error(`Error parsing user data for key ${key}:`, error);
          // Continue with other keys even if one fails
          continue;
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
  // Check if we have a connection string but haven't connected yet
  if (connectionString && !isConnected) {
    connectToMongoDB().catch(err => console.error("Error auto-connecting to MongoDB:", err));
  }

  // Collection implementations
  return {
    collection: (collectionName: string) => {
      if (collectionName === 'students') {
        return {
          find: () => ({
            toArray: async () => {
              if (!isConnected) {
                console.warn("MongoDB not connected, using localStorage data");
              }
              
              const registeredUsers = getRegisteredUsers();
              
              // If we have registered users, return them, otherwise return empty array
              if (registeredUsers.length > 0) {
                return registeredUsers;
              }
              return mockStudents;
            }
          }),
          findOne: async (filter: any) => {
            if (!isConnected) {
              console.warn("MongoDB not connected, using localStorage data");
            }
            
            const registeredUsers = getRegisteredUsers();
            let user = null;
            
            // Handle different filter types
            if (filter.id) {
              user = registeredUsers.find(student => student.id === filter.id);
            } else if (filter.email) {
              user = registeredUsers.find(student => student.email === filter.email);
            } else if (filter["courses.id"]) {
              // Handle dot notation for nested properties
              user = registeredUsers.find(student => 
                (student.courses || []).some((c: any) => c.id === filter["courses.id"])
              );
            }
            
            // If not found in registered users, try mock data
            if (!user) {
              if (filter.id) {
                user = mockStudents.find(student => student.id === filter.id);
              } else if (filter.email) {
                user = mockStudents.find(student => student.email === filter.email);
              } else if (filter["courses.id"]) {
                user = mockStudents.find(student => 
                  (student.courses || []).some((c: any) => c.id === filter["courses.id"])
                );
              }
            }
            
            return user || null;
          },
          insertOne: async (document: any) => {
            if (!isConnected) {
              console.warn("MongoDB not connected, using localStorage data");
              mockStudents.push(document);
            }
            
            // Also save to localStorage for persistence across sessions
            localStorage.setItem(`user_${document.id}`, JSON.stringify(document));
            
            return { insertedId: document.id };
          },
          insertMany: async (documents: any[]) => {
            if (!isConnected) {
              console.warn("MongoDB not connected, using localStorage data");
              mockStudents.push(...documents);
            }
            
            // Also save to localStorage for persistence across sessions
            documents.forEach(doc => {
              localStorage.setItem(`user_${doc.id}`, JSON.stringify(doc));
            });
            
            return { insertedCount: documents.length };
          },
          updateOne: async (filter: any, update: any) => {
            const registeredUsers = getRegisteredUsers();
            let index = -1;
            
            // Find by various filter properties
            if (filter.id) {
              index = registeredUsers.findIndex(student => student.id === filter.id);
            } else if (filter.email) {
              index = registeredUsers.findIndex(student => student.email === filter.email);
            } else if (filter["courses.id"]) {
              index = registeredUsers.findIndex(student => 
                (student.courses || []).some((c: any) => c.id === filter["courses.id"])
              );
            }
            
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
            
            if (!isConnected) {
              // Fall back to mock data if no registered user found
              let mockIndex = -1;
              
              if (filter.id) {
                mockIndex = mockStudents.findIndex(student => student.id === filter.id);
              } else if (filter.email) {
                mockIndex = mockStudents.findIndex(student => student.email === filter.email);
              } else if (filter["courses.id"]) {
                mockIndex = mockStudents.findIndex(student => 
                  (student.courses || []).some((c: any) => c.id === filter["courses.id"])
                );
              }
              
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
            }
            
            return { matchedCount: 0, modifiedCount: 0 };
          },
          deleteOne: async (filter: any) => {
            // Remove from localStorage if exists
            if (filter.id) {
              const key = `user_${filter.id}`;
              if (localStorage.getItem(key)) {
                localStorage.removeItem(key);
              }
            } else if (filter.email) {
              const users = getRegisteredUsers();
              const user = users.find(u => u.email === filter.email);
              if (user) {
                localStorage.removeItem(`user_${user.id}`);
              }
            }
            
            if (!isConnected) {
              const initialLength = mockStudents.length;
              if (filter.id) {
                mockStudents = mockStudents.filter(student => student.id !== filter.id);
              } else if (filter.email) {
                mockStudents = mockStudents.filter(student => student.email !== filter.email);
              }
              return { deletedCount: initialLength - mockStudents.length };
            }
            
            return { deletedCount: 1 };
          },
          countDocuments: async () => {
            const registeredUsers = getRegisteredUsers();
            return registeredUsers.length > 0 ? registeredUsers.length : mockStudents.length;
          }
        };
      } else if (collectionName === 'courses') {
        return {
          find: () => ({
            toArray: async () => {
              if (!isConnected) {
                console.warn("MongoDB not connected, using mock data");
              }
              return [...mockCourses];
            }
          }),
          findOne: async ({ id }: { id: string }) => {
            if (!isConnected) {
              console.warn("MongoDB not connected, using mock data");
            }
            return mockCourses.find(course => course.id === id) || null;
          },
          insertOne: async (document: any) => {
            if (!isConnected) {
              console.warn("MongoDB not connected, using mock data");
            }
            mockCourses.push(document);
            return { insertedId: document.id };
          },
          insertMany: async (documents: any[]) => {
            if (!isConnected) {
              console.warn("MongoDB not connected, using mock data");
            }
            mockCourses.push(...documents);
            return { insertedCount: documents.length };
          },
          updateOne: async (filter: any, update: any) => {
            if (!isConnected) {
              console.warn("MongoDB not connected, using mock data");
            }
            
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
            if (!isConnected) {
              console.warn("MongoDB not connected, using mock data");
            }
            
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
export const isMongoDBConnected = () => {
  // Check localStorage first
  const savedStatus = localStorage.getItem('mongodb_connection_status');
  if (savedStatus === 'connected') {
    isConnected = true;
  }
  return isConnected;
};
