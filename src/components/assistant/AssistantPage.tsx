import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ChatMessage, Subject } from '@/types';
import { formatTime } from '@/lib/utils';
import { AlertCircle, Send, Bot, UserIcon, Sparkles, ChevronDown, ChevronUp, Settings, Paperclip } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motion, AnimatePresence } from 'framer-motion';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const ChatMessageItem: React.FC<{ message: ChatMessage }> = ({ message }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`mb-4 flex ${
        message.role === 'user' ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`max-w-3/4 rounded-lg p-4 ${
          message.role === 'user'
            ? 'bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-lg'
            : 'bg-card shadow-md border'
        }`}
      >
        <div className="flex items-start gap-3">
          <div className={`rounded-full p-2 hidden sm:flex ${message.role === 'user' ? 'bg-primary-foreground/20' : 'bg-primary/10'}`}>
            {message.role === 'user' ? (
              <UserIcon className="h-4 w-4" />
            ) : (
              <Bot className="h-4 w-4" />
            )}
          </div>
          <div>
            <p className="whitespace-pre-wrap">{message.content}</p>
            <div className="mt-2 text-right text-xs opacity-70">
              {formatTime(message.timestamp)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Suggested prompts for the user
const suggestedPrompts = [
  "Explain the concept of derivatives in calculus",
  "Help me understand Newton's laws of motion",
  "What are the key principles of object-oriented programming?",
  "Explain the process of photosynthesis",
  "What is the significance of the Pythagorean theorem?"
];

const AssistantPage: React.FC = () => {
  const { chatHistory, addChatMessage, subjects, activeSubject, apiKey, setApiKey } = useApp();
  const [message, setMessage] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>(activeSubject?.id || '');
  const [loading, setLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [activeChatTab, setActiveChatTab] = useState('general');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (promptText = message) => {
    if (!promptText.trim()) return;
    
    const currentSubject = subjects.find(s => s.id === selectedSubject)?.name || '';
    
    // Add user message
    addChatMessage({
      content: promptText,
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
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      let response = `I'll help you with your question about ${currentSubject || 'your studies'}.\n\n`;
      
      if (currentSubject === 'Computer Science') {
        response += "Based on computer science principles, I would suggest looking into algorithms and data structures for this problem.";
      } else if (currentSubject === 'Mathematics') {
        response += "From a mathematical perspective, we could approach this using calculus or linear algebra concepts.";
      } else {
        response += "I'd be happy to help you with this question. Let me provide a comprehensive answer:\n\n" + 
                   "The concepts you're asking about are fundamental to understanding this subject area. " + 
                   "First, we should consider the theoretical foundations, then move to practical applications.";
      }
      
      // Add AI response with typing effect simulation
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
  
  const filterChatBySubject = (chat: ChatMessage[]) => {
    if (activeChatTab === 'general') {
      return chat.filter(msg => !msg.subjectContext);
    } else {
      const subject = subjects.find(s => s.id === activeChatTab);
      return chat.filter(msg => msg.subjectContext === subject?.name);
    }
  };
  
  const filteredChat = filterChatBySubject(chatHistory);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring", 
                stiffness: 260, 
                damping: 20,
                delay: 0.1 
              }}
              className="bg-primary/10 text-primary p-2 rounded-full mr-3"
            >
              <Sparkles className="h-6 w-6" />
            </motion.div>
            AI Study Assistant
          </h2>
          <p className="text-muted-foreground">Get intelligent help with your studies</p>
        </div>
        
        <div className="flex gap-2">
          <Select
            value={selectedSubject}
            onValueChange={setSelectedSubject}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select subject context" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">No specific subject</SelectItem>
              {subjects.map((subject) => (
                <SelectItem key={subject.id} value={subject.id}>
                  {subject.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => setShowSettings(!showSettings)}
            className="rounded-full"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <AnimatePresence>
        {showSettings && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Assistant Settings</CardTitle>
                <CardDescription>Configure your AI assistant</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <label htmlFor="apiKey" className="text-sm font-medium">
                      API Key
                    </label>
                    <Input
                      id="apiKey"
                      type="password"
                      placeholder="Enter your API key"
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      You can get your API key from your account settings.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {!apiKey && (
        <Alert className="mb-6" variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>API Key Required</AlertTitle>
          <AlertDescription>
            Please set your AI API key in the settings to use the AI assistant.
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="general" className="mb-4" onValueChange={setActiveChatTab} value={activeChatTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="general">General Chat</TabsTrigger>
          {subjects.map(subject => (
            <TabsTrigger key={subject.id} value={subject.id}>
              {subject.name}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <div className="flex h-[calc(100vh-300px)] flex-col rounded-lg border border-border bg-card/30 backdrop-blur-sm shadow-lg">
        <div className="flex-1 overflow-y-auto p-4">
          {filteredChat.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <motion.div 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ 
                  type: "spring", 
                  stiffness: 260, 
                  damping: 20 
                }}
                className="mb-6 h-20 w-20 rounded-full bg-primary/10 p-5 text-primary"
              >
                <Bot className="h-10 w-10" />
              </motion.div>
              <h3 className="text-lg font-medium">How can I help you today?</h3>
              <p className="mt-2 max-w-sm text-sm text-muted-foreground">
                Ask questions about your coursework and get contextual help based on your selected subject.
              </p>
              
              <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-2 w-full max-w-lg">
                {suggestedPrompts.map((prompt, index) => (
                  <Button 
                    key={index} 
                    variant="outline" 
                    className="justify-start text-left h-auto py-3"
                    onClick={() => handleSendMessage(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {filteredChat.map((msg) => (
                <ChatMessageItem key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
        <div className="border-t border-border bg-background/50 backdrop-blur-sm p-4">
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Paperclip className="h-4 w-4" />
            </Button>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask your study question..."
              className="min-h-[60px] resize-none"
              disabled={loading}
            />
            <Button
              onClick={() => handleSendMessage()}
              disabled={!message.trim() || loading}
              className="self-end shrink-0 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
            >
              {loading ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <div className="h-5 w-5 rounded-full border-2 border-primary-foreground border-t-transparent" />
                </motion.div>
              ) : (
                <Send size={18} />
              )}
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground text-center">
            Your chat assistant is ready to help with your study questions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantPage;
