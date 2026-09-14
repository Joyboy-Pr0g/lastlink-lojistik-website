/**
 * The site ships as a Vite multi-page build: each legal document is its own
 * HTML entry, so these are real URLs that work on any static host with no
 * rewrite rules. Trailing slashes keep the relative asset paths correct.
 */
export const ROUTES = {
  home: "/",
  privacy: "/privacy/",
  terms: "/terms/"
} as const;

export type LegalDoc = "privacy" | "terms";
