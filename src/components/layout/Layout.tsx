
import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import { useApp } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Book, Calendar, Calculator, Home, MessageSquare, Moon, Settings, Sun } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setActivePage } = useApp();
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Add actual theme toggle implementation here
  };

  return (
    <div className={`flex min-h-screen flex-col overflow-hidden bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Navigation bar with blur effect */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-background/70 border-b border-border/40 shadow-sm">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary">StudyScribe</Link>
          </div>
          
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => setActivePage('home')}>
                    <Home className="mr-2 h-4 w-4" />
                    Home
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <Book className="mr-2 h-4 w-4" />
                  Subjects
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <a
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md"
                          onClick={() => setActivePage('subjects')}
                        >
                          <Book className="h-6 w-6 text-white" />
                          <div className="mt-4 mb-2 text-lg font-medium text-white">
                            Subjects
                          </div>
                          <p className="text-sm leading-tight text-white/90">
                            Manage your subjects and resources
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          onClick={() => setActivePage('subjects')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Add Subject</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Create a new subject for your studies
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                    <li>
                      <NavigationMenuLink asChild>
                        <a
                          onClick={() => setActivePage('subjects')}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">Resources</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            View and manage your study resources
                          </p>
                        </a>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => setActivePage('schedule')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => setActivePage('planner')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Study Planner
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              
              <NavigationMenuItem>
                <Link to="/">
                  <NavigationMenuLink className={navigationMenuTriggerStyle()} onClick={() => setActivePage('assistant')}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    AI Assistant
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full"
              title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setActivePage('settings')}
              className="rounded-full"
              title="Settings"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
