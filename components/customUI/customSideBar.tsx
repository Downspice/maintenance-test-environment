// components/SidebarLayout.tsx
import React, { useState } from "react";
import clsx from "clsx";

export type SidebarItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
};

type SidebarLayoutProps = {
    headerItem: React.ReactNode;
  menuItems: SidebarItem[];
  defaultActiveId?: string;
};

const SidebarLayout: React.FC<SidebarLayoutProps> = ({
    headerItem,
  menuItems,
  defaultActiveId,
}) => {
  const [activeMenu, setActiveMenu] = useState(defaultActiveId || menuItems[0]?.id);
  const active = menuItems.find((item) => item.id === activeMenu);

  return (
    <div className="flex h-full bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 h-full     flex flex-col p-4 space-y-2 bg-accent">
        {headerItem}
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium",
              activeMenu === item.id
                ? "bg-blue-100 text-blue-600"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 overflow-auto">
        <h2 className="text-xl font-semibold mb-4">{active?.label}</h2>
        <div className="bg-white rounded-lg shadow p-4 h-full">{active?.content}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;
