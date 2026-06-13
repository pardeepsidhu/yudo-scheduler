'use client'
import React, { useEffect, useState } from 'react';
import { ArrowRight, Calendar, CheckIcon, ChevronLeft, ChevronRight, Clock, Quote, Settings, Star, Zap, Users, TrendingUp, Shield, Sparkles } from 'lucide-react';


function YudoSchedulerSection() {
  return (
    <section className="relative py-12 px-4 sm:px-6 lg:px-6 overflow-visible bg-white ">
      {/* Grid background */}
     


      <div
        className="absolute pointer-events-none"
        style={{
          width: 280,
          height: 280,
          bottom: -60,
          left: -60,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(139,92,246,0.10) 0%, transparent 70%)",
          filter: "blur(80px)",
        }}
      />

      <div className="max-w-full px-[2vw] mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <div className="order-2 lg:order-1">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-5 text-xs font-semibold tracking-widest uppercase"
              style={{
                background: "rgba(99,79,220,0.10)",
                border: "1px solid rgba(99,79,220,0.20)",
                color: "#4f3db5",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "#634fdc",
                  animation: "ys-pulse 2s infinite",
                }}
              />
              Productivity Reimagined
            </div>

            {/* Headline */}
            <h2
              className="text-4xl sm:text-5xl font-extrabold mb-2 leading-tight tracking-tight"
              style={{ color: "#0f0d1f", fontFamily: "'Sora', sans-serif" }}
            >
              Yudo Scheduler
              <span style={{ color: "#634fdc" }}>.</span>
            </h2>

            {/* Subheadline */}
            <p
              className="text-xl font-medium mb-4"
              style={{ color: "#3d3a5c" }}
            >
              Your Day, Your Schedule,{" "}
              <span
                className="font-bold"
                style={{
                  background:
                    "linear-gradient(135deg, #634fdc 0%, #9b59e0 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Your Success.
              </span>
            </p>

            {/* Body */}
            <p
              className="text-base leading-relaxed mb-8"
              style={{ color: "#5a5575", maxWidth: 460 }}
            >
              Don't just manage your tasks—master them. With our enterprise-grade
              scheduler, you'll transform how you work, collaborate, and achieve
              your goals.
            </p>

            {/* Checklist */}
            <ul className="space-y-3 mb-9">
              {[
                "AI-powered time management recommendations",
                "Seamless integration with your existing tools",
                "Cross-platform synchronization",
                "Team collaboration features",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3">
                  <span
                    className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-md"
                    style={{
                      background:
                        "linear-gradient(135deg, #634fdc, #9b59e0)",
                    }}
                  >
                    <CheckIcon className="w-3 h-3 text-white" />
                  </span>
                  <span
                    className="text-sm font-medium"
                    style={{ color: "#2d2a47" }}
                  >
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            <button
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm transition-all duration-300 hover:-translate-y-0.5"
              style={{
                background:
                  "linear-gradient(135deg, #634fdc 0%, #9b59e0 100%)",
                boxShadow: "0 4px 24px rgba(99,79,220,0.28)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 8px 32px rgba(99,79,220,0.40)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 24px rgba(99,79,220,0.28)";
              }}
            >
              Schedule a Demo
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Right: Image */}
          <div className="order-1 lg:order-2 relative">
            {/* Floating card — top right */}
            <div
              className="absolute -top-5 -right-4 z-20 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold shadow-lg"
              style={{
                background: "#fff",
                border: "0.5px solid rgba(99,79,220,0.15)",
                color: "#0f0d1f",
                animation: "ys-float 3s ease-in-out 1.5s infinite",
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg text-base"
                style={{ background: "#eef0ff" }}
              >
                📅
              </span>
              <div>
                <div>3 tasks synced</div>
                <div className="text-[10px] font-normal text-gray-400">
                  Just now
                </div>
              </div>
            </div>

            {/* Image card */}
            <div
              className="relative rounded-2xl overflow-hidden transition-all duration-500 hover:-translate-y-1 hover:scale-[1.01]"
              style={{
                border: "1.5px solid rgba(99,79,220,0.15)",
                boxShadow:
                  "0 2px 4px rgba(15,13,31,0.04), 0 8px 24px rgba(15,13,31,0.08), 0 24px 64px rgba(99,79,220,0.12)",
              }}
            >
              {/* Window chrome */}
              <div
                className="flex items-center gap-1.5 px-4"
                style={{
                  height: 36,
                  background: "rgba(255,255,255,0.95)",
                  borderBottom: "0.5px solid rgba(99,79,220,0.10)",
                }}
              >
                <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-400" />
              </div>

              <img
                src="/h2.jpeg"
                alt="Yudo Scheduler Interface"
                className="w-full aspect-square object-cover object-center block"
              />
            </div>

            {/* Glow behind image */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset: -24,
                borderRadius: 32,
                background:
                  "linear-gradient(135deg, rgba(99,79,220,0.18) 0%, rgba(139,92,246,0.12) 100%)",
                filter: "blur(32px)",
                zIndex: -1,
              }}
            />

            {/* Floating card — bottom left */}
            <div
              className="absolute -bottom-5 -left-6 z-20 flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-semibold shadow-lg"
              style={{
                background: "#fff",
                border: "0.5px solid rgba(99,79,220,0.15)",
                color: "#0f0d1f",
                animation: "ys-float 3s ease-in-out infinite",
              }}
            >
              <span
                className="flex items-center justify-center w-8 h-8 rounded-lg text-base"
                style={{ background: "#f0fbf4" }}
              >
                ✅
              </span>
              <div>
                <div>+24% productivity</div>
                <div className="text-[10px] font-normal text-gray-400">
                  This week
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@700;800&display=swap');
        @keyframes ys-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.8); }
        }
        @keyframes ys-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </section>
  );
}

