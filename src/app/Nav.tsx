// components/Navbar.tsx
'use client'
import { useState, useEffect, ReactNode } from 'react';
import Link from 'next/link';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils'; // Make sure you have this utility function

// Dashboard submenu items type
interface DashboardItem {
  title: string;
  href: string;
  description: string;
  icon?: ReactNode;
}

// Dashboard items data
const dashboardItems: DashboardItem[] = [
  {
    title: 'Overview',
    href: '/dashboard',
    description: 'View a summary of all your activities and statistics.',
  },
  {
    title: 'Schedule',
    href: '/dashboard/schedule',
    description: 'Manage your appointments and upcoming events.',
  },
  {
    title: 'Tasks',
    href: '/dashboard/tasks',
    description: 'Track your to-do items and ongoing projects.',
  },
  {
    title: 'Notifications',
    href: '/dashboard/notifications',
    description: 'View all your important alerts and updates.',
  },
  {
    title: 'Analytics',
    href: '/dashboard/analytics',
    description: 'Access detailed insights and performance metrics.',
  },
  {
    title: 'Reminders',
    href: '/dashboard/reminders',
    description: 'Set up and manage your reminders and alerts.',
  },
  {
    title: 'Settings',
    href: '/dashboard/settings',
    description: 'Configure your dashboard preferences.',
  },
];

// Type for navigation items
interface NavItem {
  title: string;
  href: string;
  isDropdown?: boolean;
  dropdownItems?: DashboardItem[];
}

// Navigation items
const navItems: NavItem[] = [
  { title: 'Home', href: '/' },
  { title: 'About', href: '/about' },
  { title: 'Report', href: '/report' },
  { 
    title: 'Dashboard', 
    href: '/dashboard',
    isDropdown: true,
    dropdownItems: dashboardItems
  },
  { title: 'Contact', href: '/contact' },
];

// Props interface for ListItem component
interface ListItemProps {
  className?: string;
  title: string;
  href: string;
  children?: React.ReactNode;
}

// Component for dropdown list items
const ListItem = ({ className, title, children, href }: ListItemProps) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          href={href}
          className={cn(
            "block select-none space-y-1 rounded-lg p-3 leading-none no-underline outline-none transition-colors hover:bg-slate-100 hover:text-blue-600 focus:bg-slate-100 focus:text-blue-600",
            className
          )}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-slate-500">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  );
};

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-sm",
        isScrolled 
          ? "bg-white/95 shadow-md" 
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
              YourLogo
            </span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <NavigationMenu>
              <NavigationMenuList>
                {navItems.map((item) => (
                  <NavigationMenuItem key={item.title}>
                    {item.isDropdown ? (
                      <>
                        <NavigationMenuTrigger className="text-sm font-medium">
                          {item.title}
                        </NavigationMenuTrigger>
                        <NavigationMenuContent>
                          <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <ListItem
                                key={dropdownItem.title}
                                title={dropdownItem.title}
                                href={dropdownItem.href}
                              >
                                {dropdownItem.description}
                              </ListItem>
                            ))}
                          </ul>
                        </NavigationMenuContent>
                      </>
                    ) : (
                      <Link href={item.href} legacyBehavior passHref>
                        <NavigationMenuLink className={cn(
                          navigationMenuTriggerStyle(),
                          "text-sm font-medium"
                        )}>
                          {item.title}
                        </NavigationMenuLink>
                      </Link>
                    )}
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
            
            <div className="flex items-center space-x-3 ml-4">
              <Button 
                variant="outline" 
                size="sm"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                Login
              </Button>
              <Button 
                size="sm"
                className="bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                Sign Up
              </Button>
            </div>
          </nav>
          
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full max-w-xs p-0">
              <div className="p-6">
                <Link href="/" className="flex items-center space-x-2 mb-8">
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">
                    YourLogo
                  </span>
                </Link>
                <nav className="flex flex-col gap-1">
                  {navItems.map((item) => (
                    <div key={item.title} className="py-1">
                      {item.isDropdown ? (
                        <details className="group">
                          <summary className="flex cursor-pointer items-center justify-between rounded-md py-2 px-3 font-medium hover:bg-slate-100 hover:text-blue-600 transition-colors">
                            {item.title}
                            <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                          </summary>
                          <div className="ml-4 mt-1 space-y-1">
                            {item.dropdownItems?.map((dropdownItem) => (
                              <Link
                                key={dropdownItem.title}
                                href={dropdownItem.href}
                                className="block rounded-md py-2 px-3 text-sm hover:bg-slate-100 hover:text-blue-600 transition-colors"
                                onClick={() => setIsMobileMenuOpen(false)}
                              >
                                {dropdownItem.title}
                              </Link>
                            ))}
                          </div>
                        </details>
                      ) : (
                        <Link 
                          href={item.href}
                          className="block rounded-md py-2 px-3 font-medium hover:bg-slate-100 hover:text-blue-600 transition-colors"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
                
                <div className="pt-6 mt-6 border-t border-slate-200 space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full border-blue-600 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                  >
                    Login
                  </Button>
                  <Button className="w-full bg-blue-600 text-white hover:bg-blue-700">
                    Sign Up
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Navbar;