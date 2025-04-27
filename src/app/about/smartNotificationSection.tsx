"use client"
// components/NotificationSection.tsx
import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Mail, MessageCircle, ArrowRight, Check, Clock, Star } from "lucide-react";
import { BackgroundBeams } from '@/components/ui/background-beams';
import { AuroraText } from '@/components/magicui/aurora-text';
import { useRouter } from 'next/navigation';

interface NotificationCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  imageSrc: string;
  color: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({
  title,
  description,
  icon,
  imageSrc,
  color,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const router =useRouter()
  
  const gradientMap = {
    blue: "from-blue-600 to-indigo-700",
    green: "from-emerald-500 to-teal-600",
    purple: "from-violet-600 to-fuchsia-600",
  };
  
  const gradientClass = gradientMap[color as keyof typeof gradientMap] || gradientMap.blue;

  return (
    <motion.div
      className="relative"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="overflow-hidden border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-xl rounded-xl">
        {/* Colored accent at top */}
        <div className={`h-1 w-full bg-gradient-to-r ${gradientClass}`}></div>
        
        <div className="h-56 relative overflow-hidden">
          <motion.div
            animate={{ 
              scale: isHovered ? 1.08 : 1,
              y: isHovered ? -8 : 0
            }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image
              src={imageSrc}
              alt={title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
            />
            
            {/* Overlay with gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-70"></div>
          </motion.div>
          
          {/* Floating icon */}
          <motion.div 
            className={`absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg`}
            animate={{ 
              y: isHovered ? -4 : 0,
              scale: isHovered ? 1.1 : 1
            }}
            transition={{ duration: 0.3 }}
          >
            {icon}
          </motion.div>
          
          {/* Title overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <h3 className="text-xl font-bold">{title}</h3>
          </div>
        </div>
        
        <CardHeader className="pt-6 pb-2">
          <CardDescription className="text-gray-600 text-base font-medium">{description}</CardDescription>
        </CardHeader>
        
        
        <CardFooter className="flex justify-between items-center border-t pt-4">
          <Badge variant="outline" className={`text-${color}-600 bg-${color}-50`}>Real-time</Badge>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              variant="ghost" 
              onClick={()=>router.push('/dashboard')}
              size="sm"
              className={`text-${color}-600 hover:text-${color}-800 hover:bg-${color}-50 group flex items-center gap-1`}
            >
              Learn more
              <motion.span
                animate={{ x: isHovered ? 4 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </motion.span>
            </Button>
          </motion.div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

const FeatureBadge = ({ children, color }: { children: React.ReactNode, color: string }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.05 }}
      transition={{ duration: 0.2 }}
    >
      <Badge className={`bg-${color}-100 text-${color}-700 border-${color}-200 px-3 py-1.5 text-sm font-medium`}>
        {children}
      </Badge>
    </motion.div>
  );
};

export function NotificationSection() {
  const [isHovered, setIsHovered] = useState(false);
  const router =useRouter()
  
  return (
    <section id='notifications' className="py-10 bg-gradient-to-b from-white to-gray-50 overflow-hidden relative">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 bg-purple-100 rounded-full blur-3xl opacity-20"></div>
      </div>
      
      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Badge variant="outline" className="mb-3 text-blue-600 border-blue-200 bg-blue-50 px-4 py-1.5 text-sm font-medium">
            Smart Notifications
          </Badge>
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-5 leading-tight"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Stay Connected, <span className="text-blue-600 relative">
              <AuroraText>Always</AuroraText>
              <motion.span 
                className="absolute -bottom-1 left-0 w-full h-1 bg-blue-500"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              ></motion.span>
            </span>
          </motion.h2>
          <motion.p 
            className="text-gray-600 max-w-2xl mx-auto text-lg"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Yudo Scheduler keeps you in the loop with intelligent notifications 
            across multiple platforms, ensuring you never miss what matters.
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
          <NotificationCard
            title="In-App Alerts"
            description="Get instant notifications directly within the Yudo-Scheduler , Get all login , authentication ,welcome and security alert within Yudo-Schdeuler."
            icon={<Bell className="text-blue-600" size={24} />}
            imageSrc="/about/Telegram-notification.jpg"
          
            color="blue"
          />
          <NotificationCard
            title="Email Updates"
            description="Receive detailed summaries of predefined reminders , Never miss important events. keep you life organized and be updated with feature events."
            icon={<Mail className="text-green-600" size={24} />}
            imageSrc="/about/email-notification.jpg"
       
            color="green"
          />
          <NotificationCard
            title="Telegram Integration"
            description="Connect your Telegram for real-time updates of reminder using smart telegram bot support, have a nice notificaion and reminder experince with us."
            icon={<MessageCircle className="text-purple-600" size={24} />}
            imageSrc="/about/telegram-notification.webp"
        
            color="purple"
          />
        </div>

        <motion.div 
          className="mt-20 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.h3 
            className="text-2xl md:text-3xl font-bold text-gray-800 mb-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Customize Your Notification Experience
          </motion.h3>
          
          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <FeatureBadge color="green">
              <div className="flex items-center gap-2">
                <Star size={16} />
                Smart Alerts
              </div>
            </FeatureBadge>
            <FeatureBadge color="purple">
              <div className="flex items-center gap-2">
                <Bell size={16} />
                Smart Notifications
              </div>
            </FeatureBadge>
            <FeatureBadge color="amber">
              <div className="flex items-center gap-2">
                <Clock size={16} />
                Time Sensitive
              </div>
            </FeatureBadge>
            <FeatureBadge color="cyan">
              <div className="flex items-center gap-2">
                <Mail size={16} />
                Reminder Emails
              </div>
            </FeatureBadge>
          </div>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Button 
              size="lg" 
              onClick={()=>router.push('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-medium px-8 py-6 shadow-lg hover:shadow-xl rounded-lg transition-all duration-300"
            >
              Explore All Features
            </Button>
          </motion.div>
        </motion.div>
      </div>
      <BackgroundBeams />
    </section>
  );
}