
// Main MongoDB database module
import { isMongoDBConnected, connectToMongoDB } from './connection';
import { initializeMockCourses } from './mockData';
import { createStudentsCollection } from './collections/students';
import { createCoursesCollection } from './collections/courses';

/**
 * Gets a MongoDB database interface with collection methods
 */
export const getDatabase = () => {
  // Initialize mock courses data if needed
  initializeMockCourses();
  
  // Return database interface
  return {
    collection: (collectionName: string) => {
      // Check if we need to auto-connect
      if (!isMongoDBConnected()) {
        connectToMongoDB().catch(err => console.error("Error auto-connecting to MongoDB:", err));
      }
      
      // Return the appropriate collection
      if (collectionName === 'students') {
        return createStudentsCollection();
      } else if (collectionName === 'courses') {
        return createCoursesCollection();
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
