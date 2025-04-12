'use client'
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MailIcon, LockIcon, ShieldCheck,  Calendar } from "lucide-react";
import StaticSide from "./StaticSide";

const AuthPage = () => {
  const [tab, setTab] = useState("login");
  const [otp, setOtp] = useState(["", "", "", ""]);

  const handleOtpChange = (index:number, value:string) => {
    if (!isNaN(parseInt(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-[aqua] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8">
        {/* Left side - Product info */}
       <StaticSide />
        {/* Right side - Auth form */}
        <div className="w-full md:w-1/2">
          <div className="w-full max-w-md mx-auto bg-[#D0FDFE] rounded-3xl shadow-2xl p-8 space-y-6 border border-indigo-50">
            <div className="flex justify-center">
              <div className="h-12 w-12 bg-[#49FAFC] rounded-full flex items-center justify-center">
                <Calendar className="h-6 w-6  text-indigo-600" />
              </div>
            </div>
            
            <h2 className="text-2xl m-0 font-bold text-center text-gray-800">
              Welcome to <span className="text-indigo-600">YUDO Scheduler</span>
            </h2>
            
            <p className="text-center text-zinc-500">
              Stay on track with email & Telegram alerts for important updates.
            </p>

            <Tabs defaultValue="login"  className="w-full " value={tab} onValueChange={setTab}>
              <TabsList className="grid bg-[#49FAFC] grid-cols-2 w-full mb-6">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="signup">Signup</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form className="space-y-5">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <MailIcon className="h-5 w-5 text-indigo-600" />
                      <Input placeholder="your@email.com" type="email" required className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Password</label>

                    </div>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <LockIcon className="h-5 w-5 text-indigo-600" />
                      <Input placeholder="••••••••" type="password" required className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6">
                    Log In
                  </Button>
                </form>
                
              </TabsContent>

              <TabsContent value="signup">
                <form className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <MailIcon className="h-5 w-5 text-indigo-600" />
                      <Input placeholder="your@email.com" type="email" required className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Create Password</label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <LockIcon className="h-5 w-5 text-indigo-600" />
                      <Input placeholder="••••••••" type="password" required className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" />
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="flex items-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
                      <ShieldCheck className="h-5 w-5 text-indigo-600" />
                      <Input placeholder="••••••••" type="password" required className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Verification Code</label>
                    <p className="text-xs text-gray-500">Enter the 4-digit code sent to your email</p>
                    <div className="flex justify-between gap-2">
                      {otp.map((digit, index) => (
                        <Input
                          key={index}
                          id={`otp-${index}`}
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(index, e.target.value)}
                          className="text-center text-xl font-bold w-12 h-12 rounded-xl border-2 border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                      ))}
                    </div>
                    <p className="text-xs text-right text-indigo-600">
                      <a href="#" className="hover:underline">Resend code</a>
                    </p>
                  </div>

                  <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6">
                    Create Account
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-sm text-center text-zinc-500 ">
              By continuing, you agree to YUDO&apos;s <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> & <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;