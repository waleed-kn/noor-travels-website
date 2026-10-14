"use client";

import { useEffect, useRef } from "react";
import { signOut } from "next-auth/react";

const IDLE_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes of inactivity

export function IdleTimer() {
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function resetTimer() {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = setTimeout(() => {
        // Automatically logout on 30 minutes of inactivity
        console.warn("Session expired due to 30 minutes of inactivity. Logging out.");
        signOut({ callbackUrl: "/admin/login?reason=idle" });
      }, IDLE_TIMEOUT_MS);
    }

    // Set initial timer
    resetTimer();

    // Throttle event listening for performance
    let lastReset = Date.now();
    function handleActivity() {
      const now = Date.now();
      if (now - lastReset > 1000) {
        lastReset = now;
        resetTimer();
      }
    }

    const events = ["mousedown", "mousemove", "keydown", "scroll", "touchstart", "click"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, []);

  return null;
}
