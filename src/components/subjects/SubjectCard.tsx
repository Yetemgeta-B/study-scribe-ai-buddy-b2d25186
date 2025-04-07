
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Book } from 'lucide-react';
import { Subject } from '@/types';
import { getInitials } from '@/lib/utils';
import { useApp } from '@/context/AppContext';

interface SubjectCardProps {
  subject: Subject;
}

const SubjectCard: React.FC<SubjectCardProps> = ({ subject }) => {
  const { setActiveSubject } = useApp();
  
  return (
    <Card 
      className="group h-full overflow-hidden transition-all hover:border-primary hover:shadow-md" 
      onClick={() => setActiveSubject(subject)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div 
              className="flex h-10 w-10 items-center justify-center rounded-md text-primary-foreground"
              style={{ backgroundColor: subject.color }}
            >
              <span className="text-sm font-semibold">{getInitials(subject.name)}</span>
            </div>
            <CardTitle className="text-lg">{subject.name}</CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 text-sm text-muted-foreground">
          {subject.description || 'No description'}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center text-xs text-muted-foreground">
            <Book size={14} className="mr-1" />
            {subject.resources.length} resources
          </div>
          <Button variant="ghost" size="sm" className="opacity-0 transition-opacity group-hover:opacity-100">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubjectCard;
