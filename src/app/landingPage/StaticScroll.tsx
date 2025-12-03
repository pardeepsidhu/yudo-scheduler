"use client";
import React, { useEffect, useRef, useState } from "react";
import { Bell, BellRing, Smartphone, Mail, MessageSquare, Zap, Shield, Clock, ArrowRight, Star, Users, TrendingUp, CheckCircle } from "lucide-react";

const ProfessionalNotifications = () => {
  const [isVisible, setIsVisible] = useState({});
  const [activeFeature, setActiveFeature] = useState(0);
  const featuresRef = useRef(null);
  const whyMattersRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.1 }
    );

    [featuresRef, whyMattersRef, testimonialsRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  // Auto-rotate features
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const notificationMethods = [
    {
      icon: <Mail className="w-8 h-8" />,
      title: "Email Notifications",
      description: "Get detailed updates delivered straight to your inbox with customizable templates",
      color: "from-blue-500 to-cyan-500",
      features: ["Rich HTML templates", "Instant delivery", "Smart filtering"]
    },
    {
      icon: <MessageSquare className="w-8 h-8" />,
      title: "Telegram Integration",
      description: "Receive real-time alerts on your favorite messaging platform instantly",
      color: "from-purple-500 to-pink-500",
      features: ["Real-time updates", "Bot integration", "Group notifications"]
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: "Push Notifications",
      description: "Stay informed with native mobile and desktop push notifications",
      color: "from-orange-500 to-red-500",
      features: ["Cross-platform", "Silent mode", "Priority levels"]
    }
  ];

  const statistics = [
    { value: "99.9%", label: "Delivery Rate", icon: <TrendingUp className="w-6 h-6" /> },
    { value: "<2s", label: "Avg. Delay", icon: <Zap className="w-6 h-6" /> },
    { value: "50K+", label: "Active Users", icon: <Users className="w-6 h-6" /> },
    { value: "24/7", label: "Monitoring", icon: <Shield className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Project Manager",
      company: "Tech Corp",
      quote: "Yudo notifications have transformed how I manage deadlines. The email alerts are timely and the Telegram integration is seamless.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop"
    },
    {
      name: "David Chen",
      role: "Student",
      company: "University",
      quote: "As a busy student juggling multiple classes, Yudo keeps me on track with all my assignments and exams. I haven't missed a deadline since!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop"
    },
    {
      name: "Michelle Rodriguez",
      role: "Freelancer",
      company: "Independent",
      quote: "The customizable notification system helps me manage multiple clients and projects efficiently. A game-changer for my business.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=150&h=150&fit=crop"
    }
  ];

  return (
    <div className="w-full bg-gradient-to-b from-slate-50 via-white to-slate-50 overflow-hidden">
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes pulse-ring {
          0% { transform: scale(0.95); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-pulse-ring { animation: pulse-ring 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        .animate-slide-up { animation: slide-up 0.6s ease-out forwards; }
        .gradient-border {
          position: relative;
          background: linear-gradient(white, white) padding-box,
                      linear-gradient(135deg, #667eea 0%, #764ba2 100%) border-box;
          border: 2px solid transparent;
        }
      `}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-8 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto">
          <div className="text-center mb-4">
            {/* Badge */}
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 border border-indigo-200 mb-2">
              <BellRing className="w-4 h-4 text-indigo-600 mr-2 animate-pulse" />
              <span className="text-sm font-semibold text-indigo-700">Smart Notification System</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 leading-tight">
              <span className="block text-slate-900">Stay Updated.</span>
              <span className="block bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Never Miss a Beat.
              </span>
            </h1>

            <p className="text-md sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-4">
              Get notified your way—via <span className="font-semibold text-indigo-600">Email</span>, <span className="font-semibold text-purple-600">Telegram</span>, or <span className="font-semibold text-pink-600">Push</span>. Stay on top of deadlines, meetings, and updates effortlessly.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center items-center mb-4">
              <button className="group px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Enable Notifications
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button className="px-8 py-4 bg-white text-slate-700 font-semibold rounded-xl border-2 border-slate-200 hover:border-indigo-300 hover:text-indigo-600 transition-all duration-300">
                Learn More
              </button>
            </div>

            {/* Statistics Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
              {statistics.map((stat, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg border border-slate-100 hover:shadow-xl transition-all duration-300">
                  <div className="flex justify-center mb-2 text-indigo-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Notification Methods Section */}
      <section ref={featuresRef} id="features" className="py-4 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-indigo-100 text-indigo-700 font-semibold text-sm mb-6">
              NOTIFICATION CHANNELS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
              Choose Your <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Communication Style</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Multiple delivery methods ensure you never miss important updates, no matter where you are
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-2 sm:gap-8">
            {notificationMethods.map((method, index) => (
              <div
                key={index}
                className={`relative group cursor-pointer ${isVisible.features ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
                onMouseEnter={() => setActiveFeature(index)}
              >
                <div className="absolute inset-0 bg-gradient-to-br ${method.color} rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                
                <div className="relative h-full bg-white rounded-2xl p-8 border-2 border-slate-100 shadow-lg group-hover:shadow-2xl group-hover:border-transparent transition-all duration-500 hover:-translate-y-2">
                  {/* Icon */}
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${method.color} text-white mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {method.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{method.title}</h3>

                  {/* Description */}
                  <p className="text-slate-600 mb-6 leading-relaxed">{method.description}</p>

                  {/* Features List */}
                  <div className="space-y-3">
                    {method.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-slate-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Active Indicator */}
                  {activeFeature === index && (
                    <div className="absolute top-4 right-4">
                      <div className="relative">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <div className="absolute inset-0 w-3 h-3 bg-green-500 rounded-full animate-pulse-ring"></div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Feature Highlight */}
          <div className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-3xl p-8 md:p-12 border border-indigo-100">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1">
                <h3 className="text-3xl font-bold text-slate-900 mb-4">Intelligent Delivery</h3>
                <p className="text-lg text-slate-600 mb-6">
                  Our smart notification system learns your preferences and delivers updates at the optimal time, through your preferred channel.
                </p>
                <div className="flex flex-wrap gap-3">
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-indigo-600 shadow-sm">AI-Powered</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-purple-600 shadow-sm">Customizable</span>
                  <span className="px-4 py-2 bg-white rounded-full text-sm font-semibold text-pink-600 shadow-sm">Reliable</span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <div className="relative w-48 h-48">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
                  <div className="absolute inset-4 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-4xl font-bold">100%</div>
                      <div className="text-sm">Reliable</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why It Matters Section */}
      <section ref={whyMattersRef} id="why-matters" className="py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className={`relative overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200 ${isVisible['why-matters'] ? 'animate-slide-up' : 'opacity-0'}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 opacity-50"></div>
            
            <div className="relative flex flex-col md:flex-row items-center">
              {/* Content */}
              <div className="w-full md:w-1/2 p-8 md:p-16 space-y-4">
                <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-sm">
                  WHY NOTIFICATIONS MATTER
                </div>

                <h2 className="text-3xl w-[max-content] flex gap-4 md:text-5xl font-bold">
                  <span className="block text-slate-900">Never</span>
                  <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Miss Out</span>
                </h2>

                <p className="text-md text-slate-600 leading-relaxed">
                  Whether you're juggling work, study, or personal commitments—Yudo keeps you on track. Timely updates mean more peace of mind, less chaos.
                </p>

                <div className="space-y-3 pt-2">
                  {[
                    { icon: <TrendingUp className="w-6 h-6" />, text: "Improved productivity by 72%" },
                    { icon: <Clock className="w-6 h-6" />, text: "Better time management" },
                    { icon: <Shield className="w-6 h-6" />, text: "Zero missed deadlines" },
                    { icon: <Zap className="w-6 h-6" />, text: "Instant updates" }
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-slate-100">
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center text-white">
                        {item.icon}
                      </div>
                      <span className="text-slate-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Image */}
              <div className="w-full md:w-1/2 p-8 md:p-12">
                <div className="relative group">
                  <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-2xl transition-opacity duration-500"></div>
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                    <img
                      src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800&h=800&fit=crop"
                      alt="Team collaboration"
                      className="w-full h-auto group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section ref={testimonialsRef} id="testimonials" className="py-8  px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-green-100 text-green-700 font-semibold text-sm mb-6">
              <Star className="w-4 h-4 mr-2 fill-green-600" />
              TESTIMONIALS
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-4">
              What Our <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Users Say</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Join thousands of satisfied users who have transformed their productivity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-4 sm:gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`group ${isVisible.testimonials ? 'animate-slide-up' : 'opacity-0'}`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="relative h-full">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xl"></div>
                  
                  <div className="relative h-full bg-white rounded-2xl p-8 shadow-lg border-2 border-slate-100 group-hover:shadow-2xl group-hover:border-transparent transition-all duration-500 hover:-translate-y-2 flex flex-col">
                    {/* Rating */}
                    <div className="flex gap-1 mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-amber-400 fill-amber-400" />
                      ))}
                    </div>

                    {/* Quote */}
                    <p className="text-slate-700 text-lg leading-relaxed mb-6 flex-grow italic">
                      "{testimonial.quote}"
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                      <div className="w-14 h-14 rounded-full overflow-hidden ring-2 ring-indigo-100 group-hover:ring-indigo-300 transition-all">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{testimonial.name}</div>
                        <div className="text-sm text-slate-600">{testimonial.role}</div>
                        <div className="text-xs text-slate-500">{testimonial.company}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900"></div>
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-white bg-opacity-20 backdrop-blur-sm border border-white border-opacity-30 mb-3">
            <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
            <span className="text-gray-500 text-sm font-semibold">Join 50,000+ Users</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Ready to Stay Updated?
          </h2>

          <p className="text-xl md:text-2xl text-indigo-100 mb-4 max-w-2xl mx-auto">
            Join thousands of users who never miss an important update with Yudo's notification system.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="group px-10 py-5 bg-white text-indigo-900 font-bold text-lg rounded-xl shadow-2xl hover:shadow-3xl transform hover:scale-105 transition-all duration-300 flex items-center gap-3">
              <Bell className="w-6 h-6" />
              Get Started Free
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="px-10 py-5 bg-transparent text-white font-bold text-lg rounded-xl border-2 border-white border-opacity-50 hover:bg-white hover:bg-opacity-10 transition-all duration-300">
              View Pricing
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-6 flex flex-wrap justify-center items-center gap-8 text-white text-opacity-80">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Cancel anytime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>24/7 support</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProfessionalNotifications;