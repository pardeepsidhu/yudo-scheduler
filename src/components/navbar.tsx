'use client'
import React, { useState, useEffect } from "react";
import { Calendar, LayoutDashboard, Clock, Bell, Users, LogOut, 
         PieChart, CheckSquare, Menu, X, Home, Info, 
         User} from "lucide-react";
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
const cn = (...classes) => {
  return classes.filter(Boolean).join(" ");
};

// ListItem component for Navigation Menu
const ListItem = React.forwardRef(({ className, title, children, icon: Icon, description, badge, isActive, onClick }, ref) => {
  return (
    <li className="list-none" onClick={() => onClick && onClick(title)}>
      <NavigationMenuLink asChild>
        <a
          // ref={ref}
          // href="#"
          className={cn(
            "group flex gap-4 items-start rounded-md p-3 transition-colors duration-200",
            "hover:bg-accent focus:bg-accent focus:outline-none",
            isActive && "bg-accent/60",
            className
          )}
        >
          {Icon && (
            <div className="flex-shrink-0">
              <Icon className="h-6 w-6 text-primary group-hover:text-primary/80 transition-colors" />
            </div>
          )}
          <div className="flex-grow space-y-1 min-w-0">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-foreground">{title}</h3>
              {badge && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                  {badge}
                </span>
              )}
            </div>
            {description && (
              <p className="text-xs text-muted-foreground">
                {description}
              </p>
            )}
            <div className="text-sm text-muted-foreground line-clamp-2">
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
  onLogout
}) => {
  // State for mobile menu
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const {activeItem, setActiveItem} = useNavigation();
  const [userName,setUserName]=useState("User");
  const [userEmail,setUserEmail]=useState("user@example.com")
  const [userImage,setUserImage]=useState("")
  const pathName = usePathname();
  const router = useRouter();

  const handleLogoutSuccess = () => {
    localStorage.clear();
    if (onLogout) {
      onLogout();
    } else {
      // Default redirect to login page
      window.location.href = '/login';
    }
  };
  
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
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "timesheet", label: "Timesheet", icon: Calendar },
    { id: "tasks", label: "Tasks", icon: CheckSquare },
    { id: "reminders", label: "Reminders", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "analytics", label: "Analytics", icon: PieChart },
  ];

  // Handle logout
  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      console.log("Logout");
    }
  };

  // Handle dashboard item click
  const handleDashboardItemClick = (title:string) => {
    setActiveItem(title.toLowerCase());
    router.push('/dashboard');
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

  const dashboardItems = [
    {
      title: "Dashboard",
      href: "/dashboard",
      description: "Get a complete overview of your tasks, schedules, and performance.",
      icon: LayoutDashboard,
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

  
  return pathName ==="/dashboard"?<></>:
    <>
      {/* Main Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-teal-100 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 ">
           
            {/* <Logo /> */} 
            <div className="h-10 overflow-hidden cursor-pointer">
             <Image alt="Yudo Scheduler" src={"/logo.png"} className="relative bottom-[44px] right-[10px] cursor-pointer" height={110} width={130} />
             </div>
            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1 w-[75%] justify-end cursor-pointer">

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                      )}
                      onClick={()=>{
                        setActiveItem("home");
                        router.push("/");
                      }}
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
                    <NavigationMenuTrigger className={cn(
                      // activeItem === "dashboard" && "bg-gradient-to-r from-teal-500/10 to-emerald-500/10 text-teal-600"
                    )}>
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      Dashboard
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <ul className="grid gap-4 p-6 w-[500px] sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 bg-white rounded-md shadow-lg">
                        {dashboardItems.map((item) => (
                          <ListItem
                            key={item.title}
                            title={item.title}
                            icon={item.icon}
                            onClick={handleDashboardItemClick}
                          >
                            {item.description}
                          </ListItem>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu> 

              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                      )}
                      onClick={()=>{
                        setActiveItem("profile"); 
                        router.push("/dashboard");
                      }}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      <span>Profile</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Profile</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider delayDuration={0}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={cn(
                        "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                      )}
                      onClick={()=>{
                        setActiveItem("about");
                        router.push("/about");
                      }}
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
              <div className="hidden lg:block"  >
                <DropdownMenu>
                  <DropdownMenuTrigger asChild >
                    <Button variant="ghost" className="p-1" >
                      <Avatar className="h-8 w-8 border-2 border-teal-100">
                        <AvatarImage src={userImage} alt={userName} />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-500 text-white">
                          {userName?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col">
                        <p>{userName}</p>
                        <p className="text-xs text-gray-500">{userEmail}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="cursor-pointer"
                      onClick={() =>{ 
                        setActiveItem("profile"); 
                        router.push("/dashboard");
                      }}
                    >
                      <Users className="h-4 w-4 mr-2 ml-2" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="cursor-pointer text-rose-600 hover:text-rose-700"
                    >
                      
                 { userEmail !=="user@example.com" &&     <MobileLogoutButton />}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              
              {/* Mobile Menu Button */}
              <div className="lg:hidden">
                <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-gray-600">
                      <Menu  className="h-8 w-8" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[280px] p-0">
                    <div className="flex flex-col h-full">
                      <div className="flex items-center justify-between p-4 pl-2 border-b border-teal-100 overflow-hidden h-15">
                      <div className="h-10 overflow-hidden">
             <Image alt="Yudo Scheduler" src={"/logo.png"}  className="relative bottom-[44px] right-[10px] cursor-pointer" height={110} width={130} />
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
                        {menuItems.map((item) => (
                          <Button
                            key={item.id}
                            variant="ghost"
                            size="default"
                            className={cn(
                              "w-full justify-start mb-2 relative",
                             
                                "text-gray-600 hover:text-teal-600 hover:bg-teal-50"
                            )}
                            onClick={() => {
                              setActiveItem(item.id);
                              
                              // Add routing behavior similar to desktop
                              if (item.id === "home") {
                                router.push("/");
                              } else if (item.id === "profile") {
                                router.push("/dashboard");
                              } else if (item.id === "about") {
                                router.push("/about");
                              } else if (["dashboard", "timesheet", "tasks", "reminders", "notifications", "analytics"].includes(item.id)) {
                                router.push("/dashboard");
                              }
                              
                              setMobileMenuOpen(false);
                            }}
                          >
                            <item.icon className="h-5 w-5 mr-3" />
                            <span>{item.label}</span>
                            {/* {activeItem === item.id && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-500 to-emerald-500 rounded-r-md" />
                            )} */}
                          </Button>
                        ))}
                      </nav>
                      
                      <div className="p-4 border-t border-teal-100">
                      { userEmail !=="user@example.com" &&     <MobileLogoutButton />}
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
      <div className="h-16"></div>
    </>
  
};

export default ProfessionalNavbar;