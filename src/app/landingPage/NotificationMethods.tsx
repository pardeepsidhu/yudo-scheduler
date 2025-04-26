import { useState, useEffect, useRef } from 'react';
import { Mail, Send, Calendar, Plane } from 'lucide-react';
import { AuroraText } from '@/components/magicui/aurora-text';

export default function EnhancedFeaturesSection() {
  // For intersection observer to trigger animations
  const featuresRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );
    
    if (featuresRef.current) {
      observer.observe(featuresRef.current);
    }
    
    return () => {
      if (featuresRef.current) {
        observer.unobserve(featuresRef.current);
      }
    };
  }, []);
  
  // BoxReveal component for animated entry of feature cards
  const BoxReveal = ({ children, boxColor, delay = 0 }) => {
    const [revealed, setRevealed] = useState(false);
    const boxRef = useRef(null);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setTimeout(() => setRevealed(true), delay * 1000);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1 }
      );
      
      if (boxRef.current) {
        observer.observe(boxRef.current);
      }
      
      return () => {
        if (boxRef.current) {
          observer.unobserve(boxRef.current);
        }
      };
    }, [delay]);
    
    return (
      <div 
        ref={boxRef}
        className={`transition-all duration-700 transform ${
          revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
        }`}
      >
        {children}
      </div>
    );
  };
  
  // InteractiveGrid component for hover effects and interactions
  const InteractiveGrid = ({ children, className }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <div 
        className={`${className} relative group`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Subtle glow effect on hover */}
        <div 
          className={`absolute inset-0 rounded-3xl transition-opacity duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            boxShadow: '0 0 30px rgba(99, 102, 241, 0.15)',
            zIndex: -1
          }}
        />
        {children}
      </div>
    );
  };
  
  // TypingAnimation component for animated text reveal
  const TypingAnimation = ({ children, className }) => {
    const textRef = useRef(null);
    const [visible, setVisible] = useState(false);
    
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.unobserve(entry.target);
          }
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      
      if (textRef.current) {
        observer.observe(textRef.current);
      }
      
      return () => {
        if (textRef.current) {
          observer.unobserve(textRef.current);
        }
      };
    }, []);
    
    // The text animation logic
    const text = children?.toString() || '';
    const [displayText, setDisplayText] = useState('');
    
    useEffect(() => {
      if (!visible) return;
      
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayText(text.substring(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
        }
      }, 20);
      
      return () => clearInterval(interval);
    }, [visible, text]);
    
    return (
      <p ref={textRef} className={className}>
        {visible ? displayText : ''}
        {visible && displayText.length < text.length && (
          <span className="inline-block w-1 h-5 bg-indigo-500 animate-blink ml-1"></span>
        )}
      </p>
    );
  };
  
  // FlightWidget component - animated flight info widget
  const FlightWidget = () => {
    return (
      <div className="relative bg-white rounded-xl p-4 shadow-md w-48">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500">NOTIFICATION</span>
            <span className="text-xs font-bold text-indigo-600">ACTIVE</span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="text-lg font-bold">YDO</div>
            <div className="flex items-center px-2">
              <Plane size={16} className="text-indigo-600 animate-pulse" />
              <div className="w-16 h-0.5 bg-gradient-to-r from-indigo-200 to-indigo-600"></div>
            </div>
            <div className="text-lg font-bold">INX</div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-gray-500">Status</div>
            <div className="font-medium text-green-600">Delivered</div>
          </div>
          
          <div className="flex justify-between text-sm">
            <div className="text-gray-500">Time</div>
            <div className="font-medium">Just now</div>
          </div>
        </div>
      </div>
    );
  };
  
  // CalendarEvent component - animated calendar widget
  const CalendarEvent = () => {
    return (
      <div className="relative bg-white rounded-xl p-4 shadow-md w-48">
        <div className="flex flex-col space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-xs font-semibold text-gray-500">REMINDER</span>
            <span className="text-xs font-bold text-blue-500">TODAY</span>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
              <Calendar size={18} className="text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-semibold">Meeting</p>
              <p className="text-xs text-gray-500">1:00 PM</p>
            </div>
          </div>
          
          <div className="h-1 w-full bg-gradient-to-r from-blue-200 to-blue-500 rounded-full">
            <div className="h-full w-3/4 bg-blue-500 rounded-full animate-pulse"></div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500">
            <span>9:00 AM</span>
            <span>6:00 PM</span>
          </div>
        </div>
      </div>
    );
  };
  
  // Custom image component to handle responsive behavior
  const Image = ({ src, alt, className, width, height }) => {
    return (
      <div className={`relative ${className}`} style={{ width: `${width}px`, height: `${height}px` }}>
        <div 
          className="w-full h-full bg-cover bg-center rounded-2xl transform transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url('${src}')` }}
          role="img"
          aria-label={alt}
        ></div>
      </div>
    );
  };
  
  return (
    <div
      id="features"
      ref={featuresRef}
      className="container mx-auto px-4 py-24 overflow-hidden"
    >
      {/* Section Header with Animation */}
      <div className={`text-center mb-16 transition-all duration-1000 transform ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'
      }`}>
        <span className="bg-indigo-50 text-indigo-700 py-1 px-4 rounded-full text-sm font-medium tracking-wide inline-block relative">
          <span className="relative z-10">NOTIFICATION METHODS</span>
          <span className="absolute inset-0 bg-indigo-100 rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
        </span>
        
        <h2 className="mt-4 text-4xl font-bold text-gray-900 bg-clip-text bg-gradient-to-r from-gray-900 to-gray-700">
          Choose How You Stay <AuroraText>Connected</AuroraText>
        </h2>
        
        <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
          Customize your notification experience with our flexible delivery options.
        </p>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-1/4 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
      </div>
      
      {/* Feature Cards Grid */}
      <div className="grid gap-12 md:grid-cols-2 items-stretch">
        {/* Email Notifications */}
        <BoxReveal boxColor="#5046e6" delay={0.2}>
          <InteractiveGrid className="p-8 bg-white rounded-3xl shadow-xl flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-indigo-50 rounded-xl group-hover:bg-indigo-100 transition-colors duration-300">
                  <Mail className="text-indigo-600" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Email Alerts
                </h3>
              </div>
              
              <TypingAnimation className="text-gray-700 text-lg md:text-xl leading-relaxed">
                Receive inbox alerts—daily updates, urgent reminders, and
                tailored weekly reports with ease
              </TypingAnimation>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-indigo-50 rounded-2xl mt-8 p-6 group-hover:bg-indigo-100/50 transition-colors duration-300">
              <div className="hidden md:flex transform transition-all duration-500 group-hover:translate-x-2">
                <FlightWidget />
              </div>
              
              <Image
                src="/landingPage/EmailAlert.jpeg"
                alt="Email notification preview"
                className="object-cover h-48 rounded-2xl shadow-md transition-all duration-500 group-hover:shadow-lg"
                width={275}
                height={207}
              />
            </div>
          </InteractiveGrid>
        </BoxReveal>
        
        {/* Telegram Notifications */}
        <BoxReveal boxColor="#27C5FA" delay={0.4}>
          <InteractiveGrid className="p-8 bg-white rounded-3xl shadow-xl flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors duration-300">
                  <Send className="text-blue-400" size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Telegram Bot
                </h3>
              </div>
              
              <TypingAnimation className="text-gray-700 text-lg md:text-xl leading-relaxed">
                Get Telegram alerts—push notifications, quick commands, smart
                scheduling at fingertips.
              </TypingAnimation>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-blue-50 rounded-2xl mt-8 p-6 group-hover:bg-blue-100/50 transition-colors duration-300">
              <div className="hidden md:flex transform transition-all duration-500 group-hover:translate-x-2">
                <CalendarEvent />
              </div>
              
              <Image
                src="/landingPage/TelegramAlert.jpeg"
                alt="Telegram bot preview"
                className="object-cover h-48 rounded-2xl shadow-md transition-all duration-500 group-hover:shadow-lg"
                width={275}
                height={207}
              />
            </div>
          </InteractiveGrid>
        </BoxReveal>
      </div>
    </div>
  );
}