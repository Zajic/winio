/**
 * Blok 17.1: Sledování konverzí (CTA). Volá se pouze při cookie_consent === "accepted".
 * Podporuje GA4 (gtag) nebo Plausible.
 */

const CONSENT_KEY = "cookie_consent";

export function hasAnalyticsConsent(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(CONSENT_KEY) === "accepted";
}

export function trackEvent(
  name: string,
  props?: { cta?: string; label?: string; url?: string }
): void {
  if (!hasAnalyticsConsent()) return;

  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  if (gaId && typeof window !== "undefined" && "gtag" in window) {
    (window as unknown as { gtag: (...a: unknown[]) => void }).gtag(
      "event",
      name,
      { event_category: "CTA", ...props }
    );
  }

  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (plausibleDomain && typeof window !== "undefined" && "plausible" in window) {
    (window as unknown as { plausible: (n: string, o?: { props?: Record<string, string> }) => void }).plausible(
      name,
      { props: props as Record<string, string> }
    );
  }
}
