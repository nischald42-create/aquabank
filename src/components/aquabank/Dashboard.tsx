import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface DashboardProps {
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
}

const mockAccounts = [
  { id: 'CHK-001', type: 'Checking', balance: 8762.45 },
  { id: 'SAV-001', type: 'Savings', balance: 12034.12 },
];

export function Dashboard({ onNavigate, isAdmin }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [accounts, setAccounts] = useState(mockAccounts);
  const [panel, setPanel] = useState<'transfer' | 'statements' | 'profile'>('transfer');
  const [transferFrom, setTransferFrom] = useState(accounts[0]?.id || '');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMemo, setTransferMemo] = useState('');

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    onNavigate('home');
  };

  const handleTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }
    const fromAccount = accounts.find((a) => a.id === transferFrom);
    if (!fromAccount || fromAccount.balance < amount) {
      toast.error('Insufficient funds');
      return;
    }

    setAccounts((prev) =>
      prev.map((a) => {
        if (a.id === transferFrom) return { ...a, balance: a.balance - amount };
        if (a.id === transferTo) return { ...a, balance: a.balance + amount };
        return a;
      })
    );

    const internal = accounts.find((a) => a.id === transferTo);
    if (internal) {
      toast.success(`Transferred $${amount.toFixed(2)} to ${internal.id}`);
    } else {
      toast.success(`Sent $${amount.toFixed(2)} to ${transferTo} (simulated)`);
    }

    setTransferAmount('');
    setTransferTo('');
    setTransferMemo('');
  };

  const downloadStatement = (period: string) => {
    const content = `AquaBank statement for ${period}\nAccount summary (demo)`;
    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `statement-${period}.pdf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Downloaded statement (simulated)');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-[18px]">
      <Card className="p-[14px]">
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-[13px] text-muted-foreground">Hello</div>
            <div className="font-extrabold text-lg">{userName}</div>
          </div>
          <button
            onClick={handleSignOut}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold"
          >
            Sign out
          </button>
        </div>

        <h3 className="font-bold mb-3">Accounts</h3>
        <div className="space-y-[10px]">
          {accounts.map((acc) => (
            <Card key={acc.id} className="p-[14px]">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-extrabold">{acc.type}</div>
                  <div className="text-[13px] text-muted-foreground">{acc.id}</div>
                </div>
                <div className="font-black text-lg">${acc.balance.toFixed(2)}</div>
              </div>
            </Card>
          ))}
        </div>

        <h3 className="font-bold mt-6 mb-2">Messages</h3>
        <p className="text-[13px] text-muted-foreground">You have 0 new messages</p>
      </Card>

      <Card className="p-[14px]">
        <h3 className="font-bold mb-4">Overview</h3>
        <div className="flex justify-between items-center mb-4">
          <div>
            <div className="text-[13px] text-muted-foreground">Total balance</div>
            <div className="font-black text-xl">${totalBalance.toFixed(2)}</div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setPanel('transfer')}
              className={`px-3 py-2 rounded-lg font-bold ${
                panel === 'transfer'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border'
              }`}
            >
              Transfer
            </button>
            <button
              onClick={() => setPanel('statements')}
              className={`px-3 py-2 rounded-lg font-bold ${
                panel === 'statements'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-card border border-border'
              }`}
            >
              Statements
            </button>
          </div>
        </div>

        {panel === 'transfer' && (
          <form onSubmit={handleTransfer} className="space-y-4">
            <h4 className="font-bold">Transfer funds</h4>
            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <Label htmlFor="tfFrom">From</Label>
                <select
                  id="tfFrom"
                  value={transferFrom}
                  onChange={(e) => setTransferFrom(e.target.value)}
                  className="w-full p-[10px] border border-input rounded-lg bg-transparent text-sm mt-1"
                >
                  {accounts.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.type} — {a.id}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="tfTo">To</Label>
                <Input
                  id="tfTo"
                  value={transferTo}
                  onChange={(e) => setTransferTo(e.target.value)}
                  placeholder="Account number"
                  required
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-[10px]">
              <div>
                <Label htmlFor="tfAmt">Amount</Label>
                <Input
                  id="tfAmt"
                  type="number"
                  step="0.01"
                  value={transferAmount}
                  onChange={(e) => setTransferAmount(e.target.value)}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="tfMemo">Memo</Label>
                <Input
                  id="tfMemo"
                  value={transferMemo}
                  onChange={(e) => setTransferMemo(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold"
            >
              Send transfer
            </button>
          </form>
        )}

        {panel === 'statements' && (
          <div>
            <h4 className="font-bold mb-2">Statements</h4>
            <p className="text-[13px] text-muted-foreground mb-3">
              Download recent statements (mock PDFs).
            </p>
            <ul className="list-disc pl-[18px] space-y-1">
              <li>
                <button
                  onClick={() => downloadStatement('2025-10')}
                  className="text-primary underline"
                >
                  October 2025
                </button>
              </li>
              <li>
                <button
                  onClick={() => downloadStatement('2025-09')}
                  className="text-primary underline"
                >
                  September 2025
                </button>
              </li>
            </ul>
          </div>
        )}
      </Card>
    </div>
  );
}
