import React from 'react';
import Layout from '@/components/layout/Layout';
import { AppProvider, useApp } from '@/context/AppContext';
import HomePage from '@/components/pages/HomePage';
import SubjectsPage from '@/components/pages/SubjectsPage';
import SchedulePage from '@/components/schedule/SchedulePage';
import PlannerPage from '@/components/planner/PlannerPage';
import AssistantPage from '@/components/assistant/AssistantPage';
import SettingsPage from '@/components/settings/SettingsPage';
import CalculatorPage from '@/components/calculator/CalculatorPage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderPage = () => {
    switch (activePage) {
      case 'home':
        return <HomePage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'schedule':
        return <SchedulePage />;
      case 'planner':
        return <PlannerPage />;
      case 'assistant':
        return <AssistantPage />;
      case 'settings':
        return <SettingsPage />;
      case 'calculator':
        return <CalculatorPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout>
      {renderPage()}
    </Layout>
  );
};

const Index: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default Index;
