// "use server"
import { AuroraText } from '@/components/magicui/aurora-text'
import { WordRotate } from '@/components/magicui/word-rotate'
import { Calendar, Clock, Target, Zap } from 'lucide-react'
import React from 'react'
import { cn } from "@/lib/utils";

export const HeroSection: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="size-8 text-indigo-600" />,
      title: "Smart Calendar",
      description: "Intelligent scheduling that adapts to your priorities and time constraints.",
      image: "/landingPage/Smart_Calender.jpg"
    },
    {
      icon: <Clock className="size-8 text-indigo-600" />,
      title: "Time Tracking",
      description: "Monitor how you spend your time and identify opportunities for improvement.",
      image: "/landingPage/Time_Tracking.jpg"
    },
    {
      icon: <Target className="size-8 text-indigo-600" />,
      title: "Goal Setting",
      description: "Set measurable objectives and track your progress toward completion.",
      image: "/landingPage/Goal_Setting.jpg"
    },
    {
      icon: <Zap className="size-8 text-indigo-600" />,
      title: "Productivity Insights",
      description: "Gain valuable insights into your productivity patterns and habits.",
      image: "/landingPage/Producivity.png"
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

<div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        {/* Abstract Shapes */}
        <div className="absolute inset-0 w-full h-full">
          <svg className="absolute top-0 left-0 w-full h-full opacity-10 dark:opacity-20 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
            <circle cx="75" cy="25" r="8" fill="rgba(99, 102, 241, 0.2)" className="animate-pulse-slow"></circle>
            <circle cx="25" cy="75" r="6" fill="rgba(139, 92, 246, 0.2)" className="animate-pulse-slow delay-1000"></circle>
            <circle cx="85" cy="85" r="4" fill="rgba(217, 70, 239, 0.2)" className="animate-pulse-slow delay-2000"></circle>
            <path d="M15,15 Q40,5 50,30 T90,40" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.4" className="animate-draw"></path>
            <path d="M10,50 Q20,60 40,50 T60,60 T90,50" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.4" className="animate-draw delay-1000"></path>
          </svg>
        </div>
        
        {/* Blurred Gradient Orbs - Positioned to avoid overflow */}
        <div className="absolute top-1/4 left-[5%] w-48 h-48 rounded-full bg-blue-600/20 dark:bg-blue-600/10 blur-3xl animate-blob"></div>
        <div className="absolute bottom-1/4 right-[5%] w-56 h-56 rounded-full bg-purple-600/20 dark:bg-purple-600/10 blur-3xl animate-blob delay-2000"></div>
        <div className="absolute top-2/3 left-1/3 w-40 h-40 rounded-full bg-pink-600/20 dark:bg-pink-600/10 blur-3xl animate-blob delay-4000"></div>
      </div>


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
            className={`group h-64 perspective-1000 scroll-animate scale-in ${index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : index === 3 ? 'delay-300' : ''}`}
          >
            <div className={`relative h-full w-full rounded-xl transition-all duration-500 transform-style-3d ${index % 2 === 0 ? 'group-hover:rotate-y-180' : 'group-hover:rotate-x-180'}`}>
              {/* Front Side - Now with image */}
              <div className="absolute inset-0 backface-hidden">
                <div className="h-full w-full rounded-xl overflow-hidden relative">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">{feature.title}</h3>
                    <div className="text-white/80 text-sm">{feature.description}</div>
                  </div>
                </div>
              </div>
              
              {/* Back Side - Now with original content */}
              <div className={`absolute inset-0 backface-hidden ${index % 2 === 0 ? 'rotate-y-180' : 'rotate-x-180'}`}>
                <div className="h-full bg-[aliceblue] p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col">
                  <div className="bg-indigo-50 p-3 rounded-lg inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      
    </div>
  )
}

// Add these styles to your global CSS or a <style> tag
// These are needed because some of these advanced 3D transforms aren't directly available in Tailwind classes
const additionalStyles = `
  .perspective-1000 {
    perspective: 1000px;
  }
  
  .transform-style-3d {
    transform-style: preserve-3d;
  }
  
  .backface-hidden {
    backface-visibility: hidden;
  }
  
  .rotate-y-180 {
    transform: rotateY(180deg);
  }
  
  .rotate-x-180 {
    transform: rotateX(180deg);
  }
  
  .group-hover\\:rotate-y-180:hover {
    transform: rotateY(180deg);
  }
  
  .group-hover\\:rotate-x-180:hover {
    transform: rotateX(180deg);
  }
`;