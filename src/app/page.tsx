import connectToDatabase from "@/lib/db";
import Market from "@/models/Market";
import Result from "@/models/Result";
import LiveMarkets from "@/components/LiveMarkets";

async function getMarketsData() {
  await connectToDatabase();
  const markets = await Market.find({ status: 'active' }).lean();
  
  // Fetch latest result for each market
  const marketsWithResults = await Promise.all(markets.map(async (market) => {
    const latestResult = await Result.findOne({ marketId: market._id }).sort({ date: -1 }).lean();
    return {
      ...market,
      _id: market._id.toString(),
      result: latestResult ? {
        openPanna: latestResult.openPanna,
        jodi: latestResult.jodi,
        closePanna: latestResult.closePanna,
      } : { openPanna: '***', jodi: '**', closePanna: '***' }
    };
  }));

  return marketsWithResults;
}

export default async function Home() {
  const markets = await getMarketsData();

  return (
    <div className="space-y-8">
      {/* Trending Carousel Placeholder */}
      <section className="bg-white/40 p-4 rounded-xl border border-white/50 shadow-sm overflow-hidden">
        <h2 className="text-xl font-bold mb-4 text-matka-text flex items-center">
          <span className="text-matka-accent mr-2">⭐</span> Trending Markets
        </h2>
        <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="min-w-[150px] bg-matka-accent/10 p-4 rounded-lg border border-matka-accent/20 text-center">
              <div className="font-bold">KALYAN</div>
              <div className="text-sm font-mono text-matka-text">123-45-678</div>
            </div>
          ))}
        </div>
      </section>

      {/* Dynamic Grid */}
      <section>
        <h2 className="text-2xl font-black mb-6 text-matka-text">LIVE MARKETS</h2>
        <LiveMarkets initialMarkets={markets} />
      </section>
    </div>
  );
}
