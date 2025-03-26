
import React, { useState } from 'react';
import { Check, Clock, AlertCircle } from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';

interface SubtopicItemProps {
  id: string;
  name: string;
  status: 'Not Started' | 'In Progress' | 'Completed';
  onStatusChange: (id: string, status: 'Not Started' | 'In Progress' | 'Completed') => void;
}

const SubtopicItem: React.FC<SubtopicItemProps> = ({
  id,
  name,
  status,
  onStatusChange,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleStatusChange = (value: string) => {
    setIsUpdating(true);
    const newStatus = value as 'Not Started' | 'In Progress' | 'Completed';
    
    // Simulating API call
    setTimeout(() => {
      onStatusChange(id, newStatus);
      setIsUpdating(false);
    }, 500);
  };
  
  const getStatusIcon = () => {
    switch (status) {
      case 'Completed':
        return <Check className="h-4 w-4 text-status-completed" />;
      case 'In Progress':
        return <Clock className="h-4 w-4 text-status-in-progress" />;
      case 'Not Started':
        return <AlertCircle className="h-4 w-4 text-status-not-started" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = () => {
    switch (status) {
      case 'Completed':
        return 'progress-completed';
      case 'In Progress':
        return 'progress-in-progress';
      case 'Not Started':
        return 'progress-not-started';
      default:
        return '';
    }
  };
  
  return (
    <div className={`p-3 rounded-md flex items-center justify-between animate-scale-in ${getStatusClass()}`}>
      <div className="flex items-center space-x-2">
        {getStatusIcon()}
        <span className="text-sm font-medium">{name}</span>
      </div>
      
      <Select
        value={status}
        onValueChange={handleStatusChange}
        disabled={isUpdating}
      >
        <SelectTrigger className="w-[130px] h-8 text-xs bg-white/50 backdrop-blur-sm">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Not Started" className="text-xs">Not Started</SelectItem>
          <SelectItem value="In Progress" className="text-xs">In Progress</SelectItem>
          <SelectItem value="Completed" className="text-xs">Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default SubtopicItem;
