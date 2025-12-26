import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Download, Send, FileText, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface DashboardProps {
  onNavigate: (page: string) => void;
  isAdmin?: boolean;
}

interface Account {
  id: string;
  account_number: string;
  account_name: string;
  balance: number;
}

interface Transaction {
  id: string;
  amount: number;
  type: string;
  status: string;
  memo: string | null;
  created_at: string;
  from_user_id: string | null;
  to_user_id: string | null;
}

export function Dashboard({ onNavigate, isAdmin }: DashboardProps) {
  const { user, signOut } = useAuth();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [panel, setPanel] = useState<'transfer' | 'statements' | 'qr'>('transfer');
  const [transferTo, setTransferTo] = useState('');
  const [transferAmount, setTransferAmount] = useState('');
  const [transferMemo, setTransferMemo] = useState('');
  const [showQRDialog, setShowQRDialog] = useState(false);

  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Friend';

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setLoading(true);

    // Fetch accounts
    const { data: accountsData, error: accountsError } = await supabase
      .from('accounts')
      .select('*')
      .eq('user_id', user?.id);

    if (accountsError) {
      console.error('Error fetching accounts:', accountsError);
    } else {
      setAccounts(accountsData || []);
    }

    // Fetch transactions
    const { data: txData, error: txError } = await supabase
      .from('transactions')
      .select('*')
      .or(`from_user_id.eq.${user?.id},to_user_id.eq.${user?.id}`)
      .order('created_at', { ascending: false })
      .limit(10);

    if (txError) {
      console.error('Error fetching transactions:', txError);
    } else {
      setTransactions(txData || []);
    }

    setLoading(false);
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out');
    onNavigate('home');
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(transferAmount);
    if (!amount || amount <= 0) {
      toast.error('Enter a valid amount');
      return;
    }

    if (accounts.length === 0 || accounts[0].balance < amount) {
      toast.error('Insufficient funds');
      return;
    }

    // Find recipient by account number
    const { data: recipientAccount, error: recipientError } = await supabase
      .from('accounts')
      .select('user_id')
      .eq('account_number', transferTo)
      .maybeSingle();

    if (recipientError || !recipientAccount) {
      toast.error('Recipient account not found');
      return;
    }

    // Create transaction
    const { error: txError } = await supabase
      .from('transactions')
      .insert({
        from_user_id: user?.id,
        to_user_id: recipientAccount.user_id,
        from_account_id: accounts[0].id,
        amount,
        type: 'transfer',
        status: 'completed',
        memo: transferMemo || null,
      });

    if (txError) {
      toast.error('Transfer failed');
      console.error(txError);
      return;
    }

    // Update balances
    await supabase
      .from('accounts')
      .update({ balance: accounts[0].balance - amount })
      .eq('id', accounts[0].id);

    toast.success(`Sent $${amount.toFixed(2)} to account ${transferTo}`);
    setTransferAmount('');
    setTransferTo('');
    setTransferMemo('');
    fetchUserData();
  };

  const downloadStatement = () => {
    const content = `
AquaBank Statement
==================
Account Holder: ${userName}
Account Number: ${accounts[0]?.account_number || 'N/A'}
Balance: $${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}

Recent Transactions:
${transactions.map(tx => `
${new Date(tx.created_at).toLocaleDateString()} - ${tx.type.toUpperCase()}
Amount: ${tx.from_user_id === user?.id ? '-' : '+'}$${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
Status: ${tx.status}
${tx.memo ? `Memo: ${tx.memo}` : ''}
`).join('\n')}
    `;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `aquabank-statement-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    toast.success('Statement downloaded');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
      {/* Main Content */}
      <div className="space-y-6">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <div className="text-sm text-muted-foreground">Welcome back</div>
              <div className="font-extrabold text-2xl">{userName}</div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setShowQRDialog(true)}>
                <QrCode size={18} className="mr-2" />
                My QR
              </Button>
              <Button onClick={handleSignOut}>Sign out</Button>
            </div>
          </div>

          <h3 className="font-bold text-lg mb-4">Your Accounts</h3>
          {accounts.length === 0 ? (
            <div className="text-muted-foreground py-4">No accounts found</div>
          ) : (
            <div className="space-y-3">
              {accounts.map((acc) => (
                <Card key={acc.id} className="p-4 bg-gradient-to-r from-primary/10 to-primary/5">
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-bold text-lg">{acc.account_name}</div>
                      <div className="text-sm text-muted-foreground font-mono">{acc.account_number}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-black text-2xl text-primary">
                        ${acc.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="text-xs text-muted-foreground">Available Balance</div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Card>

        {/* Recent Transactions */}
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Recent Transactions</h3>
          {transactions.length === 0 ? (
            <div className="text-muted-foreground py-4">No transactions yet</div>
          ) : (
            <div className="space-y-3">
              {transactions.map((tx) => (
                <div key={tx.id} className="flex items-center justify-between py-3 border-b last:border-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tx.from_user_id === user?.id ? 'bg-red-100' : 'bg-green-100'
                    }`}>
                      {tx.from_user_id === user?.id ? (
                        <ArrowUpRight className="text-red-600" size={20} />
                      ) : (
                        <ArrowDownLeft className="text-green-600" size={20} />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()} • {tx.memo || 'No memo'}
                      </div>
                    </div>
                  </div>
                  <div className={`font-bold ${tx.from_user_id === user?.id ? 'text-red-600' : 'text-green-600'}`}>
                    {tx.from_user_id === user?.id ? '-' : '+'}${tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Sidebar */}
      <Card className="p-6 h-fit">
        <h3 className="font-bold text-lg mb-4">Quick Actions</h3>
        <div className="flex gap-2 mb-6">
          <Button
            variant={panel === 'transfer' ? 'default' : 'outline'}
            onClick={() => setPanel('transfer')}
            className="flex-1"
          >
            <Send size={16} className="mr-2" />
            Transfer
          </Button>
          <Button
            variant={panel === 'statements' ? 'default' : 'outline'}
            onClick={() => setPanel('statements')}
            className="flex-1"
          >
            <FileText size={16} className="mr-2" />
            Statement
          </Button>
          <Button
            variant={panel === 'qr' ? 'default' : 'outline'}
            onClick={() => setPanel('qr')}
            className="flex-1"
          >
            <QrCode size={16} className="mr-2" />
            QR
          </Button>
        </div>

        {panel === 'transfer' && (
          <form onSubmit={handleTransfer} className="space-y-4">
            <h4 className="font-bold">Send Money</h4>
            <div className="space-y-2">
              <Label htmlFor="tfTo">Recipient Account Number</Label>
              <Input
                id="tfTo"
                value={transferTo}
                onChange={(e) => setTransferTo(e.target.value)}
                placeholder="Enter account number"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tfAmt">Amount ($)</Label>
              <Input
                id="tfAmt"
                type="number"
                step="0.01"
                min="0.01"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0.00"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tfMemo">Memo (Optional)</Label>
              <Input
                id="tfMemo"
                value={transferMemo}
                onChange={(e) => setTransferMemo(e.target.value)}
                placeholder="Add a note"
              />
            </div>
            <Button type="submit" className="w-full">
              <Send size={16} className="mr-2" />
              Send Transfer
            </Button>
          </form>
        )}

        {panel === 'statements' && (
          <div className="space-y-4">
            <h4 className="font-bold">Download Statement</h4>
            <p className="text-sm text-muted-foreground">
              Download your account statement with recent transaction history.
            </p>
            <Button onClick={downloadStatement} className="w-full">
              <Download size={16} className="mr-2" />
              Download Statement
            </Button>
          </div>
        )}

        {panel === 'qr' && (
          <div className="space-y-4">
            <h4 className="font-bold">Your QR Code</h4>
            <p className="text-sm text-muted-foreground">
              Share this QR code to receive payments.
            </p>
            <div className="flex justify-center bg-white p-4 rounded-xl">
              <QRCodeSVG
                value={JSON.stringify({
                  name: userName,
                  email: user?.email,
                  account: accounts[0]?.account_number,
                })}
                size={180}
                level="H"
              />
            </div>
            <div className="text-center text-sm">
              <p className="font-medium">{userName}</p>
              <p className="text-muted-foreground font-mono">{accounts[0]?.account_number || 'N/A'}</p>
            </div>
          </div>
        )}
      </Card>

      {/* QR Dialog */}
      <Dialog open={showQRDialog} onOpenChange={setShowQRDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Your Payment QR Code</DialogTitle>
            <DialogDescription>
              Share this code to receive payments
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="bg-white p-6 rounded-xl shadow-lg">
              <QRCodeSVG
                value={JSON.stringify({
                  name: userName,
                  email: user?.email,
                  account: accounts[0]?.account_number,
                })}
                size={220}
                level="H"
              />
            </div>
            <div className="mt-4 text-center space-y-1">
              <p className="font-bold text-lg">{userName}</p>
              <p className="text-muted-foreground">{user?.email}</p>
              <p className="font-mono text-primary">{accounts[0]?.account_number || 'N/A'}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}