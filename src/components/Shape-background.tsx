"use client";

import { motion } from "motion/react";
import { Pacifico } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Calendar, CheckSquare, Clock, TrendingUp, ArrowRight } from "lucide-react";

const pacifico = Pacifico({
    subsets: ["latin"],
    weight: ["400"],
    variable: "--font-pacifico",
});

function FloatingCard({
    icon: Icon,
    title,
    delay = 0,
    position,
}: {
    icon: any;
    title: string;
    delay?: number;
    position: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.8,
                y: 20,
            }}
            animate={{
                opacity: 1,
                scale: 1,
                y: 0,
            }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
            }}
            className={cn("absolute hidden lg:block", position)}
        >
            <motion.div
                animate={{
                    y: [0, -20, 0],
                }}
                transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="bg-white rounded-sm shadow-xl border border-slate-200 p-4 backdrop-blur-sm"
            >
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-sm bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-md">
                        <Icon className="h-5 w-5 text-white" strokeWidth={2.5} />
                    </div>
                    <div>
                        <p className="text-sm font-bold text-slate-900">{title}</p>
                        <p className="text-xs text-slate-500">Active</p>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

function StatsCard({
    value,
    label,
    delay = 0,
    position,
}: {
    value: string;
    label: string;
    delay?: number;
    position: string;
}) {
    return (
        <motion.div
            initial={{
                opacity: 0,
                scale: 0.8,
            }}
            animate={{
                opacity: 1,
                scale: 1,
            }}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.23, 0.86, 0.39, 0.96],
            }}
            className={cn("absolute hidden xl:block", position)}
        >
            <motion.div
                animate={{
                    y: [0, -15, 0],
                }}
                transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: delay,
                }}
                className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-sm shadow-xl p-4 min-w-[140px]"
            >
                <p className="text-3xl font-bold text-white mb-1">{value}</p>
                <p className="text-xs text-blue-100 font-medium">{label}</p>
            </motion.div>
        </motion.div>
    );
}

export default function HeroGeometric({
    badge = "Yudo-Scheduler",
    title1 = "Master Your Time,",
    title2 = "Achieve Your Goals",
}: {
    badge?: string;
    title1?: string;
    title2?: string;
}) {
    const fadeUpVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: (i: number) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.3 + i * 0.15,
                ease: [0.25, 0.4, 0.25, 1],
            },
        }),
    };

    const buttonVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                duration: 0.5,
                delay: 1,
                ease: [0.25, 0.4, 0.25, 1],
            },
        },
    };

    return (
        <div id="overview" className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20">
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-100/20 via-transparent to-indigo-100/20" />
            
            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Floating Cards */}
            <FloatingCard
                icon={CheckSquare}
                title="Tasks Completed"
                delay={0.5}
                position="top-[15%] left-[8%]"
            />
            
            <FloatingCard
                icon={Calendar}
                title="Schedule Meeting"
                delay={0.7}
                position="top-[25%] right-[10%]"
            />
            
            <FloatingCard
                icon={Clock}
                title="Time Tracking"
                delay={0.9}
                position="bottom-[20%] left-[12%]"
            />

            {/* Stats Cards */}
            <StatsCard
                value="98%"
                label="Task Completion"
                delay={0.6}
                position="top-[45%] right-[8%]"
            />
            
            <StatsCard
                value="24/7"
                label="Always Available"
                delay={0.8}
                position="bottom-[35%] right-[15%]"
            />

            {/* Main Content */}
            <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="max-w-5xl mx-auto">
                    {/* Badge */}
                    <motion.div
                        custom={0}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex justify-center mb-6 sm:mb-8"
                    >
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-sm bg-white border border-slate-200 shadow-md">
                            <div className="h-6 w-6 rounded-sm bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center">
                                <Calendar className="h-3.5 w-3.5 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-slate-900 tracking-wide">
                                {badge}
                            </span>
                            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
                        </div>
                    </motion.div>

                    {/* Main Heading */}
                    <motion.div
                        custom={1}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-6 sm:mb-8"
                    >
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight leading-[1.1] sm:leading-[1.1]">
                            <span className="block text-slate-900 mb-2 sm:mb-3">
                                {title1}
                            </span>
                            <span className="block bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                                {title2}
                            </span>
                        </h1>
                    </motion.div>

                    {/* Description */}
                    <motion.div
                        custom={2}
                        variants={fadeUpVariants}
                        initial="hidden"
                        animate="visible"
                        className="text-center mb-8 sm:mb-10 lg:mb-12"
                    >
                        <p className="text-base sm:text-lg lg:text-xl text-slate-600 leading-relaxed max-w-3xl mx-auto px-4 sm:px-6">
                            Yudo Scheduler helps professionals stay organized, manage priorities, and never miss important tasks or events. 
                            Transform your productivity with intelligent time management.
                        </p>
                    </motion.div>

                    {/* CTA Buttons */}
                    <motion.div
                        custom={3}
                        variants={buttonVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 px-4"
                    >
                        <button className="group w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2">
                            <span>Get Started Free</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" strokeWidth={2.5} />
                        </button>
                        
                        <button className="group w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-semibold rounded-sm shadow-md hover:shadow-lg border border-slate-200 transition-all duration-300 flex items-center justify-center gap-2">
                            <TrendingUp className="h-5 w-5 text-blue-600" strokeWidth={2.5} />
                            <span>View Demo</span>
                        </button>
                    </motion.div>

                    {/* Feature Pills */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 1.2 }}
                        className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-10 sm:mt-12 lg:mt-16 px-4"
                    >
                        {[
                            { icon: CheckSquare, text: "Task Management" },
                            { icon: Calendar, text: "Smart Scheduling" },
                            { icon: Clock, text: "Time Tracking" },
                            { icon: TrendingUp, text: "Analytics" }
                        ].map((feature, index) => (
                            <motion.div
                                key={feature.text}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4, delay: 1.3 + index * 0.1 }}
                                className="flex items-center gap-2 px-4 py-2 bg-white rounded-sm border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
                            >
                                <feature.icon className="h-4 w-4 text-blue-600" strokeWidth={2.5} />
                                <span className="text-sm font-medium text-slate-700">{feature.text}</span>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none" />
        </div>
    );
}