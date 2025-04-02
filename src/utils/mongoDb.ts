
// This file is kept for backward compatibility
// It re-exports the functionality from the reorganized modules
import {
  setMongoConnectionString,
  connectToMongoDB,
  closeMongoDBConnection,
  isMongoDBConnected,
  getDatabase,
  getRegisteredUsers
} from './mongodb';

export {
  setMongoConnectionString,
  connectToMongoDB,
  closeMongoDBConnection,
  isMongoDBConnected,
  getDatabase,
  getRegisteredUsers
};
