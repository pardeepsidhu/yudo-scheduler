'use client'
import React, { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Clock, Bell, Users, ChevronRight, ChevronLeft, LogOut, PieChart, CheckSquare, Menu, Home, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import LogoutConfirmation from './logout';
import { useRouter } from "next/navigation";
import Image from "next/image";

// Utility function for class names
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// TypeScript interfaces
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
  isMobile?: boolean;
}

interface ResponsiveNavProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onLogout?: () => void;
  activeItem: string;
  setActiveItem: React.Dispatch<React.SetStateAction<string>>;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ElementType;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ 
  icon: Icon, 
  label, 
  active = false, 
  collapsed = false, 
  onClick,
  isMobile = false
}) => {
  if (isMobile) {
    return (
      <button
        className={cn(
          "w-full flex items-center px-4 py-3 mb-1 relative rounded-sm transition-all duration-200 font-medium text-sm",
          active 
            ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
            : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5 mr-3 flex-shrink-0" strokeWidth={active ? 2.5 : 2} />
        <span>{label}</span>
        {active && (
          <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
        )}
      </button>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "w-full flex items-center transition-all duration-200 font-medium text-sm rounded-sm relative group",
              collapsed ? "justify-center p-3" : "px-4 py-3",
              active 
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md" 
                : "text-slate-700 hover:bg-slate-100 hover:text-blue-600"
            )}
            onClick={onClick}
          >
            <Icon className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} strokeWidth={active ? 2.5 : 2} />
            {!collapsed && <span className="truncate">{label}</span>}
            {active && !collapsed && (
              <div className="absolute right-3 w-1.5 h-1.5 bg-white rounded-full"></div>
            )}
            {active && collapsed && (
              <div className="absolute right-1 w-1 h-1 bg-white rounded-full"></div>
            )}
          </button>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right" className="font-medium">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

const ResponsiveNav: React.FC<ResponsiveNavProps> = ({ 
  userName , 
  userEmail ,
  userImage ,
  onLogout,
  activeItem,
}) => {
  // State management
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter()

  // Menu items
  const menuItems: MenuItem[] = [
    { id: "timesheet", label: "Timesheet", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "reminders", label: "Reminders", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "profile", label: "Profile", icon: Users },
  ];

  // Handle logout success
  const handleLogoutSuccess = () => {
    localStorage.clear();
    if (onLogout) {
      onLogout();
    } else {
      window.location.href = '/login';
    }
  };

  // Check for mobile screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Custom logout button for mobile
  const MobileLogoutButton = () => (
    <LogoutConfirmation 
      onLogoutConfirmed={handleLogoutSuccess}
      buttonClassName="w-full flex items-center px-4 py-3 rounded-sm text-slate-700 hover:bg-red-50 hover:text-red-600 transition-all font-medium text-sm"
      buttonContent={
        <>
          <LogOut className="h-5 w-5 mr-3 flex-shrink-0" strokeWidth={2} />
          <span>Logout</span>
        </>
      }
    />
  );

  // Custom logout button for desktop
  const DesktopLogoutButton = () => (
    <LogoutConfirmation 
      onLogoutConfirmed={handleLogoutSuccess}
      buttonClassName={cn(
        "w-full flex items-start transition-all duration-200 font-medium text-sm rounded-sm text-slate-700 hover:bg-red-50 hover:text-red-600",
        collapsed ? "justify-center p-3" : "px-4 py-3"
      )}
      buttonContent={
        <>
          <LogOut className={cn("h-5 w-5 flex-shrink-0", !collapsed && "mr-3")} strokeWidth={2} />
          {!collapsed && <span className="truncate">Logout</span>}
        </>
      }
      tooltipContent={collapsed ? "Logout" : undefined}
    />
  );

  // Mobile navbar component
  const MobileNavbar = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg">
      <div className="flex items-center justify-between px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-sm flex items-center justify-center shadow-md">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-slate-900 text-base leading-none">YUDO Scheduler</h1>
            <p className="text-xs text-slate-500 leading-none mt-0.5">Task Management</p>
          </div>
        </div>
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="p-2 text-slate-700 hover:bg-slate-100 rounded-sm transition-colors">
              <Menu className="h-6 w-6" strokeWidth={2} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] p-0 border-slate-200">
            <div className="flex flex-col h-full bg-white">
              {/* Header */}
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center shadow-md">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg leading-none">YUDO Scheduler</h2>
                    <p className="text-blue-100 text-sm leading-none mt-1">Task Management System</p>
                  </div>
                </div>
              </div>
              
              {/* Navigation */}
              <nav className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
                <div className="space-y-1">
                  <SidebarItem
                    key={"home"}
                    icon={Home}
                    label={"Home"}
                    active={activeItem === "home"}
                    isMobile={true}
                    onClick={() => {
                      router.push("/");
                      setMobileMenuOpen(false);
                    }}
                  />

                  <div className="h-px bg-slate-200 my-3"></div>

                  {menuItems.map((item) => (
                    <SidebarItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeItem === item.id}
                      isMobile={true}
                      onClick={() => {
                        router.push(`/dashboard/${item.id}`)
                        setMobileMenuOpen(false);
                      }}
                    />
                  ))}

                  <div className="h-px bg-slate-200 my-3"></div>

                  <SidebarItem
                    key={"about"}
                    isMobile={true}
                    icon={Info}
                    label={"About"}
                    active={activeItem === "about"}
                    onClick={() => {
                      router.push("/about");
                      setMobileMenuOpen(false);
                    }}
                  />
                </div>
              </nav>
              
              {/* Logout */}
              <div className="p-4 w-[fit-content] border-t border-slate-200 bg-white">
                <MobileLogoutButton />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );

  // Desktop sidebar component
  const DesktopSidebar = () => (
    <div 
      className={cn(
        "hidden lg:flex h-screen flex-col transition-all duration-300 ease-in-out border-r border-slate-200 shadow-xl bg-white ",
        collapsed ? "w-[80px]" : "min-w-[280px]"
      )}
    >
      {/* Logo Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg relative">
        <div className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "justify-center p-4" : "justify-between px-6 py-5"
        )}>
          {!collapsed ? (
            <>
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center shadow-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-white text-base leading-none">YUDO Scheduler</h2>
                <p className="text-blue-100 text-xs leading-none mt-1">Task Management</p>
              </div>
            </div>
            <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "text-white hover:bg-white/20 rounded-sm transition-all p-2"
            )}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={18} strokeWidth={2.5} />}
          </button>
          </>
          ) : (
            <>
            <div className="relative">
  <div className="h-8 w-8 bg-white/20 backdrop-blur-sm rounded-sm flex items-center justify-center shadow-lg">
    <Calendar className="h-6 w-6 text-white" />
  </div>

  <button
    onClick={() => setCollapsed(!collapsed)}
    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
    className={cn(
      " rounded-sm transition-all p-0",
      "absolute top-1/2 -translate-y-1/2",         // vertically centered
      collapsed
        ? "right-[-28px] h-8 w-8  text-white  flex items-center justify-center rounded-full"
        : "right-0"                                // normal state
    )}
  >
    {collapsed ? (
      <ChevronRight size={18} strokeWidth={2.5} />
    ) : (
      <ChevronLeft size={18} strokeWidth={2.5} />
    )}
  </button>
</div>

          </>
          )}
          
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto bg-gradient-to-b from-slate-50 to-white">
        <nav className={cn("space-y-1 transition-all duration-300", collapsed ? "p-3" : "p-4")}>
          <SidebarItem
            key={"home"}
            icon={Home}
            label={"Home"}
            active={activeItem === "home"}
            collapsed={collapsed}
            onClick={() => router.push("/")}
          />

          <div className={cn("bg-slate-200 my-3 transition-all", collapsed ? "h-px" : "h-px")}></div>

          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.id}
              collapsed={collapsed}
              onClick={() => router.push(`/dashboard/${item.id}`)}
            />
          ))}

          <div className={cn("bg-slate-200 my-3 transition-all", collapsed ? "h-px" : "h-px")}></div>

          <SidebarItem
            key={"about"}
            icon={Info}
            label={"About"}
            active={activeItem === "about"}
            collapsed={collapsed}
            onClick={() => router.push("/about")}
          />
        </nav>
      </div>

      {/* Logout Button */}
      <div className={cn("border-t border-slate-200 bg-white w-[fit-content] flex justify-start shadow-inner transition-all duration-300", collapsed ? "p-3" : "p-4")}>
        <TooltipProvider delayDuration={0}>
          <DesktopLogoutButton />
        </TooltipProvider>
      </div>

      {/* Bottom Accent */}
      <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
    </div>
  );

  return (
    <>
     
      {isMobile ? <MobileNavbar /> : <DesktopSidebar />}
      
      {/* Spacer for content - IMPORTANT for layout */}
       {/* <div className={cn("hidden lg:block transition-all duration-300", collapsed ? "w-[80px]" : "w-[280px]")}></div> */}
     
    </>
  );
};

export default ResponsiveNav;