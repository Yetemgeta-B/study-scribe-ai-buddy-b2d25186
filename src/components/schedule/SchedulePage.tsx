import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { getDayName, getPeriodTime } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ScheduleCell } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Download, Calendar, Palette, Plus, Edit, Trash } from 'lucide-react';
import { GradientPicker } from '@/components/ui/gradient-picker';

// Define the types for our schedule data
interface TimeSlot {
  id: string;
  subject: string;
  time: string;
  location: string;
  professor?: string;
  notes?: string;
  color: string;
}

interface Day {
  name: string;
  slots: TimeSlot[];
}

interface Schedule {
  id: string;
  name: string;
  days: Day[];
}

// Default color presets for subjects
const DEFAULT_COLORS = [
  'linear-gradient(to right, #ff9a9e, #fad0c4)',
  'linear-gradient(to right, #a1c4fd, #c2e9fb)',
  'linear-gradient(to right, #ffecd2, #fcb69f)',
  'linear-gradient(to right, #84fab0, #8fd3f4)',
  'linear-gradient(to right, #cfd9df, #e2ebf0)',
  'linear-gradient(to right, #a6c0fe, #f68084)',
  'linear-gradient(to right, #fccb90, #d57eeb)',
  'linear-gradient(to right, #e0c3fc, #8ec5fc)',
];

// Sample data for demonstration
const SAMPLE_SCHEDULE: Schedule = {
  id: '1',
  name: 'Fall Semester 2024',
  days: [
    {
      name: 'Monday',
      slots: [
        {
          id: 'm1',
          subject: 'Mathematics 101',
          time: '09:00 - 10:30',
          location: 'Room A204',
          professor: 'Dr. Smith',
          color: DEFAULT_COLORS[0],
        },
        {
          id: 'm2',
          subject: 'Physics Lab',
          time: '11:00 - 13:00',
          location: 'Science Building',
          professor: 'Prof. Johnson',
          color: DEFAULT_COLORS[1],
        },
        {
          id: 'm3',
          subject: 'Computer Science',
          time: '14:00 - 15:30',
          location: 'Tech Hall',
          professor: 'Dr. Williams',
          color: DEFAULT_COLORS[2],
        },
      ],
    },
    {
      name: 'Tuesday',
      slots: [
        {
          id: 't1',
          subject: 'Literature',
          time: '10:00 - 11:30',
          location: 'Room B106',
          professor: 'Prof. Davis',
          color: DEFAULT_COLORS[3],
        },
        {
          id: 't2',
          subject: 'History',
          time: '13:00 - 14:30',
          location: 'Room C301',
          professor: 'Dr. Anderson',
          color: DEFAULT_COLORS[4],
        },
      ],
    },
    {
      name: 'Wednesday',
      slots: [
        {
          id: 'w1',
          subject: 'Mathematics 101',
          time: '09:00 - 10:30',
          location: 'Room A204',
          professor: 'Dr. Smith',
          color: DEFAULT_COLORS[0],
        },
        {
          id: 'w2',
          subject: 'Chemistry',
          time: '11:00 - 12:30',
          location: 'Science Building',
          professor: 'Dr. Martinez',
          color: DEFAULT_COLORS[5],
        },
      ],
    },
    {
      name: 'Thursday',
      slots: [
        {
          id: 'th1',
          subject: 'Literature',
          time: '10:00 - 11:30',
          location: 'Room B106',
          professor: 'Prof. Davis',
          color: DEFAULT_COLORS[3],
        },
        {
          id: 'th2',
          subject: 'Art History',
          time: '13:00 - 14:30',
          location: 'Art Center',
          professor: 'Dr. Thomas',
          color: DEFAULT_COLORS[6],
        },
        {
          id: 'th3',
          subject: 'Sociology',
          time: '15:00 - 16:30',
          location: 'Room D105',
          professor: 'Prof. Wilson',
          color: DEFAULT_COLORS[7],
        },
      ],
    },
    {
      name: 'Friday',
      slots: [
        {
          id: 'f1',
          subject: 'Computer Science',
          time: '09:00 - 10:30',
          location: 'Tech Hall',
          professor: 'Dr. Williams',
          color: DEFAULT_COLORS[2],
        },
        {
          id: 'f2',
          subject: 'Physical Education',
          time: '14:00 - 16:00',
          location: 'Sports Complex',
          professor: 'Coach Brown',
          color: DEFAULT_COLORS[0],
        },
      ],
    },
  ],
};

