"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Info,
  Menu,
  LogOut,
  Calendar,
  PlusCircle
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

interface NavProps {
  user: boolean;
  setUser: (value: boolean) => void;
}

const pages = [
  { name: "Home", href: "/", icon: Home },
  { name: "All Reminders", href: "/allreminder", icon: Calendar },
  { name: "Add Reminder", href: "/inbox", icon: PlusCircle },
  { name: "About", href: "/about", icon: Info },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [openDialog, setOpenDialog] = useState(false);

  const handlePageChange = (page: string) => {
    if (page === "All Reminders") {
      router.push("/allreminder");
    } else if (page === "Home") {
      router.push("/");
    } else if (page === "Add Reminder") {
      router.push("/inbox");
    } else if (page === "About") {
      router.push("/about");
    } else if (page === "Logout") {
      if (user) {
        setOpenDialog(true);
      } else {
        router.push("/login");
      }
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(false);
    router.push("/");
    setOpenDialog(false);
  };

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 bg-[#133354] shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center space-x-2 group">
                <div className="bg-[#F5F7FA]/10 backdrop-blur-sm p-2 rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:bg-[#F5F7FA]/20 flex items-center space-x-2 max-w-[200px] sm:max-w-none">
                  <div className="relative w-8 h-8 overflow-hidden rounded-lg shrink-0">
                    <Image
                      src="/logo.png"
                      alt="Yudo-Reminder Logo"
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-[#F5F7FA] tracking-tight truncate">Yudo-Reminder</span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {pages.map((page) => {
                const Icon = page.icon;
                const isActive = pathname === page.href;
                
                return (
                  <Button
                    key={page.name}
                    variant="ghost"
                    onClick={() => handlePageChange(page.name)}
                    className={cn(
                      "group flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300",
                      "hover:shadow-lg hover:-translate-y-0.5 hover:bg-[#F5F7FA]/10",
                      isActive
                        ? "bg-[#F5F7FA]/20 text-[#F5F7FA] shadow-md"
                        : "text-[#F5F7FA]/90 hover:text-[#F5F7FA]"
                    )}
                  >
                    <Icon className={cn(
                      "h-5 w-5 transition-all duration-300",
                      isActive 
                        ? "text-[#F5F7FA]" 
                        : "text-[#F5F7FA]/80 group-hover:text-[#F5F7FA] group-hover:scale-110"
                    )} />
                    <span className="relative">
                      {page.name}
                      <span className={cn(
                        "absolute -bottom-1 left-0 w-0 h-0.5 bg-[#27C5FA] transition-all duration-300",
                        isActive ? "w-full" : "group-hover:w-full"
                      )} />
                    </span>
                  </Button>
                );
              })}
              <Button
                variant="ghost"
                onClick={() => handlePageChange("Logout")}
                className="text-[#F5F7FA]/90 hover:text-[#F5F7FA] hover:bg-[#F5F7FA]/10 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
              >
                <LogOut className="h-5 w-5 mr-2" />
                {user ? "Logout" : "Login"}
              </Button>
            </div>

            {/* Mobile Menu */}
            <div className="flex items-center">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden text-[#F5F7FA] hover:bg-[#F5F7FA]/10">
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-[#133354] border-none">
                  <div className="flex flex-col space-y-4 mt-4">
                    {pages.map((page) => {
                      const Icon = page.icon;
                      const isActive = pathname === page.href;
                      return (
                        <Button
                          key={page.name}
                          variant="ghost"
                          onClick={() => handlePageChange(page.name)}
                          className={cn(
                            "flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium w-full justify-start",
                            "text-[#F5F7FA]/90 hover:text-[#F5F7FA] hover:bg-[#F5F7FA]/10 transition-all duration-300",
                            isActive
                              ? "bg-[#F5F7FA]/20 text-[#F5F7FA]"
                              : "hover:shadow-md"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{page.name}</span>
                        </Button>
                      );
                    })}
                    <Button
                      variant="ghost"
                      onClick={() => handlePageChange("Logout")}
                      className="text-[#F5F7FA]/90 hover:text-[#F5F7FA] hover:bg-[#F5F7FA]/10 w-full justify-start transition-all duration-300"
                    >
                      <LogOut className="h-5 w-5 mr-2" />
                      {user ? "Logout" : "Login"}
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>

      {/* Logout Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-[#F5F7FA] border-[#D4D8E0]">
          <DialogHeader>
            <DialogTitle className="text-[#2D373D]">Confirm Logout</DialogTitle>
            <DialogDescription className="text-[#888CA7]">
              Are you sure you want to logout?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setOpenDialog(false)}
              className="border-[#D4D8E0] text-[#2D373D] hover:bg-[#D4D8E0]"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="bg-[#133354] hover:bg-[#133354]/90"
            >
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
