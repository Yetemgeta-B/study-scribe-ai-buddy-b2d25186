import React, { useState } from 'react';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { BookOpen, FileText, Calendar, Calculator, MessageSquare, Plus } from 'lucide-react';
import PDFUploader from '@/components/pdf/PDFUploader';

const SubjectDetail: React.FC = () => {
  const { activeSubject, setActiveSubject, deleteSubject } = useApp();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
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

  return (
    <div className="container mx-auto py-6 max-w-7xl">
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

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 mb-8">
          <TabsTrigger value="overview" className="flex gap-2 items-center">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Overview</span>
          </TabsTrigger>
          <TabsTrigger value="resources" className="flex gap-2 items-center">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Resources</span>
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex gap-2 items-center">
            <Calendar className="h-4 w-4" />
            <span className="hidden sm:inline">Schedule</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex gap-2 items-center">
            <Calculator className="h-4 w-4" />
            <span className="hidden sm:inline">Calculator</span>
          </TabsTrigger>
          <TabsTrigger value="discuss" className="flex gap-2 items-center">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Discuss</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <Card>
            <CardHeader>
              <CardTitle>About this Course</CardTitle>
              <CardDescription>Course details and information</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose dark:prose-invert max-w-none">
                <p>{activeSubject.description}</p>
                
                <h3>Schedule</h3>
                <p>{activeSubject.schedule ?? 'No schedule information available'}</p>
                
                <h3>Course Objectives</h3>
                <ul>
                  <li>Understand core concepts and principles</li>
                  <li>Develop analytical and critical thinking skills</li>
                  <li>Apply theoretical knowledge to practical problems</li>
                  <li>Collaborate effectively in team settings</li>
                </ul>
                
                <h3>Grading</h3>
                <table className="w-full">
                  <thead>
                    <tr>
                      <th>Component</th>
                      <th>Weight</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Midterm Exam</td>
                      <td>30%</td>
                    </tr>
                    <tr>
                      <td>Final Exam</td>
                      <td>40%</td>
                    </tr>
                    <tr>
                      <td>Assignments</td>
                      <td>20%</td>
                    </tr>
                    <tr>
                      <td>Participation</td>
                      <td>10%</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="resources">
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
        </TabsContent>
        
        <TabsContent value="schedule">
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
        </TabsContent>
        
        <TabsContent value="calculator">
          <Card>
            <CardHeader>
              <CardTitle>Grade Calculator</CardTitle>
              <CardDescription>Calculate your overall grade and needed scores</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Grade calculator coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="discuss">
          <Card>
            <CardHeader>
              <CardTitle>Discussion Forum</CardTitle>
              <CardDescription>Ask questions and discuss with classmates</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-12">
                Discussion forum coming soon!
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

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
