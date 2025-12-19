import { Card } from '@/components/ui/card';

const mockTx = [
  { date: '2025-10-28', payee: 'Coffee Shop', amount: -4.50 },
  { date: '2025-10-27', payee: 'Paycheck', amount: 2500.00 },
  { date: '2025-10-25', payee: 'Electric', amount: -120.34 },
];

interface HomePageProps {
  onNavigate: (page: string) => void;
}

export function HomePage({ onNavigate }: HomePageProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-5 items-start mb-[18px]">
      <div>
        <Card className="p-[18px]">
          <h1 className="text-[28px] font-bold mb-2">Modern banking with an aqua touch</h1>
          <p className="text-muted-foreground text-sm">
            Checking, savings, cards, and small-business services — built for clarity and speed.
          </p>
          <div className="flex gap-[10px] mt-[14px] flex-wrap">
            <button 
              onClick={() => onNavigate('apply')}
              className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold"
            >
              Open an account
            </button>
            <button 
              onClick={() => onNavigate('rates')}
              className="bg-transparent text-primary border border-primary/30 px-3 py-2 rounded-lg font-bold"
            >
              See rates
            </button>
          </div>

          <div className="flex gap-3 flex-wrap mt-4">
            <Card className="min-w-[170px] p-[18px]">
              <div className="text-muted-foreground text-[13px]">Personal checking</div>
              <div className="font-extrabold text-xl">$0 monthly fee</div>
            </Card>
            <Card className="min-w-[170px] p-[18px]">
              <div className="text-muted-foreground text-[13px]">Savings APY</div>
              <div className="font-extrabold text-xl">3.25%</div>
            </Card>
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-[18px] mt-4">
          <Card className="p-[14px]">
            <h3 className="font-bold mb-2">Why AquaBank</h3>
            <ul className="list-disc pl-[18px] text-muted-foreground text-sm space-y-1">
              <li>Clear, simple fees</li>
              <li>Fast online applications</li>
              <li>Secure MFA & modern encryption</li>
            </ul>
            <p className="mt-3 text-[13px] text-muted-foreground">
              This prototype simulates flows client-side and includes comments where to integrate real services.
            </p>
          </Card>

          <Card className="p-[14px]">
            <div className="flex gap-2 items-center mb-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center font-extrabold text-primary-foreground">
                AB
              </div>
              <div className="flex-1">
                <div className="font-bold">Welcome</div>
                <div className="text-[13px] text-muted-foreground">Personal Banking</div>
              </div>
              <span className="bg-accent text-accent-foreground px-2 py-1.5 rounded-lg font-bold text-sm">
                New
              </span>
            </div>
            <div className="space-y-[10px]">
              <div className="bg-gradient-to-r from-accent to-card p-[10px] rounded-[10px] border border-border/30">
                <strong>Quick actions</strong>
                <div className="text-[13px] text-muted-foreground">Transfer, statements, messages</div>
              </div>
              <div className="bg-gradient-to-r from-accent to-card p-[10px] rounded-[10px] border border-border/30">
                <strong>Mobile app</strong>
                <div className="text-[13px] text-muted-foreground">Download coming soon</div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Card className="p-[18px]">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[13px] text-muted-foreground">Account balance</div>
            <div className="font-extrabold text-lg">$8,762.45</div>
          </div>
          <span className="bg-gradient-to-r from-primary to-secondary text-primary-foreground px-[10px] py-1.5 rounded-full font-bold">
            Personal
          </span>
        </div>

        <div className="mt-4">
          <div className="text-[13px] text-muted-foreground mb-2">Recent transactions</div>
          <table className="w-full text-sm">
            <thead>
              <tr>
                <th className="text-left py-[10px] px-2 text-muted-foreground font-bold">Date</th>
                <th className="text-left py-[10px] px-2 text-muted-foreground font-bold">Payee</th>
                <th className="text-right py-[10px] px-2 text-muted-foreground font-bold">Amount</th>
              </tr>
            </thead>
            <tbody>
              {mockTx.map((tx, i) => (
                <tr key={i} className="border-t border-border">
                  <td className="py-[10px] px-2">{tx.date}</td>
                  <td className="py-[10px] px-2">{tx.payee}</td>
                  <td className="py-[10px] px-2 text-right">
                    {tx.amount < 0 ? '-' : ''}${Math.abs(tx.amount).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
