
import React from 'react';
import { BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface CourseCardProps {
  id: string;
  title: string;
  description: string;
  estimatedTime: string;
  progress: number;
  topics: number;
  prerequisites: string[];
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  description,
  estimatedTime,
  progress,
  topics,
  prerequisites,
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="glass overflow-hidden hover-lift animate-fade-in h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium line-clamp-1">{title}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground">
            <Clock className="h-3 w-3 mr-1" />
            <span>{estimatedTime}</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{description}</p>
        
        <div className="space-y-3">
          <div className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-xs text-muted-foreground">Progress</span>
              <span className="text-xs font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-1.5" />
          </div>
          
          <div className="flex items-center text-xs text-muted-foreground">
            <BookOpen className="h-3 w-3 mr-1" />
            <span>{topics} Topics</span>
          </div>
          
          {prerequisites.length > 0 && (
            <div className="space-y-1">
              <span className="text-xs text-muted-foreground">Prerequisites:</span>
              <div className="flex flex-wrap gap-1">
                {prerequisites.map((prerequisite, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {prerequisite}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-2">
        <Button 
          onClick={() => navigate(`/courses/${id}`)} 
          className="w-full text-sm"
        >
          View Course
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CourseCard;
