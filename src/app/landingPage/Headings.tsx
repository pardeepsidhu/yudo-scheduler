import React from 'react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { WordRotate } from '@/components/magicui/word-rotate';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import { AnimatedSubscribeButton } from '@/components/magicui/animated-subscribe-button';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';
import { RetroGrid } from '@/components/magicui/retro-grid';

const Headings: React.FC = () => {
  return (
    <div className="bg-[floralwhite] w-full px-4 sm:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-[#191F22] text-3xl sm:text-5xl font-bold leading-tight">
          NEVER MISS UPCOMING <AuroraText>EVENTS.</AuroraText>
        </h1>
        <WordRotate
          className="text-xl sm:text-3xl text-[#133354] mt-2"
          words={['ALWAYS STAY UPDATED', 'WITH YUDO SCHEDULER']}
        />
      </div>

      {/* Features Section */}
      <div className="grid sm:grid-cols-2 gap-10 mt-14 items-center">
        <div className="flex justify-center">
          <img
            src="https://png.pngtree.com/png-clipart/20230824/original/pngtree-deadline-time-management-on-the-road-to-success-metaphor-of-time-management-in-team-concept-of-multitasking-performance-timeline-flat-style-design-vector-illustration-picture-image_8316656.png"
            alt="Task Illustration"
            className="w-full max-w-sm sm:max-w-md object-contain"
          />
        </div>

        <div className="space-y-5">
          <BoxReveal boxColor="#5046e6" duration={0.5}>
            <h2 className="text-3xl sm:text-5xl font-semibold text-[#191F22]">
              Yudo Scheduler<span className="text-[#5046e6]">.</span>
            </h2>
          </BoxReveal>

          <BoxReveal boxColor="#5046e6" duration={0.5}>
            <p className="text-lg sm:text-xl text-[#2D373D]">
              Your Day, Your Schedule, <span className="text-[#5046e6]">Your Success.</span>
            </p>
          </BoxReveal>

          <BoxReveal boxColor="#5046e6" duration={0.5}>
            <p className="text-[#2D373D] text-md">
              Take control of your day and never miss an important{' '}
              <span className="font-semibold text-[#5046e6]">event</span> or{' '}
              <span className="font-semibold text-[#5046e6]">deadline</span>.
            </p>
            <TypingAnimation className="mt-2 text-md font-normal text-[#191F22]">
              Don’t just manage your tasks—master them. With our easy-to-use scheduler, you’ll be more
              organized, more focused, and more productive than ever.
            </TypingAnimation>
          </BoxReveal>

          <BoxReveal boxColor="#5046e6" duration={0.5}>
            <AnimatedSubscribeButton className="mt-4">
              <span className="group inline-flex items-center">
                Get Started
                <ChevronRightIcon className="ml-1 size-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
              <span className="group inline-flex items-center">
                Thanks <CheckIcon className="ml-1 size-4" />
              </span>
            </AnimatedSubscribeButton>
          </BoxReveal>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="relative w-full  rounded-xl border overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 px-6 sm:px-16 py-10 sm:py-20">
          <div className="w-full lg:w-1/2 space-y-6">
            <span className="inline-block font-bold py-1 px-4 rounded-3xl bg-[#27C5FA] text-black">
              Benefits
            </span>
            <h2 className="text-[#191F22] text-5xl sm:text-6xl font-bold">
              <AuroraText>Success</AuroraText>
            </h2>
            <h3 className="text-[#191F22] text-2xl sm:text-4xl font-semibold">
              Is Not Far Away.
            </h3>
            <p className="text-[#2D373D] text-lg leading-relaxed">
              Stay organized and never miss a deadline with the Task Scheduler. Easily create,
              prioritize, and track your tasks with reminders to keep you on track. Whether for
              personal or team projects, boost productivity and reduce stress. Get things done—on time,
              every time.
            </p>
          </div>

          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="https://png.pngtree.com/png-clipart/20230823/original/pngtree-student-watching-lesson-at-laptop-via-internet-picture-image_8290862.png"
              alt="Student using scheduler"
              className="w-full max-w-sm object-contain scale-110 sm:scale-125"
            />
          </div>
        </div>
        <RetroGrid />
      </div>
    </div>
  );
};

export default Headings;
