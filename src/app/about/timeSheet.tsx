'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { Clock, BarChart2, FileDown, Layers, CheckSquare, Calendar, ArrowRight, Star, Users, Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AuroraText } from '@/components/magicui/aurora-text';
import { useRouter } from 'next/navigation';

export const TimeSheet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true, amount: 0.3 });
  const router = useRouter()
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const statsVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  };
  
  const features = [
    {
      icon: <CheckSquare className="h-10 w-10 text-primary" />,
      title: "Task-Based Tracking",
      description: "Organize and track time by specific tasks to increase productivity and maintain clear project boundaries."
    },
    {
      icon: <Clock className="h-10 w-10 text-primary" />,
      title: "Time Stamps",
      description: "Automated timestamps capture your work patterns with precision for accurate time management."
    },
    {
      icon: <Calendar className="h-10 w-10 text-primary" />,
      title: "Time Sheets",
      description: "Generate comprehensive timesheets for billing, reporting, and productivity analysis."
    },
    {
      icon: <BarChart2 className="h-10 w-10 text-primary" />,
      title: "Advanced Analytics",
      description: "Gain insights into your productivity with visual analytics that highlight opportunities for improvement."
    },
    {
      icon: <FileDown className="h-10 w-10 text-primary" />,
      title: "Report Downloads",
      description: "Export detailed reports in multiple formats for meetings, clients, or personal review."
    },
    {
      icon: <Layers className="h-10 w-10 text-primary" />,
      title: "Project Hierarchy",
      description: "Structure your work with intuitive project and task hierarchies for optimal organization."
    },
  ];

  const stats = [
    { value: "98%", label: "Customer Satisfaction" },
    { value: "30%", label: "Productivity Increase" },
    { value: "1M+", label: "Hours Tracked" },
    { value: "50K+", label: "Active Users" }
  ];

  const testimonials = [
    {
      quote: "Yudo Scheduler has transformed how our team manages time across multiple projects. The analytics are invaluable.",
      author: "Sarah Johnson",
      position: "Product Manager, TechCorp"
    },
    {
      quote: "As a freelancer, accurate time tracking is essential for my business. Yudo makes it effortless and insightful.",
      author: "Michael Chen",
      position: "Independent Developer"
    }
  ];

  return (
    <section id='time-management' className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="container mx-auto px-4 overflow-hidden">
        <div className="py-24 relative">
        
          <div className="absolute top-20 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
          
          <motion.div 
            className="text-center mb-16 relative z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <Badge className="mb-4 px-4 py-1 bg-primary/10 text-primary border-primary/20 text-sm font-medium">Time Management Reimagined</Badge>
            <motion.h1 
              className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600"
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              About Yudo <AuroraText>Scheduler</AuroraText> 
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl max-w-3xl mx-auto text-slate-600 dark:text-slate-300 leading-relaxed"
              initial={{ opacity: 0 }}
              animate={isVisible ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Transforming how professionals track, manage, and optimize their time with intuitive task-based scheduling.
            </motion.p>
          </motion.div>
        </div>
        
        {/* Main Info Section with Image */}


        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-32">
          <motion.div 
            className="flex items-center justify-center"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
        {/* scroll bellow */}
             <div className="relative w-full max-w-md">
           
              <div className="absolute -top-6 -left-6 w-16 h-16 bg-primary/20 rounded-full"></div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-blue-500/20 rounded-full"></div>
              
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-blue-500/30 rounded-3xl transform rotate-3 scale-105 blur-sm"></div>
              <motion.div 
                className="relative bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-xl overflow-hidden"
                whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}
                transition={{ type: "spring", stiffness: 300 }}
              >
             
                <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-primary/10 to-transparent rounded-full"></div>
                
                <img 
                  src="/about/time-management.webp" 
                  alt="Yudo Scheduler Dashboard" 
                  className="w-full h-auto rounded-lg shadow-md mb-6" 
                />
                <h3 className="text-2xl font-bold mb-3 flex items-center">
                  <span className="bg-primary/10 text-primary p-2 rounded-lg mr-3">
                    <Clock className="h-5 w-5" />
                  </span>
                  Powerful Time Management
                </h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  Yudo Scheduler was built with one mission: to give you back control of your time through intelligent tracking and insightful analytics.
                </p>
              </motion.div>
                {/* scroll above  */}
            </div> 
          </motion.div>
          
          <motion.div 
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h2 className="text-4xl font-bold mb-8 relative">
              Your Time. <AuroraText>Optimized.</AuroraText> 
              <div className="h-1 w-20 bg-primary mt-4 rounded-full"></div>
            </h2>
            
            <p className="text-lg mb-6 text-slate-600 dark:text-slate-300 leading-relaxed">
              Born from the need for better time management solutions, Yudo Scheduler helps professionals from all industries track their time with precision and ease.
            </p>
            
            <ul className="space-y-4 mb-8">
              {[
                "Increase billing accuracy by up to 25%",
                "Reduce administrative overhead by automating time tracking",
                "Gain valuable insights through comprehensive analytics",
                "Make data-driven decisions to optimize workflows"
              ].map((point, index) => (
                <motion.li 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isVisible ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: 0.6 + (index * 0.1) }}
                >
                  <div className="mt-1 bg-green-100 dark:bg-green-900/30 p-1 rounded text-green-600 dark:text-green-400 mr-3">
                    <CheckSquare className="h-4 w-4" />
                  </div>
                  <span className="text-slate-700 dark:text-slate-200">{point}</span>
                </motion.li>
              ))}
            </ul>
            
            <p className="text-lg mb-8 text-slate-600 dark:text-slate-300 leading-relaxed">
              Whether you're a freelancer billing clients, a team manager overseeing projects, or simply someone looking to improve productivity, our intuitive interface and powerful features help you make every minute count.
            </p>
            
            <motion.button 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-medium flex items-center justify-center max-w-xs gap-2 shadow-lg shadow-primary/20"
              whileHover={{ scale: 1.05 }}
              onClick={()=>router.push('/dashboard')}
              whileTap={{ scale: 0.95 }}
            >
              Start Tracking Now
              <ArrowRight className="h-5 w-5" />
            </motion.button>
          </motion.div>
        </div>


       
    
        <div 
          ref={statsRef}
          className="py-16 mb-24 bg-gradient-to-r from-slate-900 to-slate-800 rounded-3xl overflow-hidden relative shadow-xl"
        >
          <div className="absolute inset-0 bg-primary/5 background-pattern opacity-10"></div>
          <div className="container mx-auto px-6">
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
              variants={containerVariants}
              initial="hidden"
              animate={isStatsInView ? "visible" : "hidden"}
            >
              {stats.map((stat, index) => (
                <motion.div 
                  key={index} 
                  className="relative"
                  variants={statsVariants}
                >
                  <div className="absolute inset-0 bg-primary/10 rounded-xl blur-xl transform scale-90"></div>
                  <div className="relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold text-white mb-2"
                      initial={{ opacity: 0, y: 20 }}
                      animate={isStatsInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ delay: 0.3 + (index * 0.1), duration: 0.7 }}
                    >
                      {stat.value}
                    </motion.div>
                    <div className="text-slate-300">{stat.label}</div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
        
        {/* Features Section */}
        <motion.div
          className="mb-32"
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
        >
          <div className="text-center mb-16">
            <Badge className="mb-3 px-4 py-1 bg-blue-500/10 text-blue-500 border-blue-500/20 text-sm font-medium">Core Functionality</Badge>
            <h2 className="text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Everything you need for complete time management in one intuitive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-700 overflow-hidden group">
                  <CardContent className="p-8 relative">
                    <div className="absolute top-0 right-0 h-32 w-32 bg-primary/5 rounded-full transform translate-x-16 -translate-y-16 group-hover:scale-110 transition-transform duration-500"></div>
                    <motion.div 
                      className="mb-5 p-4 bg-primary/10 rounded-xl inline-block relative z-10"
                      whileHover={{ rotate: 15, scale: 1.1 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h4 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors duration-300">{feature.title}</h4>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Testimonials */}
        <div id='customer' className="mb-32">
          <div className="text-center mb-16">
            <Badge className="mb-3 px-4 py-1 bg-green-500/10 text-green-500 border-green-500/20 text-sm font-medium">Customer Stories</Badge>
            <h2 className="text-4xl font-bold mb-4">What Our <AuroraText>Users</AuroraText> Say</h2>
            <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Join thousands of satisfied professionals who have transformed their productivity
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={isVisible ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.2 + (index * 0.2), duration: 0.6 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-slate-700 relative overflow-hidden"
              >
                <div className="text-primary mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="inline-block h-5 w-5 mr-1 fill-primary" />
                  ))}
                </div>
                <p className="text-lg text-slate-700 dark:text-slate-200 mb-6 italic">"{testimonial.quote}"</p>
                <div className="flex items-center">
                  <div className="bg-primary/10 rounded-full p-2 mr-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">{testimonial.author}</h4>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.position}</p>
                  </div>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full transform translate-x-16 -translate-y-16"></div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* CTA Section */}
        <motion.div 
          className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-2xl p-12 relative overflow-hidden mb-20"
          initial={{ opacity: 0, y: 40 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.2 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Decorative elements */}
          <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-l from-primary/20 to-transparent opacity-30"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-500/20 to-transparent opacity-30"></div>
          <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-primary/30 rounded-full blur-3xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-10 md:mb-0 md:pr-12">
              <Badge className="mb-6 px-4 py-1 bg-white/10 text-white border-white/20 text-sm font-medium">Get Started Today</Badge>
              <h2 className="text-4xl font-bold mb-6">Ready to Optimize Your Time?</h2>
              <p className="text-xl mb-8 text-slate-300 leading-relaxed">
                Join thousands of professionals who have transformed their productivity with Yudo Scheduler. Start your journey to better time management today.
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.button 
                onClick={()=>router.push('/dashboard')}
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2 shadow-lg shadow-primary/30"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started Free
                  <ArrowRight className="h-5 w-5" />
                </motion.button>
                <motion.button 
                onClick={()=>router.push('/dashboard')}
                  className="bg-white/10 hover:bg-white/15 border border-white/20 text-white px-8 py-4 rounded-lg font-medium flex items-center gap-2 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Watch Demo
                </motion.button>
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"></div>
                <motion.div 
                  className="relative"
                  animate={{ 
                    y: [0, -10, 0],
                  }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 4,
                    ease: "easeInOut"
                  }}
                >
                  <div className="bg-gradient-to-tr from-primary/20 to-blue-500/20 p-1 rounded-xl backdrop-blur-sm shadow-xl">
                    <img 
                      src="/about/optamize-time.avif" 
                      alt="Yudo App" 
                      className="rounded-lg shadow-lg w-full" 
                    />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-800 rounded-full p-3 shadow-lg border-4 border-slate-900">
                    <Shield className="h-8 w-8 text-primary" />
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
    </section>
  );
};