"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-50 glass-panel shadow-sm border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-black tracking-tighter text-matka-accent drop-shadow-md">
            ROCKET MATKA
          </span>
        </Link>
        
        <div className="flex flex-col items-end text-sm font-semibold text-matka-text">
          <span className="text-xs uppercase opacity-70">Server Time</span>
          <span className="text-matka-danger font-mono bg-white/50 px-2 py-1 rounded-md">{time || "Loading..."}</span>
        </div>
      </div>
    </header>
  );
}
