import { useTranslation } from "react-i18next";
import { Languages, Linkedin, Mail, MapPin, Phone, Twitter } from "lucide-react";
import { Reveal } from "@/components/ui/Reveal";
import Logo from "@/components/ui/Logo";

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

/** Dialable form of contact.details.phone_value — no spaces, brackets or trunk zero. */
const PHONE_HREF = "tel:+966507772900";

const SOCIALS = [
  { Icon: Linkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
  { Icon: Twitter, href: "https://x.com", label: "X" },
  { Icon: Mail, href: "mailto:hello@lastlink.ca", label: "Email" }
];

const Footer = () => {
  const { t } = useTranslation();
  const addressLines = t("contact.details.address_lines", { returnObjects: true }) as string[];

  return (
    <footer className="relative overflow-hidden border-t border-white/10 bg-navy-950">
      <div aria-hidden className="absolute inset-0 bg-grid-fade opacity-40" />

      <div className="shell relative py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,2fr)]">
          <Reveal>
            <Logo />

            <p className="mt-5 max-w-xs text-sm text-mist-dim">{t("footer.tagline")}</p>

            <div className="mt-6 space-y-4 text-sm text-mist-dim">
              <div className="flex gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden />
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-[.16em] text-mist-faint">
                    {t("footer.address_title")}
                  </span>
                  <address className="mt-1.5 space-y-0.5 not-italic">
                    {addressLines.map((line) => (
                      <span key={line} className="block">
                        {line}
                      </span>
                    ))}
                  </address>
                </div>
              </div>

              <div className="flex gap-2.5">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-green" aria-hidden />
                <div>
                  <span className="block text-[11px] font-semibold uppercase tracking-[.16em] text-mist-faint">
                    {t("footer.phone_title")}
                  </span>
                  <a
                    href={PHONE_HREF}
                    dir="ltr"
                    className="mt-1.5 inline-block transition-colors hover:text-green-light"
                  >
                    {t("contact.details.phone_value")}
                  </a>
                </div>
              </div>
            </div>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[11px] font-medium text-mist-dim">
              <Languages className="h-3.5 w-3.5 text-green" aria-hidden />
              {t("footer.bilingual")}
            </p>

            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-mist-dim transition-all duration-300 hover:-translate-y-0.5 hover:border-green/50 hover:text-green-light"
                >
                  <Icon className="h-4 w-4" aria-hidden />
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {COLUMNS.map((column) => (
              <div key={column.key}>
                <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-mist-faint">
                  {t(`footer.columns.${column.key}`)}
                </h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={link.key}>
                      <a
                        href={link.href}
                        className="text-sm text-mist-dim transition-colors hover:text-green-light"
                      >
                        {t(`footer.links.${link.key}`)}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Reveal>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-white/10 pt-7 text-xs text-mist-faint sm:flex-row sm:items-center">
          <p>
            LastLink © {new Date().getFullYear()}. {t("footer.rights")}
          </p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href="#top" className="transition-colors hover:text-green-light">
              {t("footer.legal.privacy")}
            </a>
            <a href="#top" className="transition-colors hover:text-green-light">
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
