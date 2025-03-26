
import { MongoClient, ServerApiVersion } from 'mongodb';

// Placeholder connection string - this will be replaced with the real one
let uri = "placeholder_connection_string";

// Function to set MongoDB connection string at runtime
export const setMongoConnectionString = (connectionString: string) => {
  uri = connectionString;
  console.log("MongoDB connection string set");
};

// Create a MongoClient with connection options
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

// Function to connect to MongoDB
export const connectToMongoDB = async () => {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    return client;
  } catch (error) {
    console.error("Failed to connect to MongoDB", error);
    throw error;
  }
};

// Function to close MongoDB connection
export const closeMongoDBConnection = async () => {
  try {
    await client.close();
    console.log("MongoDB connection closed");
  } catch (error) {
    console.error("Error closing MongoDB connection", error);
  }
};

// Function to get MongoDB database
export const getDatabase = (dbName: string = 'student_progress_system') => {
  return client.db(dbName);
};
