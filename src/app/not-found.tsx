// pages/404.js or app/not-found.js (depending on your Next.js version)
"use client"; // For App Router
import "./styles.css/bubbles.css"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Home, ArrowLeft, RefreshCw } from 'lucide-react';

export default function NotFound() {
  const [countdown, setCountdown] = useState(15);
  const [isRedirecting, setIsRedirecting] = useState(true);
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0
  });

  // Handle countdown timer and redirection
  useEffect(() => {
    if (isRedirecting && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (isRedirecting && countdown === 0) {
      window.location.href = '/';
    }
  }, [isRedirecting, countdown]);

  // Handle window resize
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
          height: window.innerHeight
        });
      };
      
      window.addEventListener('resize', handleResize);
      handleResize(); // Initialize size
      
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // Cancel redirection
  const stopRedirection = () => {
    setIsRedirecting(false);
  };

  // Restart redirection
  const startRedirection = () => {
    setIsRedirecting(true);
    setCountdown(15);
  };

  // Calculate font size for responsive 404 text
  const get404Size = () => {
    if (windowSize.width < 640) return 'text-7xl'; // Small mobile
    if (windowSize.width < 768) return 'text-8xl'; // Mobile
    if (windowSize.width < 1024) return 'text-9xl'; // Tablet
    return 'text-9xl'; // Desktop
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 dark:from-gray-900 dark:via-gray-800 dark:to-gray-950 flex flex-col items-center justify-center py-12 px-4">
      {/* Background Elements - Contained properly */}
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

  


      {/* Main Content - Properly contained */}
      <div className="relative z-10 w-full max-w-3xl mx-auto mt-10 md:mt-0">
        {/* 404 Number Animation - Responsive height and font size */}
        <div className="relative flex items-center justify-center h-32 sm:h-40 md:h-48 mb-4 sm:mb-6 overflow-visible">
          {/* Glitch effect layers - using responsive font classes */}
          <div className={`absolute ${get404Size()} font-black text-gray-200/70 dark:text-gray-800/40 select-none transform -translate-x-1 translate-y-1 animate-glitch-1`}>
            404
          </div>
          <div className={`absolute ${get404Size()} font-black text-gray-200/70 dark:text-gray-800/40 select-none transform translate-x-1 -translate-y-1 animate-glitch-2`}>
            404
          </div>
          
          {/* Main 404 text with gradient */}
          <div className={`relative z-10 ${get404Size()} font-black bg-clip-text text-transparent bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 select-none shadow-text animate-float`}>
            404
          </div>
        </div>
        
        {/* Error Message - Adjusted spacing */}
        <div className="text-center mb-8 md:mb-10">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
            Page Not Found
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-lg mx-auto px-4">
            The page you are looking for doesn't exist or has been moved.
          </p>
        </div>
        
        {/* Action Buttons - Responsive layout */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 md:mb-10 px-4">
          <Link href="/" className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            <Home size={18} className="transform group-hover:scale-110 transition-transform duration-300" />
            <span className="transform group-hover:translate-x-1 transition-transform duration-300">
              Go Home
            </span>
          </Link>
          
          <button 
            onClick={() => window.history.back()} 
            className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <ArrowLeft size={18} className="transform group-hover:-translate-x-1 transition-transform duration-300" />
            <span>Go Back</span>
          </button>
          
          <button 
            onClick={() => window.location.reload()} 
            className="w-full sm:w-auto group flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-900 hover:bg-gray-200 dark:hover:bg-gray-950 text-gray-900 dark:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            <RefreshCw size={18} className="transform group-hover:rotate-180 transition-transform duration-500" />
            <span>Refresh</span>
          </button>
        </div>
        
        {/* Redirect Timer - Responsive width and padding */}
        <div className="max-w-md mx-auto bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg rounded-xl p-4 shadow-lg border border-gray-100 dark:border-gray-800">
          {isRedirecting ? (
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
                Redirecting to homepage in <span className="font-bold text-blue-600 dark:text-blue-400">{countdown}</span> seconds
              </p>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 mb-2">
                <div 
                  className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-linear" 
                  style={{ width: `${((15 - countdown) / 15) * 100}%` }} 
                />
              </div>
              <button 
                onClick={stopRedirection}
                className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                Cancel redirect
              </button>
            </div>
          ) : (
            <div className="text-center">
              <p className="text-gray-700 dark:text-gray-300 font-medium mb-2 text-sm sm:text-base">
                Redirection cancelled
              </p>
              <button 
                onClick={startRedirection}
                className="text-xs sm:text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 hover:underline transition-colors"
              >
                Restart redirect timer
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Footer - Adjusted position */}
      <div className="w-full text-center text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-8 md:mt-12">
        © {new Date().getFullYear()} Yudo-Scheduler. All rights reserved.
      </div>
      
     
    </div>
  );
}