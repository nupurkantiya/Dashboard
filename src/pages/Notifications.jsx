import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Bell, 
  Check, 
  Trash2, 
  Eye, 
  X,
  ShoppingCart,
  Users,
  AlertCircle,
  FileText,
  Clock,
  Filter,
  Search
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@/contexts';

const Notifications = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'New Order Received',
      message: 'Order #ORD-001 has been placed by John Smith for $299.99. The order contains 2 items: Wireless Headphones and USB Cable.',
      type: 'order',
      icon: ShoppingCart,
      time: '2 minutes ago',
      read: false,
      action: () => navigate('/orders')
    },
    {
      id: 2,
      title: 'User Registration',
      message: 'New user Sarah Wilson has registered with email sarah.wilson@email.com. Account verification is pending.',
      type: 'user',
      icon: Users,
      time: '15 minutes ago',
      read: false,
      action: () => navigate('/users')
    },
    {
      id: 3,
      title: 'System Alert',
      message: 'Server maintenance is scheduled for tonight at 2:00 AM EST. Expected downtime is 30 minutes.',
      type: 'alert',
      icon: AlertCircle,
      time: '1 hour ago',
      read: true,
      action: null
    },
    {
      id: 4,
      title: 'Report Generated',
      message: 'Monthly sales report for December 2024 is now available for download. Total revenue: $12,543.',
      type: 'report',
      icon: FileText,
      time: '2 hours ago',
      read: false,
      action: () => navigate('/charts')
    },
    {
      id: 5,
      title: 'Task Reminder',
      message: 'You have 3 pending orders that require review and approval. Please check the orders page.',
      type: 'reminder',
      icon: Clock,
      time: '3 hours ago',
      read: true,
      action: () => navigate('/orders')
    },
    {
      id: 6,
      title: 'Order Completed',
      message: 'Order #ORD-002 has been completed and shipped to customer Mike Johnson. Tracking ID: TRK123456.',
      type: 'order',
      icon: ShoppingCart,
      time: '5 hours ago',
      read: false,
      action: () => navigate('/orders')
    },
    {
      id: 7,
      title: 'New User Feedback',
      message: 'Customer Alice Cooper left a 5-star review: "Excellent service and fast delivery!"',
      type: 'user',
      icon: Users,
      time: '6 hours ago',
      read: true,
      action: () => navigate('/users')
    },
    {
      id: 8,
      title: 'Low Stock Alert',
      message: 'Product "Wireless Mouse" is running low on stock. Only 5 units remaining.',
      type: 'alert',
      icon: AlertCircle,
      time: '8 hours ago',
      read: false,
      action: () => navigate('/products')
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || notification.type === filterType;
    return matchesSearch && matchesType;
  });

  const markAsRead = (id) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const handleNotificationClick = (notification) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action) {
      notification.action();
    }
  };

  const getNotificationTypeColor = (type) => {
    const colors = {
      order: 'text-green-600 bg-green-100 dark:bg-green-900/20 dark:text-green-400',
      user: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400',
      alert: 'text-red-600 bg-red-100 dark:bg-red-900/20 dark:text-red-400',
      report: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20 dark:text-purple-400',
      reminder: 'text-orange-600 bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400'
    };
    return colors[type] || 'text-gray-600 bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400';
  };

  const notificationTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'order', label: 'Orders' },
    { value: 'user', label: 'Users' },
    { value: 'alert', label: 'Alerts' },
    { value: 'report', label: 'Reports' },
    { value: 'reminder', label: 'Reminders' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Notifications</h1>
            <p className="text-muted-foreground">
              {notifications.length === 0 ? 'No notifications' : 
               `${notifications.length} total notifications, ${unreadCount} unread`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={markAllAsRead}
                className="flex items-center gap-2"
              >
                <Check className="w-4 h-4" />
                Mark all read
              </Button>
            )}
            {notifications.length > 0 && (
              <Button
                variant="outline"
                onClick={clearAllNotifications}
                className="flex items-center gap-2 text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
              >
                <Trash2 className="w-4 h-4" />
                Clear all
              </Button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search and Filter */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>All Notifications</CardTitle>
              <CardDescription>View and manage your notifications</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    {notificationTypes.find(t => t.value === filterType)?.label}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {notificationTypes.map(type => (
                    <DropdownMenuItem key={type.value} onClick={() => setFilterType(type.value)}>
                      {type.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredNotifications.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">
              <Bell className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <h3 className="font-medium mb-2">No notifications found</h3>
              <p className="text-sm">
                {searchTerm || filterType !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'You\'re all caught up! No notifications to show.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group relative p-4 rounded-lg border transition-all hover:shadow-md ${
                      !notification.read 
                        ? 'bg-accent/30 border-primary/20' 
                        : 'bg-background hover:bg-accent/20'
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div 
                        className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${getNotificationTypeColor(notification.type)}`}
                      >
                        <notification.icon className="w-5 h-5" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className={`font-medium ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {!notification.read && (
                              <div className="w-2 h-2 bg-primary rounded-full" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            {notification.time}
                          </p>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 px-2 text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Mark read
                              </Button>
                            )}
                            {notification.action && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleNotificationClick(notification)}
                                className="h-8 px-2 text-xs"
                              >
                                View
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 px-2 text-xs text-red-600 hover:text-red-700"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Notifications;
