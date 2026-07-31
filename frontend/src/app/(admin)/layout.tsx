import AdminSidebar from "@/components/shared/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/10">
      {/* Sidebar (desktop fixed) */}
      <div className="hidden md:fixed md:inset-y-0 md:flex md:w-64">
        <AdminSidebar />
      </div>

      {/* Main */}
      <div className="flex min-h-screen flex-col md:pl-64">
        {/* Topbar for mobile (keeps spacing consistent) */}
        <header className="sticky top-0 z-30 border-b bg-background/80 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">Admin Panel</div>
            {/* Mobile sheet trigger lives inside AdminSidebar */}
            <div />
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8">
          {children}
        </main>
      </div>
    </div>
  );
}
