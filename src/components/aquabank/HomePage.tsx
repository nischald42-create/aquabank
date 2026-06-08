import {
  ShieldCheck,
  Landmark,
  Wallet,
  Building2,
  PiggyBank,
  CreditCard,
  Briefcase,
  Home,
  Phone,
  MapPin,
  Clock,
  Lock,
  Award,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: string) => void;
}

const NAVY = '#0b2545';
const GOLD = '#d4af37';
const IVORY = '#f5f1e8';

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="-mx-4 -mt-7 mb-[-36px] font-serif" style={{ background: IVORY, color: NAVY }}>
      {/* Top trust bar */}
      <div style={{ background: NAVY, color: IVORY }} className="text-xs">
        <div className="max-w-[1100px] mx-auto px-4 py-2 flex flex-wrap justify-between gap-3">
          <span className="flex items-center gap-2">
            <Phone className="w-3 h-3" style={{ color: GOLD }} /> 24/7 Support: 1-800-AQUA-BANK
          </span>
          <span className="flex items-center gap-2">
            <Lock className="w-3 h-3" style={{ color: GOLD }} /> FDIC Insured · Member since 1923
          </span>
        </div>
      </div>

      {/* Hero */}
      <section
        className="relative border-b-4"
        style={{
          borderColor: GOLD,
          background: `linear-gradient(135deg, ${NAVY} 0%, #143a6b 100%)`,
          color: IVORY,
        }}
      >
        <div className="max-w-[1100px] mx-auto px-6 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="flex items-center gap-2 mb-4 text-xs tracking-[0.3em] uppercase" style={{ color: GOLD }}>
              <Landmark className="w-4 h-4" /> Established 1923
            </div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-5">
              Banking built on <span style={{ color: GOLD }}>trust</span>,<br />
              tradition, and modern care.
            </h1>
            <p className="text-base md:text-lg mb-7 opacity-90 max-w-xl">
              For more than a century, AquaBank has helped families, professionals, and
              businesses safeguard their wealth and pursue their goals with confidence.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => onNavigate('apply')}
                className="px-6 py-3 font-bold tracking-wide flex items-center gap-2 transition-transform hover:-translate-y-0.5"
                style={{ background: GOLD, color: NAVY }}
              >
                Open an Account <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => onNavigate('login')}
                className="px-6 py-3 font-bold tracking-wide border-2"
                style={{ borderColor: GOLD, color: IVORY }}
              >
                Online Banking Login
              </button>
            </div>
            <div className="flex gap-6 mt-8 text-xs opacity-80 flex-wrap">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" style={{ color: GOLD }} /> 256-bit Encryption
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-4 h-4" style={{ color: GOLD }} /> A+ BBB Rating
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" style={{ color: GOLD }} /> FDIC Insured
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 translate-x-3 translate-y-3" style={{ background: GOLD, opacity: 0.4 }} />
            <div className="relative p-8" style={{ background: IVORY, color: NAVY, borderTop: `4px solid ${GOLD}` }}>
              <div className="flex justify-between items-start mb-6 pb-4 border-b" style={{ borderColor: `${NAVY}33` }}>
                <div>
                  <div className="text-[10px] tracking-[0.3em] uppercase opacity-60">Premier Savings</div>
                  <div className="text-3xl font-bold mt-1">
                    4.50% <span className="text-base font-normal">APY</span>
                  </div>
                </div>
                <Landmark className="w-10 h-10" style={{ color: GOLD }} />
              </div>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5" style={{ color: GOLD }} /> No minimum balance, no monthly fee
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5" style={{ color: GOLD }} /> Compounded daily, credited monthly
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 mt-0.5" style={{ color: GOLD }} /> Free transfers to your checking
                </li>
              </ul>
              <button
                onClick={() => onNavigate('rates')}
                className="mt-6 text-sm font-bold underline underline-offset-4"
                style={{ color: NAVY }}
              >
                View all rates & terms →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="border-b" style={{ borderColor: `${NAVY}22`, background: '#fff' }}>
        <div className="max-w-[1100px] mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { n: '100+', l: 'Years of Service' },
            { n: '$12B', l: 'Assets Under Care' },
            { n: '240', l: 'Branches Nationwide' },
            { n: '1.4M', l: 'Trusted Clients' },
          ].map((s) => (
            <div key={s.l}>
              <div className="text-2xl md:text-3xl font-bold" style={{ color: NAVY }}>{s.n}</div>
              <div className="text-[11px] tracking-[0.2em] uppercase mt-1 opacity-70">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Services */}
      <section className="py-16">
        <div className="max-w-[1100px] mx-auto px-6">
          <div className="text-center mb-12">
            <div className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Our Services</div>
            <h2 className="text-3xl md:text-4xl font-bold">Comprehensive banking for every chapter</h2>
            <div className="w-16 h-[2px] mx-auto mt-4" style={{ background: GOLD }} />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Wallet, t: 'Personal Checking', d: 'No-fee checking with overdraft protection and nationwide ATM access.' },
              { icon: PiggyBank, t: 'Savings & CDs', d: 'Competitive yields with the security of federally insured deposits.' },
              { icon: CreditCard, t: 'Credit Cards', d: 'Premium rewards, low APR, and travel benefits for every lifestyle.' },
              { icon: Home, t: 'Home Loans', d: 'Mortgages and refinancing guided by local lending officers.' },
              { icon: Briefcase, t: 'Business Banking', d: 'Treasury, lending, and merchant services for growing enterprises.' },
              { icon: Building2, t: 'Wealth Management', d: 'Fiduciary advice, trust services, and retirement planning.' },
            ].map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="p-6 bg-white border-t-2 transition-shadow hover:shadow-lg"
                style={{
                  borderColor: GOLD,
                  borderLeft: `1px solid ${NAVY}22`,
                  borderRight: `1px solid ${NAVY}22`,
                  borderBottom: `1px solid ${NAVY}22`,
                }}
              >
                <Icon className="w-8 h-8 mb-4" style={{ color: NAVY }} />
                <h3 className="font-bold text-lg mb-2">{t}</h3>
                <p className="text-sm opacity-75 leading-relaxed">{d}</p>
                <button
                  onClick={() => onNavigate('products')}
                  className="mt-4 text-xs font-bold tracking-widest uppercase flex items-center gap-1"
                  style={{ color: NAVY }}
                >
                  Learn More <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rates */}
      <section className="py-16" style={{ background: NAVY, color: IVORY }}>
        <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <div className="text-xs tracking-[0.3em] uppercase mb-2" style={{ color: GOLD }}>Today's Rates</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Rates that reward your loyalty</h2>
            <p className="opacity-80 mb-6">
              We post our rates publicly because transparency is the foundation of every banking
              relationship. No fine print, no hidden minimums.
            </p>
            <button
              onClick={() => onNavigate('rates')}
              className="px-5 py-3 font-bold"
              style={{ background: GOLD, color: NAVY }}
            >
              Full Rate Sheet →
            </button>
          </div>
          <div className="bg-white" style={{ color: NAVY }}>
            <table className="w-full">
              <thead style={{ background: IVORY }}>
                <tr>
                  <th className="text-left p-4 text-xs tracking-widest uppercase">Product</th>
                  <th className="text-right p-4 text-xs tracking-widest uppercase">APY</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {[
                  ['Premier Savings', '4.50%'],
                  ['12-Month CD', '4.85%'],
                  ['24-Month CD', '4.65%'],
                  ['Money Market', '3.95%'],
                  ['Heritage Checking', '0.50%'],
                ].map(([p, r]) => (
                  <tr key={p} className="border-t" style={{ borderColor: `${NAVY}22` }}>
                    <td className="p-4">{p}</td>
                    <td className="p-4 text-right font-bold" style={{ color: NAVY }}>{r}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-16 bg-white">
        <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-3 gap-8">
          {[
            { icon: MapPin, t: 'Visit a Branch', d: '240 branches across the country, staffed by bankers who know your name.', a: 'Find a branch', p: 'branches' },
            { icon: Clock, t: 'Bank Anytime', d: 'Online and mobile banking with bill pay, mobile deposit, and Zelle®.', a: 'Sign in', p: 'login' },
            { icon: ShieldCheck, t: 'Bank Securely', d: 'Multi-factor authentication, fraud monitoring, and Zero Liability protection.', a: 'Learn about security', p: 'services' },
          ].map(({ icon: Icon, t, d, a, p }) => (
            <div key={t} className="text-center px-4">
              <div className="inline-flex w-14 h-14 items-center justify-center mb-4" style={{ background: IVORY, border: `2px solid ${GOLD}` }}>
                <Icon className="w-6 h-6" style={{ color: NAVY }} />
              </div>
              <h3 className="font-bold text-lg mb-2">{t}</h3>
              <p className="text-sm opacity-75 mb-3 leading-relaxed">{d}</p>
              <button
                onClick={() => onNavigate(p)}
                className="text-xs font-bold tracking-widest uppercase pb-1"
                style={{ color: NAVY, borderBottom: `2px solid ${GOLD}` }}
              >
                {a}
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-14 border-y-4" style={{ borderColor: GOLD, background: IVORY }}>
        <div className="max-w-[1100px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold">Ready to begin your journey with AquaBank?</h3>
            <p className="opacity-75 mt-2">Open an account online in minutes — no monthly fees, no commitment.</p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <button onClick={() => onNavigate('apply')} className="px-6 py-3 font-bold" style={{ background: NAVY, color: IVORY }}>
              Open an Account
            </button>
            <button onClick={() => onNavigate('contact')} className="px-6 py-3 font-bold border-2" style={{ borderColor: NAVY, color: NAVY }}>
              Talk to a Banker
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: NAVY, color: IVORY }} className="pt-12 pb-6 text-sm">
        <div className="max-w-[1100px] mx-auto px-6 grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 flex items-center justify-center font-bold" style={{ background: GOLD, color: NAVY }}>AB</div>
              <span className="font-bold tracking-wide">AquaBank</span>
            </div>
            <p className="text-xs opacity-70 leading-relaxed">
              Member FDIC. Equal Housing Lender. © {new Date().getFullYear()} AquaBank, N.A. All rights reserved.
            </p>
          </div>
          {[
            { h: 'Banking', items: [['Checking', 'products'], ['Savings', 'products'], ['Credit Cards', 'products'], ['Rates', 'rates']] as const },
            { h: 'Company', items: [['About', 'services'], ['Branches', 'branches'], ['Careers', 'contact'], ['Contact', 'contact']] as const },
            { h: 'Resources', items: [['Apply', 'apply'], ['Online Banking', 'login'], ['Documentation', 'docs'], ['Support', 'contact']] as const },
          ].map((col) => (
            <div key={col.h}>
              <div className="text-xs tracking-[0.3em] uppercase mb-3" style={{ color: GOLD }}>{col.h}</div>
              <ul className="space-y-2">
                {col.items.map(([label, page]) => (
                  <li key={label}>
                    <button onClick={() => onNavigate(page)} className="opacity-80 hover:opacity-100 hover:underline">
                      {label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="max-w-[1100px] mx-auto px-6 mt-10 pt-4 border-t text-[11px] opacity-60 flex flex-wrap justify-between gap-2" style={{ borderColor: `${IVORY}33` }}>
          <span>Deposits are FDIC insured up to $250,000 per depositor.</span>
          <span>Routing #021000021 · NMLS #418537</span>
        </div>
      </footer>
    </div>
  );
}