import { Card } from '@/components/ui/card';
import { Shield, Database, Code, Server, Lock, Globe, Layers, Zap } from 'lucide-react';

export function DocumentationPage() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-foreground">AquaBank — Project Documentation</h1>
        <p className="text-muted-foreground mt-2">
          Complete technical documentation for the AquaBank digital banking platform.
        </p>
      </div>

      {/* Tech Stack */}
      <Card className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Layers className="text-primary" size={22} />
          Technology Stack
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'React 18', desc: 'Component-based UI library for building interactive interfaces', category: 'Frontend' },
            { name: 'TypeScript', desc: 'Strongly typed JavaScript for safer, more maintainable code', category: 'Language' },
            { name: 'Vite', desc: 'Lightning-fast build tool and development server', category: 'Build Tool' },
            { name: 'Tailwind CSS', desc: 'Utility-first CSS framework for rapid UI development', category: 'Styling' },
            { name: 'shadcn/ui', desc: 'High-quality, accessible UI component library', category: 'Components' },
            { name: 'Supabase (Cloud)', desc: 'Backend-as-a-service providing database, auth, and edge functions', category: 'Backend' },
            { name: 'PostgreSQL', desc: 'Powerful open-source relational database', category: 'Database' },
            { name: 'Recharts', desc: 'Composable charting library for admin dashboard analytics', category: 'Visualization' },
          ].map(tech => (
            <div key={tech.name} className="bg-muted/30 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <p className="font-bold text-foreground">{tech.name}</p>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">{tech.category}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{tech.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Database Schema */}
      <Card className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Database className="text-primary" size={22} />
          Database Schema (PostgreSQL)
        </h2>
        <div className="space-y-4">
          {[
            {
              table: 'profiles',
              columns: ['id (UUID, PK)', 'user_id (UUID, FK → auth.users)', 'full_name (TEXT)', 'email (TEXT)', 'created_at (TIMESTAMPTZ)', 'updated_at (TIMESTAMPTZ)'],
              desc: 'Stores user profile information synced from auth system.',
            },
            {
              table: 'accounts',
              columns: ['id (UUID, PK)', 'user_id (UUID)', 'account_number (TEXT, unique)', 'account_name (TEXT)', 'balance (NUMERIC)', 'created_at / updated_at (TIMESTAMPTZ)'],
              desc: 'Banking accounts — auto-created on user registration via trigger.',
            },
            {
              table: 'transactions',
              columns: ['id (UUID, PK)', 'from_user_id / to_user_id (UUID)', 'from_account_id / to_account_id (UUID, FK → accounts)', 'amount (NUMERIC)', 'type (TEXT)', 'status (TEXT)', 'memo (TEXT)', 'created_at (TIMESTAMPTZ)'],
              desc: 'Records all transfers between accounts.',
            },
            {
              table: 'user_roles',
              columns: ['id (UUID, PK)', 'user_id (UUID)', 'role (ENUM: admin | user)', 'created_at (TIMESTAMPTZ)'],
              desc: 'Role-based access control — auto-assigned via trigger on signup.',
            },
          ].map(t => (
            <div key={t.table} className="border rounded-lg p-4">
              <h3 className="font-bold text-foreground font-mono text-primary">{t.table}</h3>
              <p className="text-sm text-muted-foreground mb-2">{t.desc}</p>
              <div className="bg-muted/50 rounded p-3">
                <code className="text-xs text-foreground leading-relaxed">
                  {t.columns.map((col, i) => (
                    <div key={i}>• {col}</div>
                  ))}
                </code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Security */}
      <Card className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Shield className="text-primary" size={22} />
          Security Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Row Level Security (RLS)', desc: 'Every table has RLS policies ensuring users only access their own data. Admins have full access.', icon: Lock },
            { name: 'JWT Authentication', desc: 'Supabase Auth issues JWTs for session management. Tokens auto-refresh on the client.', icon: Shield },
            { name: 'Role-Based Access Control', desc: 'Roles stored in user_roles table. Security definer function (has_role) prevents RLS recursion.', icon: Zap },
            { name: 'Edge Functions (Service Role)', desc: 'Admin operations (create/delete users, reset passwords) run via secure edge functions with service role key.', icon: Server },
          ].map(s => {
            const Icon = s.icon;
            return (
              <div key={s.name} className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="text-green-500" size={18} />
                  <p className="font-bold text-foreground">{s.name}</p>
                </div>
                <p className="text-sm text-muted-foreground">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Architecture */}
      <Card className="p-6">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Code className="text-primary" size={22} />
          Application Architecture
        </h2>
        <div className="bg-muted/50 rounded-lg p-4 font-mono text-sm text-foreground leading-relaxed">
          <pre>{`src/
├── components/
│   ├── aquabank/
│   │   ├── admin/          # Admin panel (Dashboard, Users, Transactions, Branches, Settings)
│   │   ├── AuthPage.tsx    # Login / Signup
│   │   ├── Dashboard.tsx   # User dashboard (accounts, transfers, QR, statements)
│   │   ├── Header.tsx      # Navigation header
│   │   └── HomePage.tsx    # Landing page
│   └── ui/                 # shadcn/ui components
├── hooks/
│   ├── useAuth.tsx         # Authentication context & provider
│   └── useAdmin.tsx        # Admin role detection hook
├── integrations/supabase/  # Auto-generated Supabase client & types
└── pages/
    └── Index.tsx            # Main router / page controller

supabase/
└── functions/
    └── admin-users/        # Edge function for admin user management`}</pre>
        </div>
      </Card>

      {/* Database Access Info */}
      <Card className="p-6 border-primary/30 bg-primary/5">
        <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
          <Globe className="text-primary" size={22} />
          Database Access
        </h2>
        <div className="space-y-3 text-sm text-foreground">
          <p>
            <strong>This project does NOT use MongoDB.</strong> It uses <strong>PostgreSQL</strong> via Lovable Cloud (powered by Supabase).
          </p>
          <p>
            There are no MongoDB credentials, usernames, passwords, or connection URLs — the database is managed automatically by the platform.
          </p>
          <div className="bg-card rounded-lg p-4 mt-4 space-y-2">
            <p className="font-bold">How to access your data:</p>
            <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
              <li>Open <strong>Lovable Cloud View</strong> → Database → Tables to browse/edit data</li>
              <li>Use <strong>Run SQL</strong> in Cloud View to execute custom queries</li>
              <li>The app connects via the Supabase JS client with auto-generated types</li>
              <li>All data is secured with Row Level Security (RLS) policies</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Key Features */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Key Features Summary</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[
            'User registration & login (email/password)',
            'Auto account creation with unique account numbers',
            'Money transfers between accounts',
            'Transaction history & downloadable statements',
            'QR code generation for payment details',
            'Admin dashboard with analytics & charts',
            'Admin user management (CRUD, password reset)',
            'Role-based access control (admin/user)',
          ].map((feature, i) => (
            <div key={i} className="flex items-center gap-2 text-sm text-foreground">
              <div className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
              {feature}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
