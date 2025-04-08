
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
import PDFViewer from '@/components/pdf/PDFViewer';
import { Resource } from '@/types';
import { toast } from 'sonner';

const SubjectDetail: React.FC = () => {
  const { activeSubject, setActiveSubject, deleteSubject, updateSubject, addResource } = useApp();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editableSubject, setEditableSubject] = useState<any>(null);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);
  
  // States for grading components
  const [gradingComponents, setGradingComponents] = useState([
    { name: 'Midterm Exam', weight: 30 },
    { name: 'Final Exam', weight: 40 },
    { name: 'Assignments', weight: 20 },
    { name: 'Participation', weight: 10 }
  ]);
  
  const [objectives, setObjectives] = useState([
    'Understand core concepts and principles',
    'Develop analytical and critical thinking skills',
    'Apply theoretical knowledge to practical problems',
    'Collaborate effectively in team settings'
  ]);
  
  const [resources, setResources] = useState<Resource[]>([]);
  
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
      const updatedSubject = {
        ...activeSubject,
        name: editableSubject.name,
        description: editableSubject.description,
        schedule: editableSubject.schedule
      };
      
      updateSubject(updatedSubject);
      setIsEditing(false);
      setEditableSubject(null);
      toast.success("Subject details updated successfully");
    }
  };

  const handleDelete = () => {
    deleteSubject(activeSubject.id);
    setIsDeleteDialogOpen(false);
    toast.success("Subject deleted successfully");
  };

  const handleAddResource = () => {
    setShowPdfUploader(true);
    setSelectedResource(null);
  };
  
  const handleUploadComplete = (file: File) => {
    // Create file URL
    const fileUrl = URL.createObjectURL(file);
    
    // Create a new resource entry
    const newResource: Omit<Resource, 'id' | 'createdAt'> = {
      name: file.name.replace('.pdf', ''),
      type: 'pdf',
      path: fileUrl,
      subjectId: activeSubject.id,
    };
    
    // Add the resource to the subject
    addResource(newResource);
    
    setShowPdfUploader(false);
    toast.success(`Resource "${newResource.name}" added successfully`);
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

  const handleAddObjective = () => {
    setObjectives([...objectives, 'New course objective']);
  };

  const handleUpdateObjective = (index: number, value: string) => {
    const updatedObjectives = [...objectives];
    updatedObjectives[index] = value;
    setObjectives(updatedObjectives);
  };

  const handleRemoveObjective = (index: number) => {
    const updatedObjectives = [...objectives];
    updatedObjectives.splice(index, 1);
    setObjectives(updatedObjectives);
  };

  const openResource = (resource: Resource) => {
    setSelectedResource(resource);
    setActiveTab('pdf-viewer');
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
        <div className="flex items-center p-2 bg-muted/50 overflow-x-auto">
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
          
          {selectedResource && (
            <Button 
              variant={activeTab === 'pdf-viewer' ? 'secondary' : 'ghost'}
              className="rounded-sm gap-2"
              onClick={() => setActiveTab('pdf-viewer')}
            >
              <File className="h-4 w-4" />
              {selectedResource.name}
            </Button>
          )}
          
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
                        <Button variant="outline" size="sm" onClick={handleAddObjective}>
                          <Plus className="h-3 w-3 mr-1" />
                          Add Objective
                        </Button>
                      )}
                    </div>
                    {isEditing ? (
                      <div className="space-y-2">
                        {objectives.map((objective, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input
                              value={objective}
                              onChange={(e) => handleUpdateObjective(index, e.target.value)}
                              className="flex-grow"
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => handleRemoveObjective(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <ul>
                        {objectives.map((objective, index) => (
                          <li key={index}>{objective}</li>
                        ))}
                      </ul>
                    )}
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
                  {activeSubject.resources.map((resource) => (
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
                              <CardTitle className="text-lg">{resource.name}</CardTitle>
                              <CardDescription>
                                {resource.createdAt ? new Date(resource.createdAt).toLocaleDateString() : 'Unknown date'}
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
                            onClick={() => openResource(resource)}
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

          {activeTab === 'pdf-viewer' && selectedResource && selectedResource.path && (
            <div>
              <PDFViewer file={selectedResource.path} />
            </div>
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