const ProfessionalScheduler = () => {
  const [isClient, setIsClient] = useState(false);
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    setIsClient(true);
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isClient) return;
    const animateOnScroll = () => {
      const elements = document.querySelectorAll('.scroll-animate');
      elements.forEach(element => {
        const position = element.getBoundingClientRect();
        if (position.top < window.innerHeight - 100) {
          element.classList.add('animate-in');
        }
      });
    };
    setTimeout(animateOnScroll, 100);
    window.addEventListener('scroll', animateOnScroll);
    return () => window.removeEventListener('scroll', animateOnScroll);
  }, [isClient]);

  const features = [
    { icon: <Clock className="w-5 h-5" />, text: "Save 8+ hours" },
    { icon: <Calendar className="w-5 h-5" />, text: "Unlimited free " },
    { icon: <Settings className="w-5 h-5" />, text: "No credit card required" }
  ];

  const statistics = [
    {
      title: "96%",
      subtitle: "Reduction in missed deadlines",
      icon: <TrendingUp className="w-8 h-8" />,
      description: "Teams report dramatic improvement in deadline management"
    },
    {
      title: "72%",
      subtitle: "Increase in team productivity",
      icon: <Zap className="w-8 h-8" />,
      description: "Streamlined workflows boost overall efficiency"
    },
    {
      title: "45%",
      subtitle: "Less time spent in meetings",
      icon: <Users className="w-8 h-8" />,
      description: "Smart scheduling reduces unnecessary meetings"
    },
    {
      title: "3.5x",
      subtitle: "Return on investment",
      icon: <Shield className="w-8 h-8" />,
      description: "Proven ROI within the first quarter"
    }
  ];

  const testimonials = [
    {
      quote: "Yudo Scheduler has completely transformed how our team manages deadlines and collaborates on projects.",
      author: "Sarah Johnson",
      role: "Marketing Director",
      company: "Tech Innovations",
      rating: 5,
      industry: "Technology",
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop'
    },
    {
      quote: "As a freelancer juggling multiple clients, Yudo has become my indispensable companion for staying organized.",
      author: "Michael Chen",
      role: "Independent Consultant",
      company: "Freelance",
      rating: 5,
      industry: "Consulting",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      quote: "The analytics provided by Yudo have helped us identify bottlenecks and optimize our team's workflow.",
      author: "Priya Sharma",
      role: "Operations Manager",
      company: "Global Logistics",
      rating: 5,
      industry: "Logistics",
      img: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop"
    }
  ];

  const navigateTestimonials = (direction: any) => {
    if (direction === 'next') {
      setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    } else {
      setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 via-white to-slate-50 w-full overflow-hidden">
      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes shine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .animate-shine > div { animation: shine 2s infinite; }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        
        .scroll-animate {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1), 
                      transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .scroll-animate.animate-in {
          opacity: 1;
          transform: translateY(0);
        }
        .delay-100 { transition-delay: 100ms; }
        .delay-200 { transition-delay: 200ms; }
        .delay-300 { transition-delay: 300ms; }
        .delay-400 { transition-delay: 400ms; }
        
        .gradient-text {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .card-hover {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .card-hover:hover {
          transform: translateY(-8px);
        }
      `}</style>



      {/* Features Section */}
      <YudoSchedulerSection />

      {/* Statistics Section */}
      <section className="py-2 md:py-4 bg-gradient-to-b from-white to-slate-50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 shadow-2xl">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Cg fill-rule=%22evenodd%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%22.05%22%3E%3Cpath opacity=%22.5%22 d=%22M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>

            <div className="relative z-10 px-6 sm:px-8 md:px-16 py-12 md:py-20">
              <div className="flex flex-col lg:flex-row items-center gap-12">
                <div className="w-full lg:w-1/2 space-y-6">
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-500 bg-opacity-30 backdrop-blur-sm border border-indigo-400 border-opacity-30">
                    <span className="text-indigo-100 text-sm font-semibold">Why Choose Yudo</span>
                  </div>

                  <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-tight">
                    Achieve More With{' '}
                    <span className="relative inline-block">
                      <span className="gradient-text bg-gradient-to-r from-blue-300 via-purple-300 to-blue-200 bg-clip-text text-transparent">
                        Less Effort
                      </span>
                      <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 100 10" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0,5 Q25,0 50,5 T100,5" fill="none" stroke="#a78bfa" strokeWidth="2" />
                      </svg>
                    </span>
                  </h2>

                  <p className="text-indigo-100 text-lg leading-relaxed">
                    Yudo Scheduler doesn't just organize your tasks—it transforms your approach to time management with intelligent prioritization and deep analytics.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                    {statistics.map((stat, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setHoveredStat(index as any)}
                        onMouseLeave={() => setHoveredStat(null)}
                      >
                        <div className="absolute inset-0 bg-indigo-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <div className="bg-indigo-800 bg-opacity-40 backdrop-blur-sm p-6 rounded-xl relative z-10 border border-indigo-700 border-opacity-30 card-hover">
                          <div className="absolute right-4 top-4 opacity-30 group-hover:opacity-100 transition-opacity text-indigo-300">
                            {stat.icon}
                          </div>
                          <div className="flex items-baseline mb-2">
                            <p className="text-4xl font-bold text-white">{stat.title}</p>
                          </div>
                          <p className="text-indigo-200 text-sm">{stat.subtitle}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="w-full lg:w-1/2 flex justify-center">
                  <div className="relative group max-w-lg w-full">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl opacity-50 blur-2xl group-hover:opacity-75 transition-opacity duration-500"></div>
                    <div className="relative bg-white bg-opacity-10 backdrop-blur-sm p-2 rounded-2xl border border-white border-opacity-20 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                      <img
                        src="/h3.jpeg"
                        alt="Analytics Dashboard"
                        className="w-full h-auto rounded-xl"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-4 md:py-6 bg-gradient-to-b from-slate-50 to-white px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-amber-100 text-amber-700 font-semibold text-sm mb-3 sm:mb-4">
              <Star className="w-4 h-4 mr-2 fill-amber-500 text-amber-500" />
              Customer Stories
            </div>

            <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-4">
              Trusted by{' '}
              <span className="gradient-text">Industry Leaders</span>
            </h2>

            <p className="text-md text-slate-600 max-w-3xl mx-auto">
              See how professionals across various industries have transformed their productivity with Yudo Scheduler.
            </p>
          </div>

          {/* Desktop Grid */}
          <div className="hidden md:grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="relative group cursor-pointer"
                onMouseEnter={() => setHoveredTestimonial(index as any)}
                onMouseLeave={() => setHoveredTestimonial(null)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>

                <div className="relative bg-white p-8 rounded-2xl border-2 border-slate-100 shadow-lg group-hover:shadow-2xl card-hover h-full flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <Quote className="w-10 h-10 text-indigo-400 opacity-60" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                      ))}
                    </div>
                  </div>

                  <p className="text-slate-700 mb-6 flex-grow text-lg italic leading-relaxed">"{testimonial.quote}"</p>

                  <div className="flex items-center mt-auto pt-6 border-t border-slate-100">
                    <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all">
                      <img
                        src={testimonial.img}
                        alt={testimonial.author}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4">
                      <p className="font-bold text-slate-900">{testimonial.author}</p>
                      <p className="text-slate-500 text-sm">{testimonial.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile Carousel */}
          <div className="md:hidden relative">
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{ transform: `translateX(-${activeIndex * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="min-w-full px-4">
                    <div className="bg-white p-6 rounded-2xl border-2 border-slate-100 shadow-lg">
                      <div className="flex justify-between items-start mb-4">
                        <Quote className="w-8 h-8 text-indigo-400 opacity-60" />
                        <div className="flex gap-1">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                          ))}
                        </div>
                      </div>

                      <p className="text-slate-700 mb-6 italic">"{testimonial.quote}"</p>

                      <div className="flex items-center pt-4 border-t border-slate-100">
                        <div className="w-10 h-10 rounded-full overflow-hidden">
                          <img
                            src={testimonial.img}
                            alt={testimonial.author}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="ml-3">
                          <p className="font-bold text-slate-900 text-sm">{testimonial.author}</p>
                          <p className="text-slate-500 text-xs">{testimonial.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile Navigation */}
            <div className="flex justify-center items-center mt-8 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${activeIndex === index ? 'bg-indigo-600 w-8' : 'bg-slate-300 w-2'
                    }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={() => navigateTestimonials('prev')}
              className="absolute top-1/2 -left-4 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-5 h-5 text-slate-700" />
            </button>

            <button
              onClick={() => navigateTestimonials('next')}
              className="absolute top-1/2 -right-4 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-5 h-5 text-slate-700" />
            </button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-indigo-800 to-violet-900 py-8 md:py-10 px-4 sm:px-6 lg:px-8">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -right-10 -top-20 w-80 h-80 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute left-0 bottom-0 w-72 h-72 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute right-1/3 top-1/3 w-64 h-64 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

          <div className="absolute inset-0 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%2240%22 height=%2240%22 viewBox=%220 0 40 40%22%3E%3Cg fill=%22%23fff%22 fill-opacity=%220.05%22%3E%3Cpath d=%22M0 0h40v40H0V0zm20 20h20v20H20V20zM0 20h20v20H0V20z%22/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-700 bg-opacity-50 backdrop-blur-sm border border-indigo-500 border-opacity-40 mb-3  sm:mb-4 animate-pulse-slow">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            <span className="text-indigo-100 text-sm font-semibold">Limited Time Offer</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-2 sm:mb-4 leading-tight">
            Ready to{' '}
            <span className="relative inline-block">
              <span className="gradient-text bg-gradient-to-r from-blue-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
                Transform
              </span>
              <svg className="absolute -bottom-2 left-0 w-full h-2" viewBox="0 0 200 8" xmlns="http://www.w3.org/2000/svg">
                <path d="M0,5 Q50,0 100,5 T200,5" fill="none" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>{' '}
            Your Productivity?
          </h2>

          <p className="text-xl md:text-2xl text-indigo-200 max-w-3xl mx-auto mb-4 sm:mb-8">
            Join thousands of professionals who have revolutionized their time management with Yudo Scheduler.
          </p>

          <div className="mb-4 sm:mb-8">
            <div
              className="relative inline-block group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition duration-500"></div>

              <button className="relative px-10 py-5 bg-white rounded-xl flex items-center justify-center gap-3 text-indigo-900 font-bold text-lg shadow-2xl transition-all duration-500 group-hover:scale-105">
                <span>Get Started Today</span>
                <ArrowRight className={`w-6 h-6 transition-transform duration-500 ${isHovered ? 'translate-x-2' : ''}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-4 sm:mb-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2 text-indigo-200 bg-indigo-800 bg-opacity-30 backdrop-blur-sm px-4 py-2 rounded-full">
                <div className="p-1 bg-indigo-700 bg-opacity-50 rounded-full text-indigo-300">
                  {feature.icon}
                </div>
                <span className="text-sm font-medium">{feature.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 pt-4 border-t border-indigo-700 border-opacity-50">
            {/* Left section - users joined */}
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  "https://randomuser.me/api/portraits/men/75.jpg",
                  "https://randomuser.me/api/portraits/women/65.jpg",
                  "https://randomuser.me/api/portraits/men/45.jpg",
                  "https://randomuser.me/api/portraits/women/12.jpg",
                ].map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`User ${i + 1}`}
                    className="w-10 h-10 rounded-full border-2 border-indigo-800 object-cover"
                  />
                ))}
              </div>
              <div className="text-indigo-200 text-sm">
                <span className="font-bold text-white">999+</span> users joined this month
              </div>
            </div>

            {/* Right section - reviews */}
            <div className="flex items-center gap-2">
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>
              <div className="text-indigo-200 text-sm">
                <span className="font-bold text-white">4.9/5</span> from 2,000+ reviews
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
};

export default ProfessionalScheduler;