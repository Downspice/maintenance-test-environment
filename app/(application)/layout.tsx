"use client";
import AdminPanelLayout from "@/components/layout/admin-panel/admin-panel-layout";
import { Navbar } from "@/components/layout/admin-panel/navbar";
import React from "react";
import QueryProvider from "@/lib/api/query-provider";

export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryProvider>
      <AdminPanelLayout>
        <Navbar />
        <div className="flex-1 min-h-0 flex flex-col overflow-hidden bg-[radial-gradient(circle,rgba(249,115,22,0.01)_0%,rgba(245,240,240,0.01)_38%,rgba(249,115,22,0.01)_100%)]">
          {children}
        </div>
      </AdminPanelLayout>
    </QueryProvider>
  );
}
