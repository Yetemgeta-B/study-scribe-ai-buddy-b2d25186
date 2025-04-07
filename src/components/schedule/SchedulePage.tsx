
import React, { useState } from 'react';
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

const SchedulePage: React.FC = () => {
  const { scheduleData, updateScheduleCell, subjects } = useApp();
  const [selectedCell, setSelectedCell] = useState<ScheduleCell | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Class Schedule</h2>
        <p className="text-muted-foreground">Manage your weekly class schedule</p>
      </div>

      <div className="rounded-lg border border-border">
        <div className="grid grid-cols-7">
          {/* Header with day names */}
          <div className="border-r border-border bg-accent p-2 font-medium">Time</div>
          {Array.from({ length: 6 }, (_, i) => (
            <div key={i} className="border-r border-border bg-accent p-2 text-center font-medium last:border-r-0">
              {getDayName(i)}
            </div>
          ))}

          {/* Time slots and cells */}
          {Array.from({ length: 8 }, (_, periodIndex) => {
            const period = periodIndex + 1;
            return (
              <React.Fragment key={periodIndex}>
                {/* Time slot */}
                <div className={`border-r border-t border-border p-2 text-sm ${period === 4 ? 'border-b-2 border-b-primary/50' : ''}`}>
                  <div className="font-medium">Period {period}</div>
                  <div className="text-xs text-muted-foreground">{getPeriodTime(period)}</div>
                </div>

                {/* Day cells */}
                {Array.from({ length: 6 }, (_, dayIndex) => {
                  const cell = scheduleData.find(c => c.day === dayIndex && c.period === period);
                  if (!cell) return null;

                  return (
                    <div
                      key={`${dayIndex}-${period}`}
                      className={`cursor-pointer border-r border-t border-border p-2 text-sm hover:bg-accent/50 last:border-r-0 ${
                        period === 4 ? 'border-b-2 border-b-primary/50' : ''
                      }`}
                      onClick={() => handleCellClick(cell)}
                    >
                      {cell.subject ? (
                        <div>
                          <div className="font-medium">{cell.subject}</div>
                          {cell.room && <div className="text-xs">Room: {cell.room}</div>}
                          {cell.professor && <div className="text-xs">{cell.professor}</div>}
                        </div>
                      ) : (
                        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                          Empty
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            );
          })}
        </div>
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
