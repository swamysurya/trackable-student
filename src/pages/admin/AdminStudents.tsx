
import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, RefreshCw } from 'lucide-react';
import AdminNavbar from '@/components/admin/AdminNavbar';
import StudentCard from '@/components/admin/StudentCard';
import { getAllStudents } from '@/utils/adminApi';
import { isMongoDBConnected } from '@/utils/mongoDb';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

const AdminStudents = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isDbConnected, setIsDbConnected] = useState(false);
  const queryClient = useQueryClient();
  
  useEffect(() => {
    // Check if MongoDB is connected
    setIsDbConnected(isMongoDBConnected());
  }, []);
  
  const { data: students, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['students'],
    queryFn: getAllStudents,
    retry: 1,
    refetchOnWindowFocus: false,
  });
  
  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ['students'] });
  };
  
  const filteredStudents = students?.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    student.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />
      
      <main className="container mx-auto px-4 py-16 mt-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-3xl font-bold mb-4 md:mb-0">Students</h1>
          
          <div className="flex items-center gap-3">
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search students by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <Button 
              variant="outline" 
              size="icon"
              onClick={refreshData}
              title="Refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {!isDbConnected && (
          <Alert className="mb-6 border-amber-500">
            <AlertCircle className="h-4 w-4 text-amber-500" />
            <AlertTitle>MongoDB Not Connected</AlertTitle>
            <AlertDescription>
              Connect to MongoDB and seed the database to see student data. Go to the Dashboard to set up the connection.
            </AlertDescription>
          </Alert>
        )}
        
        {isError && (
          <Alert className="mb-6 border-destructive">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertTitle>Error Loading Students</AlertTitle>
            <AlertDescription>
              {error instanceof Error ? error.message : 'Failed to load student data. Please try again.'}
            </AlertDescription>
          </Alert>
        )}
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-gray-200" />
            ))}
          </div>
        ) : filteredStudents && filteredStudents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredStudents.map(student => (
              <StudentCard
                key={student.id}
                id={student.id}
                name={student.name}
                email={student.email}
                progress={student.overallProgress}
                coursesCount={student.courses?.length || 0}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              {searchQuery 
                ? 'No students found matching your search.' 
                : 'No students found. Please seed the database first.'}
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminStudents;
