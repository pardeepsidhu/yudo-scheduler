'use client'
import React, { useEffect, useState } from 'react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { ArrowRight, Calendar, CheckIcon, ChevronLeft, ChevronRight, ChevronRightIcon, Clock, Quote, Settings, Star } from 'lucide-react';
import { RetroGrid } from '@/components/magicui/retro-grid';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { HeroSection } from './HeroSection';
import Image from 'next/image';
import { BackgroundBeams } from '@/components/ui/background-beams';
import ScheduleDemoButton from "@/components/ui/start-a-demo-button"
import { AvatarCircles } from '@/components/magicui/avatar-circles';
import { useRouter } from 'next/navigation';




const ProfessionalScheduler = () => {
  // State to track which elements have been scrolled into view
  const [isClient, setIsClient] = useState(false);
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const router = useRouter()
  // Only run on client-side to avoid SSR hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  const features = [
    
    { icon: <Clock className="h-5 w-5" />, text: "Save 8+ hours weekly" },
    { icon: <Calendar className="h-5 w-5" />, text: "Unlimted free trial" },
    { icon: <Settings className="h-5 w-5" />, text: "No credit card required" }
  ];


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
  
  // Initialize scroll animations after component mounts
  useEffect(() => {
    if (!isClient) return;

    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      
      elements.forEach(element => {
        const position = element.getBoundingClientRect();
        
        // If element is in viewport
        if (position.top < window.innerHeight - 100) {
          element.classList.add('animate-in');
        }
      });
    };
    
    // Initial check for elements in view
    setTimeout(animateOnScroll, 100);
    
    // Add scroll listener
    window.addEventListener('scroll', animateOnScroll);
    
    // Clean up
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, [isClient]);
  
  // Statistics data
  const statistics = [
    { title: "96%", subtitle: "Reduction in missed deadlines" },
    { title: "72%", subtitle: "Increase in team productivity" },
    { title: "45%", subtitle: "Less time spent in meetings" },
    { title: "3.5x", subtitle: "Return on investment" }
  ];

  const navigateTestimonials = (direction) => {
    if (direction === 'next') {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    } else {
      setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }
  };
  // Testimonials data
  const testimonials = [
    {
      quote: "Yudo Scheduler has completely transformed how our team manages deadlines and collaborates on projects.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: " ",
      img:'data:image/jpeg;base64,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',
    },
    {
      quote: "As a freelancer juggling multiple clients, Yudo has become my indispensable companion for staying organized.",
      author: "Michael Chen",
      role: "Independent Consultant",
      company: " ",
      img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQgAyXnbSXfUwDAzsUajlH63RE-HYJQl-eiAQ&s"
    },
    {
      quote: "The analytics provided by Yudo have helped us identify bottlenecks and optimize our team's workflow.",
      author: "Priya Sharma",
      role: "Operations Manager",
      company: " ",
      img:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR77ZZsWzsGY4LMMGtXNq6z8aCwV6Gjm_zbXg&s"
    }
  ];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 w-full overflow-hidden">
      {/* CSS for animations - using style tag for demo, in production move to a CSS file */}
      <style jsx>{`
        .scroll-animate {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
        }
        
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }
        
        .slide-in-left {
          transform: translateX(-50px);
        }
        
        .slide-in-right {
          transform: translateX(50px);
        }
        
        .slide-in-left.animate-in,
        .slide-in-right.animate-in {
          transform: translateX(0);
        }
        
        .scale-in {
          transform: scale(0.9);
        }
        
        .scale-in.animate-in {
          transform: scale(1);
        }
        
        .fade-in {
          opacity: 0;
        }
        
        .fade-in.animate-in {
          opacity: 1;
        }
      `}</style>

      {/* Hero Section */}
     <HeroSection/>

      {/* Main Features Section */}
      <div className="py-10  ">
      <div className={`bg-[url('https://img.freepik.com/free-vector/geometric-pattern-background-vector-white_53876-126684.jpg')] w-full h-full bg-center z-0 absolute opacity-30`} />
      
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 ">
 
        <div className="grid lg:grid-cols-2 gap-12 items-center ">
         
            <div className="order-2 lg:order-1">
    
              <div className="scroll-animate slide-in-left">
            
                <BoxReveal boxColor="#4f46e5" duration={0.5}>
            
                  <span className="inline-block text-sm font-bold py-1 px-4 rounded-full bg-indigo-100 text-indigo-700 mb-4">
                    PRODUCTIVITY REIMAGINED
                  </span>
                </BoxReveal>
              </div>
              
              <div className="scroll-animate slide-in-left delay-100">
                <BoxReveal boxColor="#4f46e5" duration={0.5}>
                
                  <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6">
                    Yudo Scheduler<span className="text-indigo-600">.</span>
                  </h2>
                </BoxReveal>
              </div>

              <div className="scroll-animate slide-in-left delay-200">
                <BoxReveal boxColor="#4f46e5" duration={0.5}>
                  <p className="text-xl text-gray-700 mb-6">
                    Your Day, Your Schedule, <span className="text-indigo-600 font-medium">Your Success.</span>
                  </p>
                </BoxReveal>
              </div>

              <div className="scroll-animate slide-in-left delay-300">
                <BoxReveal boxColor="#4f46e5" duration={0.5}>
                  <TypingAnimation className="text-gray-600 text-lg mb-8">
                    Do not just manage your tasks—master them. With our enterprise-grade scheduler, you will transform how you work, collaborate, and achieve your goals.
                  </TypingAnimation>
                </BoxReveal>
              </div>

              <div className="space-y-4 mb-8">
                {[
                  "AI-powered time management recommendations",
                  "Seamless integration with your existing tools",
                  "Cross-platform synchronization",
                  "Team collaboration features"
                ].map((item, index) => (
                  <div key={index} className={`flex items-start scroll-animate slide-in-left ${index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : index === 3 ? 'delay-300' : ''}`}>
                    <div className="flex-shrink-0 mt-1">
                      <CheckIcon className="size-5 text-indigo-600" />
                    </div>
                    <p className="ml-3 text-gray-600">{item}</p>
                  </div>
                ))}
              </div>

              <div className="scroll-animate slide-in-left delay-400">
                <BoxReveal boxColor="#4f46e5" duration={0.5}>
                  <ScheduleDemoButton >
                    Schedule a Demo
                    <ChevronRightIcon className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </ScheduleDemoButton>
                </BoxReveal>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative scroll-animate slide-in-right">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
                <Image
                  src="/landingPage/ScheduleDemp.jpg" 
                  alt="Yudo Scheduler Dashboard" 
                  className="relative z-10 rounded-xl ease-in-out duration-200 shadow-xl max-w-full h-auto hover:scale-105"
                  width={1000}
                  height={1000}
                />
              </div>
            </div>
          </div>
        </div>
       
      </div>

      {/* Benefits Section with Animated Counter */}
      <div className="py-16 bg-gradient-to-b from-gray-100 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-violet-900 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Cg fill-rule=%22evenodd%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%22.05%22%3E%3Cpath opacity=%22.5%22 d=%22M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-8 py-16 lg:px-16 relative z-10">
            <div className="w-full lg:w-1/2 space-y-8">
              <div className="relative inline-block group">
                <span className="absolute inset-0 bg-white bg-opacity-20 rounded-full blur-md transform group-hover:scale-110 transition-all duration-300"></span>
                <span className="relative inline-block font-bold py-1.5 px-5 rounded-full bg-indigo-500 text-white transform transition duration-300 group-hover:translate-y-[-2px] group-hover:shadow-lg">
                  Why Choose Yudo
                </span>
              </div>
              
              <h2 className="text-white text-4xl sm:text-5xl font-bold leading-tight">
                Achieve More With{' '}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-purple-300 to-blue-200 relative">
                  Less Effort
                  <svg className="absolute bottom-0 left-0 w-full h-1" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="url(#grad)" strokeWidth="2" />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#93c5fd" stopOpacity="0.7" />
                        <stop offset="50%" stopColor="#d8b4fe" stopOpacity="0.7" />
                        <stop offset="100%" stopColor="#93c5fd" stopOpacity="0.7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
              </h2>
              
              <p className="text-indigo-100 text-lg leading-relaxed">
                Yudo Scheduler doesn't just organize your tasks—it transforms your approach to time management. With intelligent prioritization, automated reminders, and deep analytics, you'll make better decisions about your time and resources.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                {statistics.map((stat, index) => (
                  <div
                    key={index}
                    className="relative group"
                    onMouseEnter={() => setHoveredStat(index)}
                    onMouseLeave={() => setHoveredStat(null)}
                  >
                    <div className="absolute inset-0 bg-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="bg-indigo-800 bg-opacity-50 p-6 rounded-xl relative z-10 transition-all duration-500 group-hover:shadow-xl group-hover:translate-y-[-4px] overflow-hidden">
                      <div className="absolute right-4 top-4 opacity-30 group-hover:opacity-100 transition-opacity">
                        {stat.icon}
                      </div>
                      <div className="flex items-center mb-2">
                        <p className="text-3xl font-bold text-white">{stat.title}</p>
                      </div>
                      <p className="text-indigo-200">{stat.subtitle}</p>
                      <div className="h-0 overflow-hidden group-hover:h-auto group-hover:mt-3 transition-all duration-300">
                        <p className="text-indigo-100 text-sm">{stat.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
             
            </div>
            
            <div className="w-full lg:w-1/2 flex justify-center">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-50 blur-xl group-hover:opacity-75 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-indigo-900 to-violet-900 p-1 rounded-xl overflow-hidden transform transition duration-500 group-hover:scale-[1.02] group-hover:shadow-2xl">
                  <div className="bg-gradient-to-br from-indigo-800 to-indigo-900 rounded-lg p-2">
                    <div className="flex justify-start space-x-1.5 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                    <div className=" flex items-center justify-center rounded-md overflow-hidden bg-indigo-950">
                      <img
                        src="/landingPage/WhyYudo.png"
                        alt="Professional using Yudo Scheduler"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-indigo-900 to-transparent opacity-50"></div>
        </div>
      </div>
    </div>

      {/* Testimonials with Scroll Animation */}
      <div className="bg-gradient-to-b from-white to-gray-50 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 relative z-10">
          <div className="inline-block mb-3">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-medium text-sm">
              <Star className="h-4 w-4 mr-2" />
              <span>Customer Stories</span>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-5xl font-bold mb-6 relative inline-block">
            Trusted by 
            <span className="relative ml-2">
              <span className="text-indigo-600">Industry Leaders</span>
              <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 150 10" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,5 Q37.5,0 75,5 T150,5" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            See how professionals across various industries have transformed their productivity with Yudo Scheduler.
          </p>
        </div>
        
        {/* Desktop Layout - Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 relative z-10">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="relative group cursor-pointer"
              onMouseEnter={() => setHoveredTestimonial(index)}
              onMouseLeave={() => setHoveredTestimonial(null)}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl opacity-0 transform scale-95 group-hover:scale-105 group-hover:opacity-100 transition-all duration-300 -z-10 blur-lg"></div>
              
              <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:border-transparent h-full flex flex-col">
                <div className="flex justify-between items-start mb-6">
                  <Quote className="h-10 w-10 text-indigo-400 opacity-70" />
                  <div className="flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
                
                <p className="text-gray-700 mb-6 flex-grow italic">"{testimonial.quote}"</p>
                
                <div className="flex items-center mt-auto">
                  <div className={`h-12 w-12 rounded-full overflow-hidden transform transition-transform duration-300 ${hoveredTestimonial === index ? 'scale-110' : ''}`}>
                    <img 
                      src={testimonial.img} 
                      alt={testimonial.author}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="ml-4">
                    <p className="font-semibold text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}{testimonial.company}</p>
                  </div>
                  <div className={`ml-auto bg-indigo-100 text-indigo-600 text-xs font-medium py-1 px-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0`}>
                    {testimonial.industry}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Mobile Layout - Carousel */}
        <div className="md:hidden relative">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${activeIndex * 100}%)` }}
            >
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="min-w-full px-4"
                >
                  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-full flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <Quote className="h-8 w-8 text-indigo-400 opacity-70" />
                      
                      <div className="flex">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="h-3 w-3 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-700 mb-6 flex-grow text-sm italic">"{testimonial.quote}"</p>
                    
                    <div className="flex items-center mt-auto">
                      <div className="h-10 w-10 rounded-full overflow-hidden">
                        <img 
                          src={testimonial.img} 
                          alt={testimonial.author}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-3">
                        <p className="font-semibold text-gray-900 text-sm">{testimonial.author}</p>
                        <p className="text-gray-500 text-xs">{testimonial.role}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Mobile Navigation Controls */}
          <div className="flex justify-center items-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-indigo-600 w-6' : 'bg-gray-300'}`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
          
          <button 
            onClick={() => navigateTestimonials('prev')}
            className="absolute top-1/2 left-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
          
          <button 
            onClick={() => navigateTestimonials('next')}
            className="absolute top-1/2 right-0 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md"
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        </div>
        
        {/* Decorative elements */}
        <div className="hidden lg:block absolute top-40 right-10 w-64 h-64 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="hidden lg:block absolute bottom-40 left-10 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      
      </div>
    </div>
      
      {/* Call to Action */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 py-20">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -right-10 -top-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
        <div className="absolute left-0 bottom-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute right-1/3 top-1/3 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          <div className="inline-block mb-6">
            <div className="animate-pulse-slow inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-700 bg-opacity-50 backdrop-blur-sm border border-indigo-500 border-opacity-40">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              <span className="text-indigo-100 text-sm font-medium">Limited Time Offer</span>
            </div>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
            Ready to 
            <span className="relative mx-2">
              Transform
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="#818cf8" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span> 
            Your Productivity?
          </h2>
          
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-10">
            Join thousands of professionals who have revolutionized their time management with Yudo Scheduler.
          </p>
          
          <div className="mb-12 relative w-full max-w-md">
            <div 
              className={`relative group transition-all duration-500 transform ${isHovered ? 'scale-105' : 'scale-100'}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              {/* Button glow effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-500"></div>
              
              <button onClick={()=>router.push("/dashboard")} className="relative w-full px-8 py-4 bg-white rounded-lg flex items-center justify-center space-x-2 text-indigo-900 font-bold text-lg shadow-xl transition-all duration-500">
                <span>Get Started Today</span>
                <ArrowRight className={`h-5 w-5 transition-transform duration-500 ${isHovered ? 'translate-x-1' : ''}`} />
              </button>
            </div>
            
            {/* Button shine animation */}
            <div className={`absolute inset-0 -z-10 overflow-hidden rounded-lg ${isHovered ? 'animate-shine' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full transform-gpu animate-shine"></div>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2 text-indigo-200">
                <div className="p-1 bg-indigo-800 bg-opacity-50 rounded-full">
                  {feature.icon}
                </div>
                <span>{feature.text}</span>
              </div>
            ))}
          </div>
          
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex -space-x-2">
              <AvatarCircles numPeople={999} avatarUrls={avatars} />
              
              </div>
              <div className="text-indigo-200 text-sm">
                <span className="font-bold"></span> users joined this month
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-4 h-4 text-yellow-400 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <div className="text-indigo-200 text-sm">
                <span className="font-bold">4.9/5</span> from 2,000+ reviews
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default ProfessionalScheduler;