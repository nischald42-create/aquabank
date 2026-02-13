import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { Header } from '@/components/aquabank/Header';
import { HomePage } from '@/components/aquabank/HomePage';
import { ProductsPage } from '@/components/aquabank/ProductsPage';
import { RatesPage } from '@/components/aquabank/RatesPage';
import { BranchesPage } from '@/components/aquabank/BranchesPage';
import { ServicesPage } from '@/components/aquabank/ServicesPage';
import { ApplyPage } from '@/components/aquabank/ApplyPage';
import { ContactPage } from '@/components/aquabank/ContactPage';
import { AuthPage } from '@/components/aquabank/AuthPage';
import { Dashboard } from '@/components/aquabank/Dashboard';
import { AdminPanel } from '@/components/aquabank/admin/AdminPanel';
import { DocumentationPage } from '@/components/aquabank/DocumentationPage';

const Index = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const { user, loading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();

  useEffect(() => {
    if (user && currentPage === 'login') {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  if (loading || adminLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-accent/20 flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  // Show admin panel if on admin page and user is admin
  if (currentPage === 'admin' && isAdmin) {
    return <AdminPanel onBack={() => handleNavigate('dashboard')} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'products':
        return <ProductsPage onNavigate={handleNavigate} />;
      case 'rates':
        return <RatesPage />;
      case 'branches':
        return <BranchesPage />;
      case 'services':
        return <ServicesPage onNavigate={handleNavigate} />;
      case 'apply':
        return <ApplyPage />;
      case 'contact':
        return <ContactPage />;
      case 'login':
        return <AuthPage onNavigate={handleNavigate} />;
      case 'docs':
        return <DocumentationPage />;
      case 'dashboard':
        return user ? <Dashboard onNavigate={handleNavigate} isAdmin={isAdmin} /> : <AuthPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-accent/20">
      <Header currentPage={currentPage} onNavigate={handleNavigate} isAdmin={isAdmin} />
      <main className="max-w-[1100px] mx-auto p-4 mt-7">
        {renderPage()}
      </main>
      <footer className="max-w-[1100px] mx-auto p-5 text-center text-[13px] text-muted-foreground mt-9">
        © AquaBank — Prototype. This is a demo. Replace with real terms, privacy, and legal disclosures.
      </footer>
    </div>
  );
};

export default Index;
