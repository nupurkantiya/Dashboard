import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard,
  Users,
  BarChart3,
  Calendar,
  Kanban,
  ShoppingCart,
  Package,
  Settings,
  User,
  ChevronRight,
  ChevronLeft,
  Home
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts';
import { Button } from '@/components/ui/button';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: Users, label: 'Users', path: '/users' },
  { icon: BarChart3, label: 'Charts', path: '/charts' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Kanban, label: 'Kanban', path: '/kanban' },
  { icon: ShoppingCart, label: 'Orders', path: '/orders' },
  { icon: Package, label: 'Products', path: '/products' },
  { icon: Settings, label: 'Settings', path: '/settings' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const Sidebar = () => {
  const location = useLocation();
  const { theme, accentColor } = useTheme();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <motion.div 
      initial={false}
      animate={{ width: isCollapsed ? 80 : 280 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="flex flex-col h-full bg-card border-r relative"
    >
      {/* Toggle Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={toggleSidebar}
        className="absolute -right-3 top-1/2 -translate-y-1/2 z-10 h-6 w-6 rounded-full bg-background border shadow-md hover:bg-accent"
      >
        {isCollapsed ? (
          <ChevronRight className="h-3 w-3" />
        ) : (
          <ChevronLeft className="h-3 w-3" />
        )}
      </Button>

      {/* Logo */}
      <div className="flex items-center justify-center h-[72.5px] px-6 border-b">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className={cn(
            "flex items-center transition-all duration-300",
            isCollapsed ? "justify-center" : "space-x-3"
          )}
        >
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300",
            "bg-primary text-primary-foreground shadow-sm",
            "hover:shadow-md hover:scale-105"
          )}>
            <Home className="w-5 h-5" />
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.h1
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className={cn(
                  "text-xl font-bold whitespace-nowrap overflow-hidden transition-colors duration-300",
                  "text-primary"
                )}
              >
                AdminPro
              </motion.h1>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Navigation */}
      <nav className={cn(
        "flex-1 py-6 space-y-2 transition-all duration-300",
        isCollapsed ? "px-2" : "px-4"
      )}>
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path || 
            (location.pathname === '/' && item.path === '/dashboard');

          return (
            <motion.div
              key={item.path}
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <NavLink
                to={item.path}
                className={({ isActive: linkActive }) =>
                  cn(
                    'group flex items-center text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden',
                    isCollapsed ? 'px-3 py-3 justify-center' : 'px-4 py-3',
                    isActive || linkActive
                      ? 'bg-primary text-primary-foreground shadow-lg'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                  )
                }
                title={isCollapsed ? item.label : undefined}
              >
                {(isActive || location.pathname === item.path) && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-primary rounded-lg"
                    initial={false}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
                
                <Icon className={cn(
                  "flex-shrink-0 relative z-10 transition-all duration-300",
                  isCollapsed ? "w-5 h-5" : "w-5 h-5 mr-3"
                )} />
                
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="relative z-10 whitespace-nowrap overflow-hidden"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {(isActive || location.pathname === item.path) && !isCollapsed && (
                  <ChevronRight className="w-4 h-4 ml-auto relative z-10" />
                )}
              </NavLink>
            </motion.div>
          );
        })}
      </nav>
    </motion.div>
  );
};

export default Sidebar;
