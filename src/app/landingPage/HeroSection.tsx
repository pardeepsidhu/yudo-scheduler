// "use server"
import { AuroraText } from '@/components/magicui/aurora-text'
import { WordRotate } from '@/components/magicui/word-rotate'
import { Calendar, Clock, Target, Zap } from 'lucide-react'
import React from 'react'


export const HeroSection:React.FC =()=>{
    const features = [
        
        {
          icon: <Calendar className="size-8 text-indigo-600" />,
          title: "Smart Calendar",
          description: "Intelligent scheduling that adapts to your priorities and time constraints."
        },
        {
          icon: <Clock className="size-8 text-indigo-600" />,
          title: "Time Tracking",
          description: "Monitor how you spend your time and identify opportunities for improvement."
        },
        {
          icon: <Target className="size-8 text-indigo-600" />,
          title: "Goal Setting",
          description: "Set measurable objectives and track your progress toward completion."
        },
        {
          icon: <Zap className="size-8 text-indigo-600" />,
          title: "Productivity Insights",
          description: "Gain valuable insights into your productivity patterns and habits."
        }
      ];
      
    
    return(
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center space-y-6">
          <h1 className="text-gray-900 text-4xl sm:text-6xl font-bold leading-tight tracking-tight scroll-animate">
            Streamline Your <AuroraText>Schedule</AuroraText>
          </h1>
          <div className="scroll-animate delay-100">
            <WordRotate
              className="text-xl sm:text-3xl text-indigo-700 font-medium mt-4"
              words={['BOOST PRODUCTIVITY', 'MEET EVERY DEADLINE', 'BALANCE YOUR LIFE']}
            />
          </div>
          <p className="max-w-2xl mx-auto text-gray-600 text-lg sm:text-xl mt-6 scroll-animate delay-200">
            Yudo Scheduler helps professionals manage their time efficiently, organize priorities, and never miss important events.
          </p>
          
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className={`bg-[aliceblue] p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 scroll-animate scale-in ${index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : index === 3 ? 'delay-300' : ''}`}
            >
              <div className="bg-indigo-50 p-3 rounded-lg inline-block mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    )
}
