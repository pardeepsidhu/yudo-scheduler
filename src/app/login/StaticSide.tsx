import { AuroraText } from '@/components/magicui/aurora-text';
import { AvatarCircles } from '@/components/magicui/avatar-circles';
import { Card, CardContent } from '@/components/ui/card';
import { Bell, Calendar, CheckCircle, Clock, KeyRound } from 'lucide-react';
import React from 'react';

export default function StaticSide() {
  const avatars = [
    {
      imageUrl: "https://avatars.githubusercontent.com/u/16860528",
      profileUrl: "https://github.com/dillionverma",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/20110627",
      profileUrl: "https://github.com/tomonarifeehan",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/59442788",
      profileUrl: "https://github.com/sanjay-mali",
    },
    {
      imageUrl: "https://avatars.githubusercontent.com/u/89768406",
      profileUrl: "https://github.com/itsarghyadas",
    },
  ];

  return (
    <div className="w-full md:w-1/2 space-y-8 p-8 bg-gradient-to-br from-slate-50 to-white rounded-3xl">
      <div className="flex items-center justify-center md:justify-start gap-3">
        <div className="bg-teal-50 p-2 rounded-xl">
          <Calendar className="h-10 w-10 text-teal-600" />
        </div>
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
          YUDO Scheduler
        </h1>
      </div>
      
      <h2 className="text-3xl font-bold text-slate-800 text-center md:text-left">
        Smart Scheduling, <br />
        Smarter <AuroraText className="from-teal-500 to-emerald-400">Notifications</AuroraText>
      </h2>
      
      <p className="text-lg text-slate-600 text-center md:text-left max-w-lg">
        Stay organized with YUDO Scheduler - your personal assistant for time management and productivity.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6">
        <Card className="border border-slate-100 shadow-sm bg-white/90 backdrop-blur transition-all duration-300 hover:shadow-md hover:border-teal-100 hover:scale-105 group">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="bg-teal-50 p-2 rounded-lg transition-colors group-hover:bg-teal-100">
              <Bell className="h-6 w-6 text-teal-500 transition-colors group-hover:text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">Smart Alerts</h3>
              <p className="text-sm text-slate-600">Custom notifications via email & Telegram</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-100 shadow-sm bg-white/90 backdrop-blur transition-all duration-300 hover:shadow-md hover:border-teal-100 hover:scale-105 group">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="bg-teal-50 p-2 rounded-lg transition-colors group-hover:bg-teal-100">
              <Clock className="h-6 w-6 text-teal-500 transition-colors group-hover:text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">Time Tracking</h3>
              <p className="text-sm text-slate-600">Monitor productivity & set milestones</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-100 shadow-sm bg-white/90 backdrop-blur transition-all duration-300 hover:shadow-md hover:border-teal-100 hover:scale-105 group">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="bg-teal-50 p-2 rounded-lg transition-colors group-hover:bg-teal-100">
              <CheckCircle className="h-6 w-6 text-teal-500 transition-colors group-hover:text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">Task Management</h3>
              <p className="text-sm text-slate-600">Create & manage tasks with deadlines</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-100 shadow-sm bg-white/90 backdrop-blur transition-all duration-300 hover:shadow-md hover:border-teal-100 hover:scale-105 group">
          <CardContent className="p-5 flex items-start gap-4">
            <div className="bg-teal-50 p-2 rounded-lg transition-colors group-hover:bg-teal-100">
              <KeyRound className="h-6 w-6 text-teal-500 transition-colors group-hover:text-teal-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 group-hover:text-teal-700 transition-colors">Secure Access</h3>
              <p className="text-sm text-slate-600">Two-factor authentication for your data</p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="flex items-center justify-center md:justify-start gap-3 pt-4">
        <div className="flex -space-x-2">
          <AvatarCircles numPeople={999} avatarUrls={avatars} />
        </div>
        <p className="text-sm font-medium text-slate-600">
         users organizing their life
        </p>
      </div>
      
      <div className="hidden md:block absolute -bottom-16 -right-16 w-64 h-64 bg-gradient-to-br from-teal-100/20 to-emerald-100/20 rounded-full blur-3xl"></div>
    </div>
  );
}