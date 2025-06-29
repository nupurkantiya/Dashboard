import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Eye, 
  Edit2, 
  Trash2,
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  User,
  ShoppingCart,
  Download,
  ChevronLeft,
  ChevronRight,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTheme, useOrder } from '@/contexts';
import { cn } from '@/lib/utils';

const initialOrders = [
  {
    id: 'ORD-001',
    customer: 'John Smith',
    customerEmail: 'john.smith@email.com',
    items: [
      { name: 'Wireless Headphones', quantity: 2, price: 199.99 },
      { name: 'USB Cable', quantity: 1, price: 19.99 }
    ],
    total: 419.97,
    status: 'pending',
    priority: 'high',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    customer: 'Sarah Johnson',
    customerEmail: 'sarah.j@email.com',
    items: [
      { name: 'Bluetooth Speaker', quantity: 1, price: 149.99 },
      { name: 'Phone Case', quantity: 3, price: 29.99 }
    ],
    total: 239.96,
    status: 'processing',
    priority: 'medium',
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-15T09:15:00Z'
  },
  {
    id: 'ORD-003',
    customer: 'Mike Davis',
    customerEmail: 'mike.davis@email.com',
    items: [
      { name: 'Laptop Stand', quantity: 1, price: 89.99 },
      { name: 'Wireless Mouse', quantity: 1, price: 59.99 }
    ],
    total: 149.98,
    status: 'completed',
    priority: 'low',
    createdAt: '2024-01-13T16:45:00Z',
    updatedAt: '2024-01-14T12:30:00Z'
  },
  {
    id: 'ORD-004',
    customer: 'Emily Wilson',
    customerEmail: 'emily.w@email.com',
    items: [
      { name: 'Smart Watch', quantity: 1, price: 299.99 }
    ],
    total: 299.99,
    status: 'cancelled',
    priority: 'medium',
    createdAt: '2024-01-12T11:15:00Z',
    updatedAt: '2024-01-13T08:45:00Z'
  },
  {
    id: 'ORD-005',
    customer: 'David Brown',
    customerEmail: 'david.brown@email.com',
    items: [
      { name: 'Gaming Keyboard', quantity: 1, price: 129.99 },
      { name: 'Gaming Mouse', quantity: 1, price: 79.99 },
      { name: 'Mouse Pad', quantity: 1, price: 24.99 }
    ],
    total: 234.97,
    status: 'shipped',
    priority: 'high',
    createdAt: '2024-01-11T13:20:00Z',
    updatedAt: '2024-01-14T16:00:00Z'
  }
];

const statusConfig = {
  pending: { 
    icon: Clock, 
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    label: 'Pending'
  },
  processing: { 
    icon: AlertCircle, 
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    label: 'Processing'
  },
  shipped: { 
    icon: Package, 
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    label: 'Shipped'
  },
  completed: { 
    icon: CheckCircle, 
    color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    label: 'Completed'
  },
  cancelled: { 
    icon: XCircle, 
    color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
    label: 'Cancelled'
  }
};

