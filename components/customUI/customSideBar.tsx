// components/SidebarLayout.tsx
import React, { useState } from "react";
import clsx from "clsx";

export type SidebarItem = {
  id: string;
  name: string;
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
  const [activeMenu, setActiveMenu] = useState(
    defaultActiveId || menuItems[0]?.id
  );
  const active = menuItems.find((item) => item.id === activeMenu);

  return (
    <div className="flex h-full bg-accent">
      {/* Sidebar */}
      <div className="w-64 h-screen overflow-auto bg-white flex flex-col pl-1 space-y-1">
        {headerItem}
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveMenu(item.id)}
            className={clsx(
              "flex items-center gap-2 px-3 py-2 text-sm font-medium",
              activeMenu === item.id
                ? "bg-accent text-primary"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1  overflow-auto">
        <div className="bg-white pl-1 shadow h-full">{active?.content}</div>
      </div>
    </div>
  );
};

export default SidebarLayout;
