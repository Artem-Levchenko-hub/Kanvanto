"use client";

import * as React from "react";
import { useInView, useMotionValue, useTransform, animate, useReducedMotion } from "framer-motion";
import { motion } from "framer-motion";

interface CountUpProps {
  to: number;
  duration?: number;
  className?: string;
  format?: (value: number) => string;
}

export function CountUp({ to, duration = 1.2, className, format }: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();
  const motionValue = useMotionValue(0);
  const display = useTransform(motionValue, (latest) =>
    format ? format(latest) : Math.round(latest).toLocaleString("ru-RU")
  );

  React.useEffect(() => {
    if (!inView) return;
    if (prefersReducedMotion) {
      motionValue.set(to);
      return;
    }
    const controls = animate(motionValue, to, {
      duration,
      ease: [0.2, 0, 0, 1],
    });
    return () => controls.stop();
  }, [inView, to, duration, prefersReducedMotion, motionValue]);

  return (
    <motion.span ref={ref} className={className} data-countup>
      {display}
    </motion.span>
  );
}
