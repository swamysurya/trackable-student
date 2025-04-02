
// MongoDB utils main entry point
// Re-exports all MongoDB functionality

// Export connection utilities
export {
  setMongoConnectionString,
  connectToMongoDB,
  closeMongoDBConnection,
  isMongoDBConnected
} from './connection';

// Export database access
export { getDatabase } from './database';

// Export other utilities as needed
export { getRegisteredUsers } from './localStorage';
