"use client"
import React, { useEffect, useRef } from 'react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { MailIcon, SendIcon, CheckCircleIcon } from 'lucide-react';
import InteractiveGrid from '@/components/bg-grid';
import CalendarEvent from '@/components/calender';
import FlightWidget from '@/components/flight-card';
import Image from 'next/image';

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
              
                  <Image
                  
                    src="/landingPage/EmailAlert.jpeg"
                    alt="Email notification preview"
                    className="object-cover w-full h-full rounded-2xl"
                    // style={{width:"100%",height:'100%'}}
                    width={1000}
                    height={1000}
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
                  <Image
                    src="/landingPage/TelegramAlert.jpeg"
                    alt="Telegram bot preview"
                    className="object-cover w-full h-full rounded-2xl"
                    width={1000}
                    height={1000}
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
                  Whether you&apos;re juggling work, study, or personal commitments—Yudo keeps you on track. 
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
                <Image
                className='rounded-2xl'
                src="/landingPage/WhyNotificatin.png" alt="ff" 
                height={1000}
                width={1000}
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
            Join thousands of users who never miss an important update with Yudo&apos;s notification system.
          </p>
          <button className="bg-white text-[#5046e6] font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300">
            Get Started Now
          </button>
        </div>
      </div>

    </div>
  );
};


export default Notifications;