'use client';
import Sidebar from '@/components/SideBar';
import React, { useState } from 'react';
import ProfessionalCalendar from './dashboard';
import RemindersPage from './reminder';

export default function Page() {
  const [activeItem, setActiveItem] = useState("dashboard");
  console.log(activeItem)
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - fixed */}
      <div className="flex-shrink-0">
        <Sidebar 
          activeItem={activeItem} 
          setActiveItem={setActiveItem} 
        />
      </div>
      
      {/* Main content - scrollable */}
      <div className="flex-grow overflow-y-auto">
        {activeItem === "dashboard" && <ProfessionalCalendar />}
        {activeItem === "reminders" && <RemindersPage />}
      </div>
    </div>
  );
}