
// Courses collection implementation
import { isMongoDBConnected } from '../connection';
import { getMockCourses, setMockCourses } from '../mockData';

/**
 * Creates a courses collection with MongoDB-like methods
 */
export const createCoursesCollection = () => {
  return {
    find: () => ({
      toArray: async () => {
        if (!isMongoDBConnected()) {
          console.warn("MongoDB not connected, using mock data");
        }
        return [...getMockCourses()];
      }
    }),
    findOne: async ({ id }: { id: string }) => {
      if (!isMongoDBConnected()) {
        console.warn("MongoDB not connected, using mock data");
      }
      return getMockCourses().find(course => course.id === id) || null;
    },
    insertOne: async (document: any) => {
      if (!isMongoDBConnected()) {
        console.warn("MongoDB not connected, using mock data");
      }
      const mockCourses = getMockCourses();
      mockCourses.push(document);
      setMockCourses(mockCourses);
      return { insertedId: document.id };
    },
    insertMany: async (documents: any[]) => {
      if (!isMongoDBConnected()) {
        console.warn("MongoDB not connected, using mock data");
      }
      const mockCourses = getMockCourses();
      mockCourses.push(...documents);
      setMockCourses(mockCourses);
      return { insertedCount: documents.length };
    },
    updateOne: async (filter: any, update: any) => {
      if (!isMongoDBConnected()) {
        console.warn("MongoDB not connected, using mock data");
      }
      
      const mockCourses = getMockCourses();
      const index = mockCourses.findIndex(course => course.id === filter.id);
      if (index !== -1) {
        if (update.$set) {
          mockCourses[index] = { ...mockCourses[index], ...update.$set };
        }
        setMockCourses(mockCourses);
        return { matchedCount: 1, modifiedCount: 1 };
      }
      return { matchedCount: 0, modifiedCount: 0 };
    },
    deleteOne: async (filter: any) => {
      if (!isMongoDBConnected()) {
        console.warn("MongoDB not connected, using mock data");
      }
      
      const mockCourses = getMockCourses();
      const initialLength = mockCourses.length;
      const newMockCourses = mockCourses.filter(course => course.id !== filter.id);
      setMockCourses(newMockCourses);
      return { deletedCount: initialLength - newMockCourses.length };
    },
    countDocuments: async () => getMockCourses().length
  };
};
