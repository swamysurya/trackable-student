
import { getDatabase } from '../mongodb';
import { ensureCollectionsSetup } from './analytics';

export const updateCourse = async (courseId: string, courseData: any) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    const result = await db.collection('courses').updateOne(
      { id: courseId },
      { $set: courseData }
    );
    
    if (result.matchedCount === 0) {
      throw new Error('Course not found');
    }
    
    return {
      success: true,
      message: 'Course updated successfully',
    };
  } catch (error) {
    console.error('Error updating course in MongoDB:', error);
    throw error;
  }
};

export const createCourse = async (courseData: any) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    // Generate a unique ID
    const courseId = 'course-' + Date.now();
    
    const newCourse = {
      id: courseId,
      ...courseData,
      studentsCount: 0,
      averageProgress: 0
    };
    
    await db.collection('courses').insertOne(newCourse);
    
    return {
      success: true,
      message: 'Course created successfully',
      courseId,
    };
  } catch (error) {
    console.error('Error creating course in MongoDB:', error);
    throw error;
  }
};

export const deleteCourse = async (courseId: string) => {
  try {
    const db = getDatabase();
    await ensureCollectionsSetup();
    
    const result = await db.collection('courses').deleteOne({ id: courseId });
    
    if (result.deletedCount === 0) {
      throw new Error('Course not found');
    }
    
    return {
      success: true,
      message: 'Course deleted successfully',
    };
  } catch (error) {
    console.error('Error deleting course from MongoDB:', error);
    throw error;
  }
};
