import { useState, useEffect } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

interface Transaction {
  id: string;
  type: string;
  amount: number;
  status: string;
  created_at: string;
  memo: string | null;
  from_user_id: string | null;
  to_user_id: string | null;
  from_email?: string;
  to_email?: string;
}

export function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const { data: txData, error } = await supabase
        .from('transactions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      if (txData) {
        const txWithEmails = await Promise.all(
          txData.map(async (tx) => {
            let fromEmail = 'External';
            let toEmail = 'External';

            if (tx.from_user_id) {
              const { data: fromProfile } = await supabase
                .from('profiles')
                .select('email')
                .eq('user_id', tx.from_user_id)
                .single();
              fromEmail = fromProfile?.email || 'Unknown';
            }

            if (tx.to_user_id) {
              const { data: toProfile } = await supabase
                .from('profiles')
                .select('email')
                .eq('user_id', tx.to_user_id)
                .single();
              toEmail = toProfile?.email || 'Unknown';
            }

            return {
              ...tx,
              from_email: fromEmail,
              to_email: toEmail,
            };
          })
        );
        setTransactions(txWithEmails);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    const matchesSearch = 
      (tx.from_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (tx.to_email?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
      (tx.memo?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
    const matchesFilter = filterType === 'all' || tx.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'failed': return 'bg-red-100 text-red-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalVolume = transactions.reduce((sum, tx) => sum + Number(tx.amount), 0);
  const pendingCount = transactions.filter(tx => tx.status === 'pending').length;
  const failedCount = transactions.filter(tx => tx.status === 'failed').length;

  // Generate chart data
  const getChartData = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      const dayTransactions = transactions.filter(tx => {
        const txDate = new Date(tx.created_at);
        return txDate.toDateString() === date.toDateString();
      });
      return {
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        amount: dayTransactions.reduce((sum, tx) => sum + Number(tx.amount), 0),
        count: dayTransactions.length,
      };
    });
    return last7Days;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Monitor all transaction activity from Cloud</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchTransactions}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg flex items-center gap-2 hover:bg-primary/90"
          >
            <RefreshCw size={18} />
            Refresh
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground w-full sm:w-64"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background text-foreground"
          >
            <option value="all">All Types</option>
            <option value="transfer">Transfers</option>
            <option value="deposit">Deposits</option>
            <option value="withdrawal">Withdrawals</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-muted-foreground">Total Volume</p>
          <p className="text-2xl font-bold text-foreground">${totalVolume.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-muted-foreground">Pending Transactions</p>
          <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-muted-foreground">Failed Transactions</p>
          <p className="text-2xl font-bold text-foreground">{failedCount}</p>
        </div>
      </div>

      {/* Transaction Graph */}
      <div className="bg-card rounded-xl p-6 shadow-sm border">
        <h3 className="font-semibold text-foreground mb-4">Transaction Volume (Last 7 Days)</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={getChartData()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => ['$' + value.toLocaleString(), 'Amount']} />
              <Area type="monotone" dataKey="amount" stroke="#0ea5e9" fill="#0ea5e9" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          {filteredTransactions.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No transactions found
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Type</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">From</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">To</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Amount</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Memo</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {tx.type === 'deposit' ? (
                          <ArrowDownLeft className="text-green-500" size={18} />
                        ) : (
                          <ArrowUpRight className="text-primary" size={18} />
                        )}
                        <span className="capitalize text-foreground">{tx.type}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{tx.from_email}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{tx.to_email}</td>
                    <td className="px-6 py-4 font-medium text-foreground">${Number(tx.amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">{tx.memo || '-'}</td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(tx.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
