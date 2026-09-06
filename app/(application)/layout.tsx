'use client'
import AdminPanelLayout from "@/components/layout/admin-panel/admin-panel-layout";
import { Navbar } from "@/components/layout/admin-panel/navbar";
import React from 'react';
import QueryProvider from '@/lib/api/query-provider'; 

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
     <QueryProvider>
      <AdminPanelLayout>
        <Navbar />
        {children}
      </AdminPanelLayout>
    </QueryProvider>
  );
}
