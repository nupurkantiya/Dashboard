import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Plus, 
  Download, 
  Eye, 
  Edit2, 
  Trash2, 
  MoreHorizontal,
  User,
  Mail,
  UserCheck,
  Activity,
  Users as UsersIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { useUser, useTheme } from '@/contexts';

const Users = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', avatar: 'JD', joinDate: '2024-01-15', lastLogin: '2 hours ago' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', avatar: 'JS', joinDate: '2024-02-20', lastLogin: '1 day ago' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'Editor', status: 'inactive', avatar: 'MJ', joinDate: '2024-01-10', lastLogin: '1 week ago' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'User', status: 'active', avatar: 'SW', joinDate: '2024-03-05', lastLogin: '3 hours ago' },
    { id: 5, name: 'Tom Brown', email: 'tom@example.com', role: 'Admin', status: 'pending', avatar: 'TB', joinDate: '2024-03-10', lastLogin: 'Never' },
    { id: 6, name: 'Lisa Anderson', email: 'lisa@example.com', role: 'User', status: 'active', avatar: 'LA', joinDate: '2024-02-28', lastLogin: '5 minutes ago' },
    { id: 7, name: 'David Garcia', email: 'david@example.com', role: 'Editor', status: 'active', avatar: 'DG', joinDate: '2024-01-25', lastLogin: '1 hour ago' },
    { id: 8, name: 'Emma Martinez', email: 'emma@example.com', role: 'User', status: 'inactive', avatar: 'EM', joinDate: '2024-02-15', lastLogin: '2 weeks ago' },
  ]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [isViewUserOpen, setIsViewUserOpen] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'User',
    status: 'active'
  });
  const [editUser, setEditUser] = useState({
    id: '',
    name: '',
    email: '',
    role: 'User',
    status: 'active'
  });
  const itemsPerPage = 10;
  const { toast } = useToast();
  const { shouldOpenAddUser, resetAddUserTrigger } = useUser();
  const { accentColor } = useTheme();

  // Get avatar color based on accent color
  const getAvatarGradient = () => {
    const gradients = {
      'sky-blue': 'from-sky-500 to-sky-600',
      'blue': 'from-blue-500 to-blue-600',
      'indigo': 'from-indigo-500 to-indigo-600',
      'cyan': 'from-cyan-500 to-cyan-600',
      'emerald': 'from-emerald-500 to-emerald-600',
      'green': 'from-green-500 to-green-600',
      'teal': 'from-teal-500 to-teal-600',
      'lime': 'from-lime-500 to-lime-600',
      'purple': 'from-purple-500 to-purple-600',
      'violet': 'from-violet-500 to-violet-600',
      'fuchsia': 'from-fuchsia-500 to-fuchsia-600',
      'pink': 'from-pink-500 to-pink-600',
      'rose': 'from-rose-500 to-rose-600',
      'red': 'from-red-500 to-red-600',
      'orange': 'from-orange-500 to-orange-600',
      'amber': 'from-amber-500 to-amber-600',
      'yellow': 'from-yellow-500 to-yellow-600',
      'slate': 'from-slate-500 to-slate-600',
      'gray': 'from-gray-500 to-gray-600',
      'zinc': 'from-zinc-500 to-zinc-600',
      'stone': 'from-stone-500 to-stone-600',
    };
    return gradients[accentColor] || 'from-blue-500 to-purple-600';
  };

  // Listen for add user trigger from dashboard
  useEffect(() => {
    if (shouldOpenAddUser) {
      setIsAddUserOpen(true);
      resetAddUserTrigger();
    }
  }, [shouldOpenAddUser, resetAddUserTrigger]);

  // Generate avatar initials
  const generateAvatar = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Generate unique ID
  const generateId = () => {
    return Math.max(...users.map(u => u.id)) + 1;
  };

  // Handle form submission
  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists
    if (users.some(user => user.email.toLowerCase() === newUser.email.toLowerCase())) {
      toast({
        title: "Error",
        description: "A user with this email already exists.",
        variant: "destructive",
      });
      return;
    }

    const userToAdd = {
      id: generateId(),
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: newUser.status,
      avatar: generateAvatar(newUser.name),
      joinDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never'
    };

    setUsers([...users, userToAdd]);
    setNewUser({ name: '', email: '', role: 'User', status: 'active' });
    setIsAddUserOpen(false);
    
    toast({
      title: "Success",
      description: "User has been added successfully.",
    });
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'User', status: 'active' });
  };

  // Filter and search logic
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, users]);

  // Status counts
  const statusCounts = useMemo(() => {
    return users.reduce((acc, user) => {
      acc[user.status] = (acc[user.status] || 0) + 1;
      return acc;
    }, {});
  }, [users]);

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const variants = {
      active: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border-green-200',
      inactive: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 hover:from-red-200 hover:to-rose-200 border-red-200',
      pending: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 hover:from-yellow-200 hover:to-amber-200 border-yellow-200',
    };
    return variants[status] || variants.active;
  };

  const getRoleBadge = (role) => {
    const variants = {
      Admin: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 hover:from-purple-200 hover:to-violet-200 border-purple-200',
      Editor: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 hover:from-blue-200 hover:to-cyan-200 border-blue-200',
      User: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 hover:from-gray-200 hover:to-slate-200 border-gray-200',
    };
    return variants[role] || variants.User;
  };

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    setUsers(users.filter(user => user.id !== userId));
    toast({
      title: "Success",
      description: "User has been deleted successfully.",
    });
  };

  // Handle view user details
  const handleViewUser = (user) => {
    setSelectedUser(user);
    setIsViewUserOpen(true);
  };

  // Handle edit user
  const handleEditUser = (user) => {
    setEditUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsEditUserOpen(true);
  };

  // Handle update user
  const handleUpdateUser = () => {
    if (!editUser.name || !editUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if email already exists (excluding current user)
    if (users.some(user => user.id !== editUser.id && user.email.toLowerCase() === editUser.email.toLowerCase())) {
      toast({
        title: "Error",
        description: "A user with this email already exists.",
        variant: "destructive",
      });
      return;
    }

    setUsers(users.map(user => 
      user.id === editUser.id 
        ? { 
            ...user, 
            name: editUser.name,
            email: editUser.email,
            role: editUser.role,
            status: editUser.status,
            avatar: generateAvatar(editUser.name)
          }
        : user
    ));
    
    setIsEditUserOpen(false);
    setEditUser({ id: '', name: '', email: '', role: 'User', status: 'active' });
    
    toast({
      title: "Success",
      description: "User has been updated successfully.",
    });
  };

  // Close dialogs
  const handleCloseViewDialog = () => {
    setIsViewUserOpen(false);
    setSelectedUser(null);
  };

  const handleCloseEditDialog = () => {
    setIsEditUserOpen(false);
    setEditUser({ id: '', name: '', email: '', role: 'User', status: 'active' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={`text-3xl font-bold text-foreground`}>
              User Management
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-muted-foreground">Manage your users and their permissions</p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {statusCounts.active || 0} Active
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  {statusCounts.inactive || 0} Inactive
                </Badge>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  {statusCounts.pending || 0} Pending
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hover:bg-accent/50">
              <Download className="mr-2 h-4 w-4 text-green-500" />
              Export
            </Button>
            <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
              <DialogTrigger asChild>
                <Button className={`bg-gradient-to-r ${getAvatarGradient()} hover:opacity-90 text-white border-0 shadow-lg`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient()} rounded-lg flex items-center justify-center`}>
                      <User className="w-4 h-4 text-white" />
                    </div>
                    Add New User
                  </DialogTitle>
                  <DialogDescription>
                    Create a new user account. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter full name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter email address"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="role" className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Role
                      </Label>
                      <Select value={newUser.role} onValueChange={(value) => setNewUser({...newUser, role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="status" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Status
                      </Label>
                      <Select value={newUser.status} onValueChange={(value) => setNewUser({...newUser, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* User Preview */}
                  {(newUser.name || newUser.email) && (
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg border">
                      <Label className="text-sm font-medium mb-2 block">Preview</Label>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient()} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                          {newUser.name ? generateAvatar(newUser.name) : '?'}
                        </div>
                        <div>
                          <p className="font-medium">{newUser.name || 'Full Name'}</p>
                          <p className="text-sm text-muted-foreground">{newUser.email || 'email@example.com'}</p>
                        </div>
                        <div className="ml-auto">
                          <Badge variant="secondary" className={getRoleBadge(newUser.role)}>
                            {newUser.role}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={handleDialogClose}>
                    Cancel
                  </Button>
                  <Button onClick={handleAddUser} className={`bg-gradient-to-r ${getAvatarGradient()} hover:opacity-90 text-white`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* View User Details Dialog */}
            <Dialog open={isViewUserOpen} onOpenChange={setIsViewUserOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient()} rounded-lg flex items-center justify-center`}>
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    User Details
                  </DialogTitle>
                  <DialogDescription>
                    View detailed information about this user account.
                  </DialogDescription>
                </DialogHeader>
                
                {selectedUser && (
                  <div className="grid gap-6 py-4">
                    {/* User Avatar and Basic Info */}
                    <div className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg border">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getAvatarGradient()} rounded-full flex items-center justify-center text-white text-lg font-semibold`}>
                        {selectedUser.avatar}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{selectedUser.name}</h3>
                        <p className="text-muted-foreground">{selectedUser.email}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className={getRoleBadge(selectedUser.role)}>
                            {selectedUser.role}
                          </Badge>
                          <Badge variant="secondary" className={getStatusBadge(selectedUser.status)}>
                            {selectedUser.status}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    {/* User Details Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">User ID</Label>
                        <p className="text-sm font-mono bg-accent/30 px-2 py-1 rounded">#{selectedUser.id}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Account Status</Label>
                        <Badge variant="secondary" className={`${getStatusBadge(selectedUser.status)} w-fit`}>
                          {selectedUser.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Role</Label>
                        <Badge variant="secondary" className={`${getRoleBadge(selectedUser.role)} w-fit`}>
                          {selectedUser.role}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Join Date</Label>
                        <p className="text-sm">{selectedUser.joinDate}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Last Login</Label>
                        <p className="text-sm">{selectedUser.lastLogin}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                        <p className="text-sm font-mono bg-accent/30 px-2 py-1 rounded break-all">{selectedUser.email}</p>
                      </div>
                    </div>

                    {/* Activity Summary */}
                    <div className="p-4 bg-accent/20 rounded-lg border">
                      <Label className="text-sm font-medium mb-3 block">Account Summary</Label>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">15</p>
                          <p className="text-xs text-muted-foreground">Projects</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">42</p>
                          <p className="text-xs text-muted-foreground">Tasks</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">8.5k</p>
                          <p className="text-xs text-muted-foreground">Activity</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseViewDialog}>
                    Close
                  </Button>
                  <Button 
                    onClick={() => {
                      handleCloseViewDialog();
                      handleEditUser(selectedUser);
                    }}
                    className={`bg-gradient-to-r ${getAvatarGradient()} hover:opacity-90 text-white`}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit User Dialog */}
            <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient()} rounded-lg flex items-center justify-center`}>
                      <Edit2 className="w-4 h-4 text-white" />
                    </div>
                    Edit User
                  </DialogTitle>
                  <DialogDescription>
                    Update user account details. Make changes below.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name" className="flex items-center gap-2">
                      <User className="w-4 h-4" />
                      Full Name *
                    </Label>
                    <Input
                      id="edit-name"
                      placeholder="Enter full name"
                      value={editUser.name}
                      onChange={(e) => setEditUser({...editUser, name: e.target.value})}
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="edit-email" className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      Email Address *
                    </Label>
                    <Input
                      id="edit-email"
                      type="email"
                      placeholder="Enter email address"
                      value={editUser.email}
                      onChange={(e) => setEditUser({...editUser, email: e.target.value})}
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-role" className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        Role
                      </Label>
                      <Select value={editUser.role} onValueChange={(value) => setEditUser({...editUser, role: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="User">User</SelectItem>
                          <SelectItem value="Editor">Editor</SelectItem>
                          <SelectItem value="Admin">Admin</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-status" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Status
                      </Label>
                      <Select value={editUser.status} onValueChange={(value) => setEditUser({...editUser, status: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="inactive">Inactive</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* User Preview */}
                  {(editUser.name || editUser.email) && (
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg border">
                      <Label className="text-sm font-medium mb-2 block">Preview Changes</Label>
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getAvatarGradient()} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                          {editUser.name ? generateAvatar(editUser.name) : '?'}
                        </div>
                        <div>
                          <p className="font-medium">{editUser.name || 'Full Name'}</p>
                          <p className="text-sm text-muted-foreground">{editUser.email || 'email@example.com'}</p>
                        </div>
                        <div className="ml-auto space-x-2">
                          <Badge variant="secondary" className={getRoleBadge(editUser.role)}>
                            {editUser.role}
                          </Badge>
                          <Badge variant="secondary" className={getStatusBadge(editUser.status)}>
                            {editUser.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseEditDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateUser} className={`bg-gradient-to-r ${getAvatarGradient()} hover:opacity-90 text-white`}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Update User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-accent/50 focus:ring-2 focus:ring-primary"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 border-accent/50 focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Active
                    </div>
                  </SelectItem>
                  <SelectItem value="inactive">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Inactive
                    </div>
                  </SelectItem>
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Pending
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Users Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="bg-gradient-to-r from-accent/20 to-accent/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient()} rounded-lg flex items-center justify-center`}>
                <UsersIcon className="w-4 h-4 text-white" />
              </div>
              Users ({filteredUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Join Date</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="hover:bg-accent/50 transition-colors"
                    >
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-accent/50">
                            <AvatarImage src={`/api/placeholder/40/40`} alt={user.name} />
                            <AvatarFallback className={`text-sm font-semibold bg-gradient-to-br ${getAvatarGradient()} text-white`}>
                              {user.avatar}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-foreground">{user.name}</p>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getRoleBadge(user.role)} font-medium shadow-sm`}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={`${getStatusBadge(user.status)} font-medium shadow-sm`}>
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{user.joinDate}</TableCell>
                      <TableCell className="text-sm">{user.lastLogin}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="hover:bg-accent/50">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-accent"
                              onClick={() => handleViewUser(user)}
                            >
                              <Eye className="mr-2 h-4 w-4 text-blue-500" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-accent"
                              onClick={() => handleEditUser(user)}
                            >
                              <Edit2 className="mr-2 h-4 w-4 text-green-500" />
                              Edit User
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete User
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-small text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredUsers.length)} of {filteredUsers.length} results
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>
                <div className="flex items-center space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-9 h-9"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default Users;
