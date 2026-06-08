import { ReactNode, useState } from 'react';
import { Users, BarChart3, Building2, Activity, Settings, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: ReactNode;
  currentTab: string;
  onTabChange: (tab: string) => void;
  onBack: () => void;
}

const navItems = [
  { id: 'dashboard', label: 'Analytics & Security', icon: BarChart3 },
  { id: 'users', label: 'Users & Add User', icon: Users },
  { id: 'transactions', label: 'Transactions', icon: Activity },
  { id: 'branches', label: 'Branches', icon: Building2 },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function AdminLayout({ children, currentTab, onTabChange, onBack }: AdminLayoutProps) {
  const { signOut, user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    onBack();
  };

  return (
    <div className="min-h-screen bg-[#f5f1e8] flex font-serif">
      {/* Mobile menu button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded bg-[#0b2545] text-[#d4af37]"
      >
        {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#0b2545] text-[#f5f1e8] border-r-4 border-[#d4af37] transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-[#d4af37]/40">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-sm bg-[#d4af37] flex items-center justify-center text-[#0b2545] font-extrabold text-lg border border-[#f5f1e8]/30">
              AB
            </div>
            <div>
              <h1 className="font-bold text-[#f5f1e8] tracking-wide text-lg">AquaBank</h1>
              <p className="text-[11px] text-[#d4af37] uppercase tracking-[0.2em]">Administration</p>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-sm text-left transition-colors border-l-2
                  ${isActive 
                    ? 'bg-[#d4af37] text-[#0b2545] border-[#f5f1e8] font-semibold' 
                    : 'text-[#f5f1e8]/80 border-transparent hover:bg-[#13315c] hover:text-[#d4af37]'
                  }
                `}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#d4af37]/40 bg-[#0a1f3d]">
          <div className="flex items-center gap-3 px-4 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-[#d4af37] flex items-center justify-center text-[#0b2545] font-bold text-sm">
              {user?.email?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#f5f1e8] truncate">{user?.email}</p>
              <p className="text-[10px] text-[#d4af37] uppercase tracking-widest">Administrator</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-sm text-[#f5f1e8]/80 hover:bg-destructive/20 hover:text-[#d4af37] transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
          <button
            onClick={onBack}
            className="w-full flex items-center gap-3 px-4 py-2 rounded-sm text-[#f5f1e8]/80 hover:bg-[#13315c] hover:text-[#d4af37] transition-colors mt-1"
          >
            <span className="font-medium">← Back to Site</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-10 pt-16 lg:pt-10 bg-[#f5f1e8]">
        <div className="max-w-6xl mx-auto bg-white border border-[#0b2545]/15 shadow-md p-6 lg:p-8 rounded-sm border-t-4 border-t-[#d4af37]">
          {children}
        </div>
      </main>
    </div>
  );
}
