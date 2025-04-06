import { AuroraText } from '@/components/magicui/aurora-text';
import { AvatarCircles } from '@/components/magicui/avatar-circles'
import SplitText from '@/components/splitText';
import { Card, CardContent } from '@/components/ui/card'
import { Bell, Calendar, CheckCircle, Clock, KeyRound } from 'lucide-react'
import React from 'react'

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
    <div className="w-full md:w-1/2 space-y-8 p-6">
    <div className="flex items-center justify-center md:justify-start gap-3">
      <Calendar className="h-10 w-10 text-indigo-600" />
      <h1 className="text-4xl font-extrabold text-indigo-600">YUDO Scheduler</h1>
    </div>
    
    <h2 className="text-3xl font-bold text-gray-800 text-center md:text-left">
      Smart Scheduling, <br />Smarter <AuroraText> Notifications</AuroraText>
    </h2>
    
    <p className="text-lg text-gray-600 text-center md:text-left">
      Stay organized with YUDO Scheduler - your personal assistant for time management.
    </p>
    
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
      <Card className="border border-indigo-100 shadow-md bg-white/80 backdrop-blur">
        <CardContent className="p-4 flex items-start gap-3">
          <Bell className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800">Smart Alerts</h3>
            <p className="text-sm text-gray-600">Custom notifications via email & Telegram</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-indigo-100 shadow-md bg-white/80 backdrop-blur">
        <CardContent className="p-4 flex items-start gap-3">
          <Clock className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800">Time Tracking</h3>
            <p className="text-sm text-gray-600">Monitor productivity & set milestones</p>
          </div>
        </CardContent>
      </Card>
      
      <Card className="border border-indigo-100 shadow-md bg-white/80 backdrop-blur">
        <CardContent className="p-4 flex items-start gap-3">
          <CheckCircle className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800">Task Management</h3>
            <p className="text-sm text-gray-600">Create & manage tasks with deadlines</p>
          </div>
          
        </CardContent>
      </Card>
      
      <Card className="border border-indigo-100 shadow-md bg-white/80 backdrop-blur">
        <CardContent className="p-4 flex items-start gap-3">
          <KeyRound className="h-6 w-6 text-indigo-500 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-800">Secure Access</h3>
            <p className="text-sm text-gray-600">Two-factor authentication for your data</p>
          </div>
        </CardContent>
      </Card>
    </div>
    
    <div className="flex items-center justify-center md:justify-start gap-2 pt-2">
      <div className="flex -space-x-2">
      <AvatarCircles numPeople={999} avatarUrls={avatars} />
      
      </div>
      <p className="text-sm text-gray-600"> <SplitText className='text-sm' text='users organizing their life' ></SplitText> </p>
    </div>
  </div>
  )
}
