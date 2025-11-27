'use client'
import React, { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Clock, Bell, Users, LogOut, 
         PieChart, CheckSquare, Menu, X, Home, Info, 
         User,
         LogIn,
         Users2} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } 
         from "@/components/ui/tooltip";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NavigationMenu, NavigationMenuContent, NavigationMenuItem, NavigationMenuList, NavigationMenuTrigger } from "./ui/navigation-menu";
import { NavigationMenuLink } from "@radix-ui/react-navigation-menu";
import { useNavigation } from "@/app/context/ActiveItemContext";
import { usePathname, useRouter } from "next/navigation";
import { fetchUser } from "@/app/api/userApi";
import LogoutConfirmation from "./logout";
import Image from "next/image";


// Utility function for class names
const cn = (...classes:[string]) => {
  return classes.filter(Boolean).join(" ");
};

// ListItem component for Navigation Menu
const ListItem = React.forwardRef(({ className, title, children, icon: Icon, description, badge, isActive, onClick }, ref) => {
  return (
    <li className="list-none" onClick={() => onClick && onClick(title)}>
      <NavigationMenuLink asChild>
        <a
          className={cn(
            "group flex gap-4 items-start rounded-sm p-4 transition-all duration-200",
            "hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 hover:border-blue-200",
            "border border-transparent",
            isActive && "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200",
            className
          )}
        >
          {Icon && (
            <div className="flex-shrink-0 mt-0.5">
              <div className="h-10 w-10 rounded-sm bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
                <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
            </div>
          )}
          <div className="flex-grow space-y-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{title}</h3>
              {badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-xs font-medium bg-blue-100 text-blue-800">
                  {badge}
                </span>
              )}
            </div>
            <div className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {children}
            </div>
          </div>
        </a>
      </NavigationMenuLink>
    </li>
  );
});

// Set display name for React DevTools
ListItem.displayName = "ListItem";

