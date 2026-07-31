"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  LogOut,
  User,
  Settings,
  LogIn,
} from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ModeToggle } from "../ui/mode-toggle";
import { useTheme } from "next-themes";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/student/dashboard",
  },
  {
    label: "Kelas Saya",
    icon: BookOpen,
    href: "/student/my-courses",
  },
  {
    label: "Jelajah Kelas",
    icon: Compass,
    href: "/courses",
  },
  {
    label: "Profil Saya",
    icon: User,
    href: "/student/profile",
  },
  {
    label: "Pengaturan",
    icon: Settings,
    href: "/student/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [enrolling, setEnrolling] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const token = getCookie("token");
    setEnrolling(!!token);
  }, []);

  const onLogout = () => {
    deleteCookie("token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    router.push("/");
  };

  return (
    <aside className="flex h-screen w-full max-w-[260px] flex-col border-r bg-background/60 px-3 py-4 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/70">
      {/* Brand / Logo */}
      <div className="mb-6 flex items-center gap-3 px-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <BookOpen className="h-5 w-5" />
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold leading-none tracking-tight">
            Pacu Pintar
          </span>
          <span className="text-xs ">Ruang belajar kamu</span>
        </div>
      </div>

      {/* Menu */}
      <ScrollArea className="flex-1">
        <nav className="space-y-1 px-1">
          {routes.map((route) => {
            const isActive =
              pathname === route.href || pathname?.startsWith(route.href);

            return (
              <Button
                key={route.href}
                asChild
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "flex w-full justify-start gap-2 rounded-lg px-2.5 py-2.5 text-sm font-medium transition-all",
                  "hover:bg-muted/70",
                  isActive && "bg-muted text-foreground shadow-sm"
                )}
              >
                <Link href={route.href}>
                  <div className="flex items-center">
                    <route.icon
                      className={cn(
                        "mr-2 h-4 w-4",
                        isActive ? "text-primary" : ""
                      )}
                    />
                    <span>{route.label}</span>
                  </div>
                </Link>
              </Button>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="mt-4 space-y-3 border-t pt-4">
        {/* Theme Toggle */}
        <div className="flex items-center justify-between rounded-lg px-2.5 py-2 text-sm">
          <span className="text-muted-foreground">
            Mode {theme === "dark" ? "Gelap" : "Terang"}
          </span>
          <ModeToggle />
        </div>

        {/* Auth Button */}
        {enrolling ? (
          <Button
            variant="ghost"
            onClick={onLogout}
            className="flex w-full justify-center gap-2 text-sm text-destructive hover:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </Button>
        ) : (
          <Button asChild className="w-full">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2"
            >
              <LogIn className="h-4 w-4" />
              Masuk
            </Link>
          </Button>
        )}
      </div>
    </aside>
  );
}
