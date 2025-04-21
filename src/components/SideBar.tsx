'use client'
import React, { useState } from "react";
import { Calendar, LayoutDashboard, Clock, Bell, Settings, Users, ChevronRight, ChevronLeft, LogOut, PieChart, CheckSquare, PanelLeftOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// In case you don't have the cn utility function defined elsewhere
const cn = (...classes: string[]) => {
  return classes.filter(Boolean).join(" ");
};

// Add proper TypeScript interfaces
interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

interface SidebarProps {
  userName?: string;
  userEmail?: string;
  userImage?: string;
  onLogout?: () => void;
  activeItem:string;
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
  onClick 
}) => {
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size={collapsed ? "icon" : "default"}
            className={cn(
              "w-full justify-start mb-1 relative",
              active ? "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-600 hover:from-teal-500/20 hover:to-emerald-500/20" : 
              "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
            )}
            onClick={onClick}
          >
            <Icon className={cn("h-5 w-5 ml-2", collapsed ? "" : "mr-2")} />
            {!collapsed && <span>{label}</span>}
            {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-md" />}
          </Button>
        </TooltipTrigger>
        {collapsed && <TooltipContent side="right">{label}</TooltipContent>}
      </Tooltip>
    </TooltipProvider>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ 
  userName = "User", 
  userEmail = "user@example.com", 
  userImage = "",
  onLogout,
  activeItem,
  setActiveItem
}) => {
  // Use state with proper typing
  const [collapsed, setCollapsed] = useState<boolean>(true);


  // Handle logout with proper fallback
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("Logout");
    }
  };

  const menuItems: MenuItem[] = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "timesheet", label: "Timesheet", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "reminders", label: "Reminders", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: PieChart },
    { id: "profile", label: "Profile", icon: Users },

  ];

  return (
    <div 
      className={cn(
        "absolute z-200 md:static h-screen   flex flex-col transition-all duration-300 ",
        collapsed ? "w-20 border-none md:border-r  md:bg-white md:border-teal-100 md:shadow-sm" : "w-64 bg-white border-teal-100 border-r shadow-sm" ,


      )}
    >
      {/* Logo and Collapse Button */}
      <div className={cn(
        "flex items-center border-b border-teal-100",
        collapsed ? "justify-center p-2 pr-0" : "justify-between p-4"
      )}>
        {!collapsed ? (
          <div className="flex items-center  ">
            <div className="h-8 w-8 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-md flex items-center justify-center shadow-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="ml-2 font-bold text-gray-800">
              YUDO <span className="text-teal-600">Scheduler</span>
            </span>
          </div>
        ) : (
          <div className="hidden md:static h-8 w-8 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-md flex items-center justify-center shadow-sm ">
            <Calendar className="h-5 w-5 text-white" />
          </div>
        )}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "text-gray-500 bg-teal-50",
            collapsed ? "ml-0" : ""
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeftOpen size={30} /> : <ChevronLeft size={30} />}
        </Button>
      </div>

      {/* User Profile */}
      <div className={cn(
        "flex items-center border-b border-teal-100 p-4",
        collapsed ? "justify-center" : "",
        collapsed ? "hidden md:flex":""
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
      <div className={`flex-1 overflow-y-auto p-3  ${collapsed ? "hidden md:flex":""}`}>
        <nav className="space-y-1">
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
        </nav>
      </div>

      {/* Logout Button */}
      <div className={`p-3 border-t border-teal-100 ${collapsed ? "hidden md:flex":""}`}>
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size={collapsed ? "icon" : "default"}
                className={cn(
                  "w-full justify-start text-gray-600 hover:text-rose-600 hover:bg-rose-50",
                )}
                onClick={handleLogout}
              >
                <LogOut className={cn("h-5 w-5", collapsed ? "" : "mr-2")} />
                {!collapsed && <span>Logout</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Logout</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default Sidebar;