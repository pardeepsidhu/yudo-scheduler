'use client'
import React, { useState, useEffect, useRef } from "react";
import {
  Calendar, LayoutDashboard, Clock, Bell, PieChart,
  CheckSquare, Home, Info, Users, Users2,
  LogOut, Menu, ChevronDown, Sparkles, LogIn, Repeat1,
  CalendarClock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import { fetchUser } from "@/app/api/userApi";
import LogoutConfirmation from "./logout";

// ─── tiny helpers ────────────────────────────────────────────────────────────
const cn = (...cls: (string | boolean | undefined)[]) =>
  cls.filter(Boolean).join(" ");

// ─── Dashboard dropdown items ────────────────────────────────────────────────
const DASHBOARD_ITEMS = [
  { title: "Profile",       href: "/dashboard/profile",       icon: Users2,      desc: "User profile & linked accounts"                    },
  { title: "Tasks",         href: "/dashboard/tasks",         icon: CheckSquare, desc: "Organize and monitor your daily tasks efficiently"  },
  { title: "Reminders",     href: "/dashboard/reminders",     icon: Clock,       desc: "Set timely reminders for all your critical deadlines"},
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell,        desc: "Track important updates and alerts in real-time"    },
  { title: "Analytics",     href: "/dashboard/analytics",     icon: PieChart,    desc: "Gain insight with visual productivity analytics"    },
  { title: "Timesheet",     href: "/dashboard/timesheet",     icon: Calendar,    desc: "Track hours worked and generate accurate reports"   },
  { title: "Routine Manager", href: "/dashboard/RoutineManager",icon: Repeat1, desc: "Plan, organize, and manage your daily, weekly, and recurring routines" },
];

// ─── Dot-grid background (matches login/footer) ──────────────────────────────
const DotGrid = () => (
  <div
    className="pointer-events-none absolute inset-0 opacity-[.18]"
    style={{
      backgroundImage: "radial-gradient(circle,#AAB0FF 1px,transparent 1px)",
      backgroundSize: "28px 28px",
    }}
  />
);

