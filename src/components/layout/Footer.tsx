import { useTranslation } from "react-i18next";
import { Languages, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import Logo from "@/components/ui/Logo";
import { ROUTES } from "@/lib/routes";

const COLUMNS = [
  {
    key: "company",
    links: [
      { key: "about", href: "#about" },
      { key: "careers", href: "#contact" },
      { key: "press", href: "#contact" }
    ]
  },
  {
    key: "services",
    links: [
      { key: "final_mile", href: "#services" },
      { key: "cold_chain", href: "#services" },
      { key: "returns", href: "#services" }
    ]
  },
  {
    key: "support",
    links: [
      { key: "track", href: "#track" },
      { key: "contact", href: "#contact" },
      { key: "claims", href: "#contact" }
    ]
  }
] as const;

const EMAIL = "hello@lastlinkx.com";

/** Dialable form of contact.details.phone_value — no spaces, brackets or trunk zero. */
const PHONE_HREF = "tel:+966507772900";

const SOCIALS = [
  { Icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
  { Icon: Twitter, href: "https://x.com", label: "X" },
  { Icon: Mail, href: `mailto:${EMAIL}`, label: "Email" }
];

const HEADING = "text-[11px] font-semibold uppercase tracking-[.18em] text-mist-faint";
const LINK = "text-sm text-mist-dim transition-colors hover:text-green-light";

/**
 * Four equal columns — brand, then the three link groups — with contact details
 * folded into the brand column as two compact rows. Keeping the address on one
 * line and the phone on the next stops the first column from running far taller
 * than the rest, which is what made the old footer look lopsided.
 *
 * `anchorBase` is "/" on the legal pages, where the in-page anchors have to
 * jump back to the home page before they can resolve.
 */
const Footer = ({ anchorBase = "" }: { anchorBase?: string }) => {
  const { t } = useTranslation();
  const addressLines = t("contact.details.address_lines", { returnObjects: true }) as string[];

  // Four locale lines pair up into two: street, then city and country.
  const street = addressLines.slice(0, 2).join(", ");
  const city = addressLines.slice(2).join(", ");

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-950">
      <div aria-hidden className="absolute inset-0 bg-grid-fade opacity-40" />

      <div className="shell relative py-14">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal className="sm:col-span-2 lg:col-span-1">
            <Logo href={anchorBase || "#top"} />

            <p className="mt-4 max-w-xs text-sm text-mist-dim">{t("footer.tagline")}</p>

            <div className="mt-5 space-y-2.5 text-sm text-mist-dim">
              <p className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden />
                <address className="not-italic">
                  <span className="sr-only">{t("footer.address_title")}: </span>
                  {street}
                  <br />
                  {city}
                </address>
              </p>

              <p className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 shrink-0 text-green" aria-hidden />
                <a href={PHONE_HREF} dir="ltr" className="transition-colors hover:text-green-light">
                  <span className="sr-only">{t("footer.phone_title")}: </span>
                  {t("contact.details.phone_value")}
                </a>
              </p>

              <p className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 shrink-0 text-green" aria-hidden />
                <a
                  href={`mailto:${EMAIL}`}
                  dir="ltr"
                  className="transition-colors hover:text-green-light"
                >
                  {EMAIL}
                </a>
              </p>
            </div>
          </Reveal>

          {COLUMNS.map((column, index) => (
            <Reveal key={column.key} delay={0.06 * (index + 1)}>
              <h2 className={HEADING}>{t(`footer.columns.${column.key}`)}</h2>
              <ul className="mt-4 space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.key}>
                    <a href={`${anchorBase}${link.href}`} className={LINK}>
                      {t(`footer.links.${link.key}`)}
                    </a>
                  </li>
                ))}
              </ul>

              {/* The language badge and socials ride along at the foot of the
                  last column so they do not lengthen the brand column. */}
              {index === COLUMNS.length - 1 && (
                <>
                  <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-medium text-mist-dim">
                    <Languages className="h-3.5 w-3.5 text-green" aria-hidden />
                    {t("footer.bilingual")}
                  </span>

                  <div className="mt-4 flex items-center gap-2">
                    {SOCIALS.map(({ Icon, href, label }) => (
                      <a
                        key={label}
                        href={href}
                        aria-label={label}
                        target="_blank"
                        rel="noreferrer noopener"
                        className="grid h-9 w-9 place-items-center rounded-full border border-white/10 text-mist-dim transition-all duration-300 hover:-translate-y-0.5 hover:border-green/50 hover:text-green-light"
                      >
                        <Icon className="h-4 w-4" aria-hidden />
                      </a>
                    ))}
                  </div>
                </>
              )}
            </Reveal>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-6 text-xs text-mist-faint sm:flex-row sm:items-center">
          <p>
            LastLinkX © {new Date().getFullYear()}. {t("footer.rights")}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={ROUTES.privacy} className="transition-colors hover:text-green-light">
              {t("footer.legal.privacy")}
            </a>
            <a href={ROUTES.terms} className="transition-colors hover:text-green-light">
              {t("footer.legal.terms")}
            </a>

            <span className="flex items-center gap-1.5">
              {t("footer.developed_by")}
              <a
                href="https://injazdev.com/"
                target="_blank"
                rel="noreferrer noopener"
                className="group relative font-semibold text-mist transition-colors hover:text-green-light"
              >
                InjazDev
                <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-green transition-all duration-300 group-hover:w-full" />
              </a>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
