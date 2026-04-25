"use client";

import * as React from "react";
import { track } from "@/lib/analytics/ym";

interface Props {
  experiment: string;
  variant: string;
}

export function ABExposureTracker({ experiment, variant }: Props) {
  React.useEffect(() => {
    track.abExposure({ experiment, variant });
  }, [experiment, variant]);
  return null;
}
