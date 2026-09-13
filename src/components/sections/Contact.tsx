import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { Send } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import { Reveal } from "@/components/ui/Reveal";
import NetworkBackdrop from "@/components/ui/NetworkBackdrop";
import { EASE, slideFrom } from "@/lib/motion";

const CONTACT_ENDPOINT = "https://formspree.io/f/placeholder";

const VOLUME_KEYS = ["under_500", "500_5k", "5k_25k", "over_25k"];

const FIELD =
  "mt-2 w-full rounded-2xl border border-white/12 bg-navy-950/60 px-4 py-3.5 text-sm text-white placeholder:text-mist-faint transition focus:border-green/60 focus:outline-none";

const LABEL = "text-[11px] font-semibold uppercase tracking-[.16em] text-mist-faint";

type SubmitStatus = "idle" | "sending" | "sent" | "error";

const Contact = () => {
  const { t } = useTranslation();
  const [status, setStatus] = useState<SubmitStatus>("idle");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const form = event.currentTarget;
    const payload = Object.fromEntries(new FormData(form));

    setStatus("sending");

    try {
      const response = await fetch(CONTACT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(String(response.status));

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  };

  return (
    <section id="contact" className="relative overflow-hidden border-t border-white/5 py-24 md:py-32">
      <NetworkBackdrop opacity={0.75} seed={29} />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_50%_50%_at_50%_100%,rgba(101,175,2,.1),transparent_70%)]"
      />

      <div className="shell relative grid gap-14 lg:grid-cols-[minmax(0,420px)_minmax(0,1fr)]">
        <Reveal>
          <span className="eyebrow">{t("contact.eyebrow")}</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("contact.title")}
          </h2>
          <p className="mt-4 text-mist">{t("contact.description")}</p>
        </Reveal>

        <Reveal variants={slideFrom(40)}>
          <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 shadow-lift sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className={LABEL}>
                  {t("contact.form.name")}
                </label>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  className={FIELD}
                />
              </div>

              <div>
                <label htmlFor="contact-email" className={LABEL}>
                  {t("contact.form.email")}
                </label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={FIELD}
                />
              </div>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-volume" className={LABEL}>
                {t("contact.form.volume")}
              </label>
              <select
                id="contact-volume"
                name="volume"
                defaultValue=""
                required
                className={`${FIELD} appearance-none`}
              >
                <option value="" disabled>
                  {t("contact.form.volume_placeholder")}
                </option>
                {VOLUME_KEYS.map((key) => (
                  <option key={key} value={key} className="bg-navy-900">
                    {t(`contact.form.volume_options.${key}`)}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-5">
              <label htmlFor="contact-message" className={LABEL}>
                {t("contact.form.message")}
              </label>
              <textarea
                id="contact-message"
                name="message"
                rows={5}
                required
                className={`${FIELD} resize-y`}
              />
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-5">
              <GlowButton
                type="submit"
                disabled={status === "sending"}
                icon={<Send className="h-4 w-4" aria-hidden />}
              >
                {status === "sending" ? t("contact.form.sending") : t("contact.form.submit")}
              </GlowButton>

              <AnimatePresence mode="wait">
                {(status === "sent" || status === "error") && (
                  <motion.p
                    key={status}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ ease: EASE }}
                    role="status"
                    aria-live="polite"
                    className={`text-sm ${
                      status === "sent" ? "text-green-light" : "text-red-300"
                    }`}
                  >
                    {status === "sent"
                      ? t("contact.form.success")
                      : t("contact.form.error")}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        </Reveal>
      </div>
    </section>
  );
};

export default Contact;
