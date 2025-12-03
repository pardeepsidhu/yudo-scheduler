'use client'

import { useEffect, useState } from "react";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "react-hot-toast";

const QuickLogin = () => {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isClient, setIsClient] = useState(false);

  // Set isClient to true once component mounts
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Track mouse position for interactive effects - only on client
  useEffect(() => {
    if (!isClient) return;
    
    const handleMouseMove = (e:any) => {
      setMousePosition({
        x: e.clientX,
        y: e.clientY
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isClient]);

  // Extract token from URL on component mount - only on client
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const tokenParam:any = urlParams.get('token');
      setToken(tokenParam);
      
      if (!tokenParam) {
        toast.error("No login token found in URL");
        setLoading(false);
      }
    } catch (err) {
      console.error("Error parsing URL parameters:", err);
      toast.error("Invalid URL parameters");
      setLoading(false);
    }
  }, [isClient]);

  // Handle login once token is available
  useEffect(() => {
    if (!isClient || !token) return;

    const loginWithQuickLink = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/v1/user/quicklogin?token=${token}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Authentication failed. Please try again.");
        }

        setSuccess(true);
        localStorage.setItem("user", JSON.stringify(data));
        toast.success("Login successful!");
        
        // Redirect after short delay to show success state
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500);
      } catch (error:any) {
        console.error("Login error:", error);
        toast.error(error.message || "Something went wrong. Please try again.");
        toast.error(error.message || "Authentication failed");
      } finally {
        setLoading(false);
      }
    };

    loginWithQuickLink();
  }, [token, isClient]);

  // Generate background elements with static keys rather than random values
  const renderBackgroundElements = () => {
    if (!isClient) return null;
    
    return [...Array(8)].map((_, i) => (
      <div 
        key={i}
        className="absolute rounded-full bg-gradient-to-r from-blue-500/30 to-indigo-500/20 blur-xl"
        style={{
          width: `${(i + 1) * 50 + 100}px`,
          height: `${(i + 1) * 50 + 100}px`,
          left: `${(i * 12) % 100}%`,
          top: `${(i * 15) % 100}%`,
          transform: 'translate(-50%, -50%)',
          opacity: 0.5,
          animation: `float ${(i % 3) + 8}s ease-in-out infinite alternate`
        }}
      />
    ));
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen px-4 overflow-hidden bg-slate-900">
      {/* Animated background elements - only render on client side */}
      <div className="absolute inset-0 overflow-hidden">
        {isClient && renderBackgroundElements()}
      </div>
      
      {/* Interactive light effect that follows mouse - only on client */}
      {isClient && (
        <div 
          className="hidden md:block absolute bg-blue-400/20 blur-3xl rounded-full w-64 h-64"
          style={{
            left: mousePosition.x,
            top: mousePosition.y,
            transform: 'translate(-50%, -50%)',
            transition: 'transform 0.1s ease-out, opacity 0.3s ease'
          }}
        />
      )}
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 to-slate-800/90" />
      
      {/* Main card content */}
      <div className="relative z-10 w-full max-w-md">
        <Card className="w-full overflow-hidden transition-all duration-300 border-0 shadow-2xl rounded-2xl group hover:shadow-blue-500/10 hover:translate-y-[-2px]">
          <CardHeader className="relative py-8 text-white bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-100 group-hover:opacity-0 transition-opacity duration-300" />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <div className="absolute inset-0">
              {isClient && [...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full bg-white/10"
                  style={{
                    width: `${(i + 1) * 20 + 50}px`,
                    height: `${(i + 1) * 20 + 50}px`,
                    left: `${(i * 20) % 100}%`,
                    top: `${(i * 25) % 100}%`,
                    opacity: 0.1 + (i * 0.05),
                    transform: 'translate(-50%, -50%)',
                    animation: `pulse ${(i % 3) + 5}s ease-in-out infinite alternate`
                  }}
                />
              ))}
            </div>
            
            <CardTitle className="relative z-10 text-center text-2xl font-medium">
              Quick Login
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-8 bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
            {loading && (
              <div className="flex flex-col items-center space-y-6">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-blue-100 dark:bg-blue-900/30"></div>
                  <Loader2 className="absolute top-0 w-20 h-20 text-blue-600 dark:text-blue-400 animate-spin" />
                </div>
                <div className="text-center space-y-2">
                  <p className="text-xl font-medium text-gray-800 dark:text-gray-200">Authenticating your session...</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">You'll be redirected automatically</p>
                </div>
              </div>
            )}

            {error && (
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="relative group">
                  <div className="w-20 h-20 transition-colors duration-300 rounded-full bg-red-100 dark:bg-red-900/30 group-hover:bg-red-200 dark:group-hover:bg-red-800/30"></div>
                  <AlertCircle className="absolute top-0 w-20 h-20 transition-colors duration-300 text-red-500 dark:text-red-400 group-hover:text-red-600 dark:group-hover:text-red-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-gray-800 dark:text-gray-200">Authentication Failed</p>
                  <p className="text-gray-600 dark:text-gray-300">{error}</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Redirecting to login page...</p>
                </div>
              </div>
            )}

            {success && (
              <div className="flex flex-col items-center space-y-6 text-center">
                <div className="relative group">
                  <div className="w-20 h-20 transition-colors duration-300 rounded-full bg-green-100 dark:bg-green-900/30 group-hover:bg-green-200 dark:group-hover:bg-green-800/30"></div>
                  <CheckCircle className="absolute top-0 w-20 h-20 transition-colors duration-300 text-green-500 dark:text-green-400 group-hover:text-green-600 dark:group-hover:text-green-300" />
                </div>
                <div className="space-y-2">
                  <p className="text-xl font-medium text-gray-800 dark:text-gray-200">Successfully Authenticated</p>
                  <p className="text-gray-600 dark:text-gray-300">You're now logged in</p>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">Redirecting to dashboard...</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* CSS Animations */}
      <style jsx global>{`
        @keyframes float {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-60%, -30%) scale(1.1); }
        }
        
        @keyframes pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.1; }
          100% { transform: translate(-50%, -50%) scale(1.2); opacity: 0.3; }
        }
      `}</style>
    </div>
  );
};

export default QuickLogin;