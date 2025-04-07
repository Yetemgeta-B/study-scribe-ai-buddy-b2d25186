import React, { useState, useEffect } from 'react';
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
import { Book, Calendar, Calculator, Home, MessageSquare, Moon, Settings, Sun, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { setActivePage } = useApp();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    // Add actual theme toggle implementation here
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className={`flex min-h-screen flex-col overflow-hidden bg-background ${isDarkMode ? 'dark' : ''}`}>
      {/* Navigation bar with enhanced blur effect and animations */}
      <header 
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'backdrop-blur-lg bg-background/80 shadow-lg' 
            : 'backdrop-blur-md bg-background/60'
        } border-b border-primary/10`}
      >
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
              StudyBuddy
            </Link>
          </div>
          
          {/* Mobile menu button */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleMobileMenu}
            className="md:hidden rounded-full"
          >
            <Menu className="h-6 w-6" />
          </Button>
          
          {/* Desktop Navigation */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block"
          >
            <NavigationMenu className="md:flex">
              <NavigationMenuList>
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} transition-all hover:text-primary hover:scale-105`} 
                      onClick={() => setActivePage('home')}
                    >
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="hover:text-primary hover:scale-105 transition-all">
                    <Book className="mr-2 h-4 w-4" />
                    Subjects
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[400px] gap-3 p-4 md:grid-cols-2">
                      <li className="row-span-3">
                        <NavigationMenuLink asChild>
                          <a
                            className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-primary/50 to-primary p-6 no-underline outline-none focus:shadow-md transition-all hover:shadow-xl duration-300"
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
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} transition-all hover:text-primary hover:scale-105`} 
                      onClick={() => setActivePage('schedule')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Schedule
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} transition-all hover:text-primary hover:scale-105`} 
                      onClick={() => setActivePage('planner')}
                    >
                      <Calendar className="mr-2 h-4 w-4" />
                      Study Planner
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} transition-all hover:text-primary hover:scale-105`} 
                      onClick={() => setActivePage('calculator')}
                    >
                      <Calculator className="mr-2 h-4 w-4" />
                      Calculator
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link to="/">
                    <NavigationMenuLink 
                      className={`${navigationMenuTriggerStyle()} transition-all hover:text-primary hover:scale-105`} 
                      onClick={() => setActivePage('assistant')}
                    >
                      <MessageSquare className="mr-2 h-4 w-4" />
                      AI Assistant
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </motion.div>
          
          <div className="flex items-center space-x-2">
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 transition-all"
                title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              >
                {isDarkMode ? 
                  <Sun className="h-5 w-5 text-yellow-400" /> : 
                  <Moon className="h-5 w-5 text-blue-400" />
                }
              </Button>
            </motion.div>
            
            <motion.div 
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActivePage('settings')}
                className="rounded-full bg-secondary/30 backdrop-blur-sm hover:bg-secondary/50 transition-all"
                title="Settings"
              >
                <Settings className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="md:hidden fixed inset-0 z-40 bg-background/90 backdrop-blur-md"
        >
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 20 }}
            className="h-full w-4/5 ml-auto bg-card/90 p-4 shadow-xl flex flex-col"
          >
            <div className="flex justify-between mb-8 pt-2">
              <h2 className="text-xl font-bold">Menu</h2>
              <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z" fill="currentColor" fillRule="evenodd" clipRule="evenodd" />
                </svg>
              </Button>
            </div>
            
            <div className="space-y-6 flex-1 overflow-auto">
              <Link to="/" 
                className="flex items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setActivePage('home');
                  toggleMobileMenu();
                }}
              >
                <Home className="mr-3 h-5 w-5 text-primary" />
                <span className="font-medium">Home</span>
              </Link>
              
              <Link to="/" 
                className="flex items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setActivePage('subjects');
                  toggleMobileMenu();
                }}
              >
                <Book className="mr-3 h-5 w-5 text-primary" />
                <span className="font-medium">Subjects</span>
              </Link>
              
              <Link to="/" 
                className="flex items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setActivePage('schedule');
                  toggleMobileMenu();
                }}
              >
                <Calendar className="mr-3 h-5 w-5 text-primary" />
                <span className="font-medium">Schedule</span>
              </Link>
              
              <Link to="/" 
                className="flex items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setActivePage('planner');
                  toggleMobileMenu();
                }}
              >
                <Calendar className="mr-3 h-5 w-5 text-primary" />
                <span className="font-medium">Study Planner</span>
              </Link>
              
              <Link to="/" 
                className="flex items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setActivePage('calculator');
                  toggleMobileMenu();
                }}
              >
                <Calculator className="mr-3 h-5 w-5 text-primary" />
                <span className="font-medium">Calculator</span>
              </Link>
              
              <Link to="/" 
                className="flex items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setActivePage('assistant');
                  toggleMobileMenu();
                }}
              >
                <MessageSquare className="mr-3 h-5 w-5 text-primary" />
                <span className="font-medium">AI Assistant</span>
              </Link>
              
              <Link to="/" 
                className="flex items-center p-3 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  setActivePage('settings');
                  toggleMobileMenu();
                }}
              >
                <Settings className="mr-3 h-5 w-5 text-primary" />
                <span className="font-medium">Settings</span>
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}

      <div className="flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
