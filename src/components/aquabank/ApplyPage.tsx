import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export function ApplyPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [product, setProduct] = useState('Checking');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Application received for ${firstName} ${lastName} — ${product}`);
    setFirstName('');
    setLastName('');
    setEmail('');
    setProduct('Checking');
  };

  const handleReset = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setProduct('Checking');
    toast.success('Form reset');
  };

  return (
    <Card className="p-[18px]">
      <h2 className="text-2xl font-bold mb-2">Open an account</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Fast online application (client-side demo). In production, submit to secure backend with KYC provider.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          <div>
            <Label htmlFor="first">First name</Label>
            <Input
              id="first"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="last">Last name</Label>
            <Input
              id="last"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[10px]">
          <div>
            <Label htmlFor="applyEmail">Email</Label>
            <Input
              id="applyEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="product">Product</Label>
            <select
              id="product"
              value={product}
              onChange={(e) => setProduct(e.target.value)}
              className="w-full p-[10px] border border-input rounded-lg bg-transparent text-sm mt-1"
            >
              <option>Checking</option>
              <option>Savings</option>
            </select>
          </div>
        </div>

        <div>
          <Label>Identity document (mock upload)</Label>
          <div className="flex items-center gap-[10px] border border-dashed border-border p-[10px] rounded-lg mt-1">
            <input type="file" accept="image/*,.pdf" />
            <span className="text-[13px] text-muted-foreground">Upload JPG/PNG/PDF</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold"
          >
            Submit application
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="bg-transparent text-foreground border border-border px-4 py-2 rounded-lg font-bold"
          >
            Reset
          </button>
        </div>
      </form>
    </Card>
  );
}
