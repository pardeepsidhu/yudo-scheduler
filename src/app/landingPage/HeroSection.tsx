"use client"
import { AuroraText } from '@/components/magicui/aurora-text'
import { WordRotate } from '@/components/magicui/word-rotate'
import { Calendar, Clock, Target, Zap } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation'

export const HeroSection: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const router = useRouter()
  
  const words = ['BOOST PRODUCTIVITY', 'MEET EVERY DEADLINE', 'BALANCE YOUR LIFE'];
  
  useEffect(() => {
    const wordInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentWord((prev) => (prev + 1) % words.length);
        setIsVisible(true);
      }, 500);
    }, 3000);
    
    return () => clearInterval(wordInterval);
  }, []);
  
  useEffect(() => {
    const handleMouseMove = (e) => {
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth) - 0.5;
      const y = (clientY / window.innerHeight) - 0.5;
      setMousePosition({ x, y });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  const getParallaxStyle = (strength = 1) => {
    return {
      transform: `translate(${mousePosition.x * 20 * strength}px, ${mousePosition.y * 20 * strength}px)`
    };
  };
  
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
    <div className="relative min-h-screen bg-gradient-to-b from-indigo-50 to-white py-20 overflow-hidden">
    {/* Background Elements */}
    <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Abstract Shapes with Parallax */}
      <div className="absolute inset-0 w-full h-full">
        <svg className="absolute top-0 left-0 w-full h-full opacity-10 overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
          <circle cx="75" cy="25" r="8" fill="rgba(99, 102, 241, 0.2)" className="animate-pulse-slow" style={getParallaxStyle(0.5)}></circle>
          <circle cx="25" cy="75" r="6" fill="rgba(139, 92, 246, 0.2)" className="animate-pulse-slow" style={getParallaxStyle(0.3)}></circle>
          <circle cx="85" cy="85" r="4" fill="rgba(217, 70, 239, 0.2)" className="animate-pulse-slow" style={getParallaxStyle(0.7)}></circle>
          <path d="M15,15 Q40,5 50,30 T90,40" fill="none" stroke="rgba(99, 102, 241, 0.3)" strokeWidth="0.4" className="animate-draw"></path>
          <path d="M10,50 Q20,60 40,50 T60,60 T90,50" fill="none" stroke="rgba(139, 92, 246, 0.3)" strokeWidth="0.4" className="animate-draw"></path>
        </svg>
      </div>
      
      {/* Blurred Gradient Orbs with Parallax */}
      <div className="absolute top-1/4 left-[5%] w-48 h-48 rounded-full bg-blue-600/20 blur-3xl animate-blob" style={getParallaxStyle(0.2)}></div>
      <div className="absolute bottom-1/4 right-[5%] w-56 h-56 rounded-full bg-purple-600/20 blur-3xl animate-blob" style={getParallaxStyle(0.3)}></div>
      <div className="absolute top-2/3 left-1/3 w-40 h-40 rounded-full bg-pink-600/20 blur-3xl animate-blob" style={getParallaxStyle(0.1)}></div>
    </div>

    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Hero Content */}
      <div className="text-center space-y-6 relative z-10">
        <div className="inline-block mb-2">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm transition-all duration-300 hover:bg-indigo-200 hover:shadow-md cursor-pointer">
            <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
            <span>New Release v2.5</span>
          </div>
        </div>
        
        <h1 className="text-gray-900 text-4xl sm:text-6xl font-bold leading-tight tracking-tight">
          Streamline Your{' '}
          <span className="relative inline-block">
            <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-600 bg-size-200 animate-gradient">Schedule</span>
            <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded transform scale-x-110"></span>
          </span>
        </h1>
        
        <div className="h-12 flex justify-center items-center">
          <div className={`text-xl sm:text-3xl text-indigo-700 font-medium transition-all duration-500 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}>
            {words[currentWord]}
          </div>
        </div>
        
        <p className="max-w-2xl mx-auto text-gray-600 text-lg sm:text-xl mt-6">
          Yudo Scheduler helps professionals manage their time efficiently, organize priorities, and never miss important events.
        </p>
        
        <div className="mt-8 flex justify-center space-x-4">
          <button onClick={()=>router.push("/dashboard")} className="group relative inline-flex items-center px-6 py-3 overflow-hidden rounded-lg bg-indigo-600 text-white font-medium transition-all duration-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400">
            <span className="relative z-10 flex items-center">
              Get Started
              <svg className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </span>
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
          </button>
          
          <button onClick={()=>router.push("/dashboard")} className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 hover:text-indigo-600 hover:border-indigo-400 transition-all duration-300">
            Watch Demo
          </button>
        </div>
  
      </div>
      
      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-20">
        {features.map((feature, index) => (
          <div
            key={index}
            className="group h-64 perspective-1000"
          >
            <div className={`relative h-full w-full rounded-xl transition-all duration-500 transform-style preserve-3d hover:rotate-y-180`}>
              {/* Front Side */}
              <div className="absolute inset-0 backface-hidden">
                <div className="h-full w-full rounded-xl overflow-hidden relative shadow-md group-hover:shadow-xl transition-shadow duration-500">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="text-xl font-semibold text-white mb-1">{feature.title}</h3>
                    <div className="text-white/80 text-sm">{feature.description}</div>
                  </div>
                </div>
              </div>
              
              {/* Back Side */}
              <div className="absolute inset-0 backface-hidden rotate-y-180">
                <div className="h-full bg-white p-6 rounded-xl shadow-md border border-gray-200 flex flex-col transition-all duration-300">
                  <div className="bg-indigo-50 p-3 rounded-lg inline-block mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                  <div className="mt-auto pt-4">
                    <button onClick={()=>router.push('/about')} className="text-indigo-600 font-medium flex items-center hover:text-indigo-800 transition-colors">
                      Learn more
                      <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Brands/Trust Section */}
    
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