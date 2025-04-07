
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import SubjectCard from '@/components/subjects/SubjectCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Book } from 'lucide-react';
import { getRandomColor } from '@/lib/utils';

const SubjectList: React.FC = () => {
  const { subjects, addSubject } = useApp();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectDescription, setNewSubjectDescription] = useState('');

  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject({
        name: newSubjectName,
        description: newSubjectDescription,
        color: getRandomColor(),
      });
      setNewSubjectName('');
      setNewSubjectDescription('');
      setIsDialogOpen(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Subjects</h2>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} className="mr-1" />
          Add Subject
        </Button>
      </div>

      {subjects.length === 0 ? (
        <div className="flex h-64 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-secondary/50 p-12 text-center">
          <Book size={48} className="mb-4 text-muted-foreground" />
          <h3 className="text-xl font-medium">No Subjects Yet</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            Add your first subject to get started with organizing your studies.
          </p>
          <Button onClick={() => setIsDialogOpen(true)}>
            <Plus size={16} className="mr-1" />
            Add Subject
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {subjects.map((subject) => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Subject</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">
                Subject Name
              </label>
              <Input
                id="name"
                placeholder="e.g., Computer Science"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description (optional)
              </label>
              <Input
                id="description"
                placeholder="e.g., Core computer science courses"
                value={newSubjectDescription}
                onChange={(e) => setNewSubjectDescription(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddSubject}>Add Subject</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SubjectList;
