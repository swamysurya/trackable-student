
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { setMongoConnectionString, connectToMongoDB } from '@/utils/mongoDb';
import { useToast } from '@/hooks/use-toast';

const MongoDBSetup: React.FC = () => {
  const [connectionString, setConnectionString] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { toast } = useToast();

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
      setIsConnected(true);
      toast({
        title: 'Connected',
        description: 'Successfully connected to MongoDB',
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

  // Try to connect on component mount if connection string exists
  React.useEffect(() => {
    const savedConnection = localStorage.getItem('mongodb_connection_string');
    if (savedConnection) {
      setConnectionString(savedConnection);
      (async () => {
        try {
          setMongoConnectionString(savedConnection);
          await connectToMongoDB();
          setIsConnected(true);
          toast({
            title: 'Connected',
            description: 'Automatically connected to MongoDB'
          });
        } catch (error) {
          console.error('Auto-connection error:', error);
        }
      })();
    }
  }, [toast]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>MongoDB Connection</CardTitle>
        <CardDescription>
          Enter your MongoDB connection string to enable real-time data storage
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
          disabled={isConnecting || isConnected}
          className="w-full"
        >
          {isConnecting 
            ? 'Connecting...' 
            : isConnected 
              ? 'Connected to MongoDB' 
              : 'Connect to MongoDB'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MongoDBSetup;
