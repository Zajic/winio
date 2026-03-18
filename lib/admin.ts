/**
 * Admin oprávnění: seznam e-mailů v ADMIN_EMAILS (čárkou oddělené).
 * Pouze tito uživatelé mají přístup do /admin.
 */

const ADMIN_EMAILS_KEY = "ADMIN_EMAILS";

function getAdminEmails(): string[] {
  const raw = process.env[ADMIN_EMAILS_KEY];
  if (!raw?.trim()) return [];
  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const list = getAdminEmails();
  if (list.length === 0) return false;
  return list.includes(email.toLowerCase());
}
