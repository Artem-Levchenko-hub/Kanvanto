"use client";

import * as React from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

/**
 * Full-bleed 16:9 секция в стиле Apple iPhone Pro pages —
 * крупный визуал на полную ширину с overlayed-цитатой.
 */
export function FullBleedShowcase() {
  const prefersReducedMotion = useReducedMotion();
  const ref = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Subtle parallax
  const visualY = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.4, 1, 1, 0.4]);

  return (
    <section ref={ref} className="relative bg-obsidian overflow-hidden">
      <div className="relative aspect-[16/9] sm:aspect-[2/1] lg:aspect-[21/9] min-h-[380px] max-h-[800px]">
        {/* Background visual */}
        <motion.div
          style={{ y: prefersReducedMotion ? 0 : visualY }}
          className="absolute inset-0 -inset-y-20"
        >
          <svg
            viewBox="0 0 1920 800"
            className="absolute inset-0 w-full h-full"
            aria-hidden
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <linearGradient id="garageBg" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#1F1F25" />
                <stop offset="50%" stopColor="#17171B" />
                <stop offset="100%" stopColor="#0A0A0B" />
              </linearGradient>
              <radialGradient id="lightSource" cx="30%" cy="20%" r="60%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.08" />
                <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="redAmbient" cx="80%" cy="80%" r="50%">
                <stop offset="0%" stopColor="#DC2626" stopOpacity="0.18" />
                <stop offset="100%" stopColor="#DC2626" stopOpacity="0" />
              </radialGradient>
            </defs>

            <rect width="1920" height="800" fill="url(#garageBg)" />
            <rect width="1920" height="800" fill="url(#lightSource)" />
            <rect width="1920" height="800" fill="url(#redAmbient)" />

            {/* Garage perspective lines (subtle grid) */}
            <g opacity="0.08" stroke="#C0C0C8" fill="none" strokeWidth="0.5">
              {Array.from({ length: 16 }).map((_, i) => (
                <line key={i} x1={i * 120} y1="0" x2={960 + (i - 8) * 80} y2="800" />
              ))}
              {Array.from({ length: 12 }).map((_, i) => (
                <line key={i} x1="0" y1={i * 67} x2="1920" y2={i * 67} />
              ))}
            </g>

            {/* Lifted car silhouette in centre */}
            <g transform="translate(600, 280)">
              {/* Lift columns */}
              <rect x="20" y="0" width="14" height="280" fill="#3A3A44" opacity="0.7" />
              <rect x="686" y="0" width="14" height="280" fill="#3A3A44" opacity="0.7" />
              {/* Lift platform */}
              <rect x="0" y="180" width="720" height="14" rx="4" fill="#52525C" opacity="0.9" />

              {/* Car on lift */}
              <g transform="translate(0, 30)">
                <ellipse cx="360" cy="160" rx="320" ry="8" fill="#000" opacity="0.4" />
                <path
                  d="M 60 130 L 100 70 Q 130 40 180 35 L 270 18 Q 360 8 450 22 L 560 45 Q 620 60 660 95 L 660 145 Q 660 165 640 165 L 80 165 Q 60 165 60 130 Z"
                  fill="#2A2A32"
                  stroke="#52525C"
                  strokeWidth="0.5"
                  opacity="0.95"
                />
                {/* Glass strip */}
                <path
                  d="M 180 35 L 270 20 Q 360 12 450 25 L 540 50 L 520 65 Q 360 40 200 65 Z"
                  fill="#C0C0C8"
                  opacity="0.12"
                />
                {/* Wheels — slightly raised */}
                <circle cx="180" cy="155" r="22" fill="#0A0A0B" stroke="#3A3A44" strokeWidth="1.2" />
                <circle cx="540" cy="155" r="22" fill="#0A0A0B" stroke="#3A3A44" strokeWidth="1.2" />
              </g>
            </g>

            {/* Bottom shadow gradient */}
            <rect width="1920" height="180" y="620" fill="url(#garageBg)" opacity="0.7" />
          </svg>
        </motion.div>

        {/* Editorial overlay quote */}
        <motion.div
          style={{ y: prefersReducedMotion ? 0 : textY, opacity }}
          className="absolute inset-0 grid place-items-center"
        >
          <div className="text-center px-6 max-w-4xl">
            <p className="text-caption uppercase tracking-[0.4em] text-chrome mb-8">
              Один стандарт обслуживания
            </p>
            <h3 className="font-display text-display-xl text-graphite-50 text-balance leading-[0.95] font-light">
              50 постов.
              <br />
              <span className="font-medium">Один стандарт.</span>
            </h3>
            <p className="mt-8 text-body-xl text-graphite-200 max-w-2xl mx-auto font-light leading-relaxed">
              Дилерское оборудование на каждом из 4 филиалов в Краснодаре —
              ICOM Next, XENTRY, PIWIS Tester, 3D-стенды Hunter.
            </p>
          </div>
        </motion.div>

        {/* Bottom hairline accent */}
        <div className="absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-primary/40 to-transparent" />
      </div>
    </section>
  );
}
