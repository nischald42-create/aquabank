import { useState } from 'react';
import { Search, ArrowUpRight, ArrowDownLeft, Filter } from 'lucide-react';

// Mock transaction data
const mockTransactions = [
  { id: 1, type: 'transfer', from: 'john@example.com', to: 'jane@example.com', amount: 500, status: 'completed', date: '2025-01-15' },
  { id: 2, type: 'deposit', from: 'External', to: 'bob@example.com', amount: 1200, status: 'completed', date: '2025-01-15' },
  { id: 3, type: 'withdrawal', from: 'alice@example.com', to: 'External', amount: 300, status: 'pending', date: '2025-01-14' },
  { id: 4, type: 'transfer', from: 'bob@example.com', to: 'alice@example.com', amount: 150, status: 'completed', date: '2025-01-14' },
  { id: 5, type: 'deposit', from: 'External', to: 'john@example.com', amount: 2000, status: 'completed', date: '2025-01-13' },
  { id: 6, type: 'transfer', from: 'jane@example.com', to: 'bob@example.com', amount: 75, status: 'failed', date: '2025-01-13' },
];

export function AdminTransactions() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredTransactions = mockTransactions.filter(tx => {
    const matchesSearch = 
      tx.from.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.to.toLowerCase().includes(searchTerm.toLowerCase());
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

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transactions</h1>
          <p className="text-muted-foreground">Monitor all transaction activity</p>
        </div>
        <div className="flex gap-3">
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
          <p className="text-sm text-muted-foreground">Total Volume Today</p>
          <p className="text-2xl font-bold text-foreground">$4,225.00</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-muted-foreground">Pending Transactions</p>
          <p className="text-2xl font-bold text-foreground">3</p>
        </div>
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <p className="text-sm text-muted-foreground">Failed Today</p>
          <p className="text-2xl font-bold text-foreground">1</p>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Type</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">From</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">To</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Amount</th>
                <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Status</th>
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
                  <td className="px-6 py-4 text-sm text-muted-foreground">{tx.from}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{tx.to}</td>
                  <td className="px-6 py-4 font-medium text-foreground">${tx.amount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
