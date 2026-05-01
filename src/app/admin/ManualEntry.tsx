"use client";

import { useState } from "react";

export default function ManualEntry({ markets }: { markets: any[] }) {
  const [selectedMarket, setSelectedMarket] = useState(markets[0]?._id || "");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [openPanna, setOpenPanna] = useState("***");
  const [jodi, setJodi] = useState("**");
  const [closePanna, setClosePanna] = useState("***");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("Saving...");

    try {
      const res = await fetch("/api/results", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marketId: selectedMarket,
          date,
          openPanna,
          jodi,
          closePanna,
        }),
      });

      if (res.ok) {
        setStatus("Success! Scraper will now ignore this entry.");
      } else {
        setStatus("Failed to save. Check inputs.");
      }
    } catch (err) {
      setStatus("Error occurred.");
    }
    
    // Clear status after 3s
    setTimeout(() => setStatus(""), 3000);
  };

  return (
    <div className="glass-panel p-6 rounded-xl border-l-4 border-blue-500">
      <h2 className="text-xl font-bold mb-4 text-matka-text">Manual Override Entry</h2>
      <p className="text-sm text-gray-500 mb-4">
        Override a result manually. This will lock it from the scraper.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Market</label>
          <select 
            value={selectedMarket}
            onChange={(e) => setSelectedMarket(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
          >
            {markets.map(m => (
              <option key={m._id} value={m._id}>{m.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-2 rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Open Panna</label>
            <input type="text" value={openPanna} onChange={e => setOpenPanna(e.target.value)} className="w-full p-2 rounded border text-center font-mono" placeholder="***" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Jodi</label>
            <input type="text" value={jodi} onChange={e => setJodi(e.target.value)} className="w-full p-2 rounded border text-center font-mono" placeholder="**" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 mb-1">Close Panna</label>
            <input type="text" value={closePanna} onChange={e => setClosePanna(e.target.value)} className="w-full p-2 rounded border text-center font-mono" placeholder="***" />
          </div>
        </div>

        <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-bold w-full transition-colors">
          Force Update Result
        </button>

        {status && (
          <div className={`text-sm text-center font-bold p-2 rounded ${status.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {status}
          </div>
        )}
      </form>
    </div>
  );
}
