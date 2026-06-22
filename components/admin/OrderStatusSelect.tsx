"use client";

import { useState, useTransition } from "react";
import { updateOrderStatus } from "@/app/actions";
import { orderStatusOptions } from "@/lib/order-labels";
import type { OrderStatus } from "@/lib/types";

export function OrderStatusSelect({
  orderId,
  currentStatus
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleChange(nextStatus: OrderStatus) {
    const previousStatus = status;
    setStatus(nextStatus);
    setMessage(null);

    startTransition(async () => {
      const result = await updateOrderStatus(orderId, nextStatus);

      if (!result.ok) {
        setStatus(previousStatus);
      }

      setMessage(result.message);
    });
  }

  return (
    <div className="grid gap-2">
      <select
        value={status}
        disabled={isPending}
        onChange={(event) => handleChange(event.target.value as OrderStatus)}
        className="rounded-md border border-coffee-100 bg-white px-3 py-2 text-sm text-coffee-900"
      >
        {orderStatusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {message ? <p className="text-xs text-coffee-700">{message}</p> : null}
    </div>
  );
}
