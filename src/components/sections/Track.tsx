import { FormEvent, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion } from "framer-motion";
import { AlertCircle, CheckCircle2, Clock, Search, Truck } from "lucide-react";
import GlowButton from "@/components/ui/GlowButton";
import Tilt from "@/components/ui/Tilt";
import { Reveal } from "@/components/ui/Reveal";
import NetworkBackdrop from "@/components/ui/NetworkBackdrop";
import { EASE } from "@/lib/motion";

type Checkpoint = { title: string; place: string; time: string };
type Status = "idle" | "searching" | "found" | "missing";

const DEMO_ID = "MM-9842-CA";
/** Any MM-0000-CA shaped number resolves to the demo shipment. */
const ID_PATTERN = /^MM-\d{4}-CA$/i;

const Track = () => {
  const { t } = useTranslation();
  const checkpoints = t("track.checkpoints", { returnObjects: true }) as Checkpoint[];

  const [value, setValue] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const query = value.trim();
    if (!query) return;

    setStatus("searching");
    // Mock lookup — there is no tracking backend behind this yet. Kept short
    // so the result feels instant rather than like a staged loading state.
    window.setTimeout(() => {
      setStatus(ID_PATTERN.test(query) ? "found" : "missing");
    }, 220);
  };

  const fillDemo = () => {
    setValue(DEMO_ID);
    setStatus("idle");
  };

  return (
    <section id="track" className="relative overflow-hidden border-t border-white/5 py-24 md:py-32">
      <NetworkBackdrop opacity={0.75} seed={41} />
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(101,175,2,.09),transparent_70%)]"
      />

      <div className="shell relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{t("track.eyebrow")}</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("track.title")}
          </h2>
          <p className="mt-4 text-mist">{t("track.description")}</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-3xl">
          <Tilt intensity={5} lift={10} glare={false}>
            <div className="glass rounded-3xl p-6 shadow-lift sm:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <label htmlFor="track-id" className="sr-only">
                    {t("track.label")}
                  </label>
                  <Search
                    className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-mist-faint"
                    aria-hidden
                  />
                  <input
                    id="track-id"
                    value={value}
                    onChange={(event) => {
                      setValue(event.target.value);
                      setStatus("idle");
                    }}
                    placeholder={t("track.placeholder")}
                    autoComplete="off"
                    spellCheck={false}
                    className="w-full rounded-full border border-white/12 bg-navy-950/60 py-3.5 pl-11 pr-4 font-mono text-sm uppercase tracking-wide text-white placeholder:normal-case placeholder:tracking-normal placeholder:text-mist-faint transition focus:border-green/60 focus:outline-none"
                  />
                </div>

                <GlowButton
                  type="submit"
                  disabled={status === "searching"}
                  icon={<Truck className="h-4 w-4" aria-hidden />}
                >
                  {status === "searching" ? t("track.tracking") : t("track.submit")}
                </GlowButton>
              </form>

              <button
                type="button"
                onClick={fillDemo}
                className="mt-3 text-xs font-medium text-mist-dim underline-offset-4 transition hover:text-green-light hover:underline"
              >
                {t("track.demo")} — {DEMO_ID}
              </button>

              <AnimatePresence mode="wait">
                {status === "missing" && (
                  <motion.p
                    key="missing"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="mt-5 flex items-start gap-2.5 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200"
                  >
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                    {t("track.not_found")}
                  </motion.p>
                )}

                {status === "found" && (
                  <motion.div
                    key="found"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="overflow-hidden"
                    aria-live="polite"
                  >
                    <div className="mt-7 border-t border-white/10 pt-7">
                      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                        <CheckCircle2 className="h-4 w-4 text-green" aria-hidden />
                        <span className="text-sm font-semibold text-white">
                          {t("track.found")}
                        </span>
                        <span className="font-mono text-xs text-mist-dim">
                          {value.toUpperCase()}
                        </span>
                      </div>

                      <dl className="mt-5 grid gap-4 sm:grid-cols-3">
                        {[
                          { k: t("track.eta"), v: t("track.eta_value") },
                          { k: t("track.weight"), v: t("track.weight_value") },
                          { k: t("track.service"), v: t("track.service_value") }
                        ].map((row) => (
                          <div
                            key={row.k}
                            className="rounded-2xl border border-white/8 bg-white/[.03] px-4 py-3"
                          >
                            <dt className="text-[10px] font-semibold uppercase tracking-[.16em] text-mist-faint">
                              {row.k}
                            </dt>
                            <dd className="mt-1 text-sm font-semibold text-white">{row.v}</dd>
                          </div>
                        ))}
                      </dl>

                      <ol className="mt-8 space-y-0">
                        {checkpoints.map((point, index) => {
                          const isLast = index === checkpoints.length - 1;

                          return (
                            <motion.li
                              key={point.title}
                              initial={{ opacity: 0, x: -16 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.05 + index * 0.07, ease: EASE }}
                              className="relative flex gap-4 pb-7 last:pb-0"
                            >
                              {/* Connector between checkpoints. */}
                              {!isLast && (
                                <span
                                  aria-hidden
                                  className="absolute left-[7px] top-5 h-full w-px bg-gradient-to-b from-green/60 to-white/10"
                                />
                              )}

                              <span className="relative mt-1.5 flex h-3.5 w-3.5 shrink-0">
                                {isLast && (
                                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75" />
                                )}
                                <span
                                  className={`relative inline-flex h-3.5 w-3.5 rounded-full border-2 ${
                                    isLast
                                      ? "border-green bg-green"
                                      : "border-green/60 bg-navy-950"
                                  }`}
                                />
                              </span>

                              <div className="flex flex-1 flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                                <div>
                                  <p
                                    className={`text-sm font-semibold ${
                                      isLast ? "text-green-light" : "text-white"
                                    }`}
                                  >
                                    {point.title}
                                  </p>
                                  <p className="text-xs text-mist-dim">{point.place}</p>
                                </div>
                                <span className="flex items-center gap-1.5 text-xs text-mist-faint">
                                  <Clock className="h-3 w-3" aria-hidden />
                                  {point.time}
                                </span>
                              </div>
                            </motion.li>
                          );
                        })}
                      </ol>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Tilt>
        </Reveal>
      </div>
    </section>
  );
};

export default Track;
