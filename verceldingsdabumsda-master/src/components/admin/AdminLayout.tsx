'use client';

import React from 'react';
import AdminNavbar from '@/app/admin/components/AdminNavbar';
import AdminSidebar from '@/app/admin/components/AdminSidebar';
import AdminAuthCheck from '@/app/admin/components/AdminAuthCheck';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <AdminAuthCheck>
      <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
        <AdminSidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        
        <div className="flex flex-col flex-1 w-full">
          <AdminNavbar toggleSidebar={toggleSidebar} />
          
          <main className="h-full overflow-y-auto p-4">
            <div className="container mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AdminAuthCheck>
  );
};

export default AdminLayout; 