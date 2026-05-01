"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Link from "next/link";

interface MarketResult {
  openPanna: string;
  jodi: string;
  closePanna: string;
}

interface Market {
  _id: string;
  name: string;
  slug: string;
  openTime: string;
  closeTime: string;
  result: MarketResult;
}

export default function LiveMarkets({ initialMarkets }: { initialMarkets: Market[] }) {
  const [markets, setMarkets] = useState<Market[]>(initialMarkets);

  useEffect(() => {
    // Connect to the standalone Scraper's Socket.io server
    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:4000";
    const socket = io(socketUrl);

    socket.on("market_updated", (data: { marketId: string; result: MarketResult }) => {
      setMarkets((prev) =>
        prev.map((m) =>
          m._id === data.marketId ? { ...m, result: data.result } : m
        )
      );
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {markets.length > 0 ? (
        markets.map((market) => (
          <div key={market._id} className="glass-panel p-6 rounded-2xl relative overflow-hidden group hover:shadow-xl transition-all">
            {/* LIVE indicator */}
            <div className="absolute top-4 right-4 flex items-center space-x-1">
              <div className="w-3 h-3 bg-matka-danger rounded-full animate-blink-dot"></div>
              <span className="text-xs font-bold text-matka-danger uppercase">Live</span>
            </div>
            
            <h3 className="text-xl font-bold text-center mb-2">{market.name}</h3>
            <p className="text-center text-sm font-semibold mb-4 text-gray-500">
              {market.openTime} - {market.closeTime}
            </p>
            
            <div className="text-center my-6">
              <span className="text-3xl font-black tracking-[0.2em] font-mono text-matka-accent">
                {market.result.openPanna}-{market.result.jodi}-{market.result.closePanna}
              </span>
            </div>
            
            <div className="flex justify-between items-center mt-4">
              <Link href={`/chart/${market.slug}`} className="text-sm font-bold text-matka-accent hover:underline">
                PANEL CHART
              </Link>
              <Link href={`/chart/${market.slug}`} className="text-sm font-bold text-matka-accent hover:underline">
                JODI CHART
              </Link>
            </div>
          </div>
        ))
      ) : (
        <div className="col-span-full text-center py-12 text-gray-500">
          No active markets found. Scraper is running...
        </div>
      )}
    </div>
  );
}
