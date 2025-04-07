
import React from 'react';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Book, Calendar, Clock, Search, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const { activePage, setActivePage } = useApp();

  const navItems = [
    { name: 'Subjects', icon: <Book size={18} />, id: 'subjects' },
    { name: 'Schedule', icon: <Calendar size={18} />, id: 'schedule' },
    { name: 'Study Planner', icon: <Clock size={18} />, id: 'planner' },
    { name: 'AI Assistant', icon: <Search size={18} />, id: 'assistant' },
    { name: 'Settings', icon: <Settings size={18} />, id: 'settings' },
  ];

  return (
    <aside className="w-64 border-r border-border bg-card">
      <div className="flex h-16 items-center border-b border-border px-6">
        <h1 className="text-xl font-bold text-primary">StudyScribe</h1>
      </div>
      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activePage === item.id ? 'secondary' : 'ghost'}
                className={`w-full justify-start gap-3 ${
                  activePage === item.id ? 'font-medium' : ''
                }`}
                onClick={() => setActivePage(item.id)}
              >
                {item.icon}
                {item.name}
              </Button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
