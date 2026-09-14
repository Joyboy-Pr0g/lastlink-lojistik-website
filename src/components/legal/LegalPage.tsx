import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ArrowLeft, ArrowRight, Globe, Mail, Phone } from "lucide-react";
import Footer from "@/components/layout/Footer";
import Logo from "@/components/ui/Logo";
import NetworkBackdrop from "@/components/ui/NetworkBackdrop";
import { Reveal } from "@/components/ui/Reveal";
import { initSmoothScroll } from "@/lib/smoothScroll";
import { useDocumentMeta } from "@/lib/seo";
import { ROUTES, type LegalDoc } from "@/lib/routes";

type Section = { title: string; body: string[] };

/** Slug used for the anchor each section is linked to from the contents list. */
const slug = (index: number) => `s${index + 1}`;

/**
 * Shared shell for the Privacy and Terms documents. Both are separate HTML
 * entries in the build, so each renders its own header and footer rather than
 * mounting inside the single-page App.
 */
const LegalPage = ({ doc }: { doc: LegalDoc }) => {
  const { t, i18n } = useTranslation();

  const title = t(`legal.${doc}.title`);
  const sections = t(`legal.${doc}.sections`, { returnObjects: true }) as Section[];

  const isArabic = i18n.language.startsWith("ar");
  const otherLang = isArabic ? "en" : "ar";
  const BackArrow = isArabic ? ArrowRight : ArrowLeft;

  useDocumentMeta(title);
  useEffect(() => initSmoothScroll(), []);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-950/80 backdrop-blur-2xl">
        <div className="shell flex h-[74px] items-center justify-between gap-6">
          <Logo href={ROUTES.home} />

          <div className="flex items-center gap-2">
            <a
              href={ROUTES.home}
              className="hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-[12px] font-medium text-mist transition-all duration-300 hover:-translate-y-0.5 hover:border-green/50 hover:text-green-light sm:inline-flex"
            >
              <BackArrow className="h-3.5 w-3.5" aria-hidden />
              {t("legal.back")}
            </a>

            <button
              onClick={() => i18n.changeLanguage(otherLang)}
              aria-label={t("nav.switch_language")}
              className="group flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-2 text-[11px] font-semibold tracking-wide text-mist transition-all duration-300 hover:-translate-y-0.5 hover:border-green/50 hover:text-green-light"
            >
              <Globe
                className="h-3.5 w-3.5 transition-transform duration-500 group-hover:rotate-180"
                aria-hidden
              />
              <span lang={otherLang}>{otherLang === "ar" ? "عربي" : "EN"}</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative overflow-hidden pb-24 pt-16 md:pt-20">
        <NetworkBackdrop opacity={0.5} seed={11} />
        <div
          aria-hidden
          className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_0%,rgba(101,175,2,.1),transparent_70%)]"
        />

        <div className="shell relative">
          <Reveal className="max-w-3xl">
            <span className="eyebrow">{t(`legal.${doc}.eyebrow`)}</span>

            <h1 className="mt-5 font-display text-4xl font-bold tracking-tight sm:text-5xl">
              {title}
            </h1>

            <p className="mt-4 text-[13px] text-mist-faint">
              {t("legal.updated_label")}: {t("legal.updated")}
            </p>

            <p className="mt-6 text-lg leading-relaxed text-mist">{t(`legal.${doc}.intro`)}</p>
          </Reveal>

          <div className="mt-14 grid gap-12 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)]">
            {/* Contents — sticky beside the document on wide screens. */}
            <Reveal className="lg:sticky lg:top-[104px] lg:self-start">
              <h2 className="text-[11px] font-semibold uppercase tracking-[.18em] text-mist-faint">
                {t("legal.toc")}
              </h2>
              <ol className="mt-4 space-y-2 border-s border-white/10 ps-4 text-sm">
                {sections.map((section, index) => (
                  <li key={section.title}>
                    <a
                      href={`#${slug(index)}`}
                      className="text-mist-dim transition-colors hover:text-green-light"
                    >
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
            </Reveal>

            <div className="max-w-3xl">
              {sections.map((section, index) => (
                <Reveal key={section.title} className="scroll-mt-28 border-t border-white/10 py-8 first:border-t-0 first:pt-0">
                  <section id={slug(index)}>
                    <h2 className="font-display text-xl font-semibold sm:text-2xl">
                      <span className="me-2 text-green">{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </h2>

                    <div className="mt-4 space-y-4">
                      {section.body.map((paragraph) => (
                        <p key={paragraph} className="leading-relaxed text-mist">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                </Reveal>
              ))}

              <Reveal className="glass mt-10 rounded-3xl p-6 sm:p-8">
                <h2 className="font-display text-lg font-semibold">{t("legal.contact_title")}</h2>
                <p className="mt-3 leading-relaxed text-mist">{t("legal.contact_body")}</p>

                <div className="mt-5 flex flex-wrap gap-x-6 gap-y-3 text-sm">
                  <a
                    href="mailto:hello@lastlinkx.com"
                    dir="ltr"
                    className="inline-flex items-center gap-2 text-mist-dim transition-colors hover:text-green-light"
                  >
                    <Mail className="h-4 w-4 text-green" aria-hidden />
                    hello@lastlinkx.com
                  </a>
                  <a
                    href="tel:+966507772900"
                    dir="ltr"
                    className="inline-flex items-center gap-2 text-mist-dim transition-colors hover:text-green-light"
                  >
                    <Phone className="h-4 w-4 text-green" aria-hidden />
                    {t("contact.details.phone_value")}
                  </a>
                </div>
              </Reveal>
            </div>
          </div>
        </div>
      </main>

      <Footer anchorBase={ROUTES.home} />
    </>
  );
};

export default LegalPage;
