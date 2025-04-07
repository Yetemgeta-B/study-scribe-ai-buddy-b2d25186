import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Subject } from '@/types';
import { Plus, ChevronRight, ChevronLeft, Folder, BookOpen, LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import SubjectCard from './SubjectCard';
import { motion } from 'framer-motion';

const SubjectList: React.FC = () => {
  const { subjects, addSubject, setActiveSubject } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [newSubject, setNewSubject] = useState({
    name: '',
    description: '',
    color: '#9B87F5' // Default color
  });
  const [showDialog, setShowDialog] = useState(false);

  const handleAddSubject = () => {
    if (newSubject.name.trim()) {
      addSubject({
        name: newSubject.name,
        description: newSubject.description,
        color: newSubject.color
      });
      setNewSubject({
        name: '',
        description: '',
        color: '#9B87F5'
      });
      setShowDialog(false);
    }
  };

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="flex">
      {/* Collapsible Sidebar */}
      <motion.div 
        className="bg-card h-[calc(100vh-7rem)] rounded-lg shadow-lg overflow-hidden"
        initial={{ width: 72 }}
        animate={{ 
          width: isExpanded || isHovering ? 280 : 72,
          transition: { duration: 0.3 }
        }}
        onHoverStart={() => setIsHovering(true)}
        onHoverEnd={() => setIsHovering(false)}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className={`font-medium ${isExpanded || isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
            My Subjects
          </h3>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSidebar}
            className="shrink-0"
          >
            {isExpanded ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />}
          </Button>
        </div>
        
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          <div className="p-3 space-y-1">
            {subjects.map(subject => (
              <motion.div
                key={subject.id}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setActiveSubject(subject)}
              >
                <div 
                  className="flex items-center gap-3 p-2 rounded-md cursor-pointer hover:bg-muted transition-colors"
                  style={{ borderLeft: `3px solid ${subject.color}` }}
                >
                  <Folder className="h-5 w-5 shrink-0" style={{ color: subject.color }} />
                  <div className={`${isExpanded || isHovering ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300 truncate`}>
                    <p className="font-medium">{subject.name}</p>
                    {subject.resources.length > 0 && (
                      <p className="text-xs text-muted-foreground">{subject.resources.length} resource{subject.resources.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="p-3 border-t">
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                className={`w-full ${isExpanded || isHovering ? 'justify-start' : 'justify-center'}`}
              >
                <Plus className="h-4 w-4 mr-2" />
                {(isExpanded || isHovering) && <span>Add Subject</span>}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Subject</DialogTitle>
                <DialogDescription>
                  Create a new subject to organize your study materials.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Subject Name</Label>
                  <Input 
                    id="name" 
                    value={newSubject.name} 
                    onChange={(e) => setNewSubject({...newSubject, name: e.target.value})}
                    placeholder="e.g. Mathematics"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Input 
                    id="description" 
                    value={newSubject.description} 
                    onChange={(e) => setNewSubject({...newSubject, description: e.target.value})}
                    placeholder="e.g. Calculus and Algebra"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="color">Color</Label>
                  <div className="flex items-center gap-2">
                    <input 
                      type="color" 
                      id="color" 
                      value={newSubject.color} 
                      onChange={(e) => setNewSubject({...newSubject, color: e.target.value})}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground">{newSubject.color}</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancel</Button>
                <Button onClick={handleAddSubject}>Add Subject</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="ml-6 flex-1">
        <h2 className="text-2xl font-bold mb-6">Your Study Subjects</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map(subject => (
            <SubjectCard key={subject.id} subject={subject} />
          ))}
          
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Card className="cursor-pointer hover:bg-muted/50 transition-colors border-dashed">
                <CardContent className="flex flex-col items-center justify-center h-full min-h-[200px]">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Plus className="h-6 w-6 text-primary" />
                  </div>
                  <p className="mt-4 font-medium">Add New Subject</p>
                </CardContent>
              </Card>
            </DialogTrigger>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default SubjectList;
