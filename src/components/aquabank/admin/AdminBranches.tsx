import { useState } from 'react';
import { MapPin, Phone, Clock, Plus, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const initialBranches = [
  { id: 1, name: 'Downtown HQ', address: '123 Finance Blvd, Downtown', phone: '(555) 100-2000', hours: '9am–5pm Mon–Fri', status: 'active' },
  { id: 2, name: 'Westside Branch', address: '456 Commerce St, Westside', phone: '(555) 200-3000', hours: '9am–6pm Mon–Sat', status: 'active' },
  { id: 3, name: 'Eastside Branch', address: '789 Market Ave, Eastside', phone: '(555) 300-4000', hours: '10am–4pm Mon–Fri', status: 'active' },
  { id: 4, name: 'North Plaza', address: '321 Shopping Dr, North Plaza Mall', phone: '(555) 400-5000', hours: '10am–8pm Daily', status: 'inactive' },
];

export function AdminBranches() {
  const [branches, setBranches] = useState(initialBranches);
  const [showForm, setShowForm] = useState(false);
  const [editingBranch, setEditingBranch] = useState<typeof initialBranches[0] | null>(null);
  const [formData, setFormData] = useState({ name: '', address: '', phone: '', hours: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingBranch) {
      setBranches(branches.map(b => 
        b.id === editingBranch.id 
          ? { ...b, ...formData }
          : b
      ));
      toast.success('Branch updated');
    } else {
      setBranches([...branches, { id: Date.now(), ...formData, status: 'active' }]);
      toast.success('Branch added');
    }
    setShowForm(false);
    setEditingBranch(null);
    setFormData({ name: '', address: '', phone: '', hours: '' });
  };

  const handleEdit = (branch: typeof initialBranches[0]) => {
    setEditingBranch(branch);
    setFormData({ name: branch.name, address: branch.address, phone: branch.phone, hours: branch.hours });
    setShowForm(true);
  };

  const handleDelete = (id: number) => {
    setBranches(branches.filter(b => b.id !== id));
    toast.success('Branch deleted');
  };

  const toggleStatus = (id: number) => {
    setBranches(branches.map(b => 
      b.id === id 
        ? { ...b, status: b.status === 'active' ? 'inactive' : 'active' }
        : b
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Branches</h1>
          <p className="text-muted-foreground">Manage bank branch locations</p>
        </div>
        <button
          onClick={() => {
            setEditingBranch(null);
            setFormData({ name: '', address: '', phone: '', hours: '' });
            setShowForm(true);
          }}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus size={18} />
          Add Branch
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <h3 className="font-semibold text-foreground mb-4">
            {editingBranch ? 'Edit Branch' : 'Add New Branch'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Branch Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Phone</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Address</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Hours</label>
              <input
                type="text"
                value={formData.hours}
                onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                required
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg">
                {editingBranch ? 'Update' : 'Add'} Branch
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingBranch(null);
                }}
                className="px-4 py-2 bg-muted text-foreground rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {branches.map((branch) => (
          <div key={branch.id} className="bg-card rounded-xl p-6 shadow-sm border">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-foreground">{branch.name}</h3>
                <span className={`
                  inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium
                  ${branch.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-muted text-muted-foreground'}
                `}>
                  {branch.status}
                </span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(branch)}
                  className="p-2 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <Edit size={16} />
                </button>
                <button
                  onClick={() => handleDelete(branch.id)}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-destructive"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin size={14} />
                <span>{branch.address}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Phone size={14} />
                <span>{branch.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock size={14} />
                <span>{branch.hours}</span>
              </div>
            </div>
            <button
              onClick={() => toggleStatus(branch.id)}
              className="mt-4 text-sm text-primary hover:underline"
            >
              {branch.status === 'active' ? 'Deactivate' : 'Activate'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
