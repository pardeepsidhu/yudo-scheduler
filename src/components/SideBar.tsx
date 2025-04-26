'use client'
import React, { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Clock, Bell, Users, ChevronRight, ChevronLeft, LogOut, PieChart, CheckSquare, Menu, X, Home, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
      <Button
        variant="ghost"
        size="default"
        className={cn(
          "w-full justify-start mb-2 relative",
          active ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-600" : 
          "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
        )}
        onClick={onClick}
      >
        <Icon className="h-5 w-5 mr-3 " />
        <span>{label}</span>
        {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-md" />}
      </Button>
    );
  }

  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn(
              "w-full justify-start mb-1 relative",
              active ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-600 hover:from-teal-500/20 hover:to-emerald-500/20 pl-1" : 
              "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
            )}
            onClick={onClick}
          >
            <Icon className={cn("h-5 w-5", collapsed ? "" : "mr-3 ")} />
            {!collapsed && <span>{label}</span>}
            {active && <div className="absolute -left-1 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-md" />}
          </Button>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

const Logo = ({ collapsed = false }) => (
  <div className="flex items-center">
    <div className="h-8 w-8 bg-[#5F61C4] rounded-md flex items-center justify-center shadow-sm">
      <Calendar className="h-5 w-5 text-white" />
    </div>
    {!collapsed && (
      <span className="ml-2 font-bold text-gray-800">
        YUDO <span className="text-teal-600">Scheduler</span>
      </span>
    )}
  </div>
);

const ResponsiveNav: React.FC<ResponsiveNavProps> = ({ 
  userName, 
  userEmail ,
  userImage ,
  onLogout,
  activeItem,
  setActiveItem
}) => {
  // State management
  const [collapsed, setCollapsed] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const router = useRouter()

  // Menu items
  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
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
      // Default redirect to login page
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
      buttonClassName="w-full justify-start text-gray-600 hover:text-rose-600 hover:bg-rose-50"
      buttonContent={
        <>
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </>
      }
    />
  );

  // Custom logout button for desktop (considering collapsed state)
  const DesktopLogoutButton = () => (
    <LogoutConfirmation 
      onLogoutConfirmed={handleLogoutSuccess}
      buttonClassName={cn(
        "w-full justify-start text-gray-600 hover:text-rose-600 hover:bg-rose-50",
        collapsed ? "flex items-center justify-center" : ""
      )}
      buttonContent={
        <>
          <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
          {!collapsed && <span>Logout</span>}
        </>
      }
      tooltipContent={collapsed ? "Logout" : undefined}
    />
  );

  // Mobile navbar component
  const MobileNavbar = () => (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-teal-100 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3">
      <div className="h-9 overflow-hidden ">
             <Image alt="Yudo Scheduler" src={"/logo.png"} className="relative bottom-[36px]" height={110} width={110} />
             </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 border-2 border-teal-100">
            <AvatarImage src={userImage} alt={userName} />
            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
              {userName?.charAt(0).toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
          
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-gray-600">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[260px] p-0">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between p-4 border-b border-teal-100">
                <div className="h-10 overflow-hidden">
             <Image alt="Yudo Scheduler" src={"/logo.png"} className="relative bottom-[44px] right-[10px]" height={110} width={130} />
             </div>
                  {/* <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-5 w-5 text-gray-600" />
                  </Button> */}
                </div>
                
                <div className="flex items-center p-4 border-b border-teal-100">
                  <Avatar className="h-10 w-10 border-2 border-teal-100">
                    <AvatarImage src={userImage} alt={userName} />
                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                      {userName?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-3 overflow-hidden">
                    <p className="font-medium text-gray-800 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{userEmail}</p>
                  </div>
                </div>
                
                <nav className="flex-1 overflow-y-auto p-4">
              <SidebarItem
              key={"home"}
              icon={Home}
              label={"Home"}
              active={false}
              isMobile={true}
              collapsed={collapsed}
              onClick={() =>router.push("/")}
            />

                  {menuItems.map((item) => (
                    <SidebarItem
                      key={item.id}
                      icon={item.icon}
                      label={item.label}
                      active={activeItem === item.id}
                      isMobile={true}
                      onClick={() => {
                        setActiveItem(item.id);
                        setMobileMenuOpen(false);
                      }}
                    />
                  ))}

            <SidebarItem
              key={"about"}
              isMobile={true}
              icon={Info}
              label={"About"}
              active={false}
              collapsed={collapsed}
              onClick={() =>router.push("/about")}
            />
                </nav>
                
                <div className="p-4 border-t border-teal-100">
                  <MobileLogoutButton />
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );

  // Desktop sidebar component
  const DesktopSidebar = () => (
    <div 
      className={cn(
        "hidden lg:flex h-screen flex-col transition-all duration-300 border-r border-teal-100 shadow-sm",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo and Collapse Button */}
      <div className={cn(
        "flex items-center border-b border-teal-100",
        collapsed ? "justify-center p-4" : "justify-between p-4"
      )}>
        {!collapsed ? (
          <div className="h-10 overflow-hidden">
             <Image alt="Yudo Scheduler" src={"/logo.png"} className="relative bottom-[44px] right-[10px]" height={110} width={130} />
             </div>
        ) : (
          <Logo collapsed={true} />
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:bg-teal-50"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      {/* User Profile */}
      <div className={cn(
        "flex items-center border-b border-teal-100 p-4",
        collapsed ? "justify-center" : ""
      )}>
        <Avatar className="h-9 w-9 border-2 border-teal-100">
          <AvatarImage src={userImage} alt={userName} />
          <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
            {userName?.charAt(0).toUpperCase() || "U"}
          </AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-800 truncate">{userName}</p>
            <p className="text-xs text-gray-500 truncate">{userEmail}</p>
          </div>
        )}
      </div>

      {/* Navigation Menu */}
      <div className="flex-1 overflow-y-auto p-3">
        <nav className="space-y-1 ">
                 
            <SidebarItem
              key={"home"}
              icon={Home}
              label={"Home"}
              active={false}
              collapsed={collapsed}
              onClick={() =>router.push("/")}
            />

    

          {menuItems.map((item) => (
            <SidebarItem
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={activeItem === item.id}
              collapsed={collapsed}
              onClick={() => setActiveItem(item.id)}
            />
          ))}

            <SidebarItem
              key={"about"}
              icon={Info}
              label={"About"}
              active={false}
              collapsed={collapsed}
              onClick={() =>router.push("/about")}
            />
        </nav>
      </div>

      {/* Logout Button */}
      <div className="p-3 border-t border-teal-100">
        <TooltipProvider delayDuration={0}>
          <DesktopLogoutButton />
        </TooltipProvider>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? <MobileNavbar /> : <DesktopSidebar />}
      
      {/* Add padding to main content area when mobile navbar is present */}
      {isMobile && <div className="h-14"></div>}
    </>
  );
};

export default ResponsiveNav;