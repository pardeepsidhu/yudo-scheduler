"use client";
import React, { useEffect, useRef } from "react";
import { AuroraText } from "@/components/magicui/aurora-text";
import { BoxReveal } from "@/components/magicui/box-reveal";
import { TypingAnimation } from "@/components/magicui/typing-animation";
import { MailIcon, SendIcon, CheckCircleIcon } from "lucide-react";
import InteractiveGrid from "@/components/bg-grid";
import CalendarEvent from "@/components/calender";
import FlightWidget from "@/components/flight-card";
import Image from "next/image";
import StartedButton from "@/components/ui/hover-width-button";
import StayUpdated from "./StayUpdateSection"
import NotificatinMethods from "./NotificationMethods"

const Notifications = () => {
  // Refs for scroll animations
  const featuresRef = useRef(null);
  const whyMattersRef = useRef(null);
  const testimonialsRef = useRef(null);

  useEffect(() => {
    // Simple intersection observer for scroll animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // Observe all refs
    [featuresRef, whyMattersRef, testimonialsRef].forEach((ref) => {
      if (ref.current) {
        observer.observe(ref.current);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="w-full bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Hero Section with Parallax Effect */}
     <StayUpdated />

      {/* Features Section */}
      <NotificatinMethods />
      {/* Why It Matters Section with Parallax */}
      <div
        ref={whyMattersRef}
        className="py-24 bg-gradient-to-b from-gray-50 to-white"
      >
        <div className="container mx-auto px-4">
          <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">
            <div className="flex flex-col p-4 md:flex-row items-center justify-between">
              <div className="w-full md:w-1/2 p-3 md:p-16 space-y-6">
                <span className="inline-block font-semibold py-1 px-4 rounded-full bg-[#5046e6] text-white tracking-wide text-sm">
                  WHY NOTIFICATIONS MATTER
                </span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                  <AuroraText>Never Miss Out</AuroraText>
                </h2>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Whether you&apos;re juggling work, study, or personal
                  commitments—Yudo keeps you on track. Timely updates mean more
                  peace of mind, less chaos.
                </p>

                <div className="pt-4 flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="text-green-500" size={24} />
                    <span className="text-gray-700">Improved productivity</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <CheckCircleIcon className="text-green-500" size={24} />
                    <span className="text-gray-700">
                      Better time management
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  background:
                    "linear-gradient(45deg, #ec4899, #facc15, #06b6d4)",
                }}
                className="w-full rounded-3xl md:w-1/2 bg-indigo-50 p-2 flex items-center justify-center"
              >
                <Image
                  className="rounded-2xl"
                  src="/landingPage/WhyNotificatin.png"
                  alt="ff"
                  height={1000}
                  width={1000}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div ref={testimonialsRef} className="py-24 container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-green-50 text-green-700 py-1 px-4 rounded-full text-sm font-medium tracking-wide">
            TESTIMONIALS
          </span>
          <h2 className="mt-4 text-4xl font-bold text-gray-900">
            What Our Users Say
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Sarah Johnson",
              role: "Project Manager",
              quote:
                "Yudo notifications have transformed how I manage deadlines. The email alerts are timely and the Telegram integration is seamless.",
            },
            {
              name: "David Chen",
              role: "Student",
              quote:
                "As a busy student juggling multiple classes, Yudo keeps me on track with all my assignments and exams. I haven't missed a deadline since!",
            },
            {
              name: "Michelle Rodriguez",
              role: "Freelancer",
              quote:
                "The customizable notification system helps me manage multiple clients and projects efficiently. A game-changer for my business.",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <div className="flex flex-col h-full">
                <div className="mb-4 text-yellow-400 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className="w-5 h-5 fill-current"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 italic flex-grow">
                  {testimonial.quote}
                </p>

                <div className="mt-6 pt-6 border-t border-gray-100">
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-[#5046e6] py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Stay Updated?
          </h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
            Join thousands of users who never miss an important update with
            Yudo&apos;s notification system.
          </p>
          <StartedButton className="bg-white text-[#5046e6] font-bold py-3 px-8 rounded-full text-lg hover:shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};

export default Notifications;
