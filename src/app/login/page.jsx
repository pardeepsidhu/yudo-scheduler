'use client'
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MailIcon, LockIcon, ShieldCheck, Calendar, Loader2 } from "lucide-react";
import StaticSide from "./StaticSide";
import { 
  Alert,
  AlertDescription 
} from "@/components/ui/alert";

// Mock API functions (replace with your actual API calls)
const handleSignIn = async (email, password, setMessage, e, navigate, setWaiting, setUser) => {
  try {
    setWaiting(true);
    // Replace with your actual API call
    const response = await fetch('https://yudo-reminder-backend.onrender.com/api/v1/user/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data.user);
      navigate("/");
    } else {
      setMessage(data.error || "Authentication failed");
    }
  } catch (error) {
    setMessage("An error occurred during sign in");
  } finally {
    setWaiting(false);
  }
};

const sendOtp = async (email, password, setMessage, setReceivedOtp, setOtpSent, setOtpTimer, setWaiting) => {
  try {
    setWaiting(true);
    // Replace with your actual API call
    const response = await fetch('https://yudo-reminder-backend.onrender.com/api/v1/user/sendotp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      setReceivedOtp(data.otp);
      setOtpSent(true);
      setOtpTimer(60); // 60 second timer
      setMessage("OTP sent to your email");
    } else {
      setMessage(data.error || "Failed to send OTP");
    }
  } catch (error) {
    setMessage("An error occurred while sending OTP");
  } finally {
    setWaiting(false);
  }
};

const verifyOtp = async (email, otp, password, setMessage, navigate, setWaiting, setUser) => {
  try {
    setWaiting(true);
    // Replace with your actual API call
    const response = await fetch('https://yudo-reminder-backend.onrender.com/api/v1/user/verifyotp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp, password })
    });
    
    const data = await response.json();
    
 
    if (response.ok) {
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data.user);
      navigate("/");
    } else {
      // console.log("this is data"+data)
      setMessage(data.error || "OTP verification failed");
    }
  } catch (error) {
    setMessage("An error occurred during verification");
  } finally {
    setWaiting(false);
  }
};

const AuthPage = () => {
  const [tab, setTab] = useState("login");
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [user, setUser] = useState(null);

  // Navigation function (replace with your routing solution)
  const navigate = (path) => {
    window.location.href = path;
  };

  useEffect(() => {
    // Check if user is already logged in
    let storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/");
    }
  }, []);

  useEffect(() => {
    // OTP timer countdown
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const handleOtpChange = (index, value) => {
    if (!isNaN(parseInt(value)) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      
      // Auto-focus next input
      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSendOtp = () => {
    // Form validation
    if (!email || !password || !confirmPassword) {
      setMessage("Please enter all required fields");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must have at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    sendOtp(email, password, setMessage, setReceivedOtp, setOtpSent, setOtpTimer, setWaiting);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      setMessage("Please enter the complete 4-digit OTP");
      return;
    }
    verifyOtp(email, otpString, password, setMessage, navigate, setWaiting, setUser);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Form validation
    if (!email || !password) {
      setMessage("Please enter your email and password");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setMessage("Please enter a valid email address");
      return;
    }

    handleSignIn(email, password, setMessage, e, navigate, setWaiting, setUser);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setOtp(["", "", "", ""]);
    setOtpSent(false);
    setOtpTimer(0);
    setMessage("");
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-teal-50 to-emerald-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 relative">
        {/* Decorative elements */}
        <div className="absolute -z-10 top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-teal-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-emerald-100/30 rounded-full blur-3xl"></div>
        </div>
        
        {/* Left side - Product info */}
        <StaticSide />
        
        {/* Right side - Auth form */}
        <div className="w-full md:w-1/2">
          <div className="w-full max-w-md mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-8 space-y-6 border border-teal-100 transition-all hover:shadow-teal-100/20">
            <div className="flex justify-center">
              <div className="h-14 w-14 bg-gradient-to-br from-teal-400 to-emerald-400 rounded-full flex items-center justify-center shadow-md">
                <Calendar className="h-7 w-7 text-white" />
              </div>
            </div>
            
            <h2 className="text-2xl m-0 font-bold text-center text-gray-800">
              Welcome to <span className="bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-transparent">YUDO Scheduler</span>
            </h2>
            
            <p className="text-center text-zinc-500">
              Stay on track with email & Telegram alerts for important updates.
            </p>

            {message && (
              <Alert variant={message.includes("success") ? "default" : "destructive"} className="bg-white/90">
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            <Tabs defaultValue="login" className="w-full" value={tab} onValueChange={setTab}>
              <TabsList className="grid bg-slate-100 grid-cols-2 w-full mb-6 rounded-lg p-1">
                <TabsTrigger 
                  value="login" 
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm transition-all"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger 
                  value="signup"
                  className="rounded-md data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm transition-all"
                >
                  Signup
                </TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form className="space-y-5" onSubmit={handleLogin}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center space-x-2 border border-slate-200 bg-white rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                      <MailIcon className="h-5 w-5 text-teal-500" />
                      <Input 
                        placeholder="your@email.com" 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Password</label>
                      <a href="#" className="text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors">
                        Forgot password?
                      </a>
                    </div>
                    <div className="flex items-center space-x-2 border border-slate-200 bg-white rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                      <LockIcon className="h-5 w-5 text-teal-500" />
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" 
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <input 
                      id="remember-me" 
                      name="remember-me" 
                      type="checkbox" 
                      className="h-4 w-4 text-teal-600 border-gray-300 rounded focus:ring-teal-500"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      Remember me
                    </label>
                  </div>
                  
                  <Button 
                    type="submit"
                    disabled={waiting}
                    className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white py-6 shadow-md hover:shadow-lg transition-all duration-300"
                  >
                    {waiting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                      </>
                    ) : (
                      "Log In"
                    )}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form className="space-y-4" onSubmit={handleVerifyOtp}>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email Address</label>
                    <div className="flex items-center space-x-2 border border-slate-200 bg-white rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                      <MailIcon className="h-5 w-5 text-teal-500" />
                      <Input 
                        placeholder="your@email.com" 
                        type="email" 
                        required 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={otpSent}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Create Password</label>
                    <div className="flex items-center space-x-2 border border-slate-200 bg-white rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                      <LockIcon className="h-5 w-5 text-teal-500" />
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={otpSent}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" 
                      />
                    </div>
                    <p className="text-xs text-gray-500">Password must be at least 8 characters</p>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Confirm Password</label>
                    <div className="flex items-center space-x-2 border border-slate-200 bg-white rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-teal-500 focus-within:border-teal-500 transition-all">
                      <ShieldCheck className="h-5 w-5 text-teal-500" />
                      <Input 
                        placeholder="••••••••" 
                        type="password" 
                        required 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={otpSent}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0" 
                      />
                    </div>
                  </div>

                  {otpSent && (
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
                            className="text-center text-xl font-bold w-12 h-12 rounded-xl border-2 border-slate-200 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 bg-white"
                          />
                        ))}
                      </div>
                      <p className="text-xs text-right">
                        <button 
                          type="button"
                          onClick={handleSendOtp}
                          disabled={otpTimer > 0}
                          className="text-teal-600 hover:text-teal-800 font-medium transition-colors disabled:text-gray-400"
                        >
                          {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend code"}
                        </button>
                      </p>
                    </div>
                  )}

                  <div className="flex gap-2">
                    {!otpSent ? (
                      <>
                        <Button 
                          type="button"
                          onClick={handleSendOtp}
                          disabled={waiting}
                          className="flex-1 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white shadow-md hover:shadow-lg transition-all duration-300"
                        >
                          {waiting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>
                        <Button 
                          type="button"
                          onClick={resetForm}
                          variant="outline"
                          className="flex-1"
                        >
                          Reset
                        </Button>
                      </>
                    ) : (
                      <Button 
                        type="submit"
                        disabled={waiting || otp.join("").length !== 4}
                        className="w-full bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-600 hover:to-emerald-600 text-white py-6 shadow-md hover:shadow-lg transition-all duration-300"
                      >
                        {waiting ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait...
                          </>
                        ) : (
                          "Create Account"
                        )}
                      </Button>
                    )}
                  </div>
                </form>
              </TabsContent>
            </Tabs>

            <div className="text-sm text-center text-zinc-500">
              By continuing, you agree to YUDO&apos;s{" "}
              <a href="#" className="text-teal-600 hover:text-teal-800 transition-colors font-medium">Terms of Service</a> & {" "}
              <a href="#" className="text-teal-600 hover:text-teal-800 transition-colors font-medium">Privacy Policy</a>.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;