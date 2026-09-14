import { useEffect } from "react";
import { useTranslation } from "react-i18next";

const LANGUAGES = ["en", "ar"];
const LD_ID = "lastlink-organization";

const upsertMeta = (name: string, content: string) => {
  const selector = `meta[name="${name}"]`;
  let tag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }

  tag.content = content;
};

const upsertLink = (rel: string, href: string, hreflang?: string) => {
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let tag = document.head.querySelector<HTMLLinkElement>(selector);

  if (!tag) {
    tag = document.createElement("link");
    tag.rel = rel;
    if (hreflang) tag.hreflang = hreflang;
    document.head.appendChild(tag);
  }

  tag.href = href;
};

const upsertOrganization = (origin: string, description: string) => {
  let tag = document.getElementById(LD_ID);

  if (!tag) {
    tag = document.createElement("script");
    tag.id = LD_ID;
    (tag as HTMLScriptElement).type = "application/ld+json";
    document.head.appendChild(tag);
  }

  tag.textContent = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LastLink",
    url: origin,
    logo: `${origin}/logo.svg`,
    description,
    areaServed: { "@type": "Country", name: "Canada" },
    knowsLanguage: LANGUAGES,
    address: {
      "@type": "PostalAddress",
      streetAddress: "JLSF3792, Salah Aldin 7933",
      addressLocality: "Jeddah",
      postalCode: "22527",
      addressCountry: "SA"
    },
    telephone: "+966507772900",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      telephone: "+966507772900",
      email: "hello@lastlink.ca",
      availableLanguage: ["English", "Arabic"]
    }
  });
};

export const useDocumentMeta = () => {
  const { t, i18n } = useTranslation();
  const language = i18n.language.startsWith("ar") ? "ar" : "en";
  const title = t("seo.title");
  const description = t("seo.description");

  useEffect(() => {
    const { origin, pathname } = window.location;

    document.documentElement.lang = language;
    // Arabic reads right-to-left; the flag also drives the Tajawal font in CSS.
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = title;
    upsertMeta("description", description);

    upsertLink("canonical", `${origin}${pathname}?lng=${language}`);
    upsertLink("alternate", `${origin}${pathname}`, "x-default");
    LANGUAGES.forEach((code) => {
      upsertLink("alternate", `${origin}${pathname}?lng=${code}`, code);
    });

    upsertOrganization(origin, description);
  }, [language, title, description]);
};
