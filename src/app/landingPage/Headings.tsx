'use client'
import React, { useEffect, useState } from 'react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { RetroGrid } from '@/components/magicui/retro-grid';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import { HeroSection } from './HeroSection';
import Image from 'next/image';
import { BackgroundBeams } from '@/components/ui/background-beams';




const ProfessionalScheduler = () => {
  // State to track which elements have been scrolled into view
  const [isClient, setIsClient] = useState(false);

  // Only run on client-side to avoid SSR hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

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
      <div className="py-20  ">
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
                  <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-md font-medium text-lg transition-colors duration-300 flex items-center group">
                    Schedule a Demo
                    <ChevronRightIcon className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </BoxReveal>
              </div>
            </div>
            
            <div className="order-1 lg:order-2 flex justify-center">
              <div className="relative scroll-animate slide-in-right">
                <div className="absolute inset-0 bg-indigo-100 rounded-full blur-3xl opacity-30"></div>
                <Image
                  src="/landingPage/ScheduleDemp.jpg" 
                  alt="Yudo Scheduler Dashboard" 
                  className="relative z-10 rounded-xl shadow-xl max-w-full h-auto"
                  width={1000}
                  height={1000}
                />
              </div>
            </div>
          </div>
        </div>
       
      </div>

      {/* Benefits Section with Animated Counter */}
      <div className="py-20 bg-gradient-to-b from-gray-100 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-indigo-900 text-white shadow-xl scroll-animate scale-in">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12 px-8 py-16 lg:px-16">
              <div className="w-full lg:w-1/2 space-y-6 relative z-10">
                <span className="inline-block font-bold py-1 px-4 rounded-full bg-indigo-500 text-white scroll-animate fade-in">
                  Why Choose Yudo
                </span>
                <h2 className="text-white text-4xl sm:text-5xl font-bold leading-tight scroll-animate fade-in delay-100">
                  Achieve More With <AuroraText>Less Effort</AuroraText>
                </h2>
                <p className="text-indigo-100 text-lg leading-relaxed scroll-animate fade-in delay-200">
                  Yudo Scheduler doesn&apos;t just organize your tasks—it transforms your approach to time management. With intelligent prioritization, automated reminders, and deep analytics, you&apos;ll make better decisions about your time and resources.
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
                  {statistics.map((stat, index) => (
                    <div 
                      key={index} 
                      className={`bg-indigo-800 bg-opacity-50 p-6 rounded-xl scroll-animate fade-in ${index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : index === 3 ? 'delay-300' : ''}`}
                    >
                      <p className="text-3xl font-bold text-white">{stat.title}</p>
                      <p className="text-indigo-200">{stat.subtitle}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="w-full lg:w-1/2 flex justify-center relative z-10">
                <div className="scroll-animate scale-in delay-300">
                  <Image
                    src="/landingPage/WhyYudo.png" 
                    alt="Professional using Yudo Scheduler"
                    className="w-full max-w-lg rounded-xl shadow-lg object-cover hover:scale-105 transition-transform duration-500"
                    width={1000}
                    height={1000}
                 />
                </div>
              </div>
            </div>
            <RetroGrid className="opacity-10" />
          </div>
        </div>
    
      </div>

      {/* Testimonials with Scroll Animation */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 scroll-animate">
              Trusted by <span className="text-indigo-600">Industry Leaders</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto scroll-animate delay-100">
              See how professionals across various industries have transformed their productivity with Yudo Scheduler.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                className={`bg-gray-50 p-8 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 scroll-animate ${index === 1 ? 'delay-100' : index === 2 ? 'delay-200' : ''}`}
              >
                <svg className="h-8 w-8 text-indigo-400 mb-4" fill="currentColor" viewBox="0 0 32 32">
                  <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                </svg>
                <p className="text-gray-600 mb-6">{testimonial.quote}</p>
                <div className="flex items-center">
                  <div className="bg-indigo-100 h-12 w-12 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">
                  <Avatar className='w-full h-full'>
  <AvatarImage className='rounded-full w-full h-full' src={testimonial.img} />
  <AvatarFallback>CN</AvatarFallback>
</Avatar>

                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{testimonial.author}</p>
                    <p className="text-gray-500 text-sm">{testimonial.role}{testimonial.company}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="bg-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6 scroll-animate">
            Ready to Transform Your Productivity?
          </h2>
          <p className="text-xl text-indigo-200 max-w-3xl mx-auto mb-8 scroll-animate delay-100">
            Join thousands of professionals who have revolutionized their time management with Yudo Scheduler.
          </p>
          <div className="scroll-animate delay-200">
            <button className="bg-white text-indigo-900 hover:bg-indigo-100 px-8 py-4 rounded-md font-bold text-lg transition-colors duration-300 inline-flex items-center group">
              Get Started Today
              <ChevronRightIcon className="ml-2 size-5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalScheduler;