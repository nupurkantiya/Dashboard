import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit2, 
  Trash2,
  Package,
  DollarSign,
  Eye,
  Star,
  ShoppingCart,
  AlertCircle,
  Download,
  ChevronLeft,
  ChevronRight,
  Activity,
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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useTheme, useProduct } from '@/contexts';
import { cn } from '@/lib/utils';

const initialProducts = [
  { id: 1, name: 'Wireless Headphones', price: 199.99, category: 'Electronics', stock: 25, rating: 4.5, image: '/api/placeholder/60/60' },
  { id: 2, name: 'USB Cable', price: 19.99, category: 'Electronics', stock: 50, rating: 4.2, image: '/api/placeholder/60/60' },
  { id: 3, name: 'Bluetooth Speaker', price: 149.99, category: 'Electronics', stock: 15, rating: 4.7, image: '/api/placeholder/60/60' },
  { id: 4, name: 'Phone Case', price: 29.99, category: 'Accessories', stock: 30, rating: 4.1, image: '/api/placeholder/60/60' },
  { id: 5, name: 'Laptop Stand', price: 89.99, category: 'Office', stock: 12, rating: 4.3, image: '/api/placeholder/60/60' },
  { id: 6, name: 'Wireless Mouse', price: 59.99, category: 'Electronics', stock: 20, rating: 4.4, image: '/api/placeholder/60/60' },
  { id: 7, name: 'Smart Watch', price: 299.99, category: 'Electronics', stock: 8, rating: 4.6, image: '/api/placeholder/60/60' },
  { id: 8, name: 'Gaming Keyboard', price: 129.99, category: 'Gaming', stock: 18, rating: 4.5, image: '/api/placeholder/60/60' },
  { id: 9, name: 'Gaming Mouse', price: 79.99, category: 'Gaming', stock: 22, rating: 4.3, image: '/api/placeholder/60/60' },
  { id: 10, name: 'Mouse Pad', price: 24.99, category: 'Gaming', stock: 35, rating: 4.0, image: '/api/placeholder/60/60' },
  { id: 11, name: 'Monitor Stand', price: 69.99, category: 'Office', stock: 14, rating: 4.2, image: '/api/placeholder/60/60' },
  { id: 12, name: 'Desk Lamp', price: 45.99, category: 'Office', stock: 28, rating: 4.4, image: '/api/placeholder/60/60' }
];

const categories = ['All', 'Electronics', 'Gaming', 'Office', 'Accessories'];

