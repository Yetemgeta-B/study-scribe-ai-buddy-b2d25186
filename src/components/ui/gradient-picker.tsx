import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface GradientPreset {
  name: string;
  value: string;
}

interface GradientPickerProps {
  onChange: (gradient: string) => void;
  value?: string;
  presets?: GradientPreset[];
}

export function GradientPicker({ onChange, value = 'linear-gradient(to right, #4f46e5, #7e22ce)', presets = [] }: GradientPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeGradient, setActiveGradient] = useState(value);
  const [gradientType, setGradientType] = useState<'linear' | 'radial'>('linear');
  const [gradientDirection, setGradientDirection] = useState('to right');
  const [colorStops, setColorStops] = useState(['#4f46e5', '#7e22ce']);

  // Default presets if none provided
  const defaultPresets: GradientPreset[] = [
    { name: 'Blue to Purple', value: 'linear-gradient(to right, #4f46e5, #7e22ce)' },
    { name: 'Green to Teal', value: 'linear-gradient(to right, #10b981, #0891b2)' },
    { name: 'Orange to Pink', value: 'linear-gradient(to right, #f97316, #ec4899)' },
    { name: 'Red to Orange', value: 'linear-gradient(to right, #dc2626, #f97316)' },
    { name: 'Purple to Pink', value: 'linear-gradient(to right, #7e22ce, #ec4899)' },
    { name: 'Blue to Green', value: 'linear-gradient(to right, #3b82f6, #10b981)' },
    { name: 'Radial Blue', value: 'radial-gradient(circle, #3b82f6, #1e3a8a)' },
    { name: 'Radial Purple', value: 'radial-gradient(circle, #8b5cf6, #4c1d95)' },
    { name: 'Sunset', value: 'linear-gradient(to right, #f97316, #dc2626, #7e22ce)' },
    { name: 'Ocean', value: 'linear-gradient(to right, #0891b2, #1e40af)' },
    { name: 'Forest', value: 'linear-gradient(to right, #047857, #10b981)' },
  ];

  const allPresets = presets.length ? presets : defaultPresets;

  // Update gradient when parameters change
  const updateGradient = () => {
    if (gradientType === 'linear') {
      setActiveGradient(`linear-gradient(${gradientDirection}, ${colorStops.join(', ')})`);
    } else {
      setActiveGradient(`radial-gradient(circle, ${colorStops.join(', ')})`);
    }
  };

  // Handle color stop change
  const handleColorStopChange = (index: number, color: string) => {
    const newColorStops = [...colorStops];
    newColorStops[index] = color;
    setColorStops(newColorStops);
    setTimeout(updateGradient, 0);
  };

  // Add a new color stop
  const addColorStop = () => {
    setColorStops([...colorStops, '#ffffff']);
    setTimeout(updateGradient, 0);
  };

  // Remove a color stop
  const removeColorStop = (index: number) => {
    if (colorStops.length <= 2) return; // Keep at least 2 color stops
    const newColorStops = colorStops.filter((_, i) => i !== index);
    setColorStops(newColorStops);
    setTimeout(updateGradient, 0);
  };

  // Apply the selected gradient
  const applyGradient = () => {
    onChange(activeGradient);
    setIsOpen(false);
  };

  return (
    <div>
      <div 
        className="h-10 w-full cursor-pointer rounded-md border border-input"
        style={{ background: value }}
        onClick={() => setIsOpen(true)}
      />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Choose Gradient</DialogTitle>
          </DialogHeader>
          
          <Tabs defaultValue="presets">
            <TabsList className="w-full">
              <TabsTrigger value="presets">Presets</TabsTrigger>
              <TabsTrigger value="custom">Custom</TabsTrigger>
            </TabsList>
            
            <TabsContent value="presets" className="space-y-4">
              <div className="grid grid-cols-3 gap-3 mt-4">
                {allPresets.map((preset, index) => (
                  <div 
                    key={index}
                    className="h-16 rounded-md cursor-pointer transition-all hover:scale-105 border border-input"
                    style={{ background: preset.value }}
                    onClick={() => {
                      setActiveGradient(preset.value);
                      onChange(preset.value);
                      setIsOpen(false);
                    }}
                    title={preset.name}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="custom" className="space-y-4">
              <div 
                className="h-24 rounded-md mb-4 border border-input"
                style={{ background: activeGradient }}
              />
              
              <div className="grid gap-4">
                <div>
                  <Label>Type</Label>
                  <div className="flex gap-2 mt-1">
                    <Button
                      type="button"
                      variant={gradientType === 'linear' ? 'default' : 'outline'}
                      onClick={() => {
                        setGradientType('linear');
                        setTimeout(updateGradient, 0);
                      }}
                      className="flex-1"
                    >
                      Linear
                    </Button>
                    <Button
                      type="button"
                      variant={gradientType === 'radial' ? 'default' : 'outline'}
                      onClick={() => {
                        setGradientType('radial');
                        setTimeout(updateGradient, 0);
                      }}
                      className="flex-1"
                    >
                      Radial
                    </Button>
                  </div>
                </div>
                
                {gradientType === 'linear' && (
                  <div>
                    <Label>Direction</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1">
                      {['to top', 'to right top', 'to right', 'to right bottom', 'to bottom', 'to left bottom', 'to left', 'to left top'].map((direction) => (
                        <Button
                          key={direction}
                          type="button"
                          variant={gradientDirection === direction ? 'default' : 'outline'}
                          onClick={() => {
                            setGradientDirection(direction);
                            setTimeout(updateGradient, 0);
                          }}
                          className="text-xs"
                        >
                          {direction.replace('to ', '→')}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
                
                <div>
                  <Label>Colors</Label>
                  <div className="space-y-2 mt-1">
                    {colorStops.map((color, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div 
                          className="h-6 w-6 rounded-full border border-input"
                          style={{ backgroundColor: color }}
                        />
                        <Input
                          type="color"
                          value={color}
                          onChange={(e) => handleColorStopChange(index, e.target.value)}
                          className="w-24"
                        />
                        <Input
                          type="text"
                          value={color}
                          onChange={(e) => handleColorStopChange(index, e.target.value)}
                          className="flex-1"
                        />
                        {colorStops.length > 2 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeColorStop(index)}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>
                          </Button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addColorStop}
                      className="w-full mt-2"
                    >
                      Add Color Stop
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={applyGradient}>
                  Apply
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
} 