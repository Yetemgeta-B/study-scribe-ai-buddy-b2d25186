
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const SettingsPage: React.FC = () => {
  const { apiKey, setApiKey } = useApp();
  const [key, setKey] = React.useState(apiKey);
  const { toast } = useToast();

  const handleSave = () => {
    setApiKey(key);
    toast({
      title: 'Settings saved',
      description: 'Your API key has been saved successfully.',
    });
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Settings</h2>
        <p className="text-muted-foreground">Configure your study environment</p>
      </div>

      <div className="space-y-8">
        <div className="rounded-lg border border-border p-6">
          <h3 className="mb-4 text-lg font-semibold">AI Assistant Configuration</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">AI API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="Enter your API key"
              />
              <p className="text-sm text-muted-foreground">
                This key will be stored locally on your device and used for the AI assistant functionality.
              </p>
            </div>
            <Button onClick={handleSave}>Save Settings</Button>
          </div>
        </div>

        <div className="rounded-lg border border-border p-6">
          <h3 className="mb-4 text-lg font-semibold">About StudyScribe</h3>
          <p className="text-sm text-muted-foreground">
            StudyScribe is your personal study companion designed to help organize your academic resources,
            schedule your classes, plan your study sessions, and provide AI-powered assistance with your coursework.
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
