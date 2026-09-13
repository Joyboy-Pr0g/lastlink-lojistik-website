import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

const VIEW_W = 1400;
const VIEW_H = 700;

/**
 * Deterministic pseudo-random generator.
 * Fixed seeds keep the layout identical between renders — a real random()
 * would reshuffle the whole field on every React update.
 */
const makeRandom = (seed: number) => () => {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
};

type Node = { x: number; y: number; r: number };

const buildLayer = (seed: number, count: number) => {
  const random = makeRandom(seed);
  const nodes: Node[] = [];

  for (let i = 0; i < count; i++) {
    nodes.push({ x: random() * VIEW_W, y: random() * VIEW_H, r: 1 + random() * 2.2 });
  }

  // Join each node to its two nearest neighbours — reads as a routed network
  // rather than random scribble.
  const edges: [number, number][] = [];
  nodes.forEach((node, i) => {
    nodes
      .map((other, j) => ({ j, d: (other.x - node.x) ** 2 + (other.y - node.y) ** 2 }))
      .filter((entry) => entry.j !== i)
      .sort((a, b) => a.d - b.d)
      .slice(0, 2)
      .forEach(({ j }) => {
        const key: [number, number] = i < j ? [i, j] : [j, i];
        if (!edges.some(([a, b]) => a === key[0] && b === key[1])) edges.push(key);
      });
  });

  return { nodes, edges };
};

/** Great-circle style arcs, the shape of long-haul lanes on a map. */
const ARCS = [
  "M-40,340 C180,210 420,190 660,300 S1080,430 1320,320",
  "M-40,160 C220,120 460,250 720,180 S1120,60 1320,150",
  "M-40,500 C260,430 520,560 780,470 S1140,540 1320,470"
];

const SVG_CLASS =
  "h-full w-full [mask-image:radial-gradient(ellipse_85%_75%_at_50%_50%,#000_15%,transparent_82%)]";

type NetworkBackdropProps = {
  className?: string;
  /** 0–1. Keep it modest; this sits behind real content. */
  opacity?: number;
  /** Distinct seed per section, so no two backgrounds look alike. */
  seed?: number;
};

/**
 * Layered logistics-network graphic: two node fields drift in opposite
 * directions behind long lane arcs, giving sections depth and slow motion.
 *
 * Each layer lives in its own <svg> inside a plain motion.div. The drift has to
 * be applied to an HTML wrapper — on an SVG <g>, Framer Motion writes x/y as
 * attributes, which a <g> ignores, so the group would never move.
 *
 * Decorative only; hidden from assistive tech.
 */
const NetworkBackdrop = ({ className = "", opacity = 0.55, seed = 7 }: NetworkBackdropProps) => {
  const reduced = useReducedMotion();

  const far = useMemo(() => buildLayer(seed * 31 + 5, 26), [seed]);
  const near = useMemo(() => buildLayer(seed * 97 + 11, 14), [seed]);

  // Gradient ids must be unique per instance: several sections render this
  // component, and duplicate ids would all resolve to the first one in the DOM.
  const laneId = `nb-lane-${seed}`;
  const edgeId = `nb-edge-${seed}`;

  const drift = (x: number[], y: number[], duration: number) =>
    reduced
      ? {}
      : {
          animate: { x, y },
          transition: {
            duration,
            repeat: Infinity,
            repeatType: "mirror" as const,
            ease: "easeInOut"
          }
        };

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
      style={{ opacity }}
    >
      {/* Long-haul arcs, with a pulse travelling each one. */}
      <div className="absolute inset-0">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className={SVG_CLASS}>
          <defs>
            <linearGradient id={laneId} x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#65AF02" stopOpacity="0" />
              <stop offset="45%" stopColor="#8BD91A" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#0A3C70" stopOpacity="0" />
            </linearGradient>
          </defs>

          {ARCS.map((d, index) => (
            <g key={d}>
              <path d={d} fill="none" stroke="#0A3C70" strokeWidth="0.8" strokeOpacity="0.4" />
              <motion.path
                d={d}
                fill="none"
                stroke={`url(#${laneId})`}
                strokeWidth="1.1"
                strokeLinecap="round"
                strokeDasharray="150 1400"
                initial={{ strokeDashoffset: 1550 }}
                animate={reduced ? {} : { strokeDashoffset: -150 }}
                transition={{
                  duration: 14 + index * 4,
                  repeat: Infinity,
                  ease: "linear",
                  delay: index * 2.5
                }}
              />
            </g>
          ))}
        </svg>
      </div>

      {/* Far field — small nodes, drifting one way. */}
      <motion.div className="absolute inset-0" {...drift([0, 90], [0, -52], 21)}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className={SVG_CLASS}>
          <defs>
            <linearGradient id={edgeId} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#65AF02" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#0A3C70" stopOpacity="0.35" />
            </linearGradient>
          </defs>

          {far.edges.map(([a, b]) => (
            <line
              key={`f${a}-${b}`}
              x1={far.nodes[a].x}
              y1={far.nodes[a].y}
              x2={far.nodes[b].x}
              y2={far.nodes[b].y}
              stroke={`url(#${edgeId})`}
              strokeWidth="0.7"
              strokeOpacity="0.5"
            />
          ))}

          {far.nodes.map((node, index) => (
            <motion.circle
              key={`fn${index}`}
              cx={node.x}
              cy={node.y}
              r={node.r * 0.8}
              fill="#65AF02"
              initial={{ opacity: 0.35 }}
              animate={reduced ? {} : { opacity: [0.35, 0.9, 0.35] }}
              transition={{ duration: 4, repeat: Infinity, delay: (index % 9) * 0.4 }}
            />
          ))}
        </svg>
      </motion.div>

      {/* Near field — larger nodes, drifting the other way for parallax. */}
      <motion.div className="absolute inset-0" {...drift([0, -128], [0, 76], 16)}>
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} preserveAspectRatio="xMidYMid slice" className={SVG_CLASS}>
          {near.edges.map(([a, b]) => (
            <line
              key={`n${a}-${b}`}
              x1={near.nodes[a].x}
              y1={near.nodes[a].y}
              x2={near.nodes[b].x}
              y2={near.nodes[b].y}
              stroke="#65AF02"
              strokeOpacity="0.28"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          ))}

          {near.nodes.map((node, index) => (
            <g key={`nn${index}`}>
              <circle cx={node.x} cy={node.y} r={node.r * 1.4} fill="#8BD91A" fillOpacity="0.75" />
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="6"
                fill="none"
                stroke="#65AF02"
                strokeOpacity="0.5"
                initial={{ scale: 0.6, opacity: 0.6 }}
                animate={reduced ? {} : { scale: [0.6, 2.6], opacity: [0.6, 0] }}
                transition={{
                  duration: 3.6,
                  repeat: Infinity,
                  delay: (index % 5) * 0.7,
                  ease: "easeOut"
                }}
                style={{ transformOrigin: `${node.x}px ${node.y}px` }}
              />
              {/* Depot glyph on a few nodes. */}
              {index % 4 === 0 && (
                <rect
                  x={node.x - 4}
                  y={node.y - 4}
                  width="8"
                  height="8"
                  rx="1.5"
                  fill="none"
                  stroke="#8BD91A"
                  strokeOpacity="0.55"
                  strokeWidth="1"
                  transform={`rotate(45 ${node.x} ${node.y})`}
                />
              )}
            </g>
          ))}
        </svg>
      </motion.div>
    </div>
  );
};

export default NetworkBackdrop;
