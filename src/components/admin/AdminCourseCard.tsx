
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { BookOpen, Users, ChevronRight, Edit } from 'lucide-react';

interface AdminCourseCardProps {
  id: string;
  name: string;
  description: string;
  studentsCount: number;
  averageProgress: number;
}

const AdminCourseCard: React.FC<AdminCourseCardProps> = ({ 
  id, 
  name, 
  description, 
  studentsCount,
  averageProgress 
}) => {
  const navigate = useNavigate();
  
  return (
    <Card className="hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">{name}</CardTitle>
              <CardDescription className="line-clamp-1">{description}</CardDescription>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(`/admin/courses/${id}/edit`)}
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Average Student Progress</span>
              <span className="font-medium">{averageProgress}%</span>
            </div>
            <Progress value={averageProgress} className="h-2" />
          </div>
          
          <div className="flex items-center text-sm text-muted-foreground">
            <Users className="h-4 w-4 mr-1" />
            <span>{studentsCount} {studentsCount === 1 ? 'student' : 'students'} enrolled</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-1">
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between"
          onClick={() => navigate(`/admin/courses/${id}`)}
        >
          <span>View Details</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AdminCourseCard;
