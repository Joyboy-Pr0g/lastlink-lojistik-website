import { useTranslation } from "react-i18next";
import { BadgeCheck, Languages, Snowflake } from "lucide-react";
import { Reveal, RevealGroup, RevealItem } from "@/components/ui/Reveal";
import NetworkBackdrop from "@/components/ui/NetworkBackdrop";
import Tilt from "@/components/ui/Tilt";
import { slideFrom } from "@/lib/motion";

type Point = { title: string; description: string };

const ICONS = [BadgeCheck, Snowflake, Languages];

const About = () => {
  const { t } = useTranslation();
  const points = t("about.points", { returnObjects: true }) as Point[];

  return (
    <section id="about" className="relative overflow-hidden border-t border-white/5 py-24 md:py-32">
      <NetworkBackdrop opacity={0.75} seed={11} />
      <div className="shell">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end">
          <Reveal>
            <span className="eyebrow">{t("about.eyebrow")}</span>
            <h2 className="mt-5 font-display text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              {t("about.title")}
            </h2>
          </Reveal>

          <Reveal variants={slideFrom(40)}>
            <p className="text-mist lg:text-lg">{t("about.lead")}</p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-4 md:grid-cols-3" delay={0.1} gap={0.1}>
          {points.map((point, index) => {
            const Icon = ICONS[index] ?? BadgeCheck;

            return (
              <RevealItem key={point.title}>
                <Tilt intensity={7} lift={16}>
                  <article className="glass h-full rounded-3xl p-7 transition-colors duration-500 hover:border-green/30">
                    <div className="preserve-3d">
                      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-green/12 text-green-light [transform:translateZ(24px)]">
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <h3 className="mt-6 font-display text-lg font-bold text-white">
                        {point.title}
                      </h3>
                      <p className="mt-3 text-sm leading-relaxed text-mist-dim">
                        {point.description}
                      </p>
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

export default About;
