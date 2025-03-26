
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressCardProps {
  title: string;
  totalItems: number;
  completedItems: number;
  inProgressItems: number;
  icon?: React.ReactNode;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  totalItems,
  completedItems,
  inProgressItems,
  icon,
}) => {
  const completedPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  const inProgressPercentage = totalItems > 0 ? Math.round((inProgressItems / totalItems) * 100) : 0;
  const notStartedItems = totalItems - completedItems - inProgressItems;
  
  return (
    <Card className="glass hover-lift animate-fade-in">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{completedPercentage}%</span>
            </div>
            <Progress value={completedPercentage} className="h-2" />
          </div>
          
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="flex flex-col items-center p-2 progress-completed rounded-md">
              <span className="text-sm font-medium">{completedItems}</span>
              <span className="text-xs">Completed</span>
            </div>
            
            <div className="flex flex-col items-center p-2 progress-in-progress rounded-md">
              <span className="text-sm font-medium">{inProgressItems}</span>
              <span className="text-xs">In Progress</span>
            </div>
            
            <div className="flex flex-col items-center p-2 progress-not-started rounded-md">
              <span className="text-sm font-medium">{notStartedItems}</span>
              <span className="text-xs">Not Started</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProgressCard;
