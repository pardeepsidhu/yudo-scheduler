'use client';
import Sidebar from '@/components/SideBar';
import React, { useEffect, useState } from 'react';
import RemindersPage from './reminder';
import TaskDashboard from './task';
import Analytics from './Analytics';
import UserProfileComponent from './Profile';
import ProfessionalTimesheet from './TimeSheet';
import { useRouter, usePathname } from 'next/navigation';
import { fetchNotifications, fetchUser } from '../api/userApi';
import NotificationsPage from './notification-page';
import { Loader } from 'lucide-react';
import toast from 'react-hot-toast';

type User = {name:string,
    email:string,
    profile:string,
    error?:string
  }


export default function Page() {
  const [activeItem,setActiveItem]=useState("profile")
  const router = useRouter();
  const pathname = usePathname(); // 👈 get current path
  const [user, setUser] = useState<User>();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [waiting, setWaiting] = useState<boolean>(true);

  // 👇 detect screen size
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // 👇 handle user + notifications
  useEffect(() => {
    const fetchData = async () => {
      try {
        const result: User  = await fetchUser();
        await fetchNotifications();
        if (result.error) {
          router.push('/login');
        } else {
          setUser(result);
        }
      } catch (err: any) {
        console.error('Error fetching user:', err);
        toast.error(err.message);
      } finally {
        setWaiting(false);
      }
    };
    fetchData();
  }, []);

  // 👇 Sync activeItem with URL path
  useEffect(() => {
    if (!pathname) return;

    const path = pathname.split('/').pop()?.toLowerCase() || '';

    switch (path) {
      case 'reminders':
        setActiveItem('reminders');
        break;
      case 'tasks':
        setActiveItem('tasks');
        break;
      case 'analytics':
        setActiveItem('analytics');
        break;
      case 'profile':
        setActiveItem('profile');
        break;
      case 'timesheet':
        setActiveItem('timesheet');
        break;
      case 'notifications':
        setActiveItem('notifications');
        break;
      default:
        router.push("/err/not-found")
        break;
    }
  }, [pathname]);

  // 👇 show loading while waiting
  if (waiting)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-blue-50 p-4 mb-3">
            <Loader size={32} className="animate-spin text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );

  // 👇 render page
  return (
    <div className="flex h-screen overflow-hidden">
      <div className="flex-shrink-0">
        <Sidebar
          activeItem={activeItem}
          setActiveItem={setActiveItem}
          userName={user?.name }
          userEmail={user?.email }
          userImage={user?.profile}
        />
      </div>

      <div
        className="flex-grow overflow-y-auto md:p-0"
        id="scrollableDiv"
        style={{ overflow: 'auto' }}
      >
        {isMobile && <div className="w-full h-17" />}

        {activeItem === 'reminders' && <RemindersPage />}
        {activeItem === 'tasks' && <TaskDashboard />}
        {activeItem === 'analytics' && <Analytics />}
        {activeItem === 'profile' && <UserProfileComponent />}
        {activeItem === 'timesheet' && <ProfessionalTimesheet />}
        {activeItem === 'notifications' && <NotificationsPage />}
      </div>
    </div>
  );
}
