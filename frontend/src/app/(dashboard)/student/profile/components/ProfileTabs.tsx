"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Clock, Activity } from "lucide-react";

export const ProfileTabs = () => {
  const pathname = usePathname();

  const tabs = [
    {
      label: "Focus Time",
      href: "/student/profile",
      icon: Clock,
    },
  ];

  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg w-fit mb-6">
      {tabs.map((tab) => {
        const isActive = pathname === tab.href;
        const Icon = tab.icon;

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all
              ${
                isActive
                  ? "bg-background text-foreground shadow-sm"
                  : " hover:text-foreground"
              }
            `}
          >
            <Icon className="h-4 w-4" />
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
};
