'use client'
import AdminPanelLayout from "@/components/admin-panel/admin-panel-layout";
import { Navbar } from "@/components/admin-panel/navbar";
import React from 'react';
import QueryProvider from '@/lib/QueryProvider'; 

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