const priorityConfig = {
  low: { color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300', label: 'Low' },
  medium: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', label: 'Medium' },
  high: { color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300', label: 'High' }
};

const Orders = () => {
  const [orders, setOrders] = useState(initialOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddOrderOpen, setIsAddOrderOpen] = useState(false);
  const [isViewOrderOpen, setIsViewOrderOpen] = useState(false);
  const [isEditOrderOpen, setIsEditOrderOpen] = useState(false);
  const [isTrackOrderOpen, setIsTrackOrderOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newOrder, setNewOrder] = useState({
    customer: '',
    customerEmail: '',
    items: [],
    priority: 'medium'
  });
  const [editOrder, setEditOrder] = useState({
    id: '',
    customer: '',
    customerEmail: '',
    status: 'pending',
    priority: 'medium'
  });
  const itemsPerPage = 10;
  const { toast } = useToast();
  const { accentColor } = useTheme();
  const { shouldOpenAddOrder, resetAddOrderTrigger } = useOrder();

  // Get theme gradient based on accent color
  const getThemeGradient = () => {
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
    return gradients[accentColor] || gradients.blue;
  };

  // Listen for add order trigger from dashboard
  useEffect(() => {
    if (shouldOpenAddOrder) {
      setIsAddOrderOpen(true);
      resetAddOrderTrigger();
    }
  }, [shouldOpenAddOrder, resetAddOrderTrigger]);

  // Generate customer initials
  const getCustomerInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  // Generate unique ID
  const generateId = () => {
    const maxId = Math.max(...orders.map(o => parseInt(o.id.split('-')[1])));
    return `ORD-${String(maxId + 1).padStart(3, '0')}`;
  };

  // Handle form submission
  const handleAddOrder = () => {
    if (!newOrder.customer || !newOrder.customerEmail || newOrder.items.length === 0) {
      toast({
        title: "Error",
        description: "Please fill in all required fields and add at least one item.",
        variant: "destructive",
      });
      return;
    }

    const orderToAdd = {
      id: generateId(),
      customer: newOrder.customer,
      customerEmail: newOrder.customerEmail,
      items: newOrder.items,
      total: newOrder.items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      priority: newOrder.priority,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setOrders([orderToAdd, ...orders]);
    setNewOrder({ customer: '', customerEmail: '', items: [], priority: 'medium' });
    setIsAddOrderOpen(false);
    
    toast({
      title: "Success",
      description: "Order has been created successfully.",
    });
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setIsAddOrderOpen(false);
    setNewOrder({ customer: '', customerEmail: '', items: [], priority: 'medium' });
  };

  // Filter and search logic
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, orders]);

  // Status counts
  const statusCounts = useMemo(() => {
    return orders.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});
  }, [orders]);

  // Pagination logic
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 hover:from-yellow-200 hover:to-amber-200 border-yellow-200',
      processing: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 hover:from-blue-200 hover:to-cyan-200 border-blue-200',
      shipped: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 hover:from-purple-200 hover:to-violet-200 border-purple-200',
      completed: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border-green-200',
      cancelled: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 hover:from-red-200 hover:to-rose-200 border-red-200',
    };
    return variants[status] || variants.pending;
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      low: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 hover:from-gray-200 hover:to-slate-200 border-gray-200',
      medium: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 hover:from-yellow-200 hover:to-amber-200 border-yellow-200',
      high: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 hover:from-red-200 hover:to-rose-200 border-red-200',
    };
    return variants[priority] || variants.medium;
  };

  // Handle order deletion
  const handleDeleteOrder = (orderId) => {
    setOrders(orders.filter(order => order.id !== orderId));
    toast({
      title: "Success",
      description: "Order has been deleted successfully.",
    });
  };

  // Handle view order details
  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setIsViewOrderOpen(true);
  };

  // Handle edit order
  const handleEditOrder = (order) => {
    setEditOrder({
      id: order.id,
      customer: order.customer,
      customerEmail: order.customerEmail,
      status: order.status,
      priority: order.priority
    });
    setIsEditOrderOpen(true);
  };

  // Handle track shipment
  const handleTrackOrder = (order) => {
    setSelectedOrder(order);
    setIsTrackOrderOpen(true);
  };

  // Handle update order
  const handleUpdateOrder = () => {
    if (!editOrder.customer || !editOrder.customerEmail) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setOrders(orders.map(order => 
      order.id === editOrder.id 
        ? { 
            ...order, 
            customer: editOrder.customer,
            customerEmail: editOrder.customerEmail,
            status: editOrder.status,
            priority: editOrder.priority,
            updatedAt: new Date().toISOString()
          }
        : order
    ));
    
    setIsEditOrderOpen(false);
    setEditOrder({ id: '', customer: '', customerEmail: '', status: 'pending', priority: 'medium' });
    
    toast({
      title: "Success",
      description: "Order has been updated successfully.",
    });
  };

  // Close dialogs
  const handleCloseViewDialog = () => {
    setIsViewOrderOpen(false);
    setSelectedOrder(null);
  };

  const handleCloseEditDialog = () => {
    setIsEditOrderOpen(false);
    setEditOrder({ id: '', customer: '', customerEmail: '', status: 'pending', priority: 'medium' });
  };

  const handleCloseTrackDialog = () => {
    setIsTrackOrderOpen(false);
    setSelectedOrder(null);
  };

  const handleStatusChange = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status: newStatus, updatedAt: new Date().toISOString() }
        : order
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header with Status Badges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className={`text-3xl font-bold text-foreground`}>
              Order Management
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-muted-foreground">Manage and track customer orders</p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mr-1"></div>
                  {statusCounts.pending || 0} Pending
                </Badge>
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  {statusCounts.processing || 0} Processing
                </Badge>
                <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-200">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                  {statusCounts.completed || 0} Completed
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hover:bg-accent/50">
              <Download className="mr-2 h-4 w-4 text-green-500" />
              Export
            </Button>
            <Button 
              onClick={() => setIsAddOrderOpen(true)}
              className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white border-0 shadow-lg`}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Order
            </Button>
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
                  placeholder="Search orders..."
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
                  <SelectItem value="pending">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                      Pending
                    </div>
                  </SelectItem>
                  <SelectItem value="processing">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Processing
                    </div>
                  </SelectItem>
                  <SelectItem value="shipped">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Shipped
                    </div>
                  </SelectItem>
                  <SelectItem value="completed">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Completed
                    </div>
                  </SelectItem>
                  <SelectItem value="cancelled">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      Cancelled
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="bg-gradient-to-r from-accent/20 to-accent/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              Orders ({filteredOrders.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedOrders.map((order, index) => {
                    const StatusIcon = statusConfig[order.status].icon;
                    return (
                      <motion.tr
                        key={order.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-10 w-10 ring-2 ring-offset-2 ring-accent/50">
                              <AvatarImage src={`/api/placeholder/40/40`} alt={order.customer} />
                              <AvatarFallback className={`text-sm font-semibold bg-gradient-to-br ${getThemeGradient()} text-white`}>
                                {getCustomerInitials(order.customer)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-semibold text-foreground">{order.customer}</p>
                              <p className="text-sm text-muted-foreground">{order.customerEmail}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {order.items.slice(0, 2).map((item, idx) => (
                              <div key={idx} className="text-sm">
                                {item.name} × {item.quantity}
                              </div>
                            ))}
                            {order.items.length > 2 && (
                              <div className="text-xs text-muted-foreground">
                                +{order.items.length - 2} more items
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getStatusBadge(order.status)} font-medium shadow-sm`}>
                            <StatusIcon className="w-3 h-3 mr-1" />
                            {statusConfig[order.status].label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getPriorityBadge(order.priority)} font-medium shadow-sm`}>
                            {priorityConfig[order.priority].label}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(order.createdAt)}</TableCell>
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
                                onClick={() => handleViewOrder(order)}
                              >
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => handleEditOrder(order)}
                              >
                                <Edit2 className="mr-2 h-4 w-4 text-green-500" />
                                Edit Order
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => handleTrackOrder(order)}
                              >
                                <Package className="mr-2 h-4 w-4 text-purple-500" />
                                Track Shipment
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteOrder(order.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-small text-muted-foreground">
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} of {filteredOrders.length} results
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

      {/* Add Order Dialog */}
      <Dialog open={isAddOrderOpen} onOpenChange={setIsAddOrderOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                <ShoppingCart className="w-4 h-4 text-white" />
              </div>
              Create New Order
            </DialogTitle>
            <DialogDescription>
              Create a new order for a customer. Fill in the details below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="customer" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Name *
                </Label>
                <Input
                  id="customer"
                  placeholder="Enter customer name"
                  value={newOrder.customer}
                  onChange={(e) => setNewOrder({...newOrder, customer: e.target.value})}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="customerEmail" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Email *
                </Label>
                <Input
                  id="customerEmail"
                  type="email"
                  placeholder="Enter customer email"
                  value={newOrder.customerEmail}
                  onChange={(e) => setNewOrder({...newOrder, customerEmail: e.target.value})}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="priority" className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Priority
              </Label>
              <Select value={newOrder.priority} onValueChange={(value) => setNewOrder({...newOrder, priority: value})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Order Preview */}
            {(newOrder.customer || newOrder.customerEmail) && (
              <div className="mt-4 p-4 bg-accent/50 rounded-lg border">
                <Label className="text-sm font-medium mb-2 block">Preview</Label>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getThemeGradient()} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                    {newOrder.customer ? getCustomerInitials(newOrder.customer) : '?'}
                  </div>
                  <div>
                    <p className="font-medium">{newOrder.customer || 'Customer Name'}</p>
                    <p className="text-sm text-muted-foreground">{newOrder.customerEmail || 'email@example.com'}</p>
                  </div>
                  <div className="ml-auto">
                    <Badge variant="secondary" className={getPriorityBadge(newOrder.priority)}>
                      {priorityConfig[newOrder.priority].label}
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
            <Button onClick={handleAddOrder} className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white`}>
              <Plus className="mr-2 h-4 w-4" />
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Order Details Dialog */}
      <Dialog open={isViewOrderOpen} onOpenChange={setIsViewOrderOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                <Eye className="w-4 h-4 text-white" />
              </div>
              Order Details
            </DialogTitle>
            <DialogDescription>
              View detailed information about this order.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid gap-6 py-4">
              {/* Order Header */}
              <div className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg border">
                <div className={`w-16 h-16 bg-gradient-to-br ${getThemeGradient()} rounded-full flex items-center justify-center text-white text-lg font-semibold`}>
                  {getCustomerInitials(selectedOrder.customer)}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-semibold">{selectedOrder.customer}</h3>
                  <p className="text-muted-foreground">{selectedOrder.customerEmail}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="secondary" className={getStatusBadge(selectedOrder.status)}>
                      {statusConfig[selectedOrder.status].label}
                    </Badge>
                    <Badge variant="secondary" className={getPriorityBadge(selectedOrder.priority)}>
                      {priorityConfig[selectedOrder.priority].label}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{formatCurrency(selectedOrder.total)}</p>
                  <p className="text-sm text-muted-foreground">Total Amount</p>
                </div>
              </div>

              {/* Order Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Order ID</Label>
                  <p className="text-sm font-mono bg-accent/30 px-2 py-1 rounded">{selectedOrder.id}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                  <Badge variant="secondary" className={`${getStatusBadge(selectedOrder.status)} w-fit`}>
                    {statusConfig[selectedOrder.status].label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Priority</Label>
                  <Badge variant="secondary" className={`${getPriorityBadge(selectedOrder.priority)} w-fit`}>
                    {priorityConfig[selectedOrder.priority].label}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Created</Label>
                  <p className="text-sm">{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Last Updated</Label>
                  <p className="text-sm">{formatDate(selectedOrder.updatedAt)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Total Items</Label>
                  <p className="text-sm">{selectedOrder.items.length} items</p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Order Items</Label>
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Item</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Total</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedOrder.items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{item.name}</TableCell>
                          <TableCell>{item.quantity}</TableCell>
                          <TableCell>{formatCurrency(item.price)}</TableCell>
                          <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
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
                handleEditOrder(selectedOrder);
              }}
              className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white`}
            >
              <Edit2 className="mr-2 h-4 w-4" />
              Edit Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditOrderOpen} onOpenChange={setIsEditOrderOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                <Edit2 className="w-4 h-4 text-white" />
              </div>
              Edit Order
            </DialogTitle>
            <DialogDescription>
              Update order details. Make changes below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-6 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-customer" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Customer Name *
              </Label>
              <Input
                id="edit-customer"
                placeholder="Enter customer name"
                value={editOrder.customer}
                onChange={(e) => setEditOrder({...editOrder, customer: e.target.value})}
                className="focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="edit-email" className="flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Customer Email *
              </Label>
              <Input
                id="edit-email"
                type="email"
                placeholder="Enter customer email"
                value={editOrder.customerEmail}
                onChange={(e) => setEditOrder({...editOrder, customerEmail: e.target.value})}
                className="focus:ring-2 focus:ring-primary"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-status" className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Status
                </Label>
                <Select value={editOrder.status} onValueChange={(value) => setEditOrder({...editOrder, status: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="edit-priority" className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Priority
                </Label>
                <Select value={editOrder.priority} onValueChange={(value) => setEditOrder({...editOrder, priority: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Order Preview */}
            {(editOrder.customer || editOrder.customerEmail) && (
              <div className="mt-4 p-4 bg-accent/50 rounded-lg border">
                <Label className="text-sm font-medium mb-2 block">Preview Changes</Label>
                <div className="flex items-center space-x-3">
                  <div className={`w-10 h-10 bg-gradient-to-br ${getThemeGradient()} rounded-full flex items-center justify-center text-white text-sm font-semibold`}>
                    {editOrder.customer ? getCustomerInitials(editOrder.customer) : '?'}
                  </div>
                  <div>
                    <p className="font-medium">{editOrder.customer || 'Customer Name'}</p>
                    <p className="text-sm text-muted-foreground">{editOrder.customerEmail || 'email@example.com'}</p>
                  </div>
                  <div className="ml-auto space-x-2">
                    <Badge variant="secondary" className={getStatusBadge(editOrder.status)}>
                      {statusConfig[editOrder.status].label}
                    </Badge>
                    <Badge variant="secondary" className={getPriorityBadge(editOrder.priority)}>
                      {priorityConfig[editOrder.priority].label}
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
            <Button onClick={handleUpdateOrder} className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white`}>
              <Edit2 className="mr-2 h-4 w-4" />
              Update Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Track Shipment Dialog */}
      <Dialog open={isTrackOrderOpen} onOpenChange={setIsTrackOrderOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                <Package className="w-4 h-4 text-white" />
              </div>
              Track Shipment
            </DialogTitle>
            <DialogDescription>
              Track the shipping status and delivery progress.
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="grid gap-6 py-4">
              {/* Order Summary */}
              <div className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg border">
                <div className={`w-12 h-12 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center text-white font-semibold`}>
                  {getCustomerInitials(selectedOrder.customer)}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">{selectedOrder.customer}</h3>
                  <p className="text-sm text-muted-foreground">Order {selectedOrder.id}</p>
                </div>
                <Badge variant="secondary" className={getStatusBadge(selectedOrder.status)}>
                  {statusConfig[selectedOrder.status].label}
                </Badge>
              </div>

              {/* Tracking Timeline */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">Shipping Timeline</Label>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['pending', 'processing', 'shipped', 'completed'].includes(selectedOrder.status) 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Order Placed</p>
                      <p className="text-sm text-muted-foreground">{formatDate(selectedOrder.createdAt)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['processing', 'shipped', 'completed'].includes(selectedOrder.status)
                        ? 'bg-green-500 text-white' 
                        : selectedOrder.status === 'pending'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Processing</p>
                      <p className="text-sm text-muted-foreground">
                        {['processing', 'shipped', 'completed'].includes(selectedOrder.status)
                          ? formatDate(selectedOrder.updatedAt)
                          : 'Pending processing'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      ['shipped', 'completed'].includes(selectedOrder.status)
                        ? 'bg-green-500 text-white' 
                        : selectedOrder.status === 'processing'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Shipped</p>
                      <p className="text-sm text-muted-foreground">
                        {['shipped', 'completed'].includes(selectedOrder.status)
                          ? `Shipped on ${formatDate(selectedOrder.updatedAt)}`
                          : 'Not yet shipped'
                        }
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      selectedOrder.status === 'completed'
                        ? 'bg-green-500 text-white' 
                        : selectedOrder.status === 'shipped'
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      <CheckCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Delivered</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedOrder.status === 'completed'
                          ? `Delivered on ${formatDate(selectedOrder.updatedAt)}`
                          : 'Not yet delivered'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-accent/20 rounded-lg">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tracking Number</Label>
                  <p className="text-sm font-mono">{selectedOrder.status === 'shipped' || selectedOrder.status === 'completed' ? `TR${selectedOrder.id.replace('ORD-', '')}2024` : 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Carrier</Label>
                  <p className="text-sm">{selectedOrder.status === 'shipped' || selectedOrder.status === 'completed' ? 'FastShip Express' : 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estimated Delivery</Label>
                  <p className="text-sm">
                    {selectedOrder.status === 'shipped' 
                      ? new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString()
                      : selectedOrder.status === 'completed'
                      ? 'Delivered'
                      : 'TBD'
                    }
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Total Items</Label>
                  <p className="text-sm">{selectedOrder.items.length} items</p>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseTrackDialog}>
              Close
            </Button>
            {selectedOrder && selectedOrder.status === 'shipped' && (
              <Button 
                onClick={() => window.open(`https://tracking.example.com/TR${selectedOrder.id.replace('ORD-', '')}2024`, '_blank')}
                className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white`}
              >
                <Package className="mr-2 h-4 w-4" />
                Track Online
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Orders;
