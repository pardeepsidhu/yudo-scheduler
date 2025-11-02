import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/navbar";
import { NavigationProvider } from "./context/ActiveItemContext";
import { Toaster } from "react-hot-toast"; // ✅ Import Toaster

export const metadata: Metadata = {
  title: "Yudo Scheduler | Professional Task & Time Management Solution",
  description:
    "Streamline your workflow with Yudo Scheduler - the comprehensive task management platform featuring time tracking, priority management, automated timesheets, analytics, and smart notifications via Telegram and email.",
  keywords: [
    "task management",
    "time tracking",
    "productivity tools",
    "timesheet generation",
    "project analytics",
    "task prioritization",
    "telegram notifications",
    "workflow optimization",
    "professional scheduler",
    "time management solution",
  ],
  authors: [{ name: "Pardeep Singh", url: "http://yudo-scheduler.vercel.app" }],
  creator: "Yudo Scheduler",
  publisher: "Yudo Scheduler",
  applicationName: "Yudo Scheduler",
  category: "Productivity",
  alternates: {
    canonical: "http://yudo-scheduler.vercel.app",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "http://yudo-scheduler.vercel.app",
    title: "Yudo Scheduler | Professional Task & Time Management Solution",
    description:
      "Streamline your workflow with intelligent task management, time tracking, and automated reporting",
    siteName: "Yudo Scheduler",
  },
  icons: {
    icon: [
      { url: "/logo.png", sizes: "any" },
      { url: "/logo.png", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon-logo.png", sizes: "180x180" }],
  },
  formatDetection: {
    telephone: true,
    email: true,
    address: true,
  },
  appleWebApp: {
    title: "Yudo Scheduler",
    capable: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true" className="antialiased">
        <NavigationProvider defaultActiveItem="dashboard">
          <Navbar />
          {children}

          {/* ✅ Add React Hot Toast globally */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3500,
              style: {
                background: "#fff",
                color: "#333",
                border: "1px solid #e5e7eb",
                padding: "10px 16px",
                borderRadius: "8px",
                fontSize: "0.9rem",
                boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              },
              success: {
                iconTheme: {
                  primary: "#22c55e",
                  secondary: "#fff",
                },
              },
              error: {
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff",
                },
              },
            }}
          />
        </NavigationProvider>
      </body>
    </html>
  );
}
