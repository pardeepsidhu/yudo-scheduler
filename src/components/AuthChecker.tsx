"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "";

export  function AuthChecker() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const verify = async () => {
      // Skip login page
      if (pathname === "/") return;

      try {
        const user = localStorage.getItem("user");
        const token = user ? JSON.parse(user).token : null;

        // No token -> logout
        if (!token) {
          localStorage.clear();
          router.replace("/");
          return;
        }

        const response = await fetch(`${BASE_URL}/api/v1/ai/chat`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify({
            query: "ping",
            history: [],
          }),
        });

        const data = await response.json();

        if (!response.ok || data?.success === false) {
          localStorage.clear();

          if (pathname !== "/") {
            router.replace("/");
          }
        }
      } catch (error) {
        console.error("Auth verification failed:", error);

        localStorage.clear();

        if (pathname !== "/") {
          router.replace("/");
        }
      }
    };

    verify();
  }, []);

  return null;
}