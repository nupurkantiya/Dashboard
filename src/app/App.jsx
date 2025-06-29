import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, UserProvider, OrderProvider, ProductProvider, CalendarProvider } from '@/contexts';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/layout/Layout';
import { 
  Dashboard, 
  Users, 
  Charts, 
  Calendar, 
  Kanban,
  Orders,
  Products,
  Notifications,
  Settings,
  Profile
} from '@/pages';

function App() {
  return (
    <ThemeProvider>
      <CalendarProvider>
        <ProductProvider>
          <OrderProvider>
            <UserProvider>
              <Router>
                <div className="min-h-screen bg-background font-sans antialiased">
                  <Layout>
                    <Routes>                <Route path="/" element={<Dashboard />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/users" element={<Users />} />
                    <Route path="/charts" element={<Charts />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/kanban" element={<Kanban />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/profile" element={<Profile />} />
                    </Routes>
                  </Layout>
                  <Toaster />
                </div>
              </Router>
            </UserProvider>
          </OrderProvider>
        </ProductProvider>
      </CalendarProvider>
    </ThemeProvider>
  );
}

export default App;
