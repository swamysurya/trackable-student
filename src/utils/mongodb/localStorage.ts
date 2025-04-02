
// LocalStorage utilities for MongoDB data

/**
 * Gets registered users from localStorage
 */
export const getRegisteredUsers = () => {
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

/**
 * Saves a user to localStorage
 */
export const saveUserToLocalStorage = (user: any) => {
  localStorage.setItem(`user_${user.id}`, JSON.stringify(user));
};

/**
 * Removes a user from localStorage
 */
export const removeUserFromLocalStorage = (userId: string) => {
  localStorage.removeItem(`user_${userId}`);
};
