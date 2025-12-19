import { Card } from '@/components/ui/card';

export function RatesPage() {
  return (
    <Card className="p-[18px]">
      <h2 className="text-2xl font-bold mb-2">Rates</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Representative rates — for demonstration only.
      </p>

      <div className="flex gap-3 flex-wrap">
        <Card className="p-[18px] min-w-[160px]">
          <div className="text-[13px] text-muted-foreground">Savings APY</div>
          <div className="font-extrabold text-xl">3.25%</div>
        </Card>
        <Card className="p-[18px] min-w-[160px]">
          <div className="text-[13px] text-muted-foreground">30-yr Mortgage</div>
          <div className="font-extrabold text-xl">6.12%</div>
        </Card>
      </div>
    </Card>
  );
}