const Products = () => {
  const [products, setProducts] = useState(initialProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isViewProductOpen, setIsViewProductOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'Electronics',
    stock: ''
  });
  const [editProduct, setEditProduct] = useState({
    id: '',
    name: '',
    price: '',
    category: 'Electronics',
    stock: ''
  });
  const itemsPerPage = 10;
  const { toast } = useToast();
  const { accentColor } = useTheme();
  const { shouldOpenAddProduct, resetAddProductTrigger } = useProduct();

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

  // Listen for add product trigger from dashboard
  useEffect(() => {
    if (shouldOpenAddProduct) {
      setIsAddProductOpen(true);
      resetAddProductTrigger();
    }
  }, [shouldOpenAddProduct, resetAddProductTrigger]);

  // Generate unique ID
  const generateId = () => {
    return Math.max(...products.map(p => p.id)) + 1;
  };

  // Handle form submission
  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if product already exists
    if (products.some(product => product.name.toLowerCase() === newProduct.name.toLowerCase())) {
      toast({
        title: "Error",
        description: "A product with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    const productToAdd = {
      id: generateId(),
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      category: newProduct.category,
      stock: parseInt(newProduct.stock),
      rating: 4.0,
      image: '/api/placeholder/60/60'
    };

    setProducts([...products, productToAdd]);
    setNewProduct({ name: '', price: '', category: 'Electronics', stock: '' });
    setIsAddProductOpen(false);
    
    toast({
      title: "Success",
      description: "Product has been added successfully.",
    });
  };

  // Reset form when dialog closes
  const handleDialogClose = () => {
    setIsAddProductOpen(false);
    setNewProduct({ name: '', price: '', category: 'Electronics', stock: '' });
  };

  // Filter and search logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.category.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = categoryFilter === 'All' || product.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter, products]);

  // Category counts
  const categoryCounts = useMemo(() => {
    return products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {});
  }, [products]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  const getCategoryBadge = (category) => {
    const variants = {
      Electronics: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 hover:from-blue-200 hover:to-cyan-200 border-blue-200',
      Gaming: 'bg-gradient-to-r from-purple-100 to-violet-100 text-purple-800 hover:from-purple-200 hover:to-violet-200 border-purple-200',
      Office: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border-green-200',
      Accessories: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 hover:from-gray-200 hover:to-slate-200 border-gray-200',
    };
    return variants[category] || variants.Electronics;
  };

  const getStockBadge = (stock) => {
    if (stock === 0) return {
      label: 'Out of Stock',
      variant: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 hover:from-red-200 hover:to-rose-200 border-red-200'
    };
    if (stock < 15) return {
      label: 'Low Stock',
      variant: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 hover:from-yellow-200 hover:to-amber-200 border-yellow-200'
    };
    return {
      label: 'In Stock',
      variant: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 hover:from-green-200 hover:to-emerald-200 border-green-200'
    };
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    setProducts(products.filter(product => product.id !== productId));
    toast({
      title: "Success",
      description: "Product has been deleted successfully.",
    });
  };

  // Handle view product details
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsViewProductOpen(true);
  };

  // Handle edit product
  const handleEditProduct = (product) => {
    setEditProduct({
      id: product.id,
      name: product.name,
      price: product.price.toString(),
      category: product.category,
      stock: product.stock.toString()
    });
    setIsEditProductOpen(true);
  };

  // Handle update product
  const handleUpdateProduct = () => {
    if (!editProduct.name || !editProduct.price || !editProduct.stock) {
      toast({
        title: "Error",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Check if product name already exists (excluding current product)
    if (products.some(product => product.id !== editProduct.id && product.name.toLowerCase() === editProduct.name.toLowerCase())) {
      toast({
        title: "Error",
        description: "A product with this name already exists.",
        variant: "destructive",
      });
      return;
    }

    setProducts(products.map(product => 
      product.id === editProduct.id 
        ? { 
            ...product, 
            name: editProduct.name,
            price: parseFloat(editProduct.price),
            category: editProduct.category,
            stock: parseInt(editProduct.stock)
          }
        : product
    ));
    
    setIsEditProductOpen(false);
    setEditProduct({ id: '', name: '', price: '', category: 'Electronics', stock: '' });
    
    toast({
      title: "Success",
      description: "Product has been updated successfully.",
    });
  };

  // Close dialogs
  const handleCloseViewDialog = () => {
    setIsViewProductOpen(false);
    setSelectedProduct(null);
  };

  const handleCloseEditDialog = () => {
    setIsEditProductOpen(false);
    setEditProduct({ id: '', name: '', price: '', category: 'Electronics', stock: '' });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-3 h-3 fill-yellow-400 text-yellow-400 opacity-50" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-3 h-3 text-gray-300" />);
    }

    return stars;
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
              Product Management
            </h1>
            <div className="flex items-center gap-4 mt-2">
              <p className="text-muted-foreground">Manage your product inventory and catalog</p>
              <div className="flex items-center gap-3">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-1"></div>
                  {categoryCounts.Electronics || 0} Electronics
                </Badge>
                <Badge variant="secondary" className="bg-purple-100 text-purple-800 border-purple-200">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-1"></div>
                  {categoryCounts.Gaming || 0} Gaming
                </Badge>
                <Badge variant="secondary" className="bg-red-100 text-red-800 border-red-200">
                  <div className="w-2 h-2 bg-red-500 rounded-full mr-1"></div>
                  {products.filter(p => p.stock < 15).length} Low Stock
                </Badge>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="hover:bg-accent/50">
              <Download className="mr-2 h-4 w-4 text-green-500" />
              Export
            </Button>
            <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
              <DialogTrigger asChild>
                <Button className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white border-0 shadow-lg`}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                      <Package className="w-4 h-4 text-white" />
                    </div>
                    Add New Product
                  </DialogTitle>
                  <DialogDescription>
                    Add a new product to your inventory. Fill in the details below.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Product Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter product name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="price" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price *
                      </Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="stock" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Stock *
                      </Label>
                      <Input
                        id="stock"
                        type="number"
                        placeholder="0"
                        value={newProduct.stock}
                        onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category" className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Category
                    </Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Product Preview */}
                  {(newProduct.name || newProduct.price) && (
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg border">
                      <Label className="text-sm font-medium mb-2 block">Preview</Label>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{newProduct.name || 'Product Name'}</p>
                          <p className="text-sm text-muted-foreground">
                            {newProduct.price ? formatCurrency(parseFloat(newProduct.price)) : '$0.00'}
                          </p>
                        </div>
                        <div className="ml-auto">
                          <Badge variant="secondary" className={getCategoryBadge(newProduct.category)}>
                            {newProduct.category}
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
                  <Button onClick={handleAddProduct} className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white`}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* View Product Details Dialog */}
            <Dialog open={isViewProductOpen} onOpenChange={setIsViewProductOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                      <Eye className="w-4 h-4 text-white" />
                    </div>
                    Product Details
                  </DialogTitle>
                  <DialogDescription>
                    View detailed information about this product.
                  </DialogDescription>
                </DialogHeader>
                
                {selectedProduct && (
                  <div className="grid gap-6 py-4">
                    {/* Product Header */}
                    <div className="flex items-center space-x-4 p-4 bg-accent/20 rounded-lg border">
                      <div className={`w-16 h-16 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                        <Package className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold">{selectedProduct.name}</h3>
                        <p className="text-muted-foreground">{selectedProduct.category}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="secondary" className={getCategoryBadge(selectedProduct.category)}>
                            {selectedProduct.category}
                          </Badge>
                          <Badge variant="secondary" className={getStockBadge(selectedProduct.stock).variant}>
                            {getStockBadge(selectedProduct.stock).label}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{formatCurrency(selectedProduct.price)}</p>
                        <div className="flex items-center gap-1 justify-end mt-1">
                          {renderStars(selectedProduct.rating)}
                          <span className="text-sm text-muted-foreground ml-1">({selectedProduct.rating})</span>
                        </div>
                      </div>
                    </div>

                    {/* Product Info Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Product ID</Label>
                        <p className="text-sm font-mono bg-accent/30 px-2 py-1 rounded">#{selectedProduct.id}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Category</Label>
                        <Badge variant="secondary" className={`${getCategoryBadge(selectedProduct.category)} w-fit`}>
                          {selectedProduct.category}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Price</Label>
                        <p className="text-sm font-semibold">{formatCurrency(selectedProduct.price)}</p>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Stock</Label>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{selectedProduct.stock}</span>
                          <Badge variant="secondary" className={`${getStockBadge(selectedProduct.stock).variant} w-fit text-xs`}>
                            {getStockBadge(selectedProduct.stock).label}
                          </Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Rating</Label>
                        <div className="flex items-center gap-1">
                          {renderStars(selectedProduct.rating)}
                          <span className="text-sm text-muted-foreground">({selectedProduct.rating})</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-muted-foreground">Status</Label>
                        <Badge variant="secondary" className={`${getStockBadge(selectedProduct.stock).variant} w-fit`}>
                          {selectedProduct.stock > 0 ? 'Available' : 'Out of Stock'}
                        </Badge>
                      </div>
                    </div>

                    {/* Product Stats */}
                    <div className="p-4 bg-accent/20 rounded-lg border">
                      <Label className="text-sm font-medium mb-3 block">Product Analytics</Label>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 100) + 50}</p>
                          <p className="text-xs text-muted-foreground">Sales</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 50) + 10}</p>
                          <p className="text-xs text-muted-foreground">Reviews</p>
                        </div>
                        <div>
                          <p className="text-2xl font-bold text-primary">{Math.floor(Math.random() * 20) + 5}</p>
                          <p className="text-xs text-muted-foreground">Returns</p>
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
                      handleEditProduct(selectedProduct);
                    }}
                    className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white`}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Edit Product
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Edit Product Dialog */}
            <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                      <Edit2 className="w-4 h-4 text-white" />
                    </div>
                    Edit Product
                  </DialogTitle>
                  <DialogDescription>
                    Update product details. Make changes below.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-6 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit-name" className="flex items-center gap-2">
                      <Package className="w-4 h-4" />
                      Product Name *
                    </Label>
                    <Input
                      id="edit-name"
                      placeholder="Enter product name"
                      value={editProduct.name}
                      onChange={(e) => setEditProduct({...editProduct, name: e.target.value})}
                      className="focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="edit-price" className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        Price *
                      </Label>
                      <Input
                        id="edit-price"
                        type="number"
                        step="0.01"
                        placeholder="0.00"
                        value={editProduct.price}
                        onChange={(e) => setEditProduct({...editProduct, price: e.target.value})}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    
                    <div className="grid gap-2">
                      <Label htmlFor="edit-stock" className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        Stock *
                      </Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        placeholder="0"
                        value={editProduct.stock}
                        onChange={(e) => setEditProduct({...editProduct, stock: e.target.value})}
                        className="focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="edit-category" className="flex items-center gap-2">
                      <ShoppingCart className="w-4 h-4" />
                      Category
                    </Label>
                    <Select value={editProduct.category} onValueChange={(value) => setEditProduct({...editProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Gaming">Gaming</SelectItem>
                        <SelectItem value="Office">Office</SelectItem>
                        <SelectItem value="Accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Product Preview */}
                  {(editProduct.name || editProduct.price) && (
                    <div className="mt-4 p-4 bg-accent/50 rounded-lg border">
                      <Label className="text-sm font-medium mb-2 block">Preview Changes</Label>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-medium">{editProduct.name || 'Product Name'}</p>
                          <p className="text-sm text-muted-foreground">
                            {editProduct.price ? formatCurrency(parseFloat(editProduct.price)) : '$0.00'}
                          </p>
                        </div>
                        <div className="ml-auto space-x-2">
                          <Badge variant="secondary" className={getCategoryBadge(editProduct.category)}>
                            {editProduct.category}
                          </Badge>
                          {editProduct.stock && (
                            <Badge variant="secondary" className={getStockBadge(parseInt(editProduct.stock)).variant}>
                              {getStockBadge(parseInt(editProduct.stock)).label}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={handleCloseEditDialog}>
                    Cancel
                  </Button>
                  <Button onClick={handleUpdateProduct} className={`bg-gradient-to-r ${getThemeGradient()} hover:opacity-90 text-white`}>
                    <Edit2 className="mr-2 h-4 w-4" />
                    Update Product
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
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-accent/50 focus:ring-2 focus:ring-primary"
                />
              </div>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 border-accent/50 focus:ring-2 focus:ring-primary">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  <SelectItem value="Electronics">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Electronics
                    </div>
                  </SelectItem>
                  <SelectItem value="Gaming">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Gaming
                    </div>
                  </SelectItem>
                  <SelectItem value="Office">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Office
                    </div>
                  </SelectItem>
                  <SelectItem value="Accessories">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                      Accessories
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-card/80">
          <CardHeader className="bg-gradient-to-r from-accent/20 to-accent/10 border-b">
            <CardTitle className="flex items-center gap-2">
              <div className={`w-8 h-8 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                <Package className="w-4 h-4 text-white" />
              </div>
              Products ({filteredProducts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedProducts.map((product, index) => {
                    const stockStatus = getStockBadge(product.stock);
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-accent/50 transition-colors"
                      >
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <div className={`w-12 h-12 bg-gradient-to-br ${getThemeGradient()} rounded-lg flex items-center justify-center`}>
                              <Package className="w-6 h-6 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-foreground">{product.name}</p>
                              <p className="text-sm text-muted-foreground">ID: {product.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${getCategoryBadge(product.category)} font-medium shadow-sm`}>
                            {product.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <span className={cn(
                              "font-medium",
                              product.stock < 15 ? "text-red-600" : "text-foreground"
                            )}>
                              {product.stock}
                            </span>
                            <span className="text-muted-foreground text-sm">units</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="flex items-center">
                              {renderStars(product.rating)}
                            </div>
                            <span className="text-sm text-muted-foreground">({product.rating})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={`${stockStatus.variant} font-medium shadow-sm`}>
                            {stockStatus.label}
                          </Badge>
                        </TableCell>
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
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="mr-2 h-4 w-4 text-blue-500" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-accent"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit2 className="mr-2 h-4 w-4 text-green-500" />
                                Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="cursor-pointer hover:bg-red-50 text-red-600 focus:text-red-600"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Product
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
                Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
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

export default Products;
