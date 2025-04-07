
import React from 'react';
import Layout from '@/components/layout/Layout';
import { AppProvider, useApp } from '@/context/AppContext';
import SubjectsPage from '@/components/pages/SubjectsPage';
import SchedulePage from '@/components/schedule/SchedulePage';
import PlannerPage from '@/components/planner/PlannerPage';
import AssistantPage from '@/components/assistant/AssistantPage';
import SettingsPage from '@/components/settings/SettingsPage';

const AppContent: React.FC = () => {
  const { activePage } = useApp();

  const renderPage = () => {
    switch (activePage) {
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
      default:
        return <SubjectsPage />;
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