const SchedulePage: React.FC = () => {
  const { scheduleData, updateScheduleCell, subjects } = useApp();
  const [selectedCell, setSelectedCell] = useState<ScheduleCell | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeSchedule, setActiveSchedule] = useState<Schedule>(SAMPLE_SCHEDULE);
  const [activeDay, setActiveDay] = useState("all");
  const [editMode, setEditMode] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedSlotColor, setSelectedSlotColor] = useState<string>(DEFAULT_COLORS[0]);
  
  // Ref for the schedule content to export
  const scheduleRef = useRef<HTMLDivElement>(null);
  
  const handleCellClick = (cell: ScheduleCell) => {
    setSelectedCell(cell);
    setDialogOpen(true);
  };

  const handleUpdateCell = () => {
    if (selectedCell) {
      updateScheduleCell(selectedCell);
      setDialogOpen(false);
    }
  };

  // Group cells by day
  const daysCells = Array.from({ length: 6 }, (_, dayIndex) => {
    return scheduleData.filter(cell => cell.day === dayIndex);
  });

  // Function to export schedule as PNG
  const exportAsPNG = async () => {
    if (scheduleRef.current) {
      try {
        const canvas = await html2canvas(scheduleRef.current, {
          scale: 2, // Increase quality
          backgroundColor: null,
        });
        
        const image = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = image;
        link.download = `${activeSchedule.name.replace(/\s+/g, '_')}.png`;
        link.click();
      } catch (error) {
        console.error('Error exporting schedule:', error);
      }
    }
  };
  
  // Function to update the color of a time slot
  const updateSlotColor = (slotId: string, newColor: string) => {
    const updatedDays = activeSchedule.days.map(day => {
      const updatedSlots = day.slots.map(slot => {
        if (slot.id === slotId) {
          return { ...slot, color: newColor };
        }
        return slot;
      });
      return { ...day, slots: updatedSlots };
    });
    
    setActiveSchedule({ ...activeSchedule, days: updatedDays });
  };
  
  // When a slot is selected for editing
  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setSelectedSlotColor(slot.color);
  };
  
  // Apply color changes to the selected slot
  const applyColorChanges = () => {
    if (selectedSlot) {
      updateSlotColor(selectedSlot.id, selectedSlotColor);
      setSelectedSlot(null);
    }
  };
  
  // Cancel color editing
  const cancelColorEditing = () => {
    setSelectedSlot(null);
  };
  
  // Filter days based on the active tab
  const filteredDays = activeDay === "all" 
    ? activeSchedule.days 
    : activeSchedule.days.filter(day => day.name.toLowerCase() === activeDay.toLowerCase());

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <div className="flex flex-col gap-6">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">{activeSchedule.name}</h1>
            <p className="text-muted-foreground">Manage your weekly schedule and classes</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={() => setEditMode(!editMode)}
              className="gap-2"
            >
              {editMode ? (
                <>
                  <Calendar className="h-4 w-4" />
                  View Mode
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4" />
                  Edit Mode
                </>
              )}
            </Button>
            
            <Button 
              onClick={exportAsPNG}
              className="gap-2"
            >
              <Download className="h-4 w-4" />
              Export as PNG
            </Button>
          </div>
        </header>
        
        <Tabs defaultValue="all" value={activeDay} onValueChange={setActiveDay}>
          <TabsList className="w-full max-w-fit mb-4">
            <TabsTrigger value="all">All Days</TabsTrigger>
            {activeSchedule.days.map((day) => (
              <TabsTrigger key={day.name} value={day.name.toLowerCase()}>
                {day.name}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <div ref={scheduleRef} className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm">
            <TabsContent value={activeDay} className="mt-0">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDays.map((day) => (
                  <Card key={day.name} className="overflow-hidden">
                    <CardHeader className="bg-slate-100 dark:bg-slate-800">
                      <CardTitle>{day.name}</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                      {day.slots.length === 0 ? (
                        <p className="text-center text-muted-foreground py-6">
                          No classes scheduled
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {day.slots.map((slot) => (
                            <motion.div
                              key={slot.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              style={{ 
                                background: slot.color,
                              }}
                              className="rounded-lg p-4 text-dark shadow-sm"
                              onClick={() => editMode && handleSlotSelect(slot)}
                            >
                              <div className="flex justify-between items-start">
                                <h3 className="font-semibold">{slot.subject}</h3>
                                {editMode && (
                                  <Button variant="ghost" size="icon" className="h-6 w-6">
                                    <Trash className="h-3 w-3" />
                                  </Button>
                                )}
                              </div>
                              <p className="text-sm opacity-80">{slot.time}</p>
                              <p className="text-sm mt-2 opacity-80">{slot.location}</p>
                              {slot.professor && (
                                <p className="text-sm mt-1 opacity-80">{slot.professor}</p>
                              )}
                            </motion.div>
                          ))}
                        </div>
                      )}
                      
                      {editMode && (
                        <div className="mt-4 flex justify-center">
                          <Button variant="outline" size="sm" className="gap-1">
                            <Plus className="h-3 w-3" />
                            Add Class
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </div>
        </Tabs>
        
        {/* Color editor dialog */}
        {selectedSlot && (
          <Card className="fixed inset-0 m-auto w-full max-w-md h-[400px] z-50 flex flex-col shadow-lg">
            <CardHeader className="bg-slate-100 dark:bg-slate-800">
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Edit Color for {selectedSlot.subject}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 pt-6 flex flex-col">
              <div className="mb-4">
                <Label htmlFor="color-picker">Select a gradient color:</Label>
                <div className="mt-2">
                  <GradientPicker
                    value={selectedSlotColor}
                    onChange={(value) => setSelectedSlotColor(value)}
                    presets={DEFAULT_COLORS.map((color, index) => ({ value: color, name: `Preset ${index + 1}` }))}
                  />
                </div>
              </div>
              
              <div className="mt-2 flex-1">
                <Label>Preview:</Label>
                <div 
                  className="mt-2 rounded-lg p-4 h-32 flex flex-col justify-center"
                  style={{ background: selectedSlotColor }}
                >
                  <h3 className="font-semibold">{selectedSlot.subject}</h3>
                  <p className="text-sm opacity-80">{selectedSlot.time}</p>
                  <p className="text-sm opacity-80">{selectedSlot.location}</p>
                </div>
              </div>
              
              <div className="mt-auto pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={cancelColorEditing}>
                  Cancel
                </Button>
                <Button onClick={applyColorChanges}>
                  Apply
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        {selectedCell && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {getDayName(selectedCell.day)} - Period {selectedCell.period} ({getPeriodTime(selectedCell.period)})
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  placeholder="Subject name"
                  value={selectedCell.subject || ''}
                  onChange={e => setSelectedCell({ ...selectedCell, subject: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input
                  id="room"
                  placeholder="Room number"
                  value={selectedCell.room || ''}
                  onChange={e => setSelectedCell({ ...selectedCell, room: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="professor">Professor</Label>
                <Input
                  id="professor"
                  placeholder="Professor name"
                  value={selectedCell.professor || ''}
                  onChange={e => setSelectedCell({ ...selectedCell, professor: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <textarea
                  id="notes"
                  className="h-20 w-full rounded-md border border-input px-3 py-2"
                  placeholder="Additional notes"
                  value={selectedCell.notes || ''}
                  onChange={e => setSelectedCell({ ...selectedCell, notes: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateCell}>Save</Button>
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default SchedulePage;
