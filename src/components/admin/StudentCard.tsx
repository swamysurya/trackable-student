
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { User, ChevronRight } from 'lucide-react';

interface StudentCardProps {
  id: string;
  name: string;
  email: string;
  progress: number;
  coursesCount: number;
}

const StudentCard: React.FC<StudentCardProps> = ({ 
  id, 
  name, 
  email, 
  progress, 
  coursesCount 
}) => {
  const navigate = useNavigate();
  
  const getProgressColor = (progress: number) => {
    if (progress < 30) return 'bg-red-500';
    if (progress < 70) return 'bg-amber-500';
    return 'bg-green-500';
  };
  
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription>{email}</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2"
              // Fix: use className with custom styles instead of indicatorClassName
              style={{ 
                '--progress-foreground': getProgressColor(progress).replace('bg-', 'var(--') + ')',
              } as React.CSSProperties}
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            Enrolled in {coursesCount} {coursesCount === 1 ? 'course' : 'courses'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between"
          onClick={() => navigate(`/admin/students/${id}`)}
        >
          <span>View Details</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default StudentCard;
