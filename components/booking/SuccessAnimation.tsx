"use client";

import { motion, useReducedMotion } from "framer-motion";

export function SuccessAnimation() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="size-20 mx-auto rounded-full bg-success/15 grid place-items-center">
      <svg viewBox="0 0 24 24" className="size-10 text-success" fill="none" stroke="currentColor" strokeWidth={3}>
        <motion.path
          d="M5 12 L10 17 L19 8"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.6, ease: [0.2, 0, 0, 1] }}
        />
      </svg>
    </div>
  );
}
