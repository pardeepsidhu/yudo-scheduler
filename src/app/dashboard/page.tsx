'use client';
import Sidebar from '@/components/SideBar';
import React, { useEffect, useState } from 'react';
import RemindersPage from './reminder';
import TaskDashboard from './task';
import Dashboard from './dashboard';
import Analytics from './Analytics';
import UserProfileComponent from './Profile';
import ProfessionalTimesheet from './TimeSheet';


export default function Page() {
  const [activeItem, setActiveItem] = useState("dashboard");
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed */}
      <div className="flex-shrink-0 ">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
        />
      </div>
      
      {/* Main content - scrollable */}
      <div className="flex-grow overflow-y-auto p-2" style={{ overflow: "auto" }} id="scrollableDiv" >
        {activeItem === "dashboard" && <Dashboard />}
        {activeItem === "reminders" && <RemindersPage />}
        {activeItem === "tasks" && <TaskDashboard />}
        {activeItem === "analytics" && <Analytics />}
        {activeItem === "profile" && <UserProfileComponent />}
        {activeItem === "timesheet" && <ProfessionalTimesheet />}
      </div>
    </div>
  );
}