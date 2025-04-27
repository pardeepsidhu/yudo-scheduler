'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Floating Blob Component
function FloatingBlob({
  delay = 0,
  duration = 20,
  size = 300,
  color = 'primary',
  opacity = 0.07,
  top,
  left,
  right,
  bottom,
  blur = 'blur-3xl',
  scale = 1,
  className,
}: {
  delay?: number;
  duration?: number;
  size?: number;
  color?: 'primary' | 'blue' | 'purple' | 'cyan' | 'amber' | 'rose';
  opacity?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  blur?: string;
  scale?: number;
  className?: string;
}) {
  // Map color names to tailwind classes
  const colorMap = {
    primary: 'bg-primary',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    cyan: 'bg-cyan-500',
    amber: 'bg-amber-500',
    rose: 'bg-rose-500',
  };

  const positions = { top, right, bottom, left };

  return (
    <motion.div
      className={cn('absolute', className)}
      style={positions}
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale }}
      transition={{
        delay,
        duration: 1.8,
        ease: 'easeOut',
      }}
    >
      <motion.div
        className="relative"
        animate={{
          y: [0, 15, -15, 0],
          x: [0, -15, 15, 0],
          rotate: [0, 3, -3, 0],
        }}
        transition={{
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.33, 0.66, 1],
          delay,
        }}
      >
        <div
          style={{ width: size, height: size }}
          className={cn(
            'rounded-full opacity-30',
            colorMap[color],
            blur
          )}
          style={{ opacity }}
        />
      </motion.div>
    </motion.div>
  );
}

// Floating Grid Element
function GridElement({
  delay = 0,
  size = 120,
  borderColor = 'border-primary/10',
  top,
  left,
  right,
  bottom,
  className,
}: {
  delay?: number;
  size?: number;
  borderColor?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  className?: string;
}) {
  const positions = { top, right, bottom, left };

  return (
    <motion.div
      className={cn('absolute', className)}
      style={positions}
      initial={{ opacity: 0, rotate: -15 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{
        delay,
        duration: 1.2,
        ease: 'easeOut',
      }}
    >
      <motion.div
        animate={{
          y: [0, 10, 0],
          rotate: [0, 5, 0],
        }}
        transition={{
          duration: 12 + Math.random() * 8,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay * 0.5,
        }}
      >
        <div
          style={{ width: size, height: size }}
          className={cn(
            'border-2 rounded-2xl backdrop-blur-sm',
            borderColor,
            'shadow-[0_8px_32px_0_rgba(0,0,0,0.03)]'
          )}
        />
      </motion.div>
    </motion.div>
  );
}

// Particle Element
function Particle({
  delay = 0,
  size = 6,
  color = 'bg-primary/30',
  top,
  left,
  right,
  bottom,
  className,
}: {
  delay?: number;
  size?: number;
  color?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  className?: string;
}) {
  const positions = { top, right, bottom, left };

  return (
    <motion.div
      className={cn('absolute', className)}
      style={positions}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        duration: 0.8,
        ease: 'easeOut',
      }}
    >
      <motion.div
        animate={{
          y: [0, -20, 0],
          x: [0, 10, 0],
          opacity: [1, 0.7, 1],
        }}
        transition={{
          duration: 4 + Math.random() * 4,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay * 0.5,
        }}
      >
        <div
          style={{ width: size, height: size }}
          className={cn('rounded-full', color)}
        />
      </motion.div>
    </motion.div>
  );
}

// Wave SVG Element
function WaveElement({
  delay = 0,
  color = 'primary',
  opacity = 0.03,
  top,
  left,
  right,
  bottom,
  rotate = 0,
  className,
}: {
  delay?: number;
  color?: 'primary' | 'blue' | 'purple' | 'cyan' | 'amber' | 'rose';
  opacity?: number;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  rotate?: number;
  className?: string;
}) {
  // Map color names to tailwind classes
  const colorMap = {
    primary: 'stroke-primary',
    blue: 'stroke-blue-500',
    purple: 'stroke-purple-500',
    cyan: 'stroke-cyan-500',
    amber: 'stroke-amber-500',
    rose: 'stroke-rose-500',
  };

  const positions = { top, right, bottom, left };

  return (
    <motion.div
      className={cn('absolute', className)}
      style={{ ...positions, rotate: `${rotate}deg` }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay,
        duration: 1.5,
        ease: 'easeOut',
      }}
    >
      <motion.div
        animate={{
          y: [0, 8, 0],
          x: [0, -5, 0],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: delay * 0.5,
        }}
      >
        <svg
          width="200"
          height="60"
          viewBox="0 0 200 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ opacity }}
        >
          <path
            d="M0 30C20 10 30 50 50 30C70 10 80 50 100 30C120 10 130 50 150 30C170 10 180 50 200 30"
            className={colorMap[color]}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />
        </svg>
      </motion.div>
    </motion.div>
  );
}

