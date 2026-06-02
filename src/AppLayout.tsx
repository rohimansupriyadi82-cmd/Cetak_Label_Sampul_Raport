import { useEffect, useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Bell,
  ChevronRight,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Printer,
  Search,
  Settings,
  Users,
  X,
} from "lucide-react";
import { cn } from "./lib/utils";

const navItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    to: "/dashboard",
    badge: null as string | null,
    matchPrefixes: ["/dashboard"],
  },
  {
    label: "Data Siswa",
    icon: Users,
    to: "/data-siswa",
    badge: null as string | null,
    matchPrefixes: ["/data-siswa"],
  },
  {
    label: "Cetak Label",
    icon: Printer,
    to: "/print/cetak-label-ijazah",
    badge: "Baru",
    matchPrefixes: ["/print"],
  },
  {
    label: "Pengaturan",
    icon: Settings,
    to: "/settings",
    badge: null as string | null,
    matchPrefixes: ["/settings"],
  },
];

function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const location = useLocation();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-screen w-64 flex flex-col",
          "bg-[hsl(var(--sidebar-bg))] text-white",
          "transition-transform duration-300 ease-in-out",
          "lg:translate-x-0 lg:static lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/10">
          <div
            className="flex items-center justify-center w-9 h-9 rounded-xl shrink-0"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-soft)) 100%)",
            }}
          >
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <p className="font-bold text-sm tracking-wide text-white">SiAkad</p>
            <p className="text-[10px] text-white/50 tracking-widest uppercase">
              Sistem Akademik
            </p>
          </div>

          <button
            onClick={onClose}
            className="ml-auto lg:hidden text-white/60 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-0.5">
          {navItems.map(({ label, icon: Icon, to, badge, matchPrefixes }) => {
            const isActive = matchPrefixes.some(
              (p) => location.pathname === p || location.pathname.startsWith(p + "/")
            );

            return (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                className={cn(
                  "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium",
                  "transition-all duration-150 relative",
                  isActive
                    ? "bg-white/10 text-white"
                    : "text-white/60 hover:bg-white/5 hover:text-white"
                )}
              >
                {isActive && (
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                    style={{ background: "var(--primary-color)" }}
                  />
                )}

                <Icon
                  className={cn(
                    "w-5 h-5 shrink-0 transition-transform duration-150",
                    isActive
                      ? "text-[color:var(--primary-color)]"
                      : "text-white/40 group-hover:text-white/70",
                    "group-hover:scale-110"
                  )}
                />

                <span className="flex-1 truncate">{label}</span>

                {badge && (
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full leading-none"
                    style={{
                      background: "color-mix(in srgb, var(--primary-color) 22%, transparent)",
                      color: "var(--primary-color)",
                    }}
                  >
                    {badge}
                  </span>
                )}

                {isActive && (
                  <ChevronRight size={14} className="text-white/30 shrink-0" />
                )}
              </NavLink>
            );
          })}
        </nav>

        <div className="px-4 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-bold"
              style={{
                background: "linear-gradient(135deg, #D4AF37, #F5D76E)",
                color: "#0D1B2A",
              }}
            >
              AD
            </div>
            <div className="leading-tight overflow-hidden">
              <p className="text-xs font-semibold text-white truncate">Admin Sekolah</p>
              <p className="text-[10px] text-white/40 truncate">admin@sekolah.sch.id</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

function BottomNav() {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 lg:hidden border-t border-border bg-background/95 backdrop-blur-sm">
      <div className="grid grid-cols-4 h-14">
        {navItems.map(({ label, icon: Icon, to, matchPrefixes }) => {
          const isActive = matchPrefixes.some(
            (p) => location.pathname === p || location.pathname.startsWith(p + "/")
          );

          return (
            <NavLink
              key={to}
              to={to}
              className={cn(
                "flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                isActive ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon size={20} className={cn("transition-transform", isActive && "scale-110")} />
              <span>{label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}

function TopHeader({ onMenuOpen }: { onMenuOpen: () => void }) {
  return (
    <header className="sticky top-0 z-20 h-14 flex items-center gap-3 px-4 border-b border-border bg-background/95 backdrop-blur-sm">
      <button
        onClick={onMenuOpen}
        className="lg:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 max-w-sm hidden sm:flex items-center gap-2 h-8 rounded-lg border border-border bg-muted/50 px-3 text-sm text-muted-foreground">
        <Search className="w-3.5 h-3.5 shrink-0" />
        <span className="text-xs">Cari siswa, menu...</span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="relative p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
          <Bell className="w-4.5 h-4.5" size={18} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-destructive" />
        </button>

        <div
          className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #0D1B2A, #1e3a5f)",
            color: "#D4AF37",
          }}
        >
          AD
        </div>
      </div>
    </header>
  );
}

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopHeader onMenuOpen={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 pb-20 lg:pb-6">
          <Outlet />
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
