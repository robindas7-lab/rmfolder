import connectToDatabase from "@/lib/db";
import Market from "@/models/Market";
import Result from "@/models/Result";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  await connectToDatabase();
  const market = await Market.findOne({ slug: params.slug }).lean();
  
  if (!market) return { title: 'Market Not Found' };

  return {
    title: market.seoTitle || `${market.name} Panel Chart - Rocket Matka`,
    description: market.seoDescription || `Live ${market.name} matka panel chart and past results.`,
  };
}

export default async function ChartPage({ params }: { params: { slug: string } }) {
  await connectToDatabase();
  const market = await Market.findOne({ slug: params.slug }).lean();
  
  if (!market) return notFound();

  const results = await Result.find({ marketId: market._id }).sort({ date: -1 }).limit(30).lean();

  return (
    <div className="glass-panel p-4 md:p-8 rounded-2xl">
      <h1 className="text-3xl font-black text-center mb-2 text-matka-accent">{market.name} PANEL CHART</h1>
      <p className="text-center text-sm font-semibold mb-8 text-gray-500">
        {market.openTime} - {market.closeTime}
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-white uppercase bg-matka-text">
            <tr>
              <th scope="col" className="px-6 py-3 rounded-tl-lg">Date</th>
              <th scope="col" className="px-6 py-3">Open Panna</th>
              <th scope="col" className="px-6 py-3">Jodi</th>
              <th scope="col" className="px-6 py-3 rounded-tr-lg">Close Panna</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, idx) => (
              <tr key={idx} className="bg-white border-b hover:bg-gray-50 font-mono text-center">
                <td className="px-6 py-4 font-bold text-gray-900">{new Date(result.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{result.openPanna}</td>
                <td className="px-6 py-4 text-matka-danger font-bold text-lg">{result.jodi}</td>
                <td className="px-6 py-4">{result.closePanna}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {results.length === 0 && (
          <div className="text-center py-8 text-gray-500">No results history available yet.</div>
        )}
      </div>
    </div>
  );
}
