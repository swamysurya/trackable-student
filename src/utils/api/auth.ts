
import { getDatabase } from '../mongodb';

export const adminLogin = async (email: string, password: string) => {
  try {
    // In a real app, this would verify against admin credentials stored in MongoDB
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
  } catch (error) {
    console.error('Admin login error:', error);
    throw error;
  }
};
