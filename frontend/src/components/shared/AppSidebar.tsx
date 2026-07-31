"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  BookOpen,
  LogOut,
  User,
  Settings,
  LogIn,
  ChevronsUpDown,
  Moon,
  Sun,
  Monitor,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { deleteCookie, getCookie } from "cookies-next";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const mainRoutes = [
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
];

const accountRoutes = [
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

interface UserData {
  name?: string;
  email?: string;
  avatar?: string;
}

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const { state, toggleSidebar } = useSidebar();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState<UserData>({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const token = getCookie("token");
    setIsLoggedIn(!!token);

    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUserData(JSON.parse(storedUser));
        } catch {
          setUserData({});
        }
      }
    }
  }, []);

  const onLogout = () => {
    deleteCookie("token");
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }
    router.push("/");
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar collapsible="icon" className="border-r">
      {/* Header */}
      <SidebarHeader className="border-b">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              asChild
            >
              <Link href="/student/dashboard">
                <div className="flex aspect-square size-9 items-center justify-center rounded-lg overflow-hidden bg-primary/10">
                  <Image
                    src="/logo web.png"
                    alt="Pacu Pintar"
                    width={50}
                    height={50}
                    className="object-cover"
                  />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">Pacu Pintar</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Ruang belajar kamu
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* Toggle Button - positioned better for both states */}
        <button
          onClick={toggleSidebar}
          className={`absolute z-50 hidden size-6 rounded-full border bg-background shadow-sm hover:bg-accent md:flex items-center justify-center transition-all ${
            isCollapsed ? "-right-3 top-4" : "-right-3 top-4"
          }`}
          title={isCollapsed ? "Perluas Sidebar" : "Kecilkan Sidebar"}
        >
          {isCollapsed ? (
            <ChevronRight className="size-3.5" />
          ) : (
            <ChevronLeft className="size-3.5" />
          )}
        </button>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent>
        {/* Main Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainRoutes.map((route) => {
                const isActive =
                  pathname === route.href || pathname?.startsWith(route.href);
                return (
                  <SidebarMenuItem key={route.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={route.label}
                    >
                      <Link href={route.href}>
                        <route.icon className="size-4" />
                        <span>{route.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Account Navigation (only shown when logged in) */}
        {isLoggedIn && (
          <SidebarGroup>
            <SidebarGroupLabel>Akun</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {accountRoutes.map((route) => {
                  const isActive =
                    pathname === route.href || pathname?.startsWith(route.href);
                  return (
                    <SidebarMenuItem key={route.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive}
                        tooltip={route.label}
                      >
                        <Link href={route.href}>
                          <route.icon className="size-4" />
                          <span>{route.label}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      {/* Rail for edge toggle */}
      <SidebarRail />

      {/* Footer with User Avatar Dropdown */}
      <SidebarFooter className="border-t">
        <SidebarMenu>
          <SidebarMenuItem>
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="size-8 rounded-lg">
                      <AvatarImage
                        src={userData.avatar}
                        alt={userData.name || "User"}
                      />
                      <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs font-medium">
                        {getInitials(userData.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {userData.name || "Pengguna"}
                      </span>
                      <span className="truncate text-xs text-muted-foreground">
                        {userData.email || "user@example.com"}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isCollapsed ? "right" : "top"}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="size-8 rounded-lg">
                        <AvatarImage
                          src={userData.avatar}
                          alt={userData.name || "User"}
                        />
                        <AvatarFallback className="rounded-lg bg-gradient-to-br from-primary/80 to-primary text-primary-foreground text-xs">
                          {getInitials(userData.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {userData.name || "Pengguna"}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {userData.email || "user@example.com"}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/student/profile" className="cursor-pointer">
                        <User className="mr-2 size-4" />
                        Profil Saya
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/student/settings" className="cursor-pointer">
                        <Settings className="mr-2 size-4" />
                        Pengaturan
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  {/* Theme Submenu */}
                  {mounted && (
                    <DropdownMenuSub>
                      <DropdownMenuSubTrigger>
                        {theme === "dark" ? (
                          <Moon className="mr-2 size-4" />
                        ) : theme === "light" ? (
                          <Sun className="mr-2 size-4" />
                        ) : (
                          <Monitor className="mr-2 size-4" />
                        )}
                        <span>Tema</span>
                      </DropdownMenuSubTrigger>
                      <DropdownMenuSubContent className="min-w-32">
                        <DropdownMenuItem
                          onClick={() => setTheme("light")}
                          className="cursor-pointer"
                        >
                          <Sun className="mr-2 size-4" />
                          <span>Terang</span>
                          {theme === "light" && (
                            <span className="ml-auto text-xs text-primary">
                              ✓
                            </span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setTheme("dark")}
                          className="cursor-pointer"
                        >
                          <Moon className="mr-2 size-4" />
                          <span>Gelap</span>
                          {theme === "dark" && (
                            <span className="ml-auto text-xs text-primary">
                              ✓
                            </span>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setTheme("system")}
                          className="cursor-pointer"
                        >
                          <Monitor className="mr-2 size-4" />
                          <span>Sistem</span>
                          {theme === "system" && (
                            <span className="ml-auto text-xs text-primary">
                              ✓
                            </span>
                          )}
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuSub>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="cursor-pointer text-destructive focus:text-destructive"
                  >
                    <LogOut className="mr-2 size-4" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <SidebarMenuButton size="lg" asChild tooltip="Masuk">
                <Link href="/login">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <LogIn className="size-4" />
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">Masuk</span>
                    <span className="truncate text-xs text-muted-foreground">
                      Login ke akun kamu
                    </span>
                  </div>
                </Link>
              </SidebarMenuButton>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
