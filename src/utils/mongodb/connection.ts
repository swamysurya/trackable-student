
// MongoDB connection utilities

let connectionString = '';
let isConnected = false;
let dbName = 'students_data';

/**
 * Sets the MongoDB connection string at runtime
 */
export const setMongoConnectionString = (newConnectionString: string) => {
  connectionString = newConnectionString;
  localStorage.setItem('mongodb_connection_string', newConnectionString);
  console.log("MongoDB connection string set");
};

/**
 * Connects to MongoDB using the stored connection string
 */
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
    
    isConnected = true;
    
    // Store the connection in localStorage
    localStorage.setItem('mongodb_connection_status', 'connected');
    
    return { connected: true };
  } catch (error) {
    console.error("Failed to connect to MongoDB Atlas", error);
    throw error;
  }
};

/**
 * Closes the MongoDB connection
 */
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

/**
 * Checks if MongoDB is connected
 */
export const isMongoDBConnected = () => {
  // Check localStorage first
  const savedStatus = localStorage.getItem('mongodb_connection_status');
  if (savedStatus === 'connected') {
    isConnected = true;
  }
  return isConnected;
};

/**
 * Gets the current connection string
 */
export const getConnectionString = () => connectionString;

/**
 * Gets the database name
 */
export const getDbName = () => dbName;
