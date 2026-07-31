// app/settings/_components/SettingsSidebar.tsx
import { Moon } from 'lucide-react';
import React from 'react'
import { FaUser, FaBell, FaBrain, FaLock } from "react-icons/fa6";

interface SettingsSidebarProps {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

export const SettingsSidebar = ({ activeTab, setActiveTab }: SettingsSidebarProps) => {
  const menuItems = [
    { id: "profile", label: "Profile", icon: <FaUser /> },
    { id: "account", label: "Account", icon: <FaLock /> },
  ];

  return (
    <aside className="lg:w-1/4">
      <nav className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
              ${activeTab === item.id 
                ? "bg-slate-100 text-slate-900" 
                : " hover:text-slate-900 hover:bg-slate-50"}
            `}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}