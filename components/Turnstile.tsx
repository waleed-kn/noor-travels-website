"use client";

import React, { useEffect, useRef, useState, useId } from "react";

interface TurnstileProps {
  onSuccess?: (token: string) => void;
  onError?: (error: unknown) => void;
  onExpire?: () => void;
  siteKey?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact" | "flexible";
  className?: string;
}

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: (error: unknown) => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact" | "flexible";
        }
      ) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
    onTurnstileLoaded?: () => void;
  }
}

// Cloudflare official Always-Pass test key for development/preview when real key is not yet set
const CF_TEST_ALWAYS_PASS_KEY = "1x00000000000000000000AA";

export function Turnstile({
  onSuccess,
  onError,
  onExpire,
  siteKey,
  theme = "light",
  size = "normal",
  className = "",
}: TurnstileProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const [token, setToken] = useState<string>("");
  const inputId = useId();

  // Resolve active site key: user-provided -> env var -> CF test key
  const envKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const activeSiteKey =
    siteKey ||
    (envKey && !envKey.includes("...") && envKey !== "0x4AAAAAA..."
      ? envKey
      : CF_TEST_ALWAYS_PASS_KEY);

  useEffect(() => {
    let isMounted = true;

    function renderWidget() {
      if (!window.turnstile || !containerRef.current || !isMounted) return;

      // Clean up previous widget if exists
      if (widgetIdRef.current) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }

      try {
        const id = window.turnstile.render(containerRef.current, {
          sitekey: activeSiteKey,
          theme,
          size,
          callback: (receivedToken: string) => {
            if (isMounted) {
              setToken(receivedToken);
              onSuccess?.(receivedToken);
            }
          },
          "error-callback": (err: unknown) => {
            if (isMounted) {
              onError?.(err);
            }
          },
          "expired-callback": () => {
            if (isMounted) {
              setToken("");
              onExpire?.();
            }
          },
        });
        widgetIdRef.current = id;
      } catch (err) {
        console.error("Turnstile render error:", err);
      }
    }

    // Check if script is already present
    const existingScript = document.getElementById("cloudflare-turnstile-script");

    if (window.turnstile) {
      renderWidget();
    } else if (existingScript) {
      const interval = setInterval(() => {
        if (window.turnstile) {
          clearInterval(interval);
          renderWidget();
        }
      }, 50);
      return () => clearInterval(interval);
    } else {
      window.onTurnstileLoaded = () => {
        if (isMounted) renderWidget();
      };

      const script = document.createElement("script");
      script.id = "cloudflare-turnstile-script";
      script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoaded&render=explicit";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }

    return () => {
      isMounted = false;
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.remove(widgetIdRef.current);
        } catch {
          // ignore
        }
        widgetIdRef.current = null;
      }
    };
  }, [activeSiteKey, theme, size, onSuccess, onError, onExpire]);

  return (
    <div className={`turnstile-wrapper my-2 ${className}`}>
      <div ref={containerRef} className="min-h-[65px]" />
      <input
        id={inputId}
        type="hidden"
        name="cf-turnstile-response"
        value={token}
        readOnly
      />
    </div>
  );
}
