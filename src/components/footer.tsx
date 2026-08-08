import React from 'react';
import {
  Github, Linkedin, Instagram,
  Code, GraduationCap, Heart, Calendar,
  Phone, Mail, MapPin, Bell, Clock,
  Shield, Sparkles, Zap, Users,
  CheckSquare, Star, Lock,
} from 'lucide-react';

const STATS = [
  { icon: Users,       num: '999+',   label: 'Active users'      },
  { icon: CheckSquare, num: '50K+',   label: 'Tasks completed'   },
  { icon: Bell,        num: '200K+',  label: 'Alerts delivered'  },
  { icon: Star,        num: '4.9/5',  label: 'User rating'       },
];

const FEATURES = [
  { icon: Bell,     title: 'Smart alerts',   desc: 'Email & Telegram notifications on your schedule' },
  { icon: Clock,    title: 'Time tracking',  desc: 'Monitor productivity & hit every milestone'      },
  { icon: Shield,   title: 'Secure access',  desc: 'Two-factor auth keeps your data safe'            },
  { icon: Sparkles, title: 'AI scheduling',  desc: 'Smart suggestions to optimise your day'          },
];

const Dot = () => (
  <span className="inline-block w-1 h-1 rounded-full bg-[#3A41E5]/30" />
);

const ColTitle = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center gap-2 mb-4">
    <span className="text-[10px] font-bold uppercase tracking-[.12em] text-[#3A41E5]">{children}</span>
    <span className="flex-1 h-px bg-[#3A41E5]/15" />
  </div>
);

const FLink = ({
  icon: Icon, text, href,
}: { icon?: React.ElementType; text: string; href: string }) => (
  <a
    href={href}
    className="flex items-center gap-2 py-[5px] text-[#1F257A]/60 text-[.79rem] hover:text-[#3A41E5] hover:pl-[5px] transition-all duration-150"
  >
    {Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-[#3A41E5]/40" />}
    <span>{text}</span>
  </a>
);

const SocialBtn = ({ href, label, icon: Icon }: { href: string; label: string; icon: React.ElementType }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="flex h-9 w-9 items-center justify-center rounded-[9px] border border-[#3A41E5]/20 bg-white/70 text-[#3A41E5] hover:bg-[#3A41E5] hover:text-white hover:border-[#3A41E5] hover:-translate-y-0.5 transition-all duration-150"
  >
    <Icon className="h-4 w-4" />
  </a>
);

const StatusDot = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-2 py-[5px]">
    <span className={`w-[7px] h-[7px] rounded-full shrink-0 ${color}`} />
    <span className="text-[.79rem] text-[#1F257A]/60">{label}</span>
  </div>
);

const Badge = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#3A41E5]/16 bg-[#3A41E5]/8 px-3 py-1 text-[11px] font-semibold text-[#1F257A]">
    <Icon className="h-3 w-3 text-[#3A41E5]" />
    {text}
  </span>
);

