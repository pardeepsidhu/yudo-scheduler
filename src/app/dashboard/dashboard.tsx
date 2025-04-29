'use client'
import React, { useState, useEffect } from 'react';
import { fetchTasks } from '../api/taskApi';
import { getAllReminders } from '../api/reminderService';
import { 
  CheckCircle, 
  Clock, 
  Calendar, 
  ChevronRight, 
  ArrowRightCircle, 
  CheckCircle2, 
  Filter, 
  Bell, 
  Inbox,
  BarChart2,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
  Setting,
  Settings
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Date formatting utility
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
};

// Status Badge Component
const StatusBadge = ({ status }) => {
  const statusConfig = {
    'pending': { bg: 'bg-yellow-100', text: 'text-yellow-800', icon: Clock },
    'to do': { bg: 'bg-blue-100', text: 'text-blue-800', icon: Inbox },
    'in progress': { bg: 'bg-purple-100', text: 'text-purple-800', icon: ArrowRightCircle },
    'done': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle2 },
    'sent': { bg: 'bg-green-100', text: 'text-green-800', icon: CheckCircle }
  };
  
  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;
  const Icon = config.icon;
  
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${config.bg} ${config.text} hover:shadow-sm`}>
      <Icon size={14} className="mr-1" />
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Stats Card Component
const StatsCard = ({ title, value, icon, color,percentage}) => {
  const Icon = icon;
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 flex flex-col h-full transition-all duration-300 hover:shadow-md hover:translate-y-px border border-transparent hover:border-gray-100">
      <div className="flex justify-between items-start mb-2">
        <div className={`rounded-full p-2 bg-${color} transition-transform duration-300 hover:scale-110`}>
          <Icon size={16} className="text-white" />
        </div>
      <p className={`text-${color}`}>{percentage}%</p>
      </div>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
      <p className="text-sm text-gray-500 mt-1">{title}</p>
    </div>
  );
};

// Task List Component (condensed overview version)
const TaskOverview = ({ tasks = [] ,setActiveItem}) => {
  const topTasks = tasks.slice(0, 4);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-transparent transition-all duration-300 hover:shadow-md hover:border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium flex items-center">
          <Inbox size={18} className="mr-2 text-blue-600" />
          Recent Tasks
        </h3>
        <button onClick={()=>setActiveItem("tasks")} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-all duration-200 hover:translate-x-px">
         
          View All
          
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {topTasks.length > 0 ? (
          topTasks.map(task => (
            <div key={task._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-100">
              <div className="flex items-center">
                <div className="mr-3">
                  {task.status === 'done' ? (
                    <div className="h-6 w-6 bg-green-100 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-green-200">
                      <CheckCircle2 size={14} className="text-green-600" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 border-2 border-gray-300 rounded-full transition-all duration-200 hover:border-blue-400" />
                  )}
                </div>
                <div>
                  <p className="text-sm sm:hidden text-wrap font-medium text-gray-800 truncate max-w-xs">{ task.title.length <20 ? task.title : task.title.substring(0, 22)+"..."} </p>
                  <p className="text-sm hidden sm:flex text-wrap font-medium text-gray-800 truncate max-w-xs">{ task.title} </p>
                  <p className="text-xs text-gray-500">{formatDate(task.updatedAt)}</p>
                </div>
              </div>
              <StatusBadge status={task.status || 'pending'} />
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Inbox size={24} className="mx-auto mb-2 opacity-50" />
            <p>No tasks available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Reminder List Component (condensed overview version)
const ReminderOverview = ({ reminders = [] ,setActiveItem}) => {
  const topReminders = reminders.slice(0, 4);
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-transparent transition-all duration-300 hover:shadow-md hover:border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium flex items-center">
          <Bell size={18} className="mr-2 text-yellow-600" />
          Upcoming Reminders
        </h3>
        <button onClick={()=>setActiveItem("reminders")} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-all duration-200 hover:translate-x-px">
        
         View All
        
          <ChevronRight size={16} />
        </button>
      </div>
      
      <div className="space-y-3">
        {topReminders.length > 0 ? (
          topReminders.map(reminder => (
            <div key={reminder._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-100">
              <div className="flex items-center">
                <div className="mr-3">
                  <div className="h-6 w-6 bg-blue-100 rounded-full flex items-center justify-center transition-all duration-200 hover:bg-blue-200">
                    <Bell size={14} className="text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm text-wrap font-medium text-gray-800 truncate max-w-xs">{reminder.subject}</p>
                  <p className="text-xs text-gray-500">{formatDate(reminder.scheduleTime)}</p>
                </div>
              </div>
              <StatusBadge status={reminder.status || 'pending'} />
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-500">
            <Bell size={24} className="mx-auto mb-2 opacity-50" />
            <p>No reminders available</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Quick Action Button Component
const QuickActionButton = ({ icon: Icon, label, onClick, color }) => {
  return (
    <button 
      onClick={onClick}
      className={`flex  flex-col items-center justify-center  rounded-lg shadow-sm p-4 transition-all duration-300 hover:shadow-md hover:translate-y-px ${color} w-full`}
    >
      <div className="rounded-full bg-gray-100 p-3 mb-2 transition-transform duration-300 hover:scale-110">
        <Icon size={20} className="text-gray-700" />
      </div>
      <span className="text-sm  font-medium text-gray-800">{label}</span>
    </button>
  );
};

// Analytics Preview Component
const AnalyticsPreview = ({setActiveItem}) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-transparent transition-all duration-300 hover:shadow-md hover:border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium flex items-center">
          <BarChart2 size={18} className="mr-2 text-purple-600" />
          Analytics
        </h3>
        <button onClick={()=>setActiveItem("analytics")} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center transition-all duration-200 hover:translate-x-px">
     
          Full Report
   
          <ChevronRight size={16} />
        </button>
      </div>
      
      {/* <div className="h-40 w-full bg-gray-100 rounded-lg flex items-center justify-center"> */}
       
       <img src="https://precog.co/wp-content/uploads/2021/04/shutterstock_Analytics-scaled.jpg" alt=""  className='rounded-xl'/>
      {/* </div> */}
    </div>
  );
};

// Main Dashboard Component
export default function Dashboard({setActiveItem}) {
  const [tasks, setTasks] = useState([]);
  const [reminders, setReminders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch tasks from API
        const taskResponse = await fetchTasks().catch(error => {
          console.error("Error fetching tasks:", error);
          return { tasks: [] };
        });
      console.log(taskResponse.tasks)
        setTasks(taskResponse.tasks || []);
        
        // Fetch reminders from API - handle potential errors with user auth
        let user;
        try {
          user = localStorage.getItem('user');
        } catch (e) {
          console.warn("Could not parse user from localStorage");
          user = null;
        }
      
        if (user) {
          console.log(user)
          const reminderResponse = await getAllReminders(user).catch(error => {
            console.log(error)
            console.error("Error fetching reminders:", error);
            return { emails: [] };
          });
          console.log(reminderResponse)
          setReminders(reminderResponse.emails || []);
        } else {
          console.warn("No user found in localStorage");
          setReminders([]);
        }
      } catch (error) {
        console.error("Error loading dashboard data:", error);
        setError("Failed to load dashboard data. Please refresh to try again.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);
  
  // Calculate statistics (safely)
  const taskStats = {
    total: tasks?.length || 0,
    completed: tasks?.filter(t => t?.status === 'done')?.length || 0,
    inProgress: tasks?.filter(t => t?.status === 'in progress')?.length || 0,
    pending: tasks?.filter(t => t?.status === 'pending' || t?.status === 'to do')?.length || 0
  };
  
  const reminderStats = {
    total: reminders?.length || 0,
    pending: reminders?.filter(r => r?.status === 'pending')?.length || 0,
    sent: reminders?.filter(r => r?.status === 'sent')?.length || 0
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="rounded-full bg-blue-50 p-4 mb-3">
            <Loader size={32} className="animate-spin text-blue-600" />
          </div>
          <p className="text-gray-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-sm max-w-md w-full text-center">
          <div className="rounded-full bg-red-50 p-4 mx-auto w-16 h-16 flex items-center justify-center mb-4">
            <AlertCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-xl font-bold mb-2">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-50 min-h-screen">
    {/* Header with subtle gradient */}
    <header className="bg-white border-b border-gray-100 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto py-4 px-6 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800 flex items-center">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center mr-3 shadow-sm">
            <Inbox size={20} className="text-white" />
          </div>
          Productivity Dashboard
        </h1>
        
      </div>
    </header>
    
    {/* Main Content */}
    <main className="container mx-auto px-4 sm:px-6 py-2 sm:py-8 pb-12">
      {/* Stats Row with improved cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-6 mb-8">
        <StatsCard 
          title="Total Tasks" 
          value={taskStats.total} 
          icon={Inbox} 
          color="blue-600" 
          percentage={100}
        />
        <StatsCard 
          title="Completed Tasks" 
          value={taskStats.completed} 
          icon={CheckCircle2} 
          color="green-600" 
          percentage={Math.floor(((taskStats.completed/taskStats.total)*100) || 0)}
        />
        <StatsCard 
          title="In Progress" 
          value={taskStats.inProgress} 
          icon={ArrowRightCircle} 
          color="purple-600" 
          percentage={Math.floor(((taskStats.inProgress/taskStats.total)*100) || 0)}
        />
        <StatsCard 
          title="Total Reminders" 
          value={reminderStats.total} 
          icon={Bell} 
          color="yellow-600" 
          percentage={100}
        />
      </div>
      
      {/* Quick Actions Row - Mobile Only with gradient backgrounds */}
      <div className="grid grid-cols-4 gap-4 mb-8 md:hidden">
        <QuickActionButton 
          icon={Inbox} 
          label="Tasks" 
          onClick={() => setActiveItem("tasks")}
          color="bg-gradient-to-r from-blue-500 to-blue-600" 
        />
        <QuickActionButton 
          icon={Bell} 
          label="Reminders" 
          onClick={() => setActiveItem("reminders")} 
          color="bg-gradient-to-r from-purple-500 to-purple-600" 
        />
        <QuickActionButton 
          icon={BarChart2} 
          label="Analytics" 
          onClick={() => setActiveItem("analytics")} 
          color="bg-gradient-to-r from-green-500 to-green-600" 
        />
        <QuickActionButton 
          icon={Settings} 
          label="Settings" 
          onClick={() => setActiveItem("profile")} 
          color="bg-gradient-to-r from-gray-500 to-gray-600" 
        />
      </div>
      
      {/* Main Content Grid with improved spacing */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Tasks Overview */}
          <TaskOverview tasks={tasks} setActiveItem={setActiveItem}/>
          
          {/* Reminders Overview */}
          <ReminderOverview reminders={reminders} setActiveItem={setActiveItem}/>
        </div>
        
        {/* Right Column */}
        <div className="space-y-8">
          {/* Analytics Preview */}
          <AnalyticsPreview setActiveItem={setActiveItem}/>
          
          {/* User Productivity Summary with enhanced design */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-transparent transition-all duration-300 hover:shadow-md hover:border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-medium text-lg flex items-center">
                <Calendar size={20} className="mr-2 text-green-600" /> 
                Task Summary
              </h3>
            </div>
            
            <div className="space-y-6">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Completion Rate</span>
                  <span className="text-sm font-medium bg-green-50 text-green-700 px-2 py-1 rounded">
                    {taskStats.total ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-green-600 h-2.5 rounded-full transition-all duration-700 ease-in-out" 
                    style={{ width: `${taskStats.total ? Math.round((taskStats.completed / taskStats.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Pending Tasks</span>
                  <span className="text-sm font-medium bg-yellow-50 text-yellow-700 px-2 py-1 rounded">
                    {taskStats.pending}
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2.5 rounded-full transition-all duration-700 ease-in-out" 
                    style={{ width: `${taskStats.total ? Math.round((taskStats.pending / taskStats.total) * 100) : 0}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100">
                <div className="flex items-start">
                  <div className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-2 mr-3 shadow-sm">
                    <Bell size={16} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-blue-800">Productivity Tip</h4>
                    <p className="text-xs text-blue-700 mt-1">Focus on completing 2-3 high priority tasks each day rather than juggling multiple tasks.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
  );
}