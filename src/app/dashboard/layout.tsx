"use client";

import Sidebar from "@/components/SideBar";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchUser, fetchNotifications } from "../api/userApi";
import { Loader } from "lucide-react";
import toast from "react-hot-toast";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [waiting, setWaiting] = useState(true);
  const [activeItem, setActiveItem] = useState("");

  // Fetch user once
  useEffect(() => {
    const loadUser = async () => {
      try {
        const result = await fetchUser();
        await fetchNotifications();

        if (result.error) router.push("/login");
        else setUser(result);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setWaiting(false);
      }
    };

    loadUser();
  }, []);

  // Update sidebar highlight based on URL
  useEffect(() => {
    const lastSegment = pathname.split("/").pop()?.toLowerCase();
    setActiveItem(lastSegment || "profile");
  }, [pathname]);

  if (waiting) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        activeItem={activeItem}
        setActiveItem={setActiveItem}
        userName={user?.name}
        userEmail={user?.email}
        userImage={user?.profile}
      />

      <div className="flex-grow overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
