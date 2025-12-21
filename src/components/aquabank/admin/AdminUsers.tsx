import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Search, UserCheck, UserX, Shield, Plus, Trash2, Key, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string | null;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<(Profile & { role?: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Add user dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [addingUser, setAddingUser] = useState(false);
  
  // Delete user dialog
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Profile | null>(null);
  const [deletingUser, setDeletingUser] = useState(false);
  
  // Reset password dialog
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [userToResetPassword, setUserToResetPassword] = useState<Profile | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [resettingPassword, setResettingPassword] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      toast.error('Failed to load users');
      setLoading(false);
      return;
    }

    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('user_id, role');

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
    }

    const usersWithRoles = (profiles || []).map(profile => ({
      ...profile,
      role: roles?.find(r => r.user_id === profile.user_id)?.role || 'user'
    }));

    setUsers(usersWithRoles);
    setLoading(false);
  };

  const filteredUsers = users.filter(user => 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    
    const { error } = await supabase
      .from('user_roles')
      .update({ role: newRole })
      .eq('user_id', userId);

    if (error) {
      toast.error('Failed to update user role');
      return;
    }

    toast.success(`User role updated to ${newRole}`);
    fetchUsers();
  };

  const handleAddUser = async () => {
    if (!newUserEmail || !newUserPassword) {
      toast.error('Email and password are required');
      return;
    }

    if (newUserPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setAddingUser(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'create_user',
          email: newUserEmail,
          password: newUserPassword,
          full_name: newUserName,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to create user');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success('User created successfully');
      setShowAddDialog(false);
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
      
      // Wait a moment for the trigger to create the profile
      setTimeout(fetchUsers, 1000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create user');
    } finally {
      setAddingUser(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    setDeletingUser(true);
    
    try {
      const response = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'delete_user',
          user_id: userToDelete.user_id,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to delete user');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success('User deleted successfully');
      setShowDeleteDialog(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setDeletingUser(false);
    }
  };

  const handleResetPassword = async () => {
    if (!userToResetPassword || !newPassword) return;

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setResettingPassword(true);
    
    try {
      const response = await supabase.functions.invoke('admin-users', {
        body: {
          action: 'reset_password',
          user_id: userToResetPassword.user_id,
          new_password: newPassword,
        },
      });

      if (response.error) {
        throw new Error(response.error.message || 'Failed to reset password');
      }

      if (response.data?.error) {
        throw new Error(response.data.error);
      }

      toast.success('Password reset successfully');
      setShowPasswordDialog(false);
      setUserToResetPassword(null);
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to reset password');
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Users</h1>
          <p className="text-muted-foreground">Manage registered users</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground w-full sm:w-64"
            />
          </div>
          <Button onClick={() => setShowAddDialog(true)} className="gap-2">
            <Plus size={18} />
            Add User
          </Button>
        </div>
      </div>

      <div className="bg-card rounded-xl shadow-sm border overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Loading users...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">No users found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">User</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Role</th>
                  <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Joined</th>
                  <th className="text-right px-6 py-4 text-sm font-semibold text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/30">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                          {user.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{user.full_name || 'No name'}</p>
                          <p className="text-sm text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`
                        inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium
                        ${user.role === 'admin' 
                          ? 'bg-primary/20 text-primary' 
                          : 'bg-muted text-muted-foreground'
                        }
                      `}>
                        {user.role === 'admin' && <Shield size={12} />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleUserRole(user.user_id, user.role || 'user')}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                          title={user.role === 'admin' ? 'Remove admin' : 'Make admin'}
                        >
                          {user.role === 'admin' ? <UserX size={18} /> : <UserCheck size={18} />}
                        </button>
                        <button
                          onClick={() => {
                            setUserToResetPassword(user);
                            setShowPasswordDialog(true);
                          }}
                          className="p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
                          title="Reset password"
                        >
                          <Key size={18} />
                        </button>
                        <button
                          onClick={() => {
                            setUserToDelete(user);
                            setShowDeleteDialog(true);
                          }}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                          title="Delete user"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add User Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
            <DialogDescription>Create a new user account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                value={newUserName}
                onChange={(e) => setNewUserName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password *</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password (min 6 characters)"
                value={newUserPassword}
                onChange={(e) => setNewUserPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser} disabled={addingUser}>
              {addingUser ? 'Creating...' : 'Create User'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete User</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {userToDelete?.email}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={deletingUser}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingUser ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Dialog */}
      <Dialog open={showPasswordDialog} onOpenChange={setShowPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {userToResetPassword?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                placeholder="Enter new password (min 6 characters)"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetPassword} disabled={resettingPassword}>
              {resettingPassword ? 'Resetting...' : 'Reset Password'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
