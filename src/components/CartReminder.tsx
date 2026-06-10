"use client";

import { useEffect, useRef } from "react";
import { useCart } from "@/context/CartContext";

const REMINDER_DELAY = 30 * 60 * 1000; // 30 minutos
const NOTIFIED_KEY = "linternita-cart-notified";
const STARTED_AT_KEY = "linternita-cart-started-at";

/**
 * Manda una notificación del navegador si el usuario deja productos
 * en el carrito durante un tiempo sin completar la compra.
 * No renderiza nada visualmente.
 */
export default function CartReminder() {
  const { items, count } = useCart();
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Pedir permiso de notificaciones discretamente cuando hay algo en el carrito
  useEffect(() => {
    if (count > 0 && typeof Notification !== "undefined" && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, [count]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Limpiar timer previo
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }

    if (count === 0) {
      localStorage.removeItem(STARTED_AT_KEY);
      localStorage.removeItem(NOTIFIED_KEY);
      return;
    }

    // Registrar cuándo empezó a tener productos el carrito
    let startedAt = Number(localStorage.getItem(STARTED_AT_KEY));
    if (!startedAt) {
      startedAt = Date.now();
      localStorage.setItem(STARTED_AT_KEY, String(startedAt));
    }

    const alreadyNotified = localStorage.getItem(NOTIFIED_KEY) === "true";
    if (alreadyNotified) return;

    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(REMINDER_DELAY - elapsed, 0);

    timerRef.current = setTimeout(() => {
      if (
        typeof Notification !== "undefined" &&
        Notification.permission === "granted" &&
        document.visibilityState === "hidden"
      ) {
        const firstItem = items[0];
        const extra = items.length > 1 ? ` y ${items.length - 1} producto(s) más` : "";
        new Notification("🕯️ Tienes productos esperando en tu carrito", {
          body: `${firstItem?.product.name ?? "Tus velas"}${extra} siguen en tu carrito. ¡Termina tu pedido antes de que se agoten!`,
          icon: "/logo.png",
          badge: "/logo.png",
          tag: "linternita-cart-reminder",
        });
      }
      localStorage.setItem(NOTIFIED_KEY, "true");
    }, remaining);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [count, items]);

  return null;
}
