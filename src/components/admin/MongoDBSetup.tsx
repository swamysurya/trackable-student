
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
        description: 'Automatically connected to MongoDB'
      });
    } catch (error) {
      console.error('Auto-connection error:', error);
    }
  };

  const handleConnect = async () => {
    if (!connectionString) {
      toast({
        title: 'Error',
        description: 'Please enter a MongoDB connection string',
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
        description: process.env.NODE_ENV === 'development' 
          ? 'Successfully connected to MongoDB (mock)' 
          : 'Successfully connected to MongoDB',
      });
    } catch (error) {
      console.error('Error connecting to MongoDB:', error);
      toast({
        title: 'Connection Error',
        description: error instanceof Error ? error.message : 'Failed to connect to MongoDB',
        variant: 'destructive'
      });
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>MongoDB Connection</CardTitle>
        <CardDescription>
          Enter your MongoDB connection string to enable data storage
          {process.env.NODE_ENV === 'development' && 
            " (Note: In development mode, this uses a browser-compatible mock implementation)"}
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
              ? 'Connected to MongoDB' 
              : 'Connect to MongoDB'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MongoDBSetup;
