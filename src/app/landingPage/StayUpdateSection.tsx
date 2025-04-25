import { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

export default function EnhancedLandingSection() {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  // Handle scroll effect for parallax and reveal animations
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    // Set initial visibility after a small delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 300);

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timer);
    };
  }, []);

  // Custom aurora text effect component
  const AuroraText = ({ children }) => (
    <span className="relative inline-block">
      <span className="relative z-10 bg-gradient-to-r from-purple-600 via-blue-500 to-indigo-600 text-transparent bg-clip-text font-black">
        {children}
      </span>
      <span className="absolute inset-0 bg-gradient-to-r from-purple-400 via-blue-400 to-indigo-400 blur-xl opacity-30 animate-pulse"></span>
    </span>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Parallax Background with subtle movement */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10 transition-transform duration-500"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1557682224-5b8590cd9ec5')",
          transform: `translateY(${scrollY * 0.15}px)` 
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/5 to-white/20"></div>
      
      {/* Content container */}
      <div className="container mx-auto px-6 relative z-10 text-center">
        <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-4 group">
            STAY NOTIFIED WITH{" "}
            <span className="inline-block group-hover:scale-105 transition-transform duration-300">
              <AuroraText>YUDO</AuroraText>
            </span>
          </h1>
          
          <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
            Never miss an update again! Get real-time reminders via{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-indigo-500 hover:to-purple-600 transition-colors duration-300 cursor-pointer">
              Email
            </span>{" "}
            and{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500 hover:from-cyan-500 hover:to-blue-400 transition-colors duration-300 cursor-pointer">
              Telegram
            </span>
            —effortless, instant, and stress-free.
          </p>
          
         
          
          {/* Floating elements for visual interest */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 rounded-full bg-gradient-to-r from-indigo-300 to-purple-300 opacity-20 blur-xl animate-float-slow"></div>
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 rounded-full bg-gradient-to-r from-blue-300 to-cyan-300 opacity-20 blur-xl animate-float-medium"></div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2">
        <div className="animate-bounce">
          <a 
            href="#features"
            className="inline-flex items-center justify-center p-4 rounded-full bg-white/90 shadow-lg hover:shadow-xl hover:bg-white transition-all duration-300 group"
          >
            <ChevronDown className="w-6 h-6 text-gray-800 group-hover:text-indigo-600 transition-colors" />
          </a>
        </div>
      </div>
    </div>
  );
}