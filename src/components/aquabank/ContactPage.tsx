import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

export function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent. Support will reply within 1–2 business days (demo).');
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <Card className="p-[18px]">
      <h2 className="text-2xl font-bold mb-2">Contact</h2>
      <p className="text-muted-foreground text-sm mb-4">
        Customer support is available Monday–Friday, 8AM–6PM
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-3">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="cname">Name</Label>
            <Input
              id="cname"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cemail">Email</Label>
            <Input
              id="cemail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="cmsg">Message</Label>
            <Textarea
              id="cmsg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="mt-1"
            />
          </div>
          <button
            type="submit"
            className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold"
          >
            Send message
          </button>
        </form>

        <Card className="p-[18px]">
          <h3 className="font-bold text-lg mb-2">Headquarters</h3>
          <p className="text-[13px] text-muted-foreground">123 Aqua Ave, Oceanside</p>
          <div className="mt-4">
            <strong>Phone</strong>
            <div className="text-[13px] text-muted-foreground">1-800-AQUA-BNK</div>
          </div>
        </Card>
      </div>
    </Card>
  );
}
