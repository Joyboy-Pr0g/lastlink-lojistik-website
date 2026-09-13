import { useTranslation } from "react-i18next";
import {
  ArrowUpRight,
  PackageOpen,
  Radar,
  RefreshCcw,
  Route,
  Snowflake,
  Truck
} from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import NetworkBackdrop from "@/components/ui/NetworkBackdrop";
import Tilt from "@/components/ui/Tilt";

type Item = { title: string; description: string };

const ICONS = [Truck, Route, Radar, RefreshCcw, Snowflake, PackageOpen];

const Services = () => {
  const { t } = useTranslation();
  const items = t("services.items", { returnObjects: true }) as Item[];

  return (
    <section id="services" className="relative overflow-hidden border-t border-white/5 py-24 md:py-32">
      <NetworkBackdrop opacity={0.75} seed={3} />
      <div className="shell relative">
        <Reveal className="max-w-2xl">
          <span className="eyebrow">{t("services.eyebrow")}</span>
          <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {t("services.title")}
          </h2>
        </Reveal>

        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-2 lg:grid-cols-3" delay={0.1}>
          {items.map((item, index) => {
            const Icon = ICONS[index] ?? Truck;

            return (
              <RevealItem key={item.title}>
                <Tilt intensity={8} lift={20}>
                  <article className="group relative h-full overflow-hidden rounded-3xl border border-white/10 bg-navy-900/75 p-7 backdrop-blur-md transition-colors duration-500 hover:border-green/35">
                    {/* Green wash that grows from the corner on hover. */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full bg-green/15 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
                    />

                    <div className="preserve-3d relative">
                      <span className="grid h-12 w-12 place-items-center rounded-2xl border border-white/10 bg-navy-800/80 text-green transition-all duration-500 group-hover:border-green/50 group-hover:bg-green/15 group-hover:text-green-light [transform:translateZ(26px)]">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>

                      <h3 className="mt-6 font-display text-xl font-bold text-white [transform:translateZ(16px)]">
                        {item.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-mist-dim">
                        {item.description}
                      </p>

                      <ArrowUpRight
                        className="mt-6 h-4 w-4 text-mist-faint transition-all duration-500 group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-green-light"
                        aria-hidden
                      />
                    </div>
                  </article>
                </Tilt>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
};

export default Services;
