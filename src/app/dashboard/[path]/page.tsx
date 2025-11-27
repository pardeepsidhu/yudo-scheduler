'use client'
import React from 'react';
import RemindersPage from './reminder';
import TaskDashboard from './task';
import Analytics from './Analytics';
import UserProfileComponent from './Profile';
import ProfessionalTimesheet from './TimeSheet';
import NotificationsPage from './notification-page';



export default function Page({ params }: { params: { path: string } }) {
  const p = params.path.toLowerCase();

  switch (p) {
    case "profile":
      return <UserProfileComponent />;

    case "tasks":
      return <TaskDashboard />;

    case "reminders":
      return <RemindersPage />;

    case "analytics":
      return <Analytics />;

    case "notifications":
      return <NotificationsPage />;

    case "timesheet":
      return <ProfessionalTimesheet />;

    default:
      return <div>404 Not Found</div>;
  }
}
