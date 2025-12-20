import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { AdminUsers } from './AdminUsers';
import { AdminTransactions } from './AdminTransactions';
import { AdminBranches } from './AdminBranches';
import { AdminSettings } from './AdminSettings';

interface AdminPanelProps {
  onBack: () => void;
}

export function AdminPanel({ onBack }: AdminPanelProps) {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'users':
        return <AdminUsers />;
      case 'transactions':
        return <AdminTransactions />;
      case 'branches':
        return <AdminBranches />;
      case 'settings':
        return <AdminSettings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout 
      currentTab={currentTab} 
      onTabChange={setCurrentTab}
      onBack={onBack}
    >
      {renderContent()}
    </AdminLayout>
  );
}
