
import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage } from '@/types';
import { formatTime } from '@/lib/utils';
import { AlertCircle, Send } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <div
      className={`mb-4 flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-3/4 rounded-lg p-3 ${
          message.role === 'user'
            ? 'bg-primary text-primary-foreground'
            : 'bg-secondary text-secondary-foreground'
        }`}
      >
        <p className="whitespace-pre-wrap">{message.content}</p>
        <div className="mt-1 text-right text-xs opacity-70">
          {formatTime(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

const AssistantPage: React.FC = () => {
  const { chatHistory, addChatMessage, subjects, activeSubject, apiKey, setApiKey } = useApp();
  const [message, setMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(activeSubject?.id || '');
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    
    const currentSubject = subjects.find(s => s.id === selectedSubject)?.name || '';
    
    // Add user message
    addChatMessage({
      content: message,
      role: 'user',
      subjectContext: currentSubject
    });

    if (!apiKey) {
      addChatMessage({
        content: "Please set your AI API key in the settings first to use the AI assistant.",
        role: 'assistant'
      });
      setMessage('');
      return;
    }

    setLoading(true);
    
    // In a real implementation, you would call an AI API here
    // For now we'll simulate a response
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      let response = `I'll help you with your question about ${currentSubject || 'your studies'}.\n\n`;
      
      if (currentSubject === 'Computer Science') {
        response += "Based on computer science principles, I would suggest looking into algorithms and data structures for this problem.";
      } else if (currentSubject === 'Mathematics') {
        response += "From a mathematical perspective, we could approach this using calculus or linear algebra concepts.";
      } else {
        response += "I'd be happy to help you with this question. Could you provide more details?";
      }
      
      // Add AI response
      addChatMessage({
        content: response,
        role: 'assistant',
        subjectContext: currentSubject
      });
    } catch (error) {
      console.error("Error getting AI response:", error);
      addChatMessage({
        content: "Sorry, I encountered an error processing your request. Please try again later.",
        role: 'assistant'
      });
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold">AI Study Assistant</h2>
        <p className="text-muted-foreground">Get help with your studies</p>
      </div>

      {!apiKey && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>
            Please set your AI API key in the settings to use the AI assistant.
          </AlertDescription>
        </Alert>
      )}

      <div className="mb-4 flex gap-4">
        <Select
          value={selectedSubject}
          onValueChange={setSelectedSubject}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select subject context" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No specific subject</SelectItem>
            {subjects.map((subject) => (
              <SelectItem key={subject.id} value={subject.id}>
                {subject.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex h-[calc(100vh-300px)] flex-col rounded-lg border border-border">
        <div className="flex-1 overflow-y-auto p-4">
          {chatHistory.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 h-12 w-12 rounded-full bg-primary/10 p-3 text-primary">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-medium">Ask your study assistant</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Ask questions about your coursework and get contextual help based on your selected subject.
              </p>
            </div>
          ) : (
            chatHistory.map((msg) => (
              <ChatMessageItem key={msg.id} message={msg} />
            ))
          )}
        </div>
        <div className="border-t border-border bg-background p-4">
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your study question..."
              className="min-h-[60px] resize-none"
              disabled={loading}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || loading}
              className="self-end"
            >
              <Send size={18} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
