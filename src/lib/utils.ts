
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  });
}

export function formatTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleTimeString(undefined, { 
    hour: '2-digit', 
    minute: '2-digit' 
  });
}

export const getRandomColor = (): string => {
  const colors = [
    '#9B87F5', // Primary purple
    '#7E69AB', // Deeper purple
    '#6E59A5', // Dark purple
    '#4A5568', // Blue gray
    '#4299E1', // Blue
    '#38B2AC', // Teal
    '#48BB78', // Green
    '#ECC94B', // Yellow
    '#ED8936', // Orange
    '#F56565', // Red
    '#667EEA', // Indigo
    '#9F7AEA', // Purple
  ];
  
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getInitials = (name: string): string => {
  const words = name.split(' ');
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

export function getPeriodTime(period: number): string {
  switch (period) {
    case 1: return "8:30 - 9:30";
    case 2: return "9:30 - 10:30";
    case 3: return "10:30 - 11:30";
    case 4: return "11:30 - 12:30";
    case 5: return "13:30 - 14:30";
    case 6: return "14:30 - 15:30";
    case 7: return "15:30 - 16:30";
    case 8: return "16:30 - 17:30";
    default: return "";
  }
}

export function getDayName(day: number): string {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[day] || "";
}
