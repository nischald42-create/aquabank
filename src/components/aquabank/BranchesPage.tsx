import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const mockBranches = [
  { name: 'AquaBank Oceanside', addr: '123 Aqua Ave, Oceanside, 90210', phone: '(800) 111-2222' },
  { name: 'AquaBank Harbor', addr: '400 Harbor Rd, Harbor City, 90211', phone: '(800) 111-3333' },
  { name: 'AquaBank Downtown', addr: '9 Market St, Downtown, 90212', phone: '(800) 111-4444' },
];

export function BranchesPage() {
  const [search, setSearch] = useState('');
  const [filteredBranches, setFilteredBranches] = useState(mockBranches);

  const handleSearch = () => {
    if (!search.trim()) {
      setFilteredBranches(mockBranches);
      toast.success('Showing all locations');
      return;
    }
    const q = search.toLowerCase();
    const filtered = mockBranches.filter(
      (b) => (b.name + b.addr + b.phone).toLowerCase().includes(q)
    );
    setFilteredBranches(filtered);
    toast.success(filtered.length ? `${filtered.length} location(s) found` : 'No locations found');
  };

  return (
    <Card className="p-[18px]">
      <h2 className="text-2xl font-bold mb-2">Branches & ATMs</h2>
      <p className="text-muted-foreground text-sm mb-4">Search locations (mock data)</p>

      <div className="flex gap-2 items-center mb-4">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="City or ZIP"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button
          onClick={handleSearch}
          className="bg-primary text-primary-foreground px-3 py-2 rounded-lg font-bold whitespace-nowrap"
        >
          Search
        </button>
      </div>

      <div className="space-y-[10px]">
        {filteredBranches.map((b, i) => (
          <Card key={i} className="p-[14px] flex items-center gap-[10px]">
            <div className="flex-1">
              <strong>{b.name}</strong>
              <div className="text-[13px] text-muted-foreground">{b.addr}</div>
            </div>
            <div className="text-[13px] text-muted-foreground">{b.phone}</div>
          </Card>
        ))}
      </div>

      <p className="text-[13px] text-muted-foreground mt-4">
        Note: replace mock data with a real geocoded locations API (Google Maps / Mapbox / OpenStreetMap).
      </p>
    </Card>
  );
}
