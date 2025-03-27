
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { setMongoConnectionString, connectToMongoDB, isMongoDBConnected } from '@/utils/mongoDb';
import { useToast } from '@/hooks/use-toast';
import { seedStudentData, getTestCredentials } from '@/utils/seedDatabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const MongoDBSetup: React.FC = () => {
  const [connectionString, setConnectionString] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
  const [isSeedingDatabase, setIsSeedingDatabase] = useState(false);
  const [testCredentials, setTestCredentials] = useState<any[]>([]);
  const { toast } = useToast();

  // Check if already connected on mount
  useEffect(() => {
    setConnected(isMongoDBConnected());
    
    const savedConnection = localStorage.getItem('mongodb_connection_string');
    if (savedConnection) {
      setConnectionString(savedConnection);
      if (!isMongoDBConnected()) {
        handleAutoConnect(savedConnection);
      }
    }
  }, []);

  const handleAutoConnect = async (connString: string) => {
    try {
      setMongoConnectionString(connString);
      await connectToMongoDB();
      setConnected(true);
      toast({
        title: 'Connected',
        description: 'Automatically connected to MongoDB Atlas'
      });
    } catch (error) {
      console.error('Auto-connection error:', error);
    }
  };

  const handleConnect = async () => {
    if (!connectionString) {
      toast({
        title: 'Error',
        description: 'Please enter a MongoDB Atlas connection string',
        variant: 'destructive'
      });
      return;
    }

    setIsConnecting(true);
    try {
      setMongoConnectionString(connectionString);
      await connectToMongoDB();
      localStorage.setItem('mongodb_connection_string', connectionString);
      setConnected(true);
      toast({
        title: 'Connected',
        description: 'Successfully connected to MongoDB Atlas database "students_data"',
      });
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to connect to MongoDB Atlas',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSeedDatabase = async () => {
    if (!connected) {
      toast({
        title: 'Error',
        description: 'Please connect to MongoDB Atlas first',
        variant: 'destructive'
      });
      return;
    }

    setIsSeedingDatabase(true);
    try {
      const result = await seedStudentData();
      if (result.success) {
        setTestCredentials(getTestCredentials());
        toast({
          title: 'Database Seeded',
          description: 'Successfully added test student data to the database',
        });
      } else {
        toast({
          title: 'Note',
          description: result.message,
        });
      }
    } catch (error) {
      console.error('Error seeding database:', error);
      toast({
        title: 'Seeding Error',
        description: error instanceof Error ? error.message : 'Failed to seed database',
        variant: 'destructive'
      });
    } finally {
      setIsSeedingDatabase(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>MongoDB Atlas Connection</CardTitle>
        <CardDescription>
          Enter your MongoDB Atlas connection string to enable data storage in the "students_data" database
        </CardDescription>
      </CardHeader>
      <Tabs defaultValue="connection">
        <TabsList className="mx-6">
          <TabsTrigger value="connection">Connection</TabsTrigger>
          <TabsTrigger value="test-data" disabled={!connected}>Test Data</TabsTrigger>
        </TabsList>
        
        <TabsContent value="connection">
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="mongodb+srv://username:password@cluster.mongodb.net"
                  value={connectionString}
                  onChange={(e) => setConnectionString(e.target.value)}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Your connection string is stored locally and never shared
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={handleConnect} 
              disabled={isConnecting || connected}
              className="w-full"
            >
              {isConnecting 
                ? 'Connecting...' 
                : connected 
                  ? 'Connected to MongoDB Atlas' 
                  : 'Connect to MongoDB Atlas'}
            </Button>
          </CardFooter>
        </TabsContent>
        
        <TabsContent value="test-data">
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col space-y-4">
                <p className="text-sm">
                  Seed the database with 5 test students including login credentials and course progress data.
                </p>
                <Button 
                  onClick={handleSeedDatabase} 
                  disabled={isSeedingDatabase || !connected}
                  variant="outline"
                >
                  {isSeedingDatabase ? 'Adding Test Data...' : 'Add Test Data'}
                </Button>
                
                {testCredentials.length > 0 && (
                  <div className="mt-4 border rounded-md p-4">
                    <h3 className="font-medium mb-2">Test Student Credentials</h3>
                    <div className="space-y-2 text-sm">
                      {testCredentials.map((cred, index) => (
                        <div key={index} className="p-2 bg-muted rounded-md">
                          <p><span className="font-medium">Name:</span> {cred.name}</p>
                          <p><span className="font-medium">Email:</span> {cred.email}</p>
                          <p><span className="font-medium">Password:</span> {cred.password}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default MongoDBSetup;
