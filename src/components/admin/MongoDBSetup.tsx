
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { setMongoConnectionString, connectToMongoDB, isMongoDBConnected } from '@/utils/mongoDb';
import { useToast } from '@/hooks/use-toast';

const MongoDBSetup: React.FC = () => {
  const [connectionString, setConnectionString] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connected, setConnected] = useState(false);
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

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>MongoDB Atlas Connection</CardTitle>
        <CardDescription>
          Enter your MongoDB Atlas connection string to enable data storage in the "students_data" database
        </CardDescription>
      </CardHeader>
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
    </Card>
  );
};

export default MongoDBSetup;

