"use client";

import { useEffect, useRef, useState } from "react";

export default function PWARegister() {
  const [updateReady, setUpdateReady] = useState(false);
  const waitingRef = useRef<ServiceWorker | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    let reg: ServiceWorkerRegistration | null = null;
    let onControllerChange: ((this: ServiceWorkerContainer, ev: Event) => void) | null = null;

    (async () => {
      try {
        reg = await navigator.serviceWorker.register("/sw.js");

        if (reg.waiting) {
          waitingRef.current = reg.waiting;
          setUpdateReady(true);
        }
        reg.addEventListener("updatefound", () => {
          const sw = reg!.installing;
          if (!sw) return;
          sw.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) {
              waitingRef.current = reg!.waiting;
              setUpdateReady(true);
            }
          });
        });
      } catch {}
    })();

    onControllerChange = () => {
      window.location.reload();
    };
    navigator.serviceWorker.addEventListener("controllerchange", onControllerChange);

    return () => {
      if (onControllerChange) navigator.serviceWorker.removeEventListener("controllerchange", onControllerChange);
    };
  }, []);

  function applyUpdate() {
    try {
      waitingRef.current?.postMessage({ type: "SKIP_WAITING" });
    } catch {}
  }

  if (!updateReady) return null;
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 rounded-full border border-zinc-200 dark:border-zinc-800 bg-white/90 dark:bg-black/80 backdrop-blur px-4 py-2 text-sm shadow-lg flex items-center gap-3">
      <span>Nova versão disponível</span>
      <button onClick={applyUpdate} className="rounded-md bg-black text-white dark:bg-white dark:text-black px-3 py-1">
        Atualizar
      </button>
    </div>
  );
}