export const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-[#F7F8FF] border border-[#3A41E5]/22">
      {/* Dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[.22]"
        style={{ backgroundImage: 'radial-gradient(circle,#AAB0FF 1px,transparent 1px)', backgroundSize: '28px 28px' }}
      />

      {/* Top accent */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#3A41E5] to-transparent" />

      {/* Stats strip */}
      <div className="relative z-10 grid grid-cols-2 sm:grid-cols-4 border-b border-[#3A41E5]/12">
        {STATS.map(({ icon: Icon, num, label }, i) => (
          <div
            key={label}
            className={`flex items-center gap-3 px-6 py-4 ${i < 3 ? 'border-r border-[#3A41E5]/10' : ''}`}
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] border border-[#3A41E5]/15 bg-[#3A41E5]/7">
              <Icon className="h-4 w-4 text-[#3A41E5]" />
            </div>
            <div>
              <div className="text-base font-bold text-[#1F257A] leading-none">{num}</div>
              <div className="text-[11px] text-[#1F257A]/50 mt-0.5">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1.45fr_1fr_1fr_1fr] border-b border-[#3A41E5]/10">

        {/* Brand column */}
        <div className="px-6 py-8 md:border-r border-[#3A41E5]/10">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[6px] bg-[#3A41E5]">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="text-[1.05rem] font-bold text-[#1F257A] tracking-tight leading-none">YUDO Scheduler</div>
              <div className="text-[10px] font-semibold tracking-[.1em] uppercase text-[#3A41E5]/70 mt-0.5">Smart · Fast · Reliable</div>
            </div>
          </div>

          <p className="text-[.8rem] leading-relaxed text-[#1F257A]/60 max-w-[230px] mb-4">
            Empowering productivity through intelligent time management and seamless scheduling solutions.
          </p>

          <div className="flex items-center gap-2.5 mb-5">
            <div className="flex">
              {[16860528, 20110627, 59442788, 89768406].map((id, i) => (
                <img
                  key={i}
                  src={`https://avatars.githubusercontent.com/u/${id}`}
                  alt=""
                  className="h-7 w-7 rounded-full border-2 border-[#F7F8FF] object-cover -ml-2 first:ml-0"
                />
              ))}
            </div>
            <span className="text-[11px] text-[#1F257A]/55">
              <strong className="text-[#1F257A] font-semibold">999+</strong> organizing their life
            </span>
          </div>

          <ColTitle>Follow us</ColTitle>
          <div className="flex gap-2">
            <SocialBtn href="https://github.com/pardeepsidhu" label="GitHub" icon={Github} />
            <SocialBtn href="https://www.linkedin.com/in/pardeep-singh-85848a2b1" label="LinkedIn" icon={Linkedin} />
            <SocialBtn href="https://www.instagram.com/es6_boy" label="Instagram" icon={Instagram} />
          </div>
        </div>

        {/* Developer + About */}
        <div className="px-6 py-8 md:border-r border-[#3A41E5]/8">
          <ColTitle>Developer</ColTitle>
          <FLink icon={Code}         text="Pardeep Singh"              href="#" />
          <FLink icon={GraduationCap} text="B.C.A."                   href="#" />
          <FLink icon={Phone}        text="+91 82840 12817"            href="tel:+918284012817" />
          <FLink icon={Mail}         text="sidhupardeep618@yahoo.com"  href="mailto:sidhupardeep618@yahoo.com" />

          <div className="mt-5">
            <ColTitle>About</ColTitle>
            <FLink text="Overview"        href="/about/#overview" />
            <FLink text="Notifications"   href="/about/#notifications" />
            <FLink text="Time management" href="/about/#time-management" />
            <FLink text="Customer"        href="/about/#customer" />
          </div>
        </div>

        {/* Services */}
        <div className="px-6 py-8 md:border-r border-[#3A41E5]/8">
          <ColTitle>Services</ColTitle>
          <FLink icon={Bell}        text="Reminders"          href="#" />
          <FLink icon={CheckSquare} text="Task management"    href="#" />
          <FLink icon={Zap}         text="Analytics"          href="#" />
          <FLink icon={Clock}       text="Time sheet"         href="#" />
          <FLink icon={Zap}         text="Telegram alerts"    href="#" />
          <FLink icon={Mail}        text="Email notifications" href="#" />
        </div>

        {/* Contact + Status */}
        <div className="px-6 py-8">
          <ColTitle>Contact</ColTitle>
          <FLink icon={MapPin} text="Fazilka, Punjab, 152132"       href="#" />
          <FLink icon={Phone}  text="+91 82840 12817"               href="tel:+918284012817" />
          <FLink icon={Mail}   text="yudo.scheduler@gmail.com"      href="mailto:yudo.scheduler@gmail.com" />

          <div className="mt-5">
            <ColTitle>Status</ColTitle>
            <StatusDot color="bg-green-500"  label="All systems operational" />
            <StatusDot color="bg-[#3A41E5]" label="99.9% uptime this month" />
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="relative z-10 border-b border-[#3A41E5]/10 px-6 py-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="flex flex-col gap-2 rounded-xl border border-[#3A41E5]/13 bg-white/60 p-3.5"
            >
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-[#3A41E5]/8 border border-[#3A41E5]/12">
                  <Icon className="h-4 w-4 text-[#3A41E5]" />
                </div>
                <span className="text-[.77rem] font-semibold text-[#1F257A]">{title}</span>
              </div>
              <p className="text-[.71rem] text-[#1F257A]/50 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex flex-wrap items-center gap-2.5 text-[.74rem] text-[#1F257A]/50">
          <span>© {year} <strong className="font-semibold text-[#1F257A]">Yudo Scheduler</strong>. All rights reserved.</span>
          <Dot />
          <span className="flex items-center gap-1">Made with <Heart className="h-3 w-3 fill-red-500 text-red-500" /> in India</span>
          <Dot />
          <Badge icon={Lock} text="SOC 2 compliant" />
          <Badge icon={Shield} text="GDPR ready" />
        </div>
        <div className="flex gap-5">
          {['Privacy Policy', 'Terms of Service', 'Cookies'].map((l) => (
            <a key={l} href={`#${l.toLowerCase().replace(/\s/g, '-')}`}
              className="text-[.74rem] text-[#1F257A]/45 hover:text-[#3A41E5] transition-colors">
              {l}
            </a>
          ))}
        </div>
      </div>

      {/* Bottom accent */}
      <div className="h-px bg-gradient-to-r from-transparent via-[#3A41E5] to-transparent" />
    </footer>
  );
};

export default Footer;