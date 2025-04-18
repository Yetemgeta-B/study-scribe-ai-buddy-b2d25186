
export interface Subject {
  id: string;
  name: string;
  color: string;
  resources: Resource[];
  description?: string;
  schedule?: string;
}

export interface Resource {
  id: string;
  name: string;
  type: 'pdf' | 'link' | 'note' | 'other';
  path?: string;
  url?: string;
  content?: string;
  subjectId: string;
  createdAt: Date;
  annotations?: Annotation[];
  bookmarks?: Bookmark[];
}

export interface Annotation {
  id: string;
  page: number;
  text: string;
  position: { x: number; y: number };
  color: string;
  createdAt: Date;
}

export interface Bookmark {
  id: string;
  page: number;
  title: string;
  createdAt: Date;
}

export interface ScheduleCell {
  id: string;
  day: number; // 0-5 for Mon-Sat
  period: number; // 1-8 for periods
  subject?: string;
  room?: string;
  professor?: string;
  notes?: string;
}

export interface StudyPlan {
  id: string;
  title: string;
  subjectId: string;
  date: Date;
  duration: number; // in minutes
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface ChatMessage {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  subjectContext?: string;
}
