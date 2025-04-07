import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useApp } from '@/context/AppContext';
import { Calendar, Book, Clock, Calculator, Award, BookOpen, Target } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const HomePage: React.FC = () => {
  const { scheduleData, subjects, setActivePage } = useApp();
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

  // Get a greeting based on time of day
  const getGreeting = () => {
    const hour = today.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-primary">{getGreeting()}</h2>
        <p className="text-2xl font-medium mt-2">Welcome to your personal study space</p>
        <p className="text-muted-foreground mt-1">{formatDate(new Date())}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Button 
          variant="outline" 
          className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-primary/10"
          onClick={() => setActivePage('subjects')}
        >
          <Book className="h-8 w-8 text-primary" />
          <span>My Subjects</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-primary/10"
          onClick={() => setActivePage('schedule')}
        >
          <Calendar className="h-8 w-8 text-primary" />
          <span>Schedule</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-primary/10"
          onClick={() => setActivePage('calculator')}
        >
          <Calculator className="h-8 w-8 text-primary" />
          <span>Calculator</span>
        </Button>
        
        <Button 
          variant="outline" 
          className="h-auto py-6 flex flex-col items-center justify-center gap-2 hover:bg-primary/10"
          onClick={() => setActivePage('assistant')}
        >
          <BookOpen className="h-8 w-8 text-primary" />
          <span>AI Assistant</span>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card className="overflow-hidden shadow-md border-l-4 border-l-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
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
                  <li key={`${classItem.day}-${classItem.period}`} className="rounded-md bg-muted/50 p-2">
                    <div className="font-medium">{classItem.subject}</div>
                    <div className="text-xs">Period {classItem.period}</div>
                    {classItem.room && <div className="text-xs">Room: {classItem.room}</div>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="flex flex-col items-center justify-center py-4 text-center">
                <p className="text-muted-foreground">No classes scheduled for today</p>
                <Button variant="link" onClick={() => setActivePage('schedule')} className="mt-2">
                  Add to schedule
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md border-l-4 border-l-blue-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-500" />
              My Goals
            </CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center rounded-md bg-muted/50 p-2">
                <div className="bg-blue-100 text-blue-600 rounded-full p-1 mr-3">
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Complete today's assignments</div>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-1">
                    <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="text-xs font-semibold">65%</div>
              </div>
              
              <div className="flex items-center rounded-md bg-muted/50 p-2">
                <div className="bg-green-100 text-green-600 rounded-full p-1 mr-3">
                  <Award className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium">Study for midterm exams</div>
                  <div className="h-1.5 w-full bg-muted rounded-full mt-1">
                    <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '40%' }}></div>
                  </div>
                </div>
                <div className="text-xs font-semibold">40%</div>
              </div>
              
              <Button variant="link" className="w-full text-center" onClick={() => setActivePage('planner')}>
                View all goals
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="overflow-hidden shadow-md border-l-4 border-l-purple-500">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-500" />
              Study Tracker
            </CardTitle>
            <CardDescription>Today's focus time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="text-4xl font-bold text-purple-500">02:15</div>
              <p className="text-sm text-muted-foreground">Hours studied today</p>
              <div className="flex gap-2 mt-4">
                <Button className="bg-purple-500 hover:bg-purple-600">
                  Start Session
                </Button>
                <Button variant="outline">
                  View History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="overflow-hidden shadow-md">
        <CardHeader>
          <CardTitle>Personalized Tips</CardTitle>
          <CardDescription>Based on your study patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
              <div className="bg-amber-100 text-amber-600 rounded-full p-1.5 shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Schedule breaks between study sessions</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Taking short 5-10 minute breaks every 25-30 minutes can improve retention and focus.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-md bg-muted/50">
              <div className="bg-cyan-100 text-cyan-600 rounded-full p-1.5 shrink-0">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-medium">Try the Feynman Technique</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  Explain concepts in simple terms as if teaching someone else to identify gaps in your understanding.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
