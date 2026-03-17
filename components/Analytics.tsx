"use client";

import Script from "next/script";
import { useEffect, useCallback, useState } from "react";
import { hasAnalyticsConsent, trackEvent } from "@/lib/analytics";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const PLAUSIBLE_DOMAIN = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

export function Analytics() {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    setConsent(hasAnalyticsConsent());
  }, []);

  const handleClick = useCallback((e: MouseEvent) => {
    const target = (e.target as HTMLElement).closest?.("[data-cta]");
    if (!target || !(target instanceof HTMLElement)) return;
    const cta = target.getAttribute("data-cta") ?? "cta";
    const label = target.getAttribute("data-cta-label") ?? "";
    const url = (target.getAttribute("href") ?? (target as HTMLAnchorElement).href) ?? "";
    trackEvent("cta_click", { cta, label, url });
  }, []);

  useEffect(() => {
    if (!consent) return;
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [consent, handleClick]);

  if (!consent || (!GA_ID && !PLAUSIBLE_DOMAIN)) return null;

  return (
    <>
      {GA_ID && (
        <>
          <Script
            id="ga4"
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-config" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
        </>
      )}
      {PLAUSIBLE_DOMAIN && (
        <Script
          id="plausible"
          src="https://plausible.io/js/script.js"
          data-domain={PLAUSIBLE_DOMAIN}
          strategy="afterInteractive"
        />
      )}
    </>
  );
}
