import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Minus, 
  X, 
  User, 
  Mail, 
  Package, 
  DollarSign,
  Search,
  ShoppingCart,
  AlertCircle
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useTheme } from '@/contexts';
import { cn } from '@/lib/utils';

// Sample products database
const availableProducts = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, category: 'Electronics', stock: 25 },
  { id: 2, name: 'USB Cable', price: 19.99, category: 'Electronics', stock: 50 },
  { id: 3, name: 'Bluetooth Speaker', price: 149.99, category: 'Electronics', stock: 15 },
  { id: 4, name: 'Phone Case', price: 29.99, category: 'Accessories', stock: 30 },
  { id: 5, name: 'Laptop Stand', price: 89.99, category: 'Office', stock: 12 },
  { id: 6, name: 'Wireless Mouse', price: 59.99, category: 'Electronics', stock: 20 },
  { id: 7, name: 'Smart Watch', price: 299.99, category: 'Electronics', stock: 8 },
  { id: 8, name: 'Gaming Keyboard', price: 129.99, category: 'Gaming', stock: 18 },
  { id: 9, name: 'Gaming Mouse', price: 79.99, category: 'Gaming', stock: 22 },
  { id: 10, name: 'Mouse Pad', price: 24.99, category: 'Gaming', stock: 35 },
  { id: 11, name: 'Monitor Stand', price: 69.99, category: 'Office', stock: 14 },
  { id: 12, name: 'Desk Lamp', price: 45.99, category: 'Office', stock: 28 }
];

const priorityOptions = [
  { value: 'low', label: 'Low Priority', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300' },
  { value: 'medium', label: 'Medium Priority', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' },
  { value: 'high', label: 'High Priority', color: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300' }
];

const CreateOrderDialog = ({ open, onOpenChange, onCreateOrder }) => {
  const [formData, setFormData] = useState({
    customer: '',
    customerEmail: '',
    priority: 'medium'
  });
  const [selectedItems, setSelectedItems] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [errors, setErrors] = useState({});
  const { theme } = useTheme();

  const getThemeColors = () => {
    const colors = {
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
    return colors[theme.accentColor] || colors.blue;
  };

  const filteredProducts = availableProducts.filter(product =>
    product.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    product.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const addProduct = (product) => {
    const existingItem = selectedItems.find(item => item.id === product.id);
    if (existingItem) {
      setSelectedItems(prev => prev.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setSelectedItems(prev => [...prev, { ...product, quantity: 1 }]);
    }
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeProduct(productId);
      return;
    }
    setSelectedItems(prev => prev.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  const removeProduct = (productId) => {
    setSelectedItems(prev => prev.filter(item => item.id !== productId));
  };

  const calculateTotal = () => {
    return selectedItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer.trim()) {
      newErrors.customer = 'Customer name is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = 'Customer email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.customerEmail)) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }
    
    if (selectedItems.length === 0) {
      newErrors.items = 'At least one product must be selected';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const orderData = {
      ...formData,
      items: selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price
      })),
      total: calculateTotal()
    };

    onCreateOrder(orderData);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      customer: '',
      customerEmail: '',
      priority: 'medium'
    });
    setSelectedItems([]);
    setProductSearch('');
    setErrors({});
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getCustomerInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className={`w-8 h-8 bg-gradient-to-br ${getThemeColors()} rounded-lg flex items-center justify-center`}>
              <ShoppingCart className="w-4 h-4 text-white" />
            </div>
            Create New Order
          </DialogTitle>
          <DialogDescription>
            Add customer information and select products to create a new order.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Customer Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Customer Information
                </CardTitle>
                <CardDescription>Enter the customer's details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer">Customer Name *</Label>
                  <Input
                    id="customer"
                    value={formData.customer}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, customer: e.target.value }));
                      if (errors.customer) setErrors(prev => ({ ...prev, customer: null }));
                    }}
                    placeholder="Enter customer name"
                    className={cn(errors.customer && "border-red-500")}
                  />
                  {errors.customer && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.customer}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="customerEmail">Customer Email *</Label>
                  <Input
                    id="customerEmail"
                    type="email"
                    value={formData.customerEmail}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, customerEmail: e.target.value }));
                      if (errors.customerEmail) setErrors(prev => ({ ...prev, customerEmail: null }));
                    }}
                    placeholder="Enter customer email"
                    className={cn(errors.customerEmail && "border-red-500")}
                  />
                  {errors.customerEmail && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {errors.customerEmail}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData(prev => ({ ...prev, priority: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            <Badge className={option.color}>
                              {option.label}
                            </Badge>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Customer Preview */}
                {formData.customer && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 border rounded-lg bg-accent/50"
                  >
                    <p className="text-sm font-medium text-muted-foreground mb-2">Customer Preview</p>
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className={`bg-gradient-to-br ${getThemeColors()} text-white font-semibold`}>
                          {getCustomerInitials(formData.customer)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{formData.customer}</div>
                        <div className="text-sm text-muted-foreground">{formData.customerEmail || 'No email provided'}</div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>

            {/* Product Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="w-4 h-4" />
                  Select Products
                </CardTitle>
                <CardDescription>Search and add products to the order</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search products..."
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto space-y-2">
                  {filteredProducts.map(product => (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {product.category} • {formatCurrency(product.price)} • Stock: {product.stock}
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => addProduct(product)}
                        disabled={product.stock === 0}
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </motion.div>
                  ))}
                </div>

                {errors.items && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.items}
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Selected Items */}
          <AnimatePresence>
            {selectedItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <ShoppingCart className="w-4 h-4" />
                        Selected Items ({selectedItems.length})
                      </span>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-lg font-bold">{formatCurrency(calculateTotal())}</span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedItems.map(item => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              {formatCurrency(item.price)} each
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              <Minus className="w-3 h-3" />
                            </Button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="w-3 h-3" />
                            </Button>
                            <Button
                              type="button"
                              size="sm"
                              variant="ghost"
                              onClick={() => removeProduct(item.id)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                          <div className="text-right ml-4">
                            <div className="font-medium">{formatCurrency(item.price * item.quantity)}</div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                handleReset();
                onOpenChange(false);
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className={`bg-gradient-to-r ${getThemeColors()} hover:opacity-90 text-white`}
              disabled={selectedItems.length === 0}
            >
              Create Order
              {selectedItems.length > 0 && (
                <span className="ml-2">• {formatCurrency(calculateTotal())}</span>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateOrderDialog;
