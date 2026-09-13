import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import Tilt from "@/components/ui/Tilt";
import NetworkBackdrop from "@/components/ui/NetworkBackdrop";

type Item = { value: string; suffix: string; label: string };

/**
 * Counts up to the target when scrolled into view.
 * Keeps the locale's own decimal separator ("99.1" vs "99,1").
 */
const Counter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduced = useReducedMotion();

  const separator = value.includes(",") ? "," : ".";
  const target = Number(value.replace(",", "."));
  const decimals = value.split(/[.,]/)[1]?.length ?? 0;

  const [display, setDisplay] = useState(reduced ? value : "0");

  useEffect(() => {
    if (!inView || reduced || Number.isNaN(target)) return;

    const controls = animate(0, target, {
      duration: 1.6,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => setDisplay(latest.toFixed(decimals).replace(".", separator))
    });

    return () => controls.stop();
  }, [inView, reduced, target, decimals, separator]);

  return <span ref={ref}>{Number.isNaN(target) ? value : display}</span>;
};

const Stats = () => {
  const { t } = useTranslation();
  const items = t("stats.items", { returnObjects: true }) as Item[];

  return (
    <section className="relative overflow-hidden border-t border-white/5 py-20 md:py-24">
      <NetworkBackdrop opacity={0.75} seed={19} />
      <div className="shell relative">
        <Reveal className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-2xl font-bold tracking-tight sm:text-3xl">
            {t("stats.title")}
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4" delay={0.1}>
          {items.map((item) => (
            <RevealItem key={item.label}>
              <Tilt intensity={10} lift={16}>
                <div className="glass h-full rounded-3xl p-7 text-center transition-colors duration-500 hover:border-green/30">
                  <p className="font-display text-4xl font-bold tracking-tight text-white lg:text-5xl">
                    <Counter value={item.value} />
                    <span className="text-green">{item.suffix}</span>
                  </p>
                  <p className="mt-3 text-sm text-mist-dim">{item.label}</p>
                </div>
              </Tilt>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
};

export default Stats;
