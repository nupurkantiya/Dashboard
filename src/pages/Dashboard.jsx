import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useUser, useOrder, useCalendar } from '@/contexts';
import { useTheme } from '@/contexts';
import { 
  Users, 
  ShoppingCart, 
  DollarSign, 
  TrendingUp,
  Activity,
  Calendar,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Package,
  MapPin,
  CalendarIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement, 
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend 
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const lineChartRef = useRef(null);
  const barChartRef = useRef(null);
  const navigate = useNavigate();
  const { triggerAddUser } = useUser();
  const { openCreateOrderDialog } = useOrder();
  const { getUpcomingEvents } = useCalendar();
  const { accentColor } = useTheme();

  const handleAddUser = () => {
    triggerAddUser();
    navigate('/users');
  };

  const handleCreateOrder = () => {
    openCreateOrderDialog();
    navigate('/orders');
  };

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
    return gradients[accentColor] || 'from-blue-500 to-blue-600';
  };

  // Get theme colors for charts
  const getThemeColors = () => {
    const colors = {
      'sky-blue': { primary: 'rgb(14, 165, 233)', secondary: 'rgba(14, 165, 233, 0.1)' },
      'blue': { primary: 'rgb(59, 130, 246)', secondary: 'rgba(59, 130, 246, 0.1)' },
      'indigo': { primary: 'rgb(99, 102, 241)', secondary: 'rgba(99, 102, 241, 0.1)' },
      'cyan': { primary: 'rgb(6, 182, 212)', secondary: 'rgba(6, 182, 212, 0.1)' },
      'emerald': { primary: 'rgb(16, 185, 129)', secondary: 'rgba(16, 185, 129, 0.1)' },
      'green': { primary: 'rgb(34, 197, 94)', secondary: 'rgba(34, 197, 94, 0.1)' },
      'teal': { primary: 'rgb(20, 184, 166)', secondary: 'rgba(20, 184, 166, 0.1)' },
      'lime': { primary: 'rgb(132, 204, 22)', secondary: 'rgba(132, 204, 22, 0.1)' },
      'purple': { primary: 'rgb(147, 51, 234)', secondary: 'rgba(147, 51, 234, 0.1)' },
      'violet': { primary: 'rgb(139, 92, 246)', secondary: 'rgba(139, 92, 246, 0.1)' },
      'fuchsia': { primary: 'rgb(217, 70, 239)', secondary: 'rgba(217, 70, 239, 0.1)' },
      'pink': { primary: 'rgb(236, 72, 153)', secondary: 'rgba(236, 72, 153, 0.1)' },
      'rose': { primary: 'rgb(244, 63, 94)', secondary: 'rgba(244, 63, 94, 0.1)' },
      'red': { primary: 'rgb(239, 68, 68)', secondary: 'rgba(239, 68, 68, 0.1)' },
      'orange': { primary: 'rgb(249, 115, 22)', secondary: 'rgba(249, 115, 22, 0.1)' },
      'amber': { primary: 'rgb(245, 158, 11)', secondary: 'rgba(245, 158, 11, 0.1)' },
      'yellow': { primary: 'rgb(234, 179, 8)', secondary: 'rgba(234, 179, 8, 0.1)' },
      'slate': { primary: 'rgb(100, 116, 139)', secondary: 'rgba(100, 116, 139, 0.1)' },
      'gray': { primary: 'rgb(107, 114, 128)', secondary: 'rgba(107, 114, 128, 0.1)' },
      'zinc': { primary: 'rgb(113, 113, 122)', secondary: 'rgba(113, 113, 122, 0.1)' },
      'stone': { primary: 'rgb(120, 113, 108)', secondary: 'rgba(120, 113, 108, 0.1)' },
    };
    return colors[accentColor] || colors.blue;
  };

  // Cleanup chart instances on unmount
  useEffect(() => {
    return () => {
      if (lineChartRef.current && lineChartRef.current.chartInstance) {
        try {
          lineChartRef.current.chartInstance.destroy();
        } catch (error) {
          console.warn('Error destroying line chart:', error);
        }
      }
      if (barChartRef.current && barChartRef.current.chartInstance) {
        try {
          barChartRef.current.chartInstance.destroy();
        } catch (error) {
          console.warn('Error destroying bar chart:', error);
        }
      }
    };
  }, []);
  const stats = [
    {
      title: 'Total Users',
      value: '2,543',
      change: '+12.5%',
      trend: 'up',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: ShoppingCart,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Revenue',
      value: '$12,543',
      change: '+23.1%',
      trend: 'up',
      icon: DollarSign,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
    },
    {
      title: 'Growth',
      value: '98.2%',
      change: '-2.4%',
      trend: 'down',
      icon: TrendingUp,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
  ];

  const recentActivities = [
    { id: 1, user: 'John Doe', action: 'completed purchase', time: '2 minutes ago', avatar: 'JD' },
    { id: 2, user: 'Jane Smith', action: 'updated profile', time: '5 minutes ago', avatar: 'JS' },
    { id: 3, user: 'Mike Johnson', action: 'created new project', time: '10 minutes ago', avatar: 'MJ' },
    { id: 4, user: 'Sarah Wilson', action: 'left a review', time: '15 minutes ago', avatar: 'SW' },
  ];

  const recentOrders = [
    { id: 'ORD-001', customer: 'Alice Cooper', amount: 299.99, status: 'completed', time: '1 hour ago', avatar: 'AC' },
    { id: 'ORD-002', customer: 'Bob Smith', amount: 149.99, status: 'processing', time: '3 hours ago', avatar: 'BS' },
    { id: 'ORD-003', customer: 'Carol Johnson', amount: 79.99, status: 'shipped', time: '5 hours ago', avatar: 'CJ' },
    { id: 'ORD-004', customer: 'David Wilson', amount: 199.99, status: 'pending', time: '8 hours ago', avatar: 'DW' },
  ];

  const recentProducts = [
    { id: 1, name: 'Wireless Headphones', price: 199.99, category: 'Electronics', stock: 25, status: 'in-stock' },
    { id: 2, name: 'USB Cable', price: 19.99, category: 'Electronics', stock: 50, status: 'in-stock' },
    { id: 3, name: 'Bluetooth Speaker', price: 149.99, category: 'Electronics', stock: 5, status: 'low-stock' },
    { id: 4, name: 'Smart Watch', price: 299.99, category: 'Electronics', stock: 0, status: 'out-of-stock' },
  ];

  // Get upcoming events from calendar context
  const upcomingEvents = getUpcomingEvents(4);

  const orderStatusColors = {
    pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
    shipped: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
  };

  const productStatusColors = {
    'in-stock': 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
    'low-stock': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
    'out-of-stock': 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getEventTypeBadge = (type) => {
    const variants = {
      meeting: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      deadline: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300',
      presentation: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      workshop: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    };
    return variants[type] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
  };

  const formatEventDate = (date) => {
    const eventDate = new Date(date);
    const now = new Date();
    const diffInHours = (eventDate - now) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return eventDate.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } else if (diffInHours < 168) { // Less than a week
      return eventDate.toLocaleDateString('en-US', { 
        weekday: 'short',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    } else {
      return eventDate.toLocaleDateString('en-US', { 
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
    }
  };

  // Get current theme colors
  const themeColors = getThemeColors();

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Revenue',
        data: [12, 19, 3, 5, 2, 3],
        borderColor: themeColors.primary,
        backgroundColor: themeColors.secondary,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: themeColors.primary,
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      },
    ],
  };

  const barChartData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Orders',
        data: [12, 19, 3, 5, 2, 3, 9],
        backgroundColor: themeColors.primary.replace('rgb', 'rgba').replace(')', ', 0.8)'),
        borderColor: themeColors.primary,
        borderWidth: 1,
        borderRadius: 4,
        borderSkipped: false,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      mode: 'index',
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: themeColors.primary,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
          drawBorder: false,
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          font: {
            size: 12,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: 'rgba(0, 0, 0, 0.6)',
          font: {
            size: 12,
          },
        },
      },
    },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening today.</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                    <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trend === 'up' ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500" />
                      )}
                      <span className={`text-sm ml-1 ${
                        stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                      }`}>
                        {stat.change}
                      </span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Line 
                  ref={lineChartRef}
                  data={lineChartData} 
                  options={chartOptions}
                  key={`line-chart-${accentColor}`}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Weekly Orders</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <Bar 
                  ref={barChartRef}
                  data={barChartData} 
                  options={chartOptions}
                  key={`bar-chart-${accentColor}`}
                />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bottom Section */}
      {/* First Row - Recent Products and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Recent Products
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentProducts.map((product) => (
                  <div key={product.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient()} rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
                      <Package className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground truncate">{product.name}</p>
                        <Badge className={productStatusColors[product.status]}>
                          {product.status.replace('-', ' ')}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{product.category}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(product.price)}</p>
                        <p className="text-xs text-muted-foreground">
                          Stock: {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Activity className="mr-2 h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient()} rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
                      {activity.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground">
                        <span className="font-semibold">{activity.user}</span> {activity.action}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center">
                        <Clock className="mr-1 h-3 w-3" />
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Second Row - Quick Actions, Recent Orders, and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                className={`w-full justify-start bg-gradient-to-r ${getAvatarGradient()} hover:opacity-90 text-white border-0 shadow-lg transition-all duration-200`}
                onClick={handleAddUser}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add New User
              </Button>
              <Button 
                className={`w-full justify-start bg-gradient-to-r ${getAvatarGradient()} hover:opacity-90 text-white border-0 shadow-lg transition-all duration-200`}
                onClick={handleCreateOrder}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Create Order
              </Button>
              <Button 
                className={`w-full justify-start bg-gradient-to-r ${getAvatarGradient()} hover:opacity-90 text-white border-0 shadow-lg transition-all duration-200`}
                onClick={() => navigate('/products')}
              >
                <Package className="mr-2 h-4 w-4" />
                View Products
              </Button>
              
              <div className="pt-4 border-t">
                <h4 className="font-medium mb-2">Storage Usage</h4>
                <Progress value={75} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">7.5 GB of 10 GB used</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Recent Orders */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Package className="mr-2 h-5 w-5" />
                Recent Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-accent transition-colors">
                    <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient()} rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm`}>
                      {order.avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-foreground">{order.id}</p>
                        <Badge className={orderStatusColors[order.status]}>
                          {order.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">{order.customer}</p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-foreground">{formatCurrency(order.amount)}</p>
                        <p className="text-xs text-muted-foreground flex items-center">
                          <Clock className="mr-1 h-3 w-3" />
                          {order.time}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Upcoming Events */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2 h-5 w-5" />
                  Upcoming Events
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/calendar')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => (
                    <div key={event.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                         onClick={() => navigate('/calendar')}>
                      <div className={`w-8 h-8 bg-gradient-to-br ${getAvatarGradient()} rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-sm flex-shrink-0`}>
                        <Calendar className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
                          <Badge variant="secondary" className={`ml-2 ${getEventTypeBadge(event.type)}`}>
                            {event.type}
                          </Badge>
                        </div>
                        <div className="flex items-center text-xs text-muted-foreground mt-1">
                          <Clock className="mr-1 h-3 w-3 flex-shrink-0" />
                          <span className="truncate">{formatEventDate(event.start)}</span>
                        </div>
                        {event.location && (
                          <div className="flex items-center text-xs text-muted-foreground mt-1">
                            <MapPin className="mr-1 h-3 w-3 flex-shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <Calendar className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">No upcoming events</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => navigate('/calendar')}
                      className="mt-2 text-xs"
                    >
                      Add Event
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
