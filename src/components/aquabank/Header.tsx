import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, Shield } from 'lucide-react';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
}

export function Header({ currentPage, onNavigate, isAdmin }: HeaderProps) {
  const { user, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = ['home', 'products', 'rates', 'branches', 'services', 'apply', 'contact'];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary to-secondary text-primary-foreground px-5 py-[18px] shadow-lg rounded-b-[10px]">
      <div className="max-w-[1100px] mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 font-bold cursor-pointer" onClick={() => onNavigate('home')}>
          <div className="w-11 h-11 rounded-[10px] bg-gradient-to-br from-accent to-primary flex items-center justify-center text-secondary font-extrabold shadow-md">
            AB
          </div>
          <div>
            <div className="text-base">AquaBank</div>
            <div className="text-xs opacity-90">Banking made simple</div>
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate(item); }}
              className={`px-[10px] py-2 rounded-lg font-semibold capitalize transition-colors hover:bg-primary-foreground/10 ${
                currentPage === item ? 'bg-primary-foreground/10' : ''
              }`}
            >
              {item}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-[10px]">
          {user ? (
            <>
              {isAdmin && (
                <button
                  onClick={() => onNavigate('admin')}
                  className="flex items-center gap-1 bg-accent text-secondary px-3 py-2 rounded-lg font-bold"
                >
                  <Shield size={16} />
                  Admin
                </button>
              )}
              <button
                onClick={() => onNavigate('dashboard')}
                className="bg-primary-foreground text-secondary px-3 py-2 rounded-lg font-bold"
              >
                Dashboard
              </button>
            </>
          ) : (
            <button
              onClick={() => onNavigate('login')}
              className="bg-primary-foreground text-secondary px-3 py-2 rounded-lg font-bold"
            >
              Log in
            </button>
          )}
          <div 
            className="md:hidden cursor-pointer"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <Menu className="w-6 h-6" />
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <nav className="md:hidden mt-4 flex flex-col gap-2">
          {navItems.map((item) => (
            <a
              key={item}
              href="#"
              onClick={(e) => { e.preventDefault(); onNavigate(item); setMobileMenuOpen(false); }}
              className={`px-[10px] py-2 rounded-lg font-semibold capitalize ${
                currentPage === item ? 'bg-primary-foreground/10' : ''
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
