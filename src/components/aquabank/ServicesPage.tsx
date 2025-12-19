import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface ServicesPageProps {
  onNavigate: (page: string) => void;
}

export function ServicesPage({ onNavigate }: ServicesPageProps) {
  return (
    <Card className="p-[18px]">
      <h2 className="text-2xl font-bold mb-2">Services</h2>
      <p className="text-muted-foreground text-sm mb-4">Banking services we offer (overview).</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <Card className="p-[18px]">
          <h3 className="font-bold text-lg mb-2">Personal Banking</h3>
          <p className="text-[13px] text-muted-foreground mb-3">
            Checking, savings, debit cards, mobile banking.
          </p>
          <button
            onClick={() => onNavigate('products')}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold"
          >
            Explore
          </button>
        </Card>

        <Card className="p-[18px]">
          <h3 className="font-bold text-lg mb-2">Business Banking</h3>
          <p className="text-[13px] text-muted-foreground mb-3">
            Business checking, ACH, payroll services, merchant processing.
          </p>
          <button
            onClick={() => toast.success('Business banking page (demo)')}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold"
          >
            Learn more
          </button>
        </Card>

        <Card className="p-[18px]">
          <h3 className="font-bold text-lg mb-2">Loans & Mortgages</h3>
          <p className="text-[13px] text-muted-foreground mb-3">
            Home loans, auto loans, personal loans — fast decisions.
          </p>
          <button
            onClick={() => onNavigate('apply')}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold"
          >
            Apply
          </button>
        </Card>

        <Card className="p-[18px]">
          <h3 className="font-bold text-lg mb-2">Wealth & Advisory</h3>
          <p className="text-[13px] text-muted-foreground mb-3">
            Investment accounts, advisory services, retirement planning.
          </p>
          <button
            onClick={() => toast.success('Contact our advisory team (demo)')}
            className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold"
          >
            Contact
          </button>
        </Card>
      </div>
    </Card>
  );
}
