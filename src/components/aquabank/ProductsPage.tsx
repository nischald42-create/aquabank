import { Card } from '@/components/ui/card';

interface ProductsPageProps {
  onNavigate: (page: string) => void;
}

export function ProductsPage({ onNavigate }: ProductsPageProps) {
  return (
    <Card className="p-[18px]">
      <h2 className="text-2xl font-bold mb-2">Products</h2>
      <p className="text-muted-foreground text-sm mb-4">Checking, Savings, Business, and Loans</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-[18px]">
          <h3 className="font-bold text-lg mb-2">Checking</h3>
          <p className="text-[13px] text-muted-foreground mb-3">
            No monthly fees, debit card, FDIC-insured.
          </p>
          <button
            onClick={() => onNavigate('apply')}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold"
          >
            Apply
          </button>
        </Card>
        <Card className="p-[18px]">
          <h3 className="font-bold text-lg mb-2">Savings</h3>
          <p className="text-[13px] text-muted-foreground mb-3">
            Competitive APY and easy transfers.
          </p>
          <button
            onClick={() => onNavigate('apply')}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold"
          >
            Open Savings
          </button>
        </Card>
      </div>
    </Card>
  );
}
