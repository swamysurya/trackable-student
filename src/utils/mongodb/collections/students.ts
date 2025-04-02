
// Students collection implementation
import { isMongoDBConnected } from '../connection';
import { getMockStudents, setMockStudents } from '../mockData';
import { getRegisteredUsers, saveUserToLocalStorage, removeUserFromLocalStorage } from '../localStorage';

/**
 * Creates a students collection with MongoDB-like methods
 */
export const createStudentsCollection = () => {
  return {
    find: () => ({
      toArray: async () => {
        if (!isMongoDBConnected()) {
          console.warn("MongoDB not connected, using localStorage data");
        }
        
        const registeredUsers = getRegisteredUsers();
        
        // If we have registered users, return them, otherwise return empty array
        if (registeredUsers.length > 0) {
          return registeredUsers;
        }
        return getMockStudents();
      }
    }),
    findOne: async (filter: any) => {
      if (!isMongoDBConnected()) {
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
        const mockStudents = getMockStudents();
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
      if (!isMongoDBConnected()) {
        console.warn("MongoDB not connected, using localStorage data");
        const mockStudents = getMockStudents();
        mockStudents.push(document);
        setMockStudents(mockStudents);
      }
      
      // Also save to localStorage for persistence across sessions
      saveUserToLocalStorage(document);
      
      return { insertedId: document.id };
    },
    insertMany: async (documents: any[]) => {
      if (!isMongoDBConnected()) {
        console.warn("MongoDB not connected, using localStorage data");
        const mockStudents = getMockStudents();
        mockStudents.push(...documents);
        setMockStudents(mockStudents);
      }
      
      // Also save to localStorage for persistence across sessions
      documents.forEach(doc => {
        saveUserToLocalStorage(doc);
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
          saveUserToLocalStorage(updatedUser);
          return { matchedCount: 1, modifiedCount: 1 };
        } else if (update.$push && filter.id) {
          const user = registeredUsers[index];
          if (update.$push.courses) {
            if (!user.courses) user.courses = [];
            user.courses.push(update.$push.courses);
            saveUserToLocalStorage(user);
            return { matchedCount: 1, modifiedCount: 1 };
          }
        }
      }
      
      if (!isMongoDBConnected()) {
        // Fall back to mock data if no registered user found
        const mockStudents = getMockStudents();
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
          setMockStudents(mockStudents);
          return { matchedCount: 1, modifiedCount: 1 };
        }
      }
      
      return { matchedCount: 0, modifiedCount: 0 };
    },
    deleteOne: async (filter: any) => {
      // Remove from localStorage if exists
      if (filter.id) {
        removeUserFromLocalStorage(filter.id);
      } else if (filter.email) {
        const users = getRegisteredUsers();
        const user = users.find(u => u.email === filter.email);
        if (user) {
          removeUserFromLocalStorage(user.id);
        }
      }
      
      if (!isMongoDBConnected()) {
        const mockStudents = getMockStudents();
        const initialLength = mockStudents.length;
        let newMockStudents;
        
        if (filter.id) {
          newMockStudents = mockStudents.filter(student => student.id !== filter.id);
        } else if (filter.email) {
          newMockStudents = mockStudents.filter(student => student.email !== filter.email);
        } else {
          newMockStudents = mockStudents;
        }
        
        setMockStudents(newMockStudents);
        return { deletedCount: initialLength - newMockStudents.length };
      }
      
      return { deletedCount: 1 };
    },
    countDocuments: async () => {
      const registeredUsers = getRegisteredUsers();
      return registeredUsers.length > 0 ? registeredUsers.length : getMockStudents().length;
    }
  };
};
