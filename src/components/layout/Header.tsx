import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring
} from "framer-motion";
import { ArrowRight, Globe, Menu, X } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import Logo from "@/components/ui/Logo";
import { EASE } from "@/lib/motion";

const LINKS = [
  { href: "#track", key: "nav.track" },
  { href: "#journey", key: "nav.journey" },
  { href: "#services", key: "nav.services" },
  { href: "#coverage", key: "nav.coverage" },
  { href: "#about", key: "nav.about" }
] as const;

/**
 * Nav label whose glyphs lift out of the plane one after another on hover.
 * Arabic is cursive, so its letters stay in one span — splitting them would
 * break the joining and render the word as disconnected forms.
 */
const LIFT = {
  rest: { y: 0, rotateX: 0, color: "rgb(199 214 228)" },
  hover: { y: -2, rotateX: -18, color: "rgb(255 255 255)" }
};

const NavLabel = ({ text, split = true }: { text: string; split?: boolean }) =>
  !split ? (
    <motion.span
      className="preserve-3d relative z-10 inline-block will-change-transform"
      variants={LIFT}
      transition={{ duration: 0.32, ease: EASE }}
    >
      {text}
    </motion.span>
  ) : (
  <span className="preserve-3d relative z-10 inline-flex">
    {text.split("").map((char, index) => (
      <motion.span
        key={`${char}-${index}`}
        className="inline-block will-change-transform"
        variants={LIFT}
        transition={{ duration: 0.32, ease: EASE, delay: index * 0.018 }}
      >
        {char === " " ? " " : char}
      </motion.span>
    ))}
  </span>
  );

const Header = () => {
  const { t, i18n } = useTranslation();
  const { scrollY, scrollYProgress } = useScroll();
  const [condensed, setCondensed] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>("");

  const isArabic = i18n.language.startsWith("ar");
  const otherLang = isArabic ? "en" : "ar";
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.4 });

  useMotionValueEvent(scrollY, "change", (value) => setCondensed(value > 40));

  // Highlight the section currently under the header.
  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(
      (node): node is Element => Boolean(node)
    );

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visible) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // The mobile sheet covers the page, so the body behind it must not scroll.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <motion.header
        initial={{ y: -90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.15 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={`relative transition-all duration-500 ${
            condensed
              ? "border-b border-white/10 bg-navy-950/72 backdrop-blur-2xl backdrop-saturate-150"
              : "border-b border-white/[.06] bg-gradient-to-b from-navy-950/60 to-transparent backdrop-blur-sm"
          }`}
        >
          <div className="shell flex h-[74px] items-center justify-between gap-6">
            <Logo />

            <nav
              aria-label={t("nav.primary")}
              className="scene-3d hidden items-center gap-0.5 lg:flex"
            >
              {LINKS.map((link) => {
                const isActive = active === link.href;

                return (
                  <motion.a
                    key={link.href}
                    href={link.href}
                    initial="rest"
                    whileHover="hover"
                    animate="rest"
                    className="preserve-3d group relative rounded-full px-4 py-2.5 text-[13px] font-medium tracking-tight"
                  >
                    <NavLabel text={t(link.key)} split={!isArabic} />

                    {/* Hover pill. */}
                    <motion.span
                      className="absolute inset-0 rounded-full bg-white/[.07] ring-1 ring-inset ring-white/10"
                      variants={{ rest: { opacity: 0, scale: 0.88 }, hover: { opacity: 1, scale: 1 } }}
                      transition={{ duration: 0.3, ease: EASE }}
                    />

                    {/* Active-section underline. */}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-x-3 -bottom-0.5 h-px bg-gradient-to-r from-transparent via-green to-transparent"
                        transition={{ duration: 0.45, ease: EASE }}
                      />
                    )}
                  </motion.a>
                );
              })}
            </nav>

            <div className="flex items-center gap-2">
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

              <div className="hidden sm:block">
                <GlowButton
                  href="#contact"
                  className="px-5 py-2.5 text-[13px]"
                  icon={<ArrowRight className="h-4 w-4" aria-hidden />}
                >
                  {t("nav.quote")}
                </GlowButton>
              </div>

              <button
                onClick={() => setOpen(true)}
                aria-label={t("nav.open_menu")}
                className="rounded-full border border-white/10 p-2.5 text-white transition hover:border-green/50 lg:hidden"
              >
                <Menu className="h-4 w-4" aria-hidden />
              </button>
            </div>
          </div>

          {/* Reading progress for the whole page. */}
          <motion.div
            className="absolute inset-x-0 bottom-0 h-px origin-left bg-gradient-to-r from-green-dark via-green to-green-light"
            style={{ scaleX: progress }}
            aria-hidden
          />
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[60] bg-navy-950/96 backdrop-blur-2xl lg:hidden"
          >
            <div className="shell flex h-[74px] items-center justify-between">
              <Logo />
              <button
                onClick={() => setOpen(false)}
                aria-label={t("nav.close_menu")}
                className="rounded-full border border-white/10 p-2.5 text-white"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <nav className="shell mt-8 flex flex-col gap-1">
              {[...LINKS, { href: "#contact", key: "nav.contact" }].map((link, index) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -28, rotateY: -20 }}
                  animate={{ opacity: 1, x: 0, rotateY: 0 }}
                  transition={{ delay: 0.06 * index, ease: EASE }}
                  className="border-b border-white/5 py-5 font-display text-2xl font-semibold text-white"
                >
                  {t(link.key)}
                </motion.a>
              ))}
            </nav>

            <div className="shell mt-10">
              <GlowButton
                href="#contact"
                fullWidth
                icon={<ArrowRight className="h-4 w-4" aria-hidden />}
              >
                {t("nav.quote")}
              </GlowButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Header;
