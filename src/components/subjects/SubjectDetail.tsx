
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Pencil, Trash, Save, X, BookOpen, FileText, Calendar, MessageSquare, Plus, Copy } from 'lucide-react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen as BookOpenIcon, FileText as FileTextIcon, Calendar as CalendarIcon, Copy as CopyIcon, Edit3, File, Share2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import PDFUploader from '@/components/pdf/PDFUploader';

const SubjectDetail: React.FC = () => {
  const { activeSubject, setActiveSubject, deleteSubject, updateSubject } = useApp();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editableSubject, setEditableSubject] = useState<any>(null);
  
  // States for grading components
  const [gradingComponents, setGradingComponents] = useState([
    { name: 'Midterm Exam', weight: 30 },
    { name: 'Final Exam', weight: 40 },
    { name: 'Assignments', weight: 20 },
    { name: 'Participation', weight: 10 }
  ]);
  
  const [resources, setResources] = useState([
    {
      id: '1',
      title: 'Course Syllabus',
      type: 'pdf',
      date: '2023-09-01',
    },
    {
      id: '2',
      title: 'Lecture Notes - Week 1',
      type: 'pdf',
      date: '2023-09-05',
    },
    {
      id: '3',
      title: 'Course Website',
      type: 'link',
      url: 'https://example.com/course',
      date: '2023-09-01',
    }
  ]);
  
  const [showPdfUploader, setShowPdfUploader] = useState(false);

  if (!activeSubject) return null;
  
  // Initialize editable subject data when editing starts
  const startEditing = () => {
    setEditableSubject({
      ...activeSubject,
      description: activeSubject.description || 'No description provided',
      schedule: activeSubject.schedule || 'No schedule information available',
    });
    setIsEditing(true);
  };
  
  const cancelEditing = () => {
    setIsEditing(false);
    setEditableSubject(null);
  };
  
  const saveChanges = () => {
    if (editableSubject) {
      updateSubject({
        ...activeSubject,
        name: editableSubject.name,
        description: editableSubject.description,
        schedule: editableSubject.schedule
      });
      setIsEditing(false);
      setEditableSubject(null);
    }
  };

  const handleDelete = () => {
    deleteSubject(activeSubject.id);
    setIsDeleteDialogOpen(false);
  };

  const handleAddResource = () => {
    setShowPdfUploader(true);
  };
  
  const handleUploadComplete = (file: File) => {
    // Create a new resource entry
    const newResource = {
      id: Date.now().toString(),
      title: file.name.replace('.pdf', ''),
      type: 'pdf',
      date: new Date().toISOString().split('T')[0],
    };
    
    setResources([newResource, ...resources]);
    setShowPdfUploader(false);
  };
  
  const handleUpdateGradingComponent = (index: number, field: 'name' | 'weight', value: string) => {
    const updatedComponents = [...gradingComponents];
    if (field === 'name') {
      updatedComponents[index].name = value;
    } else {
      const numValue = parseInt(value, 10);
      updatedComponents[index].weight = isNaN(numValue) ? 0 : numValue;
    }
    setGradingComponents(updatedComponents);
  };
  
  const addGradingComponent = () => {
    setGradingComponents([...gradingComponents, { name: 'New Component', weight: 0 }]);
  };
  
  const removeGradingComponent = (index: number) => {
    const updatedComponents = [...gradingComponents];
    updatedComponents.splice(index, 1);
    setGradingComponents(updatedComponents);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="mb-6 flex items-center">
        <Button variant="ghost" onClick={() => setActiveSubject(null)} className="mr-3">
          <ArrowLeft size={16} />
          <span className="ml-1">Back</span>
        </Button>
        <h2 className="text-2xl font-bold">{isEditing ? 'Edit Subject' : 'Subject Details'}</h2>
        <div className="ml-auto flex items-center">
          {!isEditing && (
            <>
              <Button variant="outline" size="sm" className="mr-2" onClick={startEditing}>
                <Pencil size={14} className="mr-1" />
                Edit
              </Button>
              <Button variant="destructive" size="sm" onClick={() => setIsDeleteDialogOpen(true)}>
                <Trash size={14} className="mr-1" />
                Delete
              </Button>
            </>
          )}
          {isEditing && (
            <>
              <Button variant="outline" size="sm" className="mr-2" onClick={cancelEditing}>
                <X size={14} className="mr-1" />
                Cancel
              </Button>
              <Button variant="default" size="sm" onClick={saveChanges}>
                <Save size={14} className="mr-1" />
                Save Changes
              </Button>
            </>
          )}
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
          {isEditing ? (
            <Input 
              value={editableSubject.name} 
              onChange={(e) => setEditableSubject({...editableSubject, name: e.target.value})}
              className="font-bold text-xl mb-1"
            />
          ) : (
            <h3 className="text-xl font-bold">{activeSubject.name}</h3>
          )}
          {isEditing ? (
            <Input 
              value={editableSubject.description} 
              onChange={(e) => setEditableSubject({...editableSubject, description: e.target.value})}
              placeholder="Add a description"
              className="text-muted-foreground"
            />
          ) : (
            <p className="text-muted-foreground">{activeSubject.description || 'No description'}</p>
          )}
        </div>
      </div>

      {/* Ribbon-like interface */}
      <div className="mb-6 border rounded-lg overflow-hidden bg-card shadow-sm">
        <div className="flex items-center p-2 bg-muted/50">
          <Button 
            variant={activeTab === 'overview' ? 'secondary' : 'ghost'}
            className="rounded-sm gap-2"
            onClick={() => setActiveTab('overview')}
          >
            <BookOpenIcon className="h-4 w-4" />
            Overview
          </Button>
          <Button 
            variant={activeTab === 'resources' ? 'secondary' : 'ghost'}
            className="rounded-sm gap-2"
            onClick={() => setActiveTab('resources')}
          >
            <FileTextIcon className="h-4 w-4" />
            Resources
          </Button>
          <Button 
            variant={activeTab === 'schedule' ? 'secondary' : 'ghost'}
            className="rounded-sm gap-2"
            onClick={() => setActiveTab('schedule')}
          >
            <CalendarIcon className="h-4 w-4" />
            Schedule
          </Button>
          
          <div className="ml-auto flex items-center">
            <Button variant="ghost" size="sm" className="gap-2">
              <CopyIcon className="h-4 w-4" />
              <span className="hidden sm:inline">Copy</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-2">
              <Share2 className="h-4 w-4" />
              <span className="hidden sm:inline">Share</span>
            </Button>
          </div>
        </div>
        
        <div className="p-4">
          {activeTab === 'overview' && (
            <Card>
              <CardHeader>
                <CardTitle>About this Course</CardTitle>
                <CardDescription>Course details and information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none space-y-6">
                  {isEditing ? (
                    <Textarea 
                      value={editableSubject.description}
                      onChange={(e) => setEditableSubject({...editableSubject, description: e.target.value})}
                      placeholder="Enter course description"
                      className="min-h-32"
                    />
                  ) : (
                    <p>{activeSubject.description || 'No description provided.'}</p>
                  )}
                  
                  <div>
                    <h3 className="text-lg font-medium mb-2">Schedule</h3>
                    {isEditing ? (
                      <Textarea 
                        value={editableSubject.schedule}
                        onChange={(e) => setEditableSubject({...editableSubject, schedule: e.target.value})}
                        placeholder="Enter schedule information"
                        className="min-h-24"
                      />
                    ) : (
                      <p>{activeSubject.schedule || 'No schedule information available.'}</p>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Course Objectives</h3>
                      {isEditing && (
                        <Button variant="outline" size="sm">
                          <Plus className="h-3 w-3 mr-1" />
                          Add Objective
                        </Button>
                      )}
                    </div>
                    <ul>
                      <li>Understand core concepts and principles</li>
                      <li>Develop analytical and critical thinking skills</li>
                      <li>Apply theoretical knowledge to practical problems</li>
                      <li>Collaborate effectively in team settings</li>
                    </ul>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-medium">Grading</h3>
                      {isEditing && (
                        <Button variant="outline" size="sm" onClick={addGradingComponent}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Component
                        </Button>
                      )}
                    </div>
                    
                    {isEditing ? (
                      <div className="space-y-2">
                        {gradingComponents.map((component, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={component.name}
                              onChange={(e) => handleUpdateGradingComponent(index, 'name', e.target.value)}
                              className="flex-grow"
                            />
                            <div className="flex items-center gap-1 w-24">
                              <Input
                                type="number"
                                value={component.weight}
                                onChange={(e) => handleUpdateGradingComponent(index, 'weight', e.target.value)}
                                className="w-16"
                                min={0}
                                max={100}
                              />
                              <span className="text-muted-foreground">%</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => removeGradingComponent(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="pt-2 text-muted-foreground text-sm">
                          Total: {gradingComponents.reduce((sum, component) => sum + component.weight, 0)}%
                          {gradingComponents.reduce((sum, component) => sum + component.weight, 0) !== 100 && (
                            <span className="text-destructive ml-2">(Should add up to 100%)</span>
                          )}
                        </div>
                      </div>
                    ) : (
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="text-left">Component</th>
                            <th className="text-right">Weight</th>
                          </tr>
                        </thead>
                        <tbody>
                          {gradingComponents.map((component, index) => (
                            <tr key={index}>
                              <td>{component.name}</td>
                              <td className="text-right">{component.weight}%</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
          
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">Course Resources</h2>
                <Button onClick={handleAddResource} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Resource
                </Button>
              </div>
              
              {showPdfUploader ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Upload PDF Resource</CardTitle>
                    <CardDescription>
                      Upload a PDF document to add to your course resources
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PDFUploader onUploadComplete={handleUploadComplete} />
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {resources.map((resource) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className="h-full">
                        <CardHeader className="p-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">{resource.title}</CardTitle>
                              <CardDescription>
                                {new Date(resource.date).toLocaleDateString()}
                              </CardDescription>
                            </div>
                            {resource.type === 'pdf' ? (
                              <div className="h-10 w-10 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5" />
                              </div>
                            ) : (
                              <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg flex items-center justify-center">
                                <BookOpen className="h-5 w-5" />
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => {
                              if (resource.type === 'pdf') {
                                setActiveTab('pdf-viewer');
                              }
                            }}
                          >
                            {resource.type === 'pdf' ? 'View PDF' : 'Open Link'}
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {activeTab === 'schedule' && (
            <Card>
              <CardHeader>
                <CardTitle>Course Schedule</CardTitle>
                <CardDescription>Weekly schedule and important dates</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Week 1: Introduction</h3>
                    <p className="text-muted-foreground">Sept 1 - Sept 7</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Lecture: Course Overview (Mon, 10:00 AM)</li>
                      <li>• Lab: Introduction to Tools (Wed, 2:00 PM)</li>
                      <li>• Assignment #1 Due (Fri, 11:59 PM)</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Week 2: Fundamentals</h3>
                    <p className="text-muted-foreground">Sept 8 - Sept 14</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Lecture: Core Concepts (Mon, 10:00 AM)</li>
                      <li>• Lab: Application Practice (Wed, 2:00 PM)</li>
                      <li>• Quiz #1 (Fri, 10:00 AM)</li>
                    </ul>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="font-medium">Week 3: Advanced Topics</h3>
                    <p className="text-muted-foreground">Sept 15 - Sept 21</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      <li>• Lecture: Advanced Methodology (Mon, 10:00 AM)</li>
                      <li>• Lab: Group Project Kickoff (Wed, 2:00 PM)</li>
                      <li>• Assignment #2 Due (Fri, 11:59 PM)</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

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
