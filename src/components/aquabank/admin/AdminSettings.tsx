import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Eye, EyeOff, Lock, Mail, Bell, Shield } from 'lucide-react';

export function AdminSettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }

    setLoading(true);
    
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    
    setLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">Manage admin account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Account Info */}
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Mail className="text-primary" size={20} />
            </div>
            <h3 className="font-semibold text-foreground">Account Information</h3>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Email Address</label>
              <p className="font-medium text-foreground">{user?.email}</p>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Role</label>
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-medium">
                <Shield size={14} />
                Administrator
              </span>
            </div>
            <div>
              <label className="block text-sm text-muted-foreground mb-1">Account Created</label>
              <p className="font-medium text-foreground">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
          </div>
        </div>

        {/* Change Password */}
        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Lock className="text-primary" size={20} />
            </div>
            <h3 className="font-semibold text-foreground">Change Password</h3>
          </div>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg bg-background text-foreground pr-10"
                  placeholder="Enter current password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                placeholder="Enter new password"
                minLength={8}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">Confirm New Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg bg-background text-foreground"
                placeholder="Confirm new password"
                minLength={8}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>

        {/* Security Settings */}
        <div className="bg-card rounded-xl p-6 shadow-sm border lg:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="text-primary" size={20} />
            </div>
            <h3 className="font-semibold text-foreground">Notification Preferences</h3>
          </div>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-foreground">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive email alerts for important events</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-foreground">Security Alerts</p>
                <p className="text-sm text-muted-foreground">Get notified about suspicious activities</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5 accent-primary" />
            </label>
            <label className="flex items-center justify-between p-4 bg-muted/50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-foreground">Weekly Reports</p>
                <p className="text-sm text-muted-foreground">Receive weekly summary of activities</p>
              </div>
              <input type="checkbox" className="w-5 h-5 accent-primary" />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
