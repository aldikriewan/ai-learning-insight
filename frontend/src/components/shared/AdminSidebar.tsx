"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  LogOut,
  Shield,
  Menu,
} from "lucide-react";
import { deleteCookie } from "cookies-next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin/dashboard",
  },
  {
    label: "Manajemen Kelas",
    icon: BookOpen,
    href: "/admin/courses",
  },
  {
    label: "Penilaian Tugas",
    icon: GraduationCap,
    href: "/admin/grading",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = () => {
    deleteCookie("token");
    if (typeof window !== "undefined") localStorage.removeItem("user");
    router.push("/login");
  };

  const NavItem = ({ href, label, Icon }: any) => {
    const active = pathname?.startsWith(href);
    return (
      <Link
        href={href}
        className={cn(
          "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition",
          active
            ? "bg-muted/60 text-foreground shadow-sm"
            : " hover:bg-muted/40"
        )}
        aria-current={active ? "page" : undefined}
      >
        <Icon
          className={cn(
            "h-5 w-5",
            active ? "text-primary" : ""
          )}
        />
        <span>{label}</span>
      </Link>
    );
  };

  // Desktop sidebar content (reusable)
  const SidebarContent = (
    <div className="flex h-full flex-col">
      <div className="px-4 py-6">
        <Link href="/admin/dashboard" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/5 text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-none">Admin Panel</h3>
            <p className="text-xs ">Dashboard & Kontrol</p>
          </div>
        </Link>
      </div>

      <div className="px-3 pb-4 flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <nav className="flex flex-col gap-1 px-1">
            {routes.map((r) => (
              <NavItem
                key={r.href}
                href={r.href}
                label={r.label}
                Icon={r.icon}
              />
            ))}
          </nav>
        </ScrollArea>
      </div>

      <div className="px-4 py-4">
        <Button
          variant="ghost"
          className="w-full justify-center"
          onClick={onLogout}
        >
          <LogOut className="mr-2 h-4 w-4 text-destructive" />
          Keluar
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile: Sheet/drawer */}
      <div className="md:hidden px-4 py-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-9 w-9">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Buka menu admin</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {SidebarContent}
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-40 border-r bg-background">
        {SidebarContent}
      </aside>
    </>
  );
}
