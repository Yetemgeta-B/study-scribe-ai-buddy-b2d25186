
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Calendar } from '@/components/ui/calendar';
import { formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock, Plus, Calendar as CalendarIcon } from 'lucide-react';
import { StudyPlan } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Checkbox } from '@/components/ui/checkbox';

const PlannerPage: React.FC = () => {
  const { studyPlans, subjects, addStudyPlan, updateStudyPlan, deleteStudyPlan } = useApp();
  const [date, setDate] = useState<Date>(new Date());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<{
    title: string;
    subjectId: string;
    date: Date;
    duration: number;
    priority: 'low' | 'medium' | 'high';
  }>({
    title: '',
    subjectId: subjects[0]?.id || '',
    date: new Date(),
    duration: 60,
    priority: 'medium',
  });

  const filteredPlans = studyPlans.filter(
    plan => formatDate(plan.date) === formatDate(date)
  );

  const handleAddPlan = () => {
    if (newPlan.title && newPlan.subjectId) {
      addStudyPlan({
        ...newPlan,
        completed: false,
      });
      setNewPlan({
        title: '',
        subjectId: subjects[0]?.id || '',
        date: new Date(),
        duration: 60,
        priority: 'medium',
      });
      setIsDialogOpen(false);
    }
  };

  const handleToggleComplete = (plan: StudyPlan) => {
    updateStudyPlan({
      ...plan,
      completed: !plan.completed,
    });
  };

  const getPriorityClass = (priority: 'low' | 'medium' | 'high') => {
    switch (priority) {
      case 'low':
        return 'text-blue-500 border-blue-500';
      case 'medium':
        return 'text-amber-500 border-amber-500';
      case 'high':
        return 'text-red-500 border-red-500';
      default:
        return '';
    }
  };

  const getSubjectById = (id: string) => {
    return subjects.find(subject => subject.id === id);
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Study Planner</h2>
          <p className="text-muted-foreground">Plan your study sessions</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus size={16} className="mr-1" />
          Add Study Plan
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border p-4">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(date) => date && setDate(date)}
              className="pointer-events-auto"
            />
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="rounded-lg border border-border p-4">
            <h3 className="mb-4 text-lg font-semibold">
              Study Plans for {formatDate(date)}
            </h3>

            {filteredPlans.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock size={48} className="mb-4 text-muted-foreground" />
                <p className="text-muted-foreground">
                  No study plans for this day
                </p>
                <Button
                  variant="link"
                  onClick={() => setIsDialogOpen(true)}
                  className="mt-2"
                >
                  Add a study plan
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredPlans.map((plan) => {
                  const subject = getSubjectById(plan.subjectId);
                  return (
                    <div
                      key={plan.id}
                      className={`flex items-center justify-between rounded-md border border-border p-4 ${
                        plan.completed ? 'bg-secondary/50' : ''
                      }`}
                    >
                      <div className="flex items-center">
                        <Checkbox
                          checked={plan.completed}
                          onCheckedChange={() => handleToggleComplete(plan)}
                          className="mr-3"
                        />
                        <div>
                          <h4
                            className={`font-medium ${
                              plan.completed ? 'line-through text-muted-foreground' : ''
                            }`}
                          >
                            {plan.title}
                          </h4>
                          <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                            {subject && (
                              <span
                                className="inline-flex rounded-full px-2 py-0.5 text-xs font-medium"
                                style={{ backgroundColor: subject.color, color: 'white' }}
                              >
                                {subject.name}
                              </span>
                            )}
                            <span className="inline-flex items-center gap-1">
                              <Clock size={12} />
                              {plan.duration} min
                            </span>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${getPriorityClass(
                                plan.priority
                              )}`}
                            >
                              {plan.priority}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Study Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="e.g., Review Chapter 3"
                value={newPlan.title}
                onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={newPlan.subjectId}
                onValueChange={(value) => setNewPlan({ ...newPlan, subjectId: value })}
              >
                <SelectTrigger id="subject">
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn("w-full justify-start text-left font-normal")}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newPlan.date ? format(newPlan.date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newPlan.date}
                    onSelect={(date) => date && setNewPlan({ ...newPlan, date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                value={newPlan.duration}
                onChange={(e) =>
                  setNewPlan({ ...newPlan, duration: parseInt(e.target.value) || 30 })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Select
                value={newPlan.priority}
                onValueChange={(value) =>
                  setNewPlan({ ...newPlan, priority: value as 'low' | 'medium' | 'high' })
                }
              >
                <SelectTrigger id="priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddPlan}>Create Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlannerPage;
