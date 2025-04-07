
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject, Resource, ScheduleCell, StudyPlan, ChatMessage } from '@/types';
import { generateId } from '@/lib/utils';

interface AppContextType {
  subjects: Subject[];
  activeSubject: Subject | null;
  scheduleData: ScheduleCell[];
  studyPlans: StudyPlan[];
  chatHistory: ChatMessage[];
  activePage: string;
  apiKey: string;
  setApiKey: (key: string) => void;
  setActivePage: (page: string) => void;
  addSubject: (subject: Omit<Subject, 'id' | 'resources'>) => void;
  updateSubject: (subject: Subject) => void;
  deleteSubject: (id: string) => void;
  setActiveSubject: (subject: Subject | null) => void;
  addResource: (resource: Omit<Resource, 'id' | 'createdAt'>) => void;
  updateResource: (resource: Resource) => void;
  deleteResource: (id: string) => void;
  openResource: (resource: Resource) => void;
  updateScheduleCell: (cell: ScheduleCell) => void;
  addStudyPlan: (plan: Omit<StudyPlan, 'id'>) => void;
  updateStudyPlan: (plan: StudyPlan) => void;
  deleteStudyPlan: (id: string) => void;
  addChatMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
}

const defaultSubjects: Subject[] = [
  {
    id: '1',
    name: 'Computer Science',
    color: '#9B87F5',
    description: 'Core computer science courses',
    resources: []
  },
  {
    id: '2',
    name: 'Mathematics',
    color: '#7E69AB',
    description: 'Mathematics and statistical methods',
    resources: []
  }
];

const defaultSchedule: ScheduleCell[] = Array.from({ length: 48 }, (_, i) => {
  const day = Math.floor(i / 8);
  const period = (i % 8) + 1;
  return {
    id: `schedule-${i}`,
    day,
    period,
    subject: '',
    room: '',
    professor: '',
    notes: ''
  };
});

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage if available
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('studyScribe-subjects');
    return saved ? JSON.parse(saved) : defaultSubjects;
  });
  
  const [activeSubject, setActiveSubject] = useState<Subject | null>(null);
  
  const [scheduleData, setScheduleData] = useState<ScheduleCell[]>(() => {
    const saved = localStorage.getItem('studyScribe-schedule');
    return saved ? JSON.parse(saved) : defaultSchedule;
  });
  
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>(() => {
    const saved = localStorage.getItem('studyScribe-studyPlans');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('studyScribe-chatHistory');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activePage, setActivePage] = useState<string>('subjects');

  const [apiKey, setApiKey] = useState<string>(() => {
    return localStorage.getItem('studyScribe-apiKey') || '';
  });
  
  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('studyScribe-subjects', JSON.stringify(subjects));
  }, [subjects]);
  
  useEffect(() => {
    localStorage.setItem('studyScribe-schedule', JSON.stringify(scheduleData));
  }, [scheduleData]);
  
  useEffect(() => {
    localStorage.setItem('studyScribe-studyPlans', JSON.stringify(studyPlans));
  }, [studyPlans]);
  
  useEffect(() => {
    localStorage.setItem('studyScribe-chatHistory', JSON.stringify(chatHistory));
  }, [chatHistory]);

  useEffect(() => {
    localStorage.setItem('studyScribe-apiKey', apiKey);
  }, [apiKey]);
  
  const addSubject = (subject: Omit<Subject, 'id' | 'resources'>) => {
    const newSubject: Subject = {
      id: generateId(),
      ...subject,
      resources: []
    };
    
    setSubjects(prev => [...prev, newSubject]);
  };
  
  const updateSubject = (updatedSubject: Subject) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === updatedSubject.id ? updatedSubject : subject
      )
    );
  };
  
  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(subject => subject.id !== id));
    
    if (activeSubject?.id === id) {
      setActiveSubject(null);
    }
    
    // Also delete related resources and study plans
    setStudyPlans(prev => prev.filter(plan => plan.subjectId !== id));
  };
  
  const addResource = (resource: Omit<Resource, 'id' | 'createdAt'>) => {
    const newResource: Resource = {
      id: generateId(),
      ...resource,
      createdAt: new Date()
    };
    
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === resource.subjectId
          ? { ...subject, resources: [...subject.resources, newResource] }
          : subject
      )
    );
  };
  
  const updateResource = (updatedResource: Resource) => {
    setSubjects(prev => 
      prev.map(subject => 
        subject.id === updatedResource.subjectId
          ? {
              ...subject,
              resources: subject.resources.map(resource => 
                resource.id === updatedResource.id ? updatedResource : resource
              )
            }
          : subject
      )
    );
  };
  
  const deleteResource = (id: string) => {
    setSubjects(prev => 
      prev.map(subject => ({
        ...subject,
        resources: subject.resources.filter(resource => resource.id !== id)
      }))
    );
  };
  
  const openResource = (resource: Resource) => {
    if (resource.type === 'pdf' && resource.path) {
      window.open(resource.path);
    } else if (resource.type === 'link' && resource.url) {
      window.open(resource.url, '_blank');
    }
  };
  
  const updateScheduleCell = (updatedCell: ScheduleCell) => {
    setScheduleData(prev => 
      prev.map(cell => 
        cell.id === updatedCell.id ? updatedCell : cell
      )
    );
  };
  
  const addStudyPlan = (plan: Omit<StudyPlan, 'id'>) => {
    const newPlan: StudyPlan = {
      id: generateId(),
      ...plan
    };
    
    setStudyPlans(prev => [...prev, newPlan]);
  };
  
  const updateStudyPlan = (updatedPlan: StudyPlan) => {
    setStudyPlans(prev => 
      prev.map(plan => 
        plan.id === updatedPlan.id ? updatedPlan : plan
      )
    );
  };
  
  const deleteStudyPlan = (id: string) => {
    setStudyPlans(prev => prev.filter(plan => plan.id !== id));
  };
  
  const addChatMessage = (message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      id: generateId(),
      ...message,
      timestamp: new Date()
    };
    
    setChatHistory(prev => [...prev, newMessage]);
  };
  
  return (
    <AppContext.Provider
      value={{
        subjects,
        activeSubject,
        scheduleData,
        studyPlans,
        chatHistory,
        activePage,
        apiKey,
        setApiKey,
        setActivePage,
        addSubject,
        updateSubject,
        deleteSubject,
        setActiveSubject,
        addResource,
        updateResource,
        deleteResource,
        openResource,
        updateScheduleCell,
        addStudyPlan,
        updateStudyPlan,
        deleteStudyPlan,
        addChatMessage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
