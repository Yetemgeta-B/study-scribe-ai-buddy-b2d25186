
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { Calendar, Book, Clock } from 'lucide-react';
import { formatDate } from '@/lib/utils';

const HomePage: React.FC = () => {
  const { scheduleData, subjects } = useApp();
  const today = new Date();
  const dayOfWeek = today.getDay();
  // Convert Sunday (0) to 6 for our schedule format, and others to match our 0-based days
  // (0 = Monday, 1 = Tuesday, ..., 5 = Saturday in our schedule)
  const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  
  // Get today's schedule
  const todaysClasses = scheduleData.filter(cell => cell.day === adjustedDay && cell.subject)
    .sort((a, b) => a.period - b.period);
  
  // Get recent subjects
  const recentSubjects = subjects.slice(0, 3);

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold">Welcome to StudyScribe</h2>
        <p className="text-muted-foreground">Your personal study companion</p>
        <p className="mt-2 text-lg font-medium">{formatDate(new Date())}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Today's Schedule
            </CardTitle>
            <CardDescription>
              {dayOfWeek === 0 ? "Sunday" : ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"][adjustedDay]}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {todaysClasses.length > 0 ? (
              <ul className="space-y-2">
                {todaysClasses.map((classItem) => (
                  <li key={`${classItem.day}-${classItem.period}`} className="rounded-md bg-background/80 p-2">
                    <div className="font-medium">{classItem.subject}</div>
                    <div className="text-xs">Period {classItem.period}</div>
                    {classItem.room && <div className="text-xs">Room: {classItem.room}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-4">No classes scheduled for today</p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-gradient-to-br from-accent/50 to-accent/20 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Recent Subjects
            </CardTitle>
            <CardDescription>Your recently accessed subjects</CardDescription>
          </CardHeader>
          <CardContent>
            {recentSubjects.length > 0 ? (
              <ul className="space-y-2">
                {recentSubjects.map((subject) => (
                  <li key={subject.id} className="rounded-md bg-background/80 p-2">
                    <div className="font-medium">{subject.name}</div>
                    {subject.description && (
                      <div className="text-xs text-muted-foreground">{subject.description}</div>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-muted-foreground py-4">No subjects added yet</p>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden bg-gradient-to-br from-secondary/70 to-secondary/30 shadow-lg">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Study Tracker
            </CardTitle>
            <CardDescription>Track your study progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-6">
              <div className="text-4xl font-bold">0h</div>
              <p className="text-muted-foreground">Study time today</p>
              <button className="mt-3 rounded-full bg-primary px-3 py-1 text-sm text-white hover:bg-primary/90">
                Start Session
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Quick Tips</CardTitle>
            <CardDescription>Make the most of your study time</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Break your study sessions into 25-minute focused blocks</li>
              <li>Review your notes within 24 hours of taking them</li>
              <li>Use the AI assistant for help with difficult concepts</li>
              <li>Keep your study environment clean and distraction-free</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Get Started</CardTitle>
            <CardDescription>New to StudyScribe?</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 list-disc pl-5">
              <li>Add your subjects in the Subjects section</li>
              <li>Set up your weekly schedule</li>
              <li>Create study plans for upcoming exams</li>
              <li>Configure the AI assistant with your API key in Settings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default HomePage;
