'use client';
import Sidebar from '@/components/SideBar';
import React, { useEffect, useState } from 'react';
import RemindersPage from './reminder';
import TaskDashboard from './task';
import Dashboard from './dashboard';
import Analytics from './Analytics';
import UserProfileComponent from './Profile';
import ProfessionalTimesheet from './TimeSheet';
import { useRouter } from 'next/navigation';
import { fetchNotifications, fetchUser } from '../api/userApi';
import { useNavigation } from '../context/ActiveItemContext';
import  NotificationsPage from './notification-page';


export default function Page() {
  const {activeItem,setActiveItem}  = useNavigation()
  const router = useRouter();
  const [user,setUser]=useState()
  const [isMobile, setIsMobile] = useState<boolean>(false);
  

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchUser();
       await fetchNotifications()
        if (result.error) {
          router.push("/login");
        } else {
          setUser(result);
          console.log(result);
        }

      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };
  
    fetchData();
  }, []);

  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed */}
      <div className="flex-shrink-0 ">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem}
          userName={user?.name}
          userEmail={user?.email}
          userImage={user?.profile}
        />
      </div>
      
      {/* Main content - scrollable */}
      <div className="flex-grow overflow-y-auto  md:p-0 " style={{ overflow: "auto" }} id="scrollableDiv" >
   {  isMobile &&   <div className='w-full h-17'/>}
        {activeItem === "dashboard" && <Dashboard setActiveItem={setActiveItem}/>}
        {activeItem === "reminders" && <RemindersPage />}
        {activeItem === "tasks" && <TaskDashboard />}
        {activeItem === "analytics" && <Analytics />}
        {activeItem === "profile" && <UserProfileComponent />}
        {activeItem === "timesheet" && <ProfessionalTimesheet />}
        {activeItem === "notifications" && <NotificationsPage />}
      </div>
    </div>
  );
}