// ─── Nav link button ─────────────────────────────────────────────────────────
const NavBtn = ({
  icon: Icon, label, onClick, active,
}: { icon: React.ElementType; label: string; onClick: () => void; active?: boolean }) => (
  <button
    onClick={onClick}
    className={cn(
      "flex items-center gap-1.5 rounded-lg border px-3 py-[7px] text-[.82rem] font-semibold transition-all duration-150",
      active
        ? "border-[#3A41E5]/25 bg-[#3A41E5]/10 text-[#3A41E5]"
        : "border-transparent bg-transparent text-[#1F257A]/70 hover:border-[#3A41E5]/18 hover:bg-[#3A41E5]/7 hover:text-[#3A41E5]"
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
  </button>
);

// ─── Dashboard mega-dropdown card ────────────────────────────────────────────
const DDCard = ({
  icon: Icon, title, desc, onClick,
}: { icon: React.ElementType; title: string; desc: string; onClick: () => void }) => (
  <button
    onClick={onClick}
    className="flex items-start gap-2.5 rounded-[9px] border border-transparent p-2.5 text-left transition-all duration-150 hover:border-[#3A41E5]/15 hover:bg-[#3A41E5]/5 w-full"
  >
    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[8px] bg-[#3A41E5]">
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div>
      <p className="text-[.8rem] font-bold text-[#1F257A] leading-none mb-1">{title}</p>
      <p className="text-[.71rem] text-[#1F257A]/50 leading-relaxed">{desc}</p>
    </div>
  </button>
);

// ─── Main component ───────────────────────────────────────────────────────────
const ProfessionalNavbar = () => {
  const [ddOpen, setDdOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userName, setUserName] = useState("User");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [userImage, setUserImage] = useState("");
  const ddRef = useRef<HTMLDivElement>(null);
  const pathName = usePathname();
  const router = useRouter();

  const isLoggedIn = userEmail !== "user@example.com";

  const handleLogoutSuccess = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchUser();
        if (!result.error) {
          setUserEmail(result.email);
          setUserImage(result?.profile);
          setUserName(result?.name);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchData();
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ddRef.current && !ddRef.current.contains(e.target as Node)) {
        setDdOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  if (pathName !== "/" && pathName !== "/about") return null;

  const MOBILE_ITEMS = [
    { id: "home",          label: "Home",          icon: Home        },
    { id: "profile",       label: "Profile",        icon: Users       },
    { id: "timesheet",     label: "Timesheet",      icon: Calendar    },
    { id: "tasks",         label: "Tasks",          icon: CheckSquare },
    { id: "reminders",     label: "Reminders",      icon: Clock       },
    { id: "notifications", label: "Notifications",  icon: Bell        },
    { id: "analytics",     label: "Analytics",      icon: PieChart    },
    { id: "RoutineManager",label: "RoutineManager", icon: Repeat1        },
    { id: "calendar",      label: "Calendar",       icon: CalendarClock      },
  ];

  const handleMobileNav = (id: string) => {
    const routes: Record<string, string> = {
      home: "/", profile: "/dashboard/profile",
      timesheet: "/dashboard/timesheet", tasks: "/dashboard/tasks",
      reminders: "/dashboard/reminders", notifications: "/dashboard/notifications",
      analytics: "/dashboard/analytics",
    };
    if (routes[id]) router.push(routes[id]);
    setMobileOpen(false);
  };

  const initials = userName?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <header className="fixed left-0 right-0 top-0 z-50">
        {/* Top gradient accent line */}
        <div className="h-0.5 bg-gradient-to-r from-transparent via-[#3A41E5] to-transparent" />

        <div className="relative overflow-hidden border-b border-[#3A41E5]/20 bg-[#F7F8FF]/95 backdrop-blur-md overflow-visible">
          <DotGrid />

          <div className="relative z-10 mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

            {/* Logo */}
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2.5 rounded-lg p-1 transition-opacity hover:opacity-80"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[6px] bg-[#3A41E5]">
                <Calendar className="h-4.5 w-4.5 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-[.95rem] font-bold leading-none tracking-tight text-[#1F257A]">
                  YUDO Scheduler
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[.08em] text-[#3A41E5]/65">
                  Task Management
                </p>
              </div>
            </button>

            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 lg:flex">
              <NavBtn
                icon={Home} label="Home"
                active={pathName === "/"}
                onClick={() => router.push("/")}
              />

              {/* Dashboard dropdown */}
              <div className="relative" ref={ddRef}>
                <button
                  onClick={() => setDdOpen((v) => !v)}
                  className={cn(
                    "flex items-center gap-1.5 rounded-lg border px-3 py-[7px] text-[.82rem] font-semibold transition-all duration-150",
                    ddOpen
                      ? "border-[#3A41E5]/25 bg-[#3A41E5]/10 text-[#3A41E5]"
                      : "border-transparent text-[#1F257A]/70 hover:border-[#3A41E5]/18 hover:bg-[#3A41E5]/7 hover:text-[#3A41E5]"
                  )}
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard
                  <ChevronDown
                    className={cn(
                      "h-3.5 w-3.5 transition-transform duration-200",
                      ddOpen && "rotate-180"
                    )}
                  />
                </button>

                {ddOpen && (
                  <div className="absolute left-1/2 top-full mt-4 w-[560px] -translate-x-1/2 rounded-2xl border border-[#3A41E5]/18 bg-white p-2.5 shadow-xl shadow-[#3A41E5]/10">
                    {/* Arrow */}
                    <div className="absolute -top-[13px] left-1/2 h-6 w-6 -translate-x-1/2 rotate-45 border-l border-t border-[#3A41E5]/18 bg-white" />
                    <div className="grid grid-cols-2 gap-1.5">
                      {DASHBOARD_ITEMS.map((item) => (
                        <DDCard
                          key={item.title}
                          icon={item.icon}
                          title={item.title}
                          desc={item.desc}
                          onClick={() => { router.push(item.href); setDdOpen(false); }}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {isLoggedIn ? (
                <NavBtn
                  icon={Users} label="Profile"
                  onClick={() => router.push("/dashboard/profile")}
                />
              ) : (
                <NavBtn
                  icon={LogIn} label="Login"
                  onClick={() => router.push("/login")}
                />
              )}


            </nav>

            {/* Right side */}
            <div className="flex items-center gap-2">

             

              {/* User avatar dropdown — desktop */}
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center  rounded-xl border border-[#3A41E5]/18 bg-white/70 py-1.5 pl-1.5 pr-1.5 transition-all hover:border-[#3A41E5]/30 hover:bg-[#3A41E5]/5">
                      <Avatar className="h-8 w-8 rounded-[7px]">
                        <AvatarImage src={userImage} alt={userName} />
                        <AvatarFallback className="rounded-[7px] bg-[#3A41E5] text-[.78rem] font-bold text-white">
                          {initials}
                        </AvatarFallback>
                      </Avatar>
                    
                    </button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent
                    align="end"
                    className="w-56 rounded-xl border border-[#3A41E5]/18 bg-white p-1.5 shadow-xl shadow-[#3A41E5]/10"
                  >
                    <DropdownMenuLabel className="px-2.5 pb-2 pt-1.5">
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-9 w-9 rounded-[8px]">
                          <AvatarImage src={userImage} />
                          <AvatarFallback className="rounded-[8px] bg-[#3A41E5] text-sm font-bold text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-[.82rem] font-bold text-[#1F257A]">{userName}</p>
                          <p className="text-[11px] text-[#1F257A]/50">{userEmail}</p>
                        </div>
                      </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="bg-[#3A41E5]/10" />

                    <DropdownMenuItem
                      onClick={() => router.push("/dashboard/profile")}
                      className="cursor-pointer rounded-lg px-2.5 py-2 text-[.8rem] font-semibold text-[#1F257A] hover:bg-[#3A41E5]/7 hover:text-[#3A41E5] focus:bg-[#3A41E5]/7"
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Profile
                    </DropdownMenuItem>

                    {isLoggedIn && (
                      <>
                        <DropdownMenuSeparator className="bg-[#3A41E5]/10" />
                        <DropdownMenuItem
                          onClick={handleLogoutSuccess}
                          className="cursor-pointer rounded-lg px-2.5 py-2 text-[.8rem] font-semibold text-red-500 hover:bg-red-50 hover:text-red-600 focus:bg-red-50"
                        >
                          <LogOut className="mr-2 h-4 w-4" />
                          Logout
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Mobile hamburger */}
              <div className="lg:hidden">
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                  <SheetTrigger asChild>
                    <button className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#3A41E5]/18 bg-white/70 text-[#1F257A]/70 transition-all hover:bg-[#3A41E5]/7 hover:text-[#3A41E5]">
                      <Menu className="h-5 w-5" />
                    </button>
                  </SheetTrigger>

                  <SheetContent side="right" className="w-[300px] border-[#3A41E5]/20 p-0 bg-[#F7F8FF]">
                    <div className="flex h-full flex-col">

                      {/* Mobile header */}
                      <div className="relative overflow-hidden bg-[#3A41E5] p-5">
                        <div
                          className="pointer-events-none absolute inset-0 opacity-20"
                          style={{
                            backgroundImage: "radial-gradient(circle,#fff 1px,transparent 1px)",
                            backgroundSize: "20px 20px",
                          }}
                        />
                        <div className="relative flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-[6px] bg-white/20">
                            <Calendar className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-bold text-white leading-none">YUDO Scheduler</p>
                            <p className="mt-0.5 text-[11px] text-white/70">Task Management System</p>
                          </div>
                        </div>
                      </div>

                      {/* Mobile user row */}
                      <div className="flex items-center gap-3 border-b border-[#3A41E5]/12 bg-white/60 px-4 py-3">
                        <Avatar className="h-10 w-10 rounded-[8px]">
                          <AvatarImage src={userImage} />
                          <AvatarFallback className="rounded-[8px] bg-[#3A41E5] font-bold text-white">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div className="min-w-0">
                          <p className="truncate text-[.83rem] font-bold text-[#1F257A]">{userName}</p>
                          <p className="truncate text-[11px] text-[#1F257A]/50">{userEmail}</p>
                        </div>
                      </div>

                      {/* Mobile nav items */}
                      <nav className="flex-1 overflow-y-auto p-3">
                        <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-[.1em] text-[#3A41E5]/50">
                          Navigation
                        </p>
                        {MOBILE_ITEMS.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => handleMobileNav(item.id)}
                            className="mb-0.5 flex w-full items-center gap-3 rounded-lg border border-transparent px-3 py-2.5 text-[.83rem] font-semibold text-[#1F257A]/70 transition-all hover:border-[#3A41E5]/15 hover:bg-[#3A41E5]/7 hover:text-[#3A41E5]"
                          >
                            <item.icon className="h-4.5 w-4.5 shrink-0" />
                            {item.label}
                          </button>
                        ))}
                      </nav>

                      {/* Mobile logout */}
                      {isLoggedIn && (
                        <div className="border-t border-[#3A41E5]/12 p-3">
                          <LogoutConfirmation
                            onLogoutConfirmed={handleLogoutSuccess}
                            buttonClassName="flex w-full items-center gap-3 rounded-lg border border-red-100 bg-red-50 px-3 py-2.5 text-[.83rem] font-semibold text-red-500 transition-all hover:border-red-200 hover:bg-red-100"
                            buttonContent={
                              <>
                                <LogOut className="h-4 w-4" />
                                Logout
                              </>
                            }
                          />
                        </div>
                      )}
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-[66px]" />
    </>
  );
};

export default ProfessionalNavbar;