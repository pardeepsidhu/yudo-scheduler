import React from 'react';
import { Github, Twitter, Linkedin, Instagram, Facebook, Youtube, Mail, Globe, Phone, MapPin, Code, GraduationCap, ArrowRight, Heart } from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const socialLinks = [
    { 
      icon: <Github size={20} />, 
      href: "https://github.com/pardeepsidhu", 
      label: "GitHub",
      color: "hover:bg-gray-700"
    },
    { 
      icon: <Linkedin size={20} />, 
      href: "https://www.linkedin.com/in/pardeep-singh-85848a2b1", 
      label: "LinkedIn",
      color: "hover:bg-blue-600"
    },
    { 
      icon: <Instagram size={20} />, 
      href: "https://www.instagram.com/es6_boy?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==", 
      label: "Instagram",
      color: "hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600"
    },
  ];

  const footerSections = [
    {
      title: "Developer",
      items: [
        { icon: <Code size={16} />, text: "Pardeep Singh", href: "void(0)" },
        { icon: <GraduationCap size={16} />, text: "B.C.A", href: "void(0)" },
        { icon: <Phone size={16} />, text: "+91 8284012817", href: "tel:+918284012817" },
        { icon: <Mail size={16} />, text: "sidhupardeep618@yahoo.com", href: "mailto:sidhupardeep618@yahoo.com" },
      ]
    },
    {
      title: "About",
      items: [
        { text: "Overview", href: "/about/#overview" },
        { text: "Notifications", href: "/about/#notifications" },
        { text: "Time-Management", href: "/about/#time-management" },
        { text: "Customer", href: "/about/#customer" },
      ]
    },
    {
      title: "Services",
      items: [
        { text: "Reminders", href: "void(0)" },
        { text: "Task Management", href: "void(0)" },
        { text: "Analytics", href: "void(0)" },
        { text: "Time Sheet", href: "void(0)" },
      ]
    },
    {
      title: "Contact",
      items: [
        { icon: <MapPin size={16} />, text: "Fazilka, Punjab, 152132", href: "void(0)" },
        { icon: <Phone size={16} />, text: "+91 8284012817", href: "tel:+918284012817" },
        { icon: <Mail size={16} />, text: "yudo.scheduler@gmail.com", href: "mailto:yudo.scheduler@gmail.com" },
      ]
    }
  ];

  return (
    <footer className="relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-gray-200 overflow-hidden">
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        {/* Top Section - Brand & Social */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 pb-10 border-b border-slate-700/50">
          {/* Brand Section */}
          <div className="mb-8 md:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Yudo Scheduler
              </span>
            </h2>
            <p className="text-slate-400 text-sm md:text-base max-w-md">
              Empowering productivity through intelligent time management and seamless scheduling solutions.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <p className="text-slate-400 text-sm mb-4">Connect with us</p>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  className={`group relative w-11 h-11 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 flex items-center justify-center text-slate-400 transition-all duration-300 hover:text-white hover:border-transparent hover:scale-110 hover:shadow-lg ${link.color}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.icon}
                  <span className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-slate-700 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
                    {link.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Main Links Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {footerSections.map((section, idx) => (
            <div key={idx} className="space-y-4">
              <h3 className="text-white font-semibold text-lg mb-6 relative inline-block">
                {section.title}
                <span className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"></span>
              </h3>
              <ul className="space-y-3">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="group">
                    <a
                      href={item.href}
                      className="flex items-center text-slate-400 hover:text-indigo-400 transition-all duration-300 group-hover:translate-x-1"
                    >
                      {item.icon && (
                        <span className="mr-3 text-indigo-400/70 group-hover:text-indigo-400 transition-colors">
                          {item.icon}
                        </span>
                      )}
                      <span className="text-sm">{item.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        {/* <div className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 border border-indigo-500/20 backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-bold text-white mb-2">Stay Updated</h3>
              <p className="text-slate-400 text-sm">Get the latest updates on features and productivity tips.</p>
            </div>
            <div className="flex w-full md:w-auto gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 md:w-64 px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 flex items-center gap-2 hover:shadow-lg hover:scale-105">
                Subscribe
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div> */}

        {/* Bottom Section - Copyright & Legal */}
      <div className="pt-8 border-t border-slate-700/50">
  <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left px-4 sm:px-6">
    
    {/* Left Section */}
    <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 text-slate-400 text-sm sm:text-base leading-relaxed">
      <p>© {currentYear} <span className="font-semibold text-white">Yudo Scheduler</span>. All rights reserved.</p>
      
      <span className="hidden sm:inline">•</span>
      
      <span className="flex items-center gap-1">
        Made with <Heart size={14} className="text-red-500 fill-red-500 animate-pulse" /> in India
      </span>
    </div>
    
    {/* Right Section */}
    <div className="flex flex-wrap justify-center md:justify-end gap-4 sm:gap-6 text-sm sm:text-base">
      <a
        href="#privacy"
        className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
      >
        Privacy Policy
      </a>
      <a
        href="#terms"
        className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
      >
        Terms of Service
      </a>
      <a
        href="#cookies"
        className="text-slate-400 hover:text-indigo-400 transition-colors duration-300"
      >
        Cookies
      </a>
    </div>
  </div>
</div>

      </div>

      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
    </footer>
  );
};

export default Footer;