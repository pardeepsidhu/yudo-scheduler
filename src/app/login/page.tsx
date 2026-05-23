'use client'
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { MailIcon, LockIcon, ShieldCheck, Calendar, Loader2, Mails, MailCheck, CheckCircle, AlertCircle, ArrowRight, Sparkles, Bell, Clock, Shield } from "lucide-react";
// import StaticSide from "./StaticSide";
import {
  Alert,
  AlertDescription
} from "@/components/ui/alert";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { handleQuickLogin, handleResetPassword, handleSignIn, sendOtp, verifyOtp } from "../api/userApi";

const FeatureCard = ({ icon: Icon, title, desc, accent }: any) => (
  <div className="group flex items-start gap-4 rounded-2xl border border-white/60 bg-white/50 p-5 backdrop-blur transition-all duration-300 hover:bg-white/80 hover:shadow-md hover:shadow-teal-100/50 cursor-pointer">
    <div className={`shrink-0 rounded-xl p-2.5 ${accent}`}>
      <Icon className="h-5 w-5 text-teal-600" />
    </div>
    <div>
      <p className="text-sm font-semibold green-text">{title}</p>
      <p className="mt-0.5 text-xs leading-relaxed green-text">{desc}</p>
    </div>
  </div>
);

const Field = ({ label, icon: Icon, children, hint }: any) => (
  <div>
    <label className="text-xs font-semibold uppercase tracking-widest text-slate-400">
      {label}
    </label>
    <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 green-text transition-all">
      <Icon className="h-4 w-4 shrink-0 text-slate-400" />
      {children}
    </div>
    {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
  </div>
);

const OtpRow = ({ otp, handleOtpChange }: any) => (
  <div className="flex gap-3">
    {(otp ?? ["", "", "", ""]).map((digit: string, i: number) => (
      <div
        key={i}
        className="flex-1 rounded-xl border-2 border-slate-200 bg-white focus-within:border-teal-400 transition-colors"
      >
        <input
          id={`otp-${i}`}
          maxLength={1}
          value={digit}
          onChange={(e) => handleOtpChange(i, e.target.value)}
          className="w-full h-12 text-center text-xl font-bold bg-transparent outline-none text-slate-800"
        />
      </div>
    ))}
  </div>
);

const Banner = ({ message }: any) => {
  if (!message) return null;
  const ok = message.includes("success");
  return (
    <div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium
      ${ok ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}>
      <span className={`h-2 w-2 rounded-full shrink-0 ${ok ? "bg-emerald-500" : "bg-red-500"}`} />
      {message}
    </div>
  );
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
  const [resetId, setResetId] = useState(null);
  const [restIdWaiting, setResetIdWaiting] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('resetId');
    setResetId(token as any);
    setResetIdWaiting(false)
  }, []);

  const navigate = (path: string) => {
    window.location.href = path;
  };

  useEffect(() => {
    if (!resetId && !restIdWaiting) {
      let storedUser = localStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
        navigate("/");
      }
    }
  }, [restIdWaiting]);

  useEffect(() => {
    let timer: any;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (!isNaN(parseInt(value)) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < 3) {
        document.getElementById(`otp-${index + 1}`)?.focus();
      }
    }
  };

  const handleSendOtp = () => {
    if (!email || !password || !confirmPassword) {
      toast.error("Please enter all required fields");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      toast.error("Password must have at least 8 characters");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    sendOtp(email, password, toast, setReceivedOtp, setOtpSent, setOtpTimer, setWaiting);
  };

  const handleVerifyOtp = (e: any) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 4) {
      toast.error("Please enter the complete 4-digit OTP");
      return;
    }
    verifyOtp(email, otpString, password, toast, navigate, setWaiting, setUser);
  };

  const handleLogin = (e: any) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter your email and password");
      return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    handleSignIn(email, password, toast, e, navigate, setWaiting, setUser);
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
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <div className="relative flex w-full flex-col overflow-hidden bg-slate-50  md:w-[480px] md:shrink-0 p-1">
  <div className="relative h-full w-full  border border-teal-200/70 bg-white/40 p-[6px] overflow-hidden">
    <div className="relative h-full w-full  border border-emerald-300/70 bg-slate-50 overflow-y-auto">
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      
      <div className="relative z-10 w-full max-w-sm mx-auto px-6 py-6">
        <Banner message={message} />

        {resetId ? (
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Set new password</h2>
              <p className="mt-1 text-sm text-slate-500">Choose something strong and memorable.</p>
            </div>

            <form
              className=""
              onSubmit={async (e) => {
                e.preventDefault();
                await handleResetPassword(setWaiting, password, toast, navigate);
              }}
            >
              <Field label="New password" icon={LockIcon} hint="At least 8 characters">
                <Input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
              </Field>
              <Field label="Confirm password" icon={ShieldCheck}>
                <Input type="password" placeholder="••••••••" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </Field>
              <Button type="submit" disabled={waiting} className="w-full mt-2">
                {waiting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Please wait…</> : "Reset password"}
              </Button>
            </form>

            <div className="text-center">
              <Button variant="link" onClick={() => (window.location.href = window.location.pathname)}>
                ← Back to login
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-[4px] bg-[linear-gradient(135deg,_#00d1b0_0%,_#00c0a2_50%,_#00a88d_100%)] backdrop-blur-sm">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold green-text">
                  {tab === "login" ? "Welcome back" : "Create account"}
                </h2>
                <p className="mt-1 text-sm green-text">
                  {tab === "login" ? "Sign in to your workspace." : "Start your free account today."}
                </p>
              </div>
            </div>

            <div className="flex rounded-xl bg-slate-100 p-1">
              {["login", "signup"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`flex-1 rounded-lg py-2 text-sm font-semibold capitalize transition-all duration-200
                ${tab === t ? "bg-white green-text shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
                >
                  {t}
                </button>
              ))}
            </div>

            {tab === "login" && (
              <form className="space-y-4" onSubmit={handleLogin}>
                <Field label="Email" icon={MailIcon}>
                  <Input type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>

                <Field label="Password" icon={LockIcon}>
                  <Input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </Field>

                <button
                  type="button"
                  onClick={async () => await handleQuickLogin(toast, email, setWaiting)}
                  className="flex items-center gap-1.5 text-xs font-medium text-teal-600 hover:text-teal-800 transition-colors"
                >
                  <MailCheck className="h-3.5 w-3.5" />
                  Request quick login link
                </button>

                <Button type="submit" disabled={waiting} className="yudo-btn">
                  {waiting
                    ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Signing in…</>
                    : <>Sign in <ArrowRight className="ml-1.5 h-4 w-4" /></>}
                </Button>
              </form>
            )}

            {tab === "signup" && (
              <form className="space-y-4" onSubmit={handleVerifyOtp}>
                <Field label="Email" icon={MailIcon}>
                  <Input type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={otpSent} />
                </Field>

                <Field label="Password" icon={LockIcon} hint="At least 8 characters">
                  <Input type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={otpSent} />
                </Field>

                <Field key={'Confirm password'} label="Confirm password" icon={ShieldCheck}>
                  <Input type="password" placeholder="••••••••" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={otpSent} />
                </Field>

                {otpSent && (
                  <div className="space-y-3 rounded-2xl border border-teal-100 bg-teal-50/60 p-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-widest text-teal-700">Verification code</p>
                      <p className="text-xs text-slate-500 mt-0.5">Check your email for a 4-digit code.</p>
                    </div>
                    <OtpRow otp={otp} handleOtpChange={handleOtpChange} />
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={handleSendOtp}
                        disabled={otpTimer > 0}
                        className="text-xs font-medium text-teal-600 hover:text-teal-800 disabled:text-slate-400 transition-colors"
                      >
                        {otpTimer > 0 ? `Resend in ${otpTimer}s` : "Resend code"}
                      </button>
                      <button type="button" onClick={resetForm} className="text-xs text-slate-400 hover:text-slate-600 transition-colors">
                        Reset form
                      </button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  {!otpSent ? (
                    <>
                      <div className="w-1/2">
                        <Button
                          type="button"
                          onClick={handleSendOtp}
                          disabled={waiting}
                          className="yudo-btn w-full"
                        >
                          {waiting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Sending…
                            </>
                          ) : (
                            "Send OTP"
                          )}
                        </Button>
                      </div>

                      <div className="w-1/2">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={resetForm}
                          className="w-full min-w-0 yudo-btn-sec"
                        >
                          Reset
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      type="submit"
                      disabled={waiting || (otp ?? []).join("").length !== 4}
                      className="w-full"
                    >
                      {waiting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating account…
                        </>
                      ) : (
                        <>
                          Create account
                          <ArrowRight className="ml-1.5 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
</div>

      <div className="relative hidden flex-1 flex-col overflow-hidden bg-gradient-to-br from-teal-600 via-teal-500 to-emerald-500 p-8 md:flex lg:p-12">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-emerald-400/20" />
        <div className="pointer-events-none absolute top-1/2 right-0 h-56 w-56 -translate-y-1/2 rounded-full bg-teal-400/20" />

        <div className="relative z-10 flex flex-col h-full justify-between min-h-0">
          <div className="flex items-center gap-3 shrink-0">
            <div className="flex h-9 w-9 items-center justify-center rounded-[4PX] bg-white/20 backdrop-blur-sm">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <span className="text-base font-semibold text-white/90">YUDO-SCHEDULER</span>
          </div>

          <div className="space-y-6 shrink-0">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-medium text-white backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" />
                Smart scheduling, smarter alerts
              </div>
              <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white lg:text-4xl">
                Take control of<br />your time.
              </h1>
              <p className="max-w-md text-sm leading-relaxed text-teal-100 lg:text-base">
                YUDO Scheduler keeps you on track with intelligent reminders via email and Telegram — so nothing slips through the cracks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              <FeatureCard
                icon={Bell}
                title="Smart Alerts"
                desc="Email & Telegram notifications on your schedule"
                accent="bg-white/20"
              />
              <FeatureCard
                icon={Clock}
                title="Time Tracking"
                desc="Monitor productivity & hit every milestone"
                accent="bg-white/20"
              />
              <FeatureCard
                icon={CheckCircle}
                title="Task Management"
                desc="Create tasks with deadlines in seconds"
                accent="bg-white/20"
              />
              <FeatureCard
                icon={Shield}
                title="Secure Access"
                desc="Two-factor auth keeps your data safe"
                accent="bg-white/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex -space-x-2">
              {[
                "https://avatars.githubusercontent.com/u/16860528",
                "https://avatars.githubusercontent.com/u/20110627",
                "https://avatars.githubusercontent.com/u/59442788",
                "https://avatars.githubusercontent.com/u/89768406",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="user avatar"
                  className="h-8 w-8 rounded-full border-2 border-teal-500 object-cover"
                />
              ))}
            </div>
            <p className="text-sm font-medium text-teal-100">
              <span className="text-white font-bold">999+</span> users organizing their life
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;