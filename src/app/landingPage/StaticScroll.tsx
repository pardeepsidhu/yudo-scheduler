"use client"
import React, { useEffect, useRef } from 'react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { MailIcon, SendIcon, BellIcon, CheckCircleIcon, Calendar } from 'lucide-react';
import InteractiveGrid from '@/components/bg-grid';
import CalendarEvent from '@/components/calender';
import FlightWidget from '@/components/flight-card';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';

const Notifications = () => {
  // Refs for scroll animations
  const featuresRef = useRef(null);
  const whyMattersRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    // Simple intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all refs
    [featuresRef, whyMattersRef, testimonialsRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Hero Section with Parallax Effect */}
      <div className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1557682224-5b8590cd9ec5')] bg-cover bg-center opacity-5"></div>
        
        <div className="container mx-auto px-6 relative z-10 text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 mb-4">
              STAY NOTIFIED WITH <AuroraText>YUDO</AuroraText>
            </h1>
            <p className="mt-6 text-xl md:text-2xl max-w-3xl mx-auto text-gray-600 leading-relaxed">
              Never miss an update again! Get real-time reminders via{" "}
              <span className="font-semibold text-[#5046e6]">Email</span> and{" "}
              <span className="font-semibold text-[#27C5FA]">Telegram</span>—effortless,
              instant, and stress-free.
            </p>
            
            <div className="mt-10 animate-bounce">
              <a href="#features" className="inline-flex items-center justify-center p-4 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300">
                <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" ref={featuresRef} className="container mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <span className="bg-indigo-50 text-indigo-700 py-1 px-4 rounded-full text-sm font-medium tracking-wide">
            NOTIFICATION METHODS
          </span>
          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            Choose How You Stay Connected
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-2xl mx-auto">
            Customize your notification experience with our flexible delivery options.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 items-stretch">
          {/* Email Notifications */}
          <BoxReveal boxColor="#5046e6" duration={0.5}>
            <InteractiveGrid className="p-8 bg-white rounded-3xl shadow-xl flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-indigo-50 rounded-xl">
                    <MailIcon className="text-[#5046e6]" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Email Alerts</h3>
                </div>
                <TypingAnimation className="text-gray-700 text-xl md:text-2xl">
                  Receive inbox alerts—daily updates, urgent reminders, and tailored weekly reports with ease
                </TypingAnimation>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-indigo-50 rounded-2xl mt-8 p-6">
                <FlightWidget />
              
                  <img
                  
                    src="data:image/jpeg;base64,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"
                    alt="Email notification preview"
                    className="object-cover w-full h-full rounded-2xl"
                  />
              
              </div>
            </InteractiveGrid>
          </BoxReveal>

          {/* Telegram Notifications */}
          <BoxReveal boxColor="#27C5FA" duration={0.5}>
            <InteractiveGrid className="p-8 bg-white rounded-3xl shadow-xl flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <SendIcon className="text-[#27C5FA]" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Telegram Bot</h3>
                </div>
                <TypingAnimation className="text-gray-700 text-xl md:text-2xl">
                  Get Telegram alerts—push notifications, quick commands, smart scheduling at fingertips.
                </TypingAnimation>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-blue-50 rounded-2xl mt-8 p-6">
        <CalendarEvent />
                {/* <div className="hidden sm:block relative w-32 h-32 rounded-2xl overflow-hidden"> */}
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbDFF13A6lP3dDIN0L8d6vgEyQz88HIvmzZg&s"
                    alt="Telegram bot preview"
                    className="object-cover w-full h-full rounded-2xl"
                  />
                {/* </div> */}
              </div>
            </InteractiveGrid>
          </BoxReveal>
        </div>
      </div>

      {/* Why It Matters Section with Parallax */}
      <div ref={whyMattersRef} className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 p-8 md:p-16 space-y-6">
                <span className="inline-block font-semibold py-1 px-4 rounded-full bg-[#5046e6] text-white tracking-wide text-sm">
                  WHY NOTIFICATIONS MATTER
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  <AuroraText>Never Miss Out</AuroraText>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Whether you're juggling work, study, or personal commitments—Yudo keeps you on track. 
                  Timely updates mean more peace of mind, less chaos.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="text-green-500" size={24} />
                    <span className="text-gray-700">Improved productivity</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="text-green-500" size={24} />
                    <span className="text-gray-700">Better time management</span>
                  </div>
                </div>
              </div>

              <div style={{background:"linear-gradient(45deg, #ec4899, #facc15, #06b6d4)"}} className="w-full rounded-3xl md:w-1/2 bg-indigo-50 p-2 flex items-center justify-center">
                <img 
                className='rounded-2xl'
                src="https://thumbs.dreamstime.com/b/happy-young-manager-woman-using-tablet-office-co-working-space-looking-away-smiling-laughing-thinking-business-career-358743078.jpg" alt="ff" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-green-50 text-green-700 py-1 px-4 rounded-full text-sm font-medium tracking-wide">
            TESTIMONIALS
          </span>
          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            What Our Users Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Project Manager",
              quote: "Yudo notifications have transformed how I manage deadlines. The email alerts are timely and the Telegram integration is seamless.",
            },
            {
              name: "David Chen",
              role: "Student",
              quote: "As a busy student juggling multiple classes, Yudo keeps me on track with all my assignments and exams. I haven't missed a deadline since!",
            },
            {
              name: "Michelle Rodriguez",
              role: "Freelancer",
              quote: "The customizable notification system helps me manage multiple clients and projects efficiently. A game-changer for my business.",
            },
          ].map((testimonial, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4 text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic flex-grow">{testimonial.quote}</p>
         

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">{testimonial.name}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#5046e6] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Stay Updated?
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Join thousands of users who never miss an important update with Yudo's notification system.
          </p>
          <button className="bg-white text-[#5046e6] font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Get Started Now
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <h3 className="text-2xl font-bold">YUDO</h3>
              <p className="text-gray-400 mt-2">Your Ultimate Digital Organizer</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-indigo-400 transition-colors">About</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Features</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Pricing</a>
              <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© {new Date().getFullYear()} Yudo. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};


export default Notifications;