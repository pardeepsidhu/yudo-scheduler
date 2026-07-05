'use client'
import React, { useState, useEffect } from "react";
import {
  Calendar, Clock, Bell, Users, PieChart, CheckSquare,
  Home, Info, LogOut, Menu, ChevronLeft, ChevronRight,
  Repeat1
} from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutConfirmation from "./logout";
import { useRouter } from "next/navigation";

// ─── helpers ──────────────────────────────────────────────────────────────────
const cn = (...cls: (string | boolean | undefined)[]) => cls.filter(Boolean).join(" ");

// ─── types ────────────────────────────────────────────────────────────────────
interface ResponsiveNavProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onLogout?: () => void;
  activeItem: string;
  setActiveItem?: React.Dispatch<React.SetStateAction<string>>;
}

interface MenuItem { id: string; label: string; icon: React.ElementType }

// ─── Dot-grid (shared with navbar/footer) ────────────────────────────────────
const DotGrid = () => (
  <div
    className="pointer-events-none absolute inset-0 opacity-[.18] z-0"
    style={{
      backgroundImage: "radial-gradient(circle,#AAB0FF 1px,transparent 1px)",
      backgroundSize: "28px 28px",
    }}
  />
);

// ─── Accent lines ─────────────────────────────────────────────────────────────
const AccentLine = () => (
  <div className="h-0.5 shrink-0 bg-gradient-to-r from-transparent via-[#3A41E5] to-transparent" />
);

// ─── Nav item ─────────────────────────────────────────────────────────────────
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon, label, active = false, collapsed = false, onClick, isMobile = false,
}) => {
  const base = cn(
    "flex w-full items-center rounded-[9px] border transition-all duration-150 mb-0.5",
    collapsed && !isMobile ? "justify-center p-2" : "gap-2.5 px-2.5 py-2",
    active
      ? "border-[#3A41E5]/22 bg-[#3A41E5]/10"
      : "border-transparent bg-transparent hover:border-[#3A41E5]/14 hover:bg-[#3A41E5]/6"
  );

  const iconWrap = cn(
    "flex shrink-0 items-center justify-center rounded-[7px] transition-all duration-150",
    collapsed && !isMobile ? "h-[34px] w-[34px]" : "h-[30px] w-[30px]",
    active ? "bg-[#3A41E5]" : "bg-transparent"
  );

  const iconEl = (
    <div className={iconWrap}>
      <Icon
        className={cn("h-4 w-4 transition-colors", active ? "text-white" : "text-[#1F257A]/50")}
        strokeWidth={active ? 2.5 : 2}
      />
    </div>
  );

  if (isMobile) {
    return (
      <button className={base} onClick={onClick}>
        {iconEl}
        <span className={cn("text-[.8rem] font-semibold transition-colors", active ? "text-[#1F257A] font-bold" : "text-[#1F257A]/65")}>
          {label}
        </span>
        {active && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-[#3A41E5]" />}
      </button>
    );
  }

  const btn = (
    <button className={base} onClick={onClick}>
      {iconEl}
      {!collapsed && (
        <>
          <span className={cn("flex-1 truncate text-[.8rem] font-semibold transition-colors text-start", active ? "text-[#1F257A] font-bold" : "text-[#1F257A]/65")}>
            {label}
          </span>
          {active && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#3A41E5]" />}
        </>
      )}
    </button>
  );

  if (collapsed) {
    return (
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>{btn}</TooltipTrigger>
          <TooltipContent side="right" className="rounded-lg border border-[#3A41E5]/18 bg-white text-[#1F257A] font-semibold text-xs">
            {label}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }
  return btn;
};

// ─── Section label ────────────────────────────────────────────────────────────
const SectionLabel = ({ label, collapsed }: { label: string; collapsed: boolean }) =>
  collapsed ? null : (
    <p className="mb-1 px-2 pt-1 text-[9px] font-bold uppercase tracking-[.12em] text-[#3A41E5]/40">
      {label}
    </p>
  );

const Sep = () => <div className="my-1.5 h-px bg-[#3A41E5]/10" />;

// ─── Main component ───────────────────────────────────────────────────────────
const ResponsiveNav: React.FC<ResponsiveNavProps> = ({
  userName = "User", userEmail = "user@example.com", userImage = "",
  onLogout, activeItem,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  const menuItems: MenuItem[] = [
    { id: "timesheet",     label: "Timesheet",      icon: Calendar    },
    { id: "tasks",         label: "Tasks",          icon: CheckSquare },
    { id: "reminders",     label: "Reminders",      icon: Clock       },
    { id: "notifications", label: "Notifications",  icon: Bell        },
    { id: "analytics",     label: "Analytics",      icon: PieChart    },
    { id: "profile",       label: "Profile",        icon: Users       },
    { id: "RoutineManager",label: "RoutineManager", icon: Repeat1        },
  ];

  const handleLogout = () => {
    localStorage.clear();
    onLogout ? onLogout() : (window.location.href = "/login");
  };

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const navigate = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const initials = userName?.charAt(0).toUpperCase() || "U";

  // ── Shared user card ─────────────────────────────────────────────────────
  const UserCard = ({ mini }: { mini?: boolean }) =>
    mini ? (
      <div className="flex justify-center px-2 py-2.5 border-b border-[#3A41E5]/10">
        <div className="h-9 w-9 shrink-0 rounded-[8px] bg-[#3A41E5] flex items-center justify-center text-[.8rem] font-bold text-white">
          {initials}
        </div>
      </div>
    ) : (
      <div className="flex items-center gap-2.5 border-b border-[#3A41E5]/10 bg-white/40 px-3.5 py-3">
        <div className="h-9 w-9 shrink-0 rounded-[8px] bg-[#3A41E5] flex items-center justify-center text-[.8rem] font-bold text-white overflow-hidden">
          {userImage
            ? <img src={userImage} alt={userName} className="w-full h-full object-cover" />
            : initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[.79rem] font-bold text-[#1F257A]">{userName}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-[10px] font-semibold text-green-600">Online</span>
          </div>
        </div>
      </div>
    );

  // ── Shared logout button ─────────────────────────────────────────────────
  const LogoutBtn = ({ mini }: { mini?: boolean }) => (
    <LogoutConfirmation
      onLogoutConfirmed={handleLogout}
      buttonClassName={cn(
        "flex w-full items-center rounded-[9px] border border-red-100 bg-red-50/60 transition-all hover:border-red-200 hover:bg-red-100",
        mini ? "justify-center p-2" : "gap-2.5 px-2.5 py-2"
      )}
      buttonContent={
        <>
          <div className={cn("flex shrink-0 items-center justify-center rounded-[7px] bg-red-50", mini ? "h-[34px] w-[34px]" : "h-[30px] w-[30px]")}>
            <LogOut className="h-4 w-4 text-red-500" strokeWidth={2} />
          </div>
          {!mini && <span className="text-[.8rem] font-semibold text-red-500">Logout</span>}
        </>
      }
      tooltipContent={mini ? "Logout" : undefined}
    />
  );

  // ── Nav body (shared) ────────────────────────────────────────────────────
  const NavBody = ({ coll = false, mob = false }: { coll?: boolean; mob?: boolean }) => (
    <div className="flex-1 overflow-y-auto px-2 py-2">
      <SectionLabel label="Main" collapsed={coll} />
      <SidebarItem icon={Home} label="Home" active={activeItem === "home"} collapsed={coll} isMobile={mob} onClick={() => navigate("/")} />

      <Sep />
      <SectionLabel label="Dashboard" collapsed={coll} />
      {menuItems.map((item) => (
        <SidebarItem
          key={item.id}
          icon={item.icon}
          label={item.label}
          active={activeItem === item.id}
          collapsed={coll}
          isMobile={mob}
          onClick={() => navigate(`/dashboard/${item.id}`)}
        />
      ))}


    </div>
  );

  // ─── Mobile navbar ────────────────────────────────────────────────────────
  if (isMobile) return (
    <>
      <div className="fixed left-0 right-0 top-0 z-50">
        <AccentLine />
        <div className="relative overflow-hidden border-b border-[#3A41E5]/20 bg-[#F7F8FF]/95 backdrop-blur-md">
          <DotGrid />
          <div className="relative z-10 flex items-center justify-between px-4 py-3">
            <button onClick={() => router.push("/")} className="flex items-center gap-2.5">
              <div className="h-9 w-9 shrink-0 rounded-[6px] bg-[#3A41E5] flex items-center justify-center">
                <Calendar className="h-4 w-4 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[.9rem] font-bold leading-none text-[#1F257A]">YUDO Scheduler</p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.08em] text-[#3A41E5]/60">Task Management</p>
              </div>
            </button>

            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3A41E5]/18 bg-white/70 text-[#1F257A]/70 hover:bg-[#3A41E5]/7 hover:text-[#3A41E5] transition-all">
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>

              <SheetContent side="left" className="w-[280px] border-[#3A41E5]/20 p-0 bg-[#F7F8FF]">
                <div className="flex h-full flex-col relative overflow-hidden">
                  <DotGrid />

                  {/* Mobile sheet header */}
                  <div className="relative z-10 flex-shrink-0">
                    <AccentLine />
                    <div className="flex items-center gap-3 border-b border-[#3A41E5]/12 bg-[#3A41E5] px-4 py-4">
                      <div className="h-9 w-9 shrink-0 rounded-[6px] bg-white/20 flex items-center justify-center">
                        <Calendar className="h-5 w-5 text-white" strokeWidth={2.5} />
                      </div>
                      <div>
                        <p className="font-bold text-white leading-none text-[.9rem]">YUDO Scheduler</p>
                        <p className="mt-0.5 text-[10px] text-white/70">Task Management System</p>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 flex-shrink-0"><UserCard /></div>
                  <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
                    <NavBody mob />
                  </div>
                  <div className="relative z-10 flex-shrink-0 border-t border-[#3A41E5]/10 p-2">
                    <LogoutBtn />
                  </div>
                  <div className="relative z-10 flex-shrink-0"><AccentLine /></div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
      <div className="h-[58px]" />
    </>
  );

  // ─── Desktop sidebar ──────────────────────────────────────────────────────
  return (
    <div
      className={cn(
        "relative hidden h-screen shrink-0 flex-col overflow-hidden border-r border-[#3A41E5]/20 bg-[#F7F8FF] transition-all duration-300 lg:flex",
        collapsed ? "w-[72px]" : "w-[264px]"
      )}
    >
      <DotGrid />

      {/* Top accent */}
      <AccentLine />

      {/* Header */}
      <div className={collapsed?"relative z-10 flex shrink-0 items-center border-b border-[#3A41E5]/12 bg-white/50 px-3 py-3.5 justify-center":"relative z-10 flex shrink-0 items-center border-b border-[#3A41E5]/12 bg-white/50 px-3 py-3.5"}>
       {!collapsed && ( <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[7px] bg-[#3A41E5]">
          <Calendar className="h-4 w-4 text-white" strokeWidth={2.5} />
        </div>)}

        {!collapsed && (
          <div className="ml-2.5 min-w-0 flex-1 overflow-hidden">
            <p className="truncate text-[.88rem] font-bold leading-none text-[#1F257A]">YUDO Scheduler</p>
            <p className="mt-0.5 text-[9px] font-bold uppercase tracking-[.1em] text-[#3A41E5]/60">Task Management</p>
          </div>
        )}

        <button
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className={cn(
            "flex h-7 w-7 shrink-0 items-center justify-center rounded-[7px] border border-[#3A41E5]/20 bg-[#3A41E5]/6 text-[#3A41E5] transition-all hover:border-[#3A41E5]/35 hover:bg-[#3A41E5]/12",
            collapsed ? "ml-0 mt-2 self-start" : "ml-2"
          )}
        >
          {collapsed
            ? <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.5} />
            : <ChevronLeft className="h-3.5 w-3.5" strokeWidth={2.5} />}
        </button>
      </div>

      
      {/* Nav */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
        <NavBody coll={collapsed} />
      </div>

      {/* Logout */}
      <div className="relative z-10 shrink-0 border-t border-[#3A41E5]/10 p-2">
        <TooltipProvider delayDuration={0}>
          <LogoutBtn mini={collapsed} />
        </TooltipProvider>
      </div>

      {/* Bottom accent */}
      <AccentLine />
    </div>
  );
};

export default ResponsiveNav;