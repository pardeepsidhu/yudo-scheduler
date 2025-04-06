import React from 'react';
import { AuroraText } from '@/components/magicui/aurora-text';
import { BoxReveal } from '@/components/magicui/box-reveal';
import { TypingAnimation } from '@/components/magicui/typing-animation';
import {  MailIcon, SendIcon } from 'lucide-react';
import { RetroGrid } from '@/components/magicui/retro-grid';
import InteractiveGrid from '@/components/bg-grid';
import CalendarEvent from '@/components/calender';
import FlightWidget from '@/components/flight-card';

const Notifications: React.FC = () => {
  return (
    <div className=" w-full bg-[floralwhite] px-4 sm:px-8 py-3 overflow-hidden">
      {/* Header Section */}
      <div className="text-center mb-16">
        <h1 className="text-[#191F22] text-4xl sm:text-6xl font-bold leading-tight">
          STAY NOTIFIED WITH <AuroraText>YUDO</AuroraText>
        </h1>
        <p className="mt-4 text-[#2D373D] text-lg sm:text-xl max-w-3xl mx-auto">
          Never miss an update again! Get real-time reminders via <span className="font-semibold text-[#5046e6]">Email</span> and <span className="font-semibold text-[#27C5FA]">Telegram</span>—effortless, instant, and stress-free.
        </p>
      </div>

      {/* Notification Methods */}
      <div className="grid gap-12 md:grid-cols-2 items-stretch">
  {/* Email Notifications */}
  <BoxReveal  boxColor="#5046e6" duration={0.5}>
    <InteractiveGrid className="p-6 sm:p-8 bg-white rounded-3xl shadow-xl flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <MailIcon className="text-[#5046e6]" size={36} />
          <h2 className="text-2xl font-semibold text-[#191F22]">Email Alerts</h2>
        </div>
        <TypingAnimation className="text-[#2D373D]">
        Receive inbox alerts—daily updates, urgent reminders, and tailored weekly reports with ease
        </TypingAnimation>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-[aliceblue] rounded-[23px] mt-8 p-4">
        
        <FlightWidget />
        <img
          src="https://www.iphonelife.com/sites/iphonelife.com/files/styles/2023_iphone14pro_642_2x/public/touch_blank_spot_on_screen_to_enter_wiggle_mode.png"
          alt="Email illustration"
          className="w-32 rounded-[23px] object-contain"
        />
      </div>
    </InteractiveGrid>
  </BoxReveal>

  {/* Telegram Notifications */}
  <BoxReveal boxColor="#27C5FA" duration={0.5}>
    <InteractiveGrid className="p-6 sm:p-8 bg-white rounded-3xl shadow-xl flex flex-col justify-between h-full hover:shadow-2xl transition-all duration-300">
      <div className="space-y-4">
        <div className="flex items-center space-x-4">
          <SendIcon className="text-[#27C5FA]" size={36} />
          <h2 className="text-2xl font-semibold text-[#191F22]">Telegram Bot</h2>
        </div>
        <TypingAnimation className="text-[#2D373D]">
        Get Telegram alerts—push notifications, quick commands, smart scheduling at fingertips.
        </TypingAnimation>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-6 bg-[#fced99] rounded-2xl mt-8 p-4">
        <NotesCard title="Telegram Bot Perks">
          <ul >
            <li>Instant push notifications</li>
            <li>Custom event reminders</li>
            <li>Interactive commands like /start, /remindme</li>
          </ul>
          <p>

          </p>
          {/* <div>100% free and encrypted</div> */}
        </NotesCard>

        <img
          src="https://d35v9wsdymy32b.cloudfront.net/v1/images/HP4CqcqwzkqhVszrS-q3kXfE.png"
          alt="Telegram illustration"
          className="w-32 object-contain"
        />
      </div>
    </InteractiveGrid>
  </BoxReveal>
</div>

      {/* Why It Matters */}
      <div className="mt-24 relative rounded-3xl border bg-[#F5F7FA] shadow-lg overflow-hidden">
        <div className="flex flex-col md:flex-row items-center justify-between gap-10 p-6 sm:p-16">
          <div className="w-full md:w-1/2 space-y-6">
            <span className="inline-block font-semibold py-1 px-4 rounded-3xl bg-[#5046e6] text-white tracking-wide text-sm">
              Why Notifications Matter
            </span>
            <h2 className="text-[#191F22] text-4xl sm:text-5xl font-bold leading-tight">
              <AuroraText>Never Miss Out</AuroraText>
            </h2>
            <p className="text-[#2D373D] text-lg leading-relaxed">
              Whether you're juggling work, study, or personal commitments—Yudo keeps you on track. Timely updates mean more peace of mind, less chaos.
            </p>
          </div>

          <div className="w-full md:w-1/2 relative scale-110 bg-white rounded-2xl flex justify-center">
          <CalendarEvent  />
            <img
              src="https://png.pngtree.com/png-clipart/20241018/original/pngtree-phone-notification-cellphone-icon-vector-png-image_16382429.png"
              alt="Notification bell"
              className="w-32 md:w-40 object-contain drop-shadow-md"
            />
          </div>
        </div>
        <RetroGrid />
      </div>
      
    </div>
  );
};



export function NotesCard({ title, children }: { title?: string; children?: React.ReactNode }) {
  return (
    <div className="h-50 w-48 rounded-3xl border bg-[#f0f8ff] p-4 font-sans text-zinc-950 shadow-sm">
      <div className="text-lg font-bold tracking-wide">{title}</div>
      <div className="mt-3 flex flex-col gap-3 text-sm">{children}</div>
    </div>
  );
}



export default Notifications;