// Main Background Component
export  function DynamicBackground({
  variant = 'light',
  intensity = 'medium',
  children,
  className,
}: {
  variant?: 'light' | 'dark';
  intensity?: 'low' | 'medium' | 'high';
  children?: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Intensity factor affects number of elements
  const intensityFactor = {
    low: 0.5,
    medium: 1,
    high: 1.5,
  }[intensity];

  // Base background color based on variant
  const bgBase = variant === 'light' 
    ? 'bg-gradient-to-br from-slate-50 via-white to-slate-100' 
    : 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900';

  return (
    <div className={cn('relative overflow-hidden', bgBase, className)}>
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] via-transparent to-blue-500/[0.02]" />
      
      {/* Animated background elements */}
      {mounted && (
        <>
          {/* Large blobs - further back */}
          <FloatingBlob 
            color="primary" 
            size={600 * intensityFactor} 
            opacity={0.04} 
            top="-5%" 
            left="-10%" 
            blur="blur-3xl"
            delay={0.2}
            duration={25}
          />
          <FloatingBlob 
            color="blue" 
            size={500 * intensityFactor} 
            opacity={0.03} 
            bottom="-15%" 
            right="-5%" 
            blur="blur-3xl"
            delay={0.5}
            duration={30}
          />
          <FloatingBlob 
            color="purple" 
            size={450 * intensityFactor} 
            opacity={0.025} 
            top="60%" 
            left="10%" 
            blur="blur-3xl"
            delay={0.3}
            duration={28}
          />

          {/* Medium blobs - middle layer */}
          <FloatingBlob 
            color="cyan" 
            size={300 * intensityFactor} 
            opacity={0.04} 
            top="20%" 
            right="15%" 
            blur="blur-2xl"
            delay={0.6}
            duration={22}
          />
          <FloatingBlob 
            color="amber" 
            size={250 * intensityFactor} 
            opacity={0.035} 
            bottom="30%" 
            left="20%" 
            blur="blur-2xl"
            delay={0.4}
            duration={20}
          />

          {/* Grid elements */}
          <GridElement 
            size={180 * intensityFactor} 
            top="15%" 
            left="8%" 
            borderColor="border-primary/10"
            delay={0.7}
          />
          <GridElement 
            size={140 * intensityFactor} 
            bottom="20%" 
            right="12%" 
            borderColor="border-blue-500/10"
            delay={0.9}
          />
          <GridElement 
            size={100 * intensityFactor} 
            top="40%" 
            right="25%" 
            borderColor="border-purple-500/10"
            delay={1.1}
          />

          {/* Wave elements */}
          <WaveElement 
            color="primary" 
            opacity={0.08} 
            top="25%" 
            left="5%" 
            rotate={15}
            delay={0.5}
          />
          <WaveElement 
            color="blue" 
            opacity={0.06} 
            bottom="15%" 
            right="10%" 
            rotate={-10}
            delay={0.8}
          />
          <WaveElement 
            color="amber" 
            opacity={0.05} 
            top="60%" 
            left="30%" 
            rotate={5}
            delay={1.0}
          />

          {/* Particles - front layer */}
          {Array.from({ length: Math.floor(8 * intensityFactor) }).map((_, i) => (
            <Particle
              key={i}
              size={4 + Math.random() * 4}
              top={`${10 + Math.random() * 80}%`}
              left={`${Math.random() * 90}%`}
              color={`bg-primary/${0.2 + Math.random() * 0.3}`}
              delay={1 + i * 0.1}
            />
          ))}
          {Array.from({ length: Math.floor(6 * intensityFactor) }).map((_, i) => (
            <Particle
              key={i + 100}
              size={3 + Math.random() * 3}
              top={`${10 + Math.random() * 80}%`}
              left={`${Math.random() * 90}%`}
              color={`bg-blue-500/${0.2 + Math.random() * 0.3}`}
              delay={1.5 + i * 0.1}
            />
          ))}
        </>
      )}

      {/* Very subtle noise texture overlay */}
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] pointer-events-none" />

      {/* Gradient overlay to fade edges */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/30 dark:to-slate-900/30 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}