const ProfessionalNavbar = ({ 

}) => {
  // State for mobile menu
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName,setUserName]=useState("User");
  const [userEmail,setUserEmail]=useState("user@example.com")
  const [userImage,setUserImage]=useState("")
  const pathName = usePathname();
  const router = useRouter();

  const handleLogoutSuccess = () => {
    localStorage.clear();
      window.location.href = '/login';
  };
  
  const MobileLogoutButton = () => (
    <LogoutConfirmation 
      onLogoutConfirmed={handleLogoutSuccess}
      buttonClassName="w-full justify-start text-slate-700 hover:text-red-600 hover:bg-red-50 rounded-sm font-medium"
      buttonContent={
        <>
          <LogOut className="h-5 w-5 mr-3" />
          <span>Logout</span>
        </>
      }
    />
  );
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchUser();
        if (!result.error) {
          setUserEmail(result.email)
          setUserImage(result?.profile)
          setUserName(result?.name)
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
    fetchData();
  }, []);
  
  // Menu items
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "profile", label: "Profile", icon: Users },
    { id: "about", label: "About", icon: Info },
    { id: "timesheet", label: "Timesheet", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "reminders", label: "Reminders", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: PieChart },
  ];

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

  const dashboardItems = [
    {
      title: "Profile",
      href: "/dashboard/profile",
      description: "Get user profile, linked accounts",
      icon: Users2,
    },
    {
      title: "Tasks",
      href: "/dashboard/tasks",
      description: "Organize, create, and monitor your daily tasks efficiently.",
      icon: CheckSquare,
    },
    {
      title: "Reminders",
      href: "/dashboard/reminders",
      description: "Set and manage timely reminders for all your critical deadlines.",
      icon: Clock,
    },
    {
      title: "Notifications",
      href: "/dashboard/notifications",
      description: "Keep track of important updates and system alerts in real-time.",
      icon: Bell,
    },
    {
      title: "Analytics",
      href: "/dashboard/analytics",
      description: "Gain insight into productivity trends with visual analytics.",
      icon: PieChart,
    },
    {
      title: "Timesheet",
      href: "/dashboard/timesheet",
      description: "Track hours worked and generate accurate time reports effortlessly.",
      icon: Calendar,
    },
  ];

  if (pathName !== "/" && pathName !== "/about") {
    return<></>
  }

  return <>
      {/* Main Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-slate-200 shadow-lg backdrop-blur-sm bg-white/95">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
           
            <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => router.push("/")}>
              <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-sm flex items-center justify-center shadow-md">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-slate-900 text-lg leading-none">YUDO Scheduler</h1>
                <p className="text-xs text-slate-500 leading-none mt-0.5">Task Management</p>
              </div>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-2">

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-sm font-medium transition-all"
                      onClick={() => router.push("/")}
                    >
                      <Home className="h-4 w-4 mr-2" />
                      <span>Home</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Home</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-sm font-medium">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-3 p-4 w-[600px] grid-cols-2 bg-white rounded-sm shadow-xl border border-slate-200">
                        {dashboardItems.map((item) => (
                          <ListItem
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                            onClick={() => router.push(item?.href)}
                          >
                            {item.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu> 

              {userEmail === "user@example.com" ? (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-sm font-medium transition-all"
                        onClick={() => router.push("/login")}
                      >
                        <Users2 className="h-4 w-4 mr-2" />
                        <span>Login</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Login</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-sm font-medium transition-all"
                        onClick={() => router.push("/profile")}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        <span>Profile</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Profile</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
              
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-sm font-medium transition-all"
                      onClick={() => router.push("/about")}
                    >
                      <Info className="h-4 w-4 mr-2" />
                      <span>About</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>About</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </nav>
            
            {/* User Profile & Mobile Menu Toggle */}
            <div className="flex items-center gap-3">
              {/* Desktop User Menu */}
              <div className="hidden lg:block">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="p-1 rounded-sm hover:bg-slate-50">
                      <Avatar className="h-9 w-9 border-2 border-slate-200 shadow-sm">
                        <AvatarImage src={userImage} alt={userName} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                          {userName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-sm border-slate-200 shadow-lg">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <p className="font-semibold text-slate-900">{userName}</p>
                        <p className="text-xs text-slate-500 font-normal">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-slate-200" />
                    <DropdownMenuItem 
                      className="cursor-pointer rounded-sm hover:bg-slate-50 font-medium"
                      onClick={() => router.push("/profile")}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    {userEmail !== "user@example.com" && (
                      <DropdownMenuItem 
                        className="cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 rounded-sm font-medium"
                        onClick={handleLogoutSuccess}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-slate-700 hover:bg-slate-50 rounded-sm">
                      <Menu className="h-6 w-6" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] p-0 border-slate-200">
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
                      
                      {/* User Profile */}
                      <div className="flex items-center p-4 border-b border-slate-200 bg-slate-50">
                        <Avatar className="h-11 w-11 border-2 border-slate-200 shadow-sm">
                          <AvatarImage src={userImage} alt={userName} />
                          <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-semibold">
                            {userName?.charAt(0).toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="ml-3 overflow-hidden">
                          <p className="font-semibold text-slate-900 truncate">{userName}</p>
                          <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                        </div>
                      </div>
                      
                      {/* Navigation */}
                      <nav className="flex-1 overflow-y-auto p-4">
                        {menuItems.map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            size="default"
                            className="w-full justify-start mb-1 text-slate-700 hover:text-blue-600 hover:bg-slate-50 rounded-sm font-medium transition-all"
                            onClick={() => {
                              if (item.id === "home") {
                                router.push("/");
                              } else if (item.id === "profile") {
                                router.push("/dashboard/profile");
                              } else if (item.id === "about") {
                                router.push("/about");
                              } else if (["dashboard", "timesheet", "tasks", "reminders", "notifications", "analytics"].includes(item.id)) {
                                router.push("/dashboard/" + item?.id);
                              }
                              setMobileMenuOpen(false);
                            }}
                          >
                            <item.icon className="h-5 w-5 mr-3" />
                            <span>{item.label}</span>
                          </Button>
                        ))}
                      </nav>
                      
                      {/* Logout */}
                      <div className="p-4 border-t border-slate-200 bg-white">
                        {userEmail !== "user@example.com" && <MobileLogoutButton />}
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Spacer for fixed navbar */}
      {/* <div className="h-16"></div> */}
    </>
};

export default ProfessionalNavbar;