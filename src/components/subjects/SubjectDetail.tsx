
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash } from 'lucide-react';
import ResourceList from './ResourceList';
import { getInitials } from '@/lib/utils';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from 'react';

const SubjectDetail: React.FC = () => {
  const { activeSubject, setActiveSubject, deleteSubject } = useApp();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  if (!activeSubject) return null;

  const handleDelete = () => {
    deleteSubject(activeSubject.id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <div>
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => setActiveSubject(null)} className="mr-3">
          <ArrowLeft size={16} />
          <span className="ml-1">Back</span>
        </Button>
        <h2 className="text-2xl font-bold">Subject Details</h2>
        <div className="ml-auto flex items-center">
          <Button variant="outline" size="sm" className="mr-2">
            <Pencil size={14} className="mr-1" />
            Edit
          </Button>
          <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
            <Trash size={14} className="mr-1" />
            Delete
          </Button>
        </div>
      </div>

      <div className="mb-6 flex items-center">
        <div 
          className="mr-4 flex h-16 w-16 items-center justify-center rounded-md text-primary-foreground"
          style={{ backgroundColor: activeSubject.color }}
        >
          <span className="text-xl font-semibold">{getInitials(activeSubject.name)}</span>
        </div>
        <div>
          <h3 className="text-xl font-bold">{activeSubject.name}</h3>
          <p className="text-muted-foreground">{activeSubject.description || 'No description'}</p>
        </div>
      </div>

      <ResourceList />

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the subject "{activeSubject.name}" and all its resources. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SubjectDetail;
