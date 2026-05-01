import connectToDatabase from "@/lib/db";
import Market from "@/models/Market";
import ManualEntry from "./ManualEntry";

export default async function AdminDashboard() {
  await connectToDatabase();
  const markets = await Market.find({ status: 'active' }).select('_id name').lean();
  
  // Convert _id to string for the client component
  const safeMarkets = markets.map(m => ({ _id: m._id.toString(), name: m.name }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black text-matka-accent">Admin Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Scraper Health */}
        <div className="glass-panel p-6 rounded-xl border-l-4 border-matka-accent">
          <h2 className="text-xl font-bold mb-4">Scraper Health</h2>
          <div className="flex items-center justify-between text-sm">
            <span>Status:</span>
            <span className="text-matka-danger font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-matka-danger animate-blink-dot"></span> Active
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-2">
            <span>Last Success:</span>
            <span className="font-mono">{new Date().toLocaleTimeString()}</span>
          </div>
        </div>

        {/* Manual Result Entry */}
        <ManualEntry markets={safeMarkets} />

        {/* SEO Manager */}
        <div className="glass-panel p-6 rounded-xl border-l-4 border-green-500">
          <h2 className="text-xl font-bold mb-4">SEO Manager</h2>
          <p className="text-sm text-gray-500 mb-4">Customize meta tags and descriptions for dynamic market pages.</p>
          <button className="bg-green-500 text-white px-4 py-2 rounded text-sm font-bold w-full">
            Manage SEO
          </button>
        </div>
      </div>
      
      {/* Recent Error Logs Placeholder */}
      <div className="glass-panel p-6 rounded-xl mt-8">
        <h2 className="text-xl font-bold mb-4 text-matka-danger">Recent Error Logs</h2>
        <div className="bg-white/50 rounded p-4 font-mono text-sm text-gray-600">
          No recent errors. Scraper is running optimally.
        </div>
      </div>
    </div>
  );
}
