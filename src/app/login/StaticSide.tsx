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
   <div className="relative w-full -full overflow-x-hidden overflow-y-auto rounded-none md:rounded-3xl bg-gradient-to-br from-slate-50 to-white">
  
  <div className="pointer-events-none absolute -bottom-20 -right-20 h-72 w-72 rounded-full bg-gradient-to-br from-teal-100/30 to-emerald-100/30 blur-3xl" />

  <div className="relative z-10 flex min-h-full w-full flex-col justify-between px-4 py-6 sm:px-6 sm:py-8 md:px-8 lg:px-10 xl:px-12">
    
    <div className="space-y-6 sm:space-y-8">
      
      <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:justify-start md:text-left">
        
        <div className="flex shrink-0 items-center justify-center rounded-2xl bg-teal-50 p-3 shadow-sm">
          <Calendar className="h-8 w-8 text-teal-600 sm:h-10 sm:w-10" />
        </div>

        <h1 className="break-words text-2xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
          <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">
            YUDO Scheduler
          </span>
        </h1>
      </div>

      <div className="space-y-4 text-center md:text-left">
        
        <h2 className="break-words text-2xl font-bold leading-tight text-slate-800 sm:text-4xl lg:text-5xl">
          Smart Scheduling,
          <br />
          Smarter{" "}
          <AuroraText className="from-teal-500 to-emerald-400">
            Notifications
          </AuroraText>
        </h2>

        <p className="mx-auto max-w-xl break-words text-sm leading-relaxed text-slate-600 sm:text-base md:mx-0 lg:text-lg">
          Stay organized with YUDO Scheduler — your personal assistant
          for time management, productivity, and smart reminders.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        
        <Card className="group w-full overflow-hidden border border-slate-100 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-teal-100 hover:shadow-md">
          <CardContent className="flex h-full w-full items-start gap-3 p-4 sm:gap-4 sm:p-5">
            
            <div className="shrink-0 rounded-xl bg-teal-50 p-3 transition-colors group-hover:bg-teal-100">
              <Bell className="h-5 w-5 text-teal-500 transition-colors group-hover:text-teal-600 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="break-words text-sm font-semibold text-slate-800 transition-colors group-hover:text-teal-700 sm:text-base">
                Smart Alerts
              </h3>

              <p className="break-words text-xs leading-relaxed text-slate-600 sm:text-sm">
                Custom notifications via email & Telegram
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group w-full overflow-hidden border border-slate-100 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-teal-100 hover:shadow-md">
          <CardContent className="flex h-full w-full items-start gap-3 p-4 sm:gap-4 sm:p-5">
            
            <div className="shrink-0 rounded-xl bg-teal-50 p-3 transition-colors group-hover:bg-teal-100">
              <Clock className="h-5 w-5 text-teal-500 transition-colors group-hover:text-teal-600 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="break-words text-sm font-semibold text-slate-800 transition-colors group-hover:text-teal-700 sm:text-base">
                Time Tracking
              </h3>

              <p className="break-words text-xs leading-relaxed text-slate-600 sm:text-sm">
                Monitor productivity & set milestones
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group w-full overflow-hidden border border-slate-100 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-teal-100 hover:shadow-md">
          <CardContent className="flex h-full w-full items-start gap-3 p-4 sm:gap-4 sm:p-5">
            
            <div className="shrink-0 rounded-xl bg-teal-50 p-3 transition-colors group-hover:bg-teal-100">
              <CheckCircle className="h-5 w-5 text-teal-500 transition-colors group-hover:text-teal-600 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="break-words text-sm font-semibold text-slate-800 transition-colors group-hover:text-teal-700 sm:text-base">
                Task Management
              </h3>

              <p className="break-words text-xs leading-relaxed text-slate-600 sm:text-sm">
                Create & manage tasks with deadlines
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="group w-full overflow-hidden border border-slate-100 bg-white/90 shadow-sm backdrop-blur transition-all duration-300 hover:scale-[1.02] hover:border-teal-100 hover:shadow-md">
          <CardContent className="flex h-full w-full items-start gap-3 p-4 sm:gap-4 sm:p-5">
            
            <div className="shrink-0 rounded-xl bg-teal-50 p-3 transition-colors group-hover:bg-teal-100">
              <KeyRound className="h-5 w-5 text-teal-500 transition-colors group-hover:text-teal-600 sm:h-6 sm:w-6" />
            </div>

            <div className="min-w-0 space-y-1">
              <h3 className="break-words text-sm font-semibold text-slate-800 transition-colors group-hover:text-teal-700 sm:text-base">
                Secure Access
              </h3>

              <p className="break-words text-xs leading-relaxed text-slate-600 sm:text-sm">
                Two-factor authentication for your data
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>

    <div className="mt-8 flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-center md:justify-start md:text-left">
      
      <div className="flex shrink-0 -space-x-2 overflow-hidden">
        <AvatarCircles numPeople={999} avatarUrls={avatars} />
      </div>

      <p className="break-words text-sm font-medium text-slate-600">
        users organizing their life
      </p>
    </div>
  </div>
</div>
  );
}