"use client";

import * as React from "react";
import type { BookingStatus } from "@prisma/client";
import { BookingActions } from "./BookingActions";
import { CompleteBookingDialog } from "./CompleteBookingDialog";

interface Props {
  bookingId: string;
  currentStatus: BookingStatus;
  serviceTitle: string;
  servicePrice: number;
  carMileage: number | null;
}

export function BookingDetailWorkflow(props: Props) {
  const [completeOpen, setCompleteOpen] = React.useState(false);

  return (
    <>
      <BookingActions
        bookingId={props.bookingId}
        currentStatus={props.currentStatus}
        onCompleteClick={() => setCompleteOpen(true)}
      />
      <CompleteBookingDialog
        open={completeOpen}
        onOpenChange={setCompleteOpen}
        bookingId={props.bookingId}
        serviceTitle={props.serviceTitle}
        servicePrice={props.servicePrice}
        carMileage={props.carMileage}
      />
    </>
  );
}
