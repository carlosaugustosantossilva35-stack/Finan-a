"use client";
import { useEffect, useState } from "react";

type InstallEvent = Event & { prompt: () => Promise<void> };

export function PwaSetup() {
  const [evt, setEvt] = useState<InstallEvent | null>(null);
  useEffect(() => {
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const h = (e: Event) => { e.preventDefault(); setEvt(e as InstallEvent); };
    window.addEventListener("beforeinstallprompt", h);
    return () => window.removeEventListener("beforeinstallprompt", h);
  }, []);
  if (!evt) return null;
  return (
    <button onClick={async () => { await evt.prompt(); setEvt(null); }}
      className="fixed right-3 top-3 z-20 rounded-full bg-gain px-4 py-2 text-sm font-medium text-black">
      Instalar app
    </button>
  );
}
