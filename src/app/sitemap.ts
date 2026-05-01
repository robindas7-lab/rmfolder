import { MetadataRoute } from 'next';
import connectToDatabase from '@/lib/db';
import Market from '@/models/Market';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://your-rocket-matka-domain.com';

  await connectToDatabase();
  const markets = await Market.find({ status: 'active' }).select('slug updatedAt').lean();

  const marketUrls = markets.map((market) => ({
    url: `${baseUrl}/chart/${market.slug}`,
    lastModified: new Date(),
    changeFrequency: 'always' as const,
    priority: 0.8,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'always',
      priority: 1,
    },
    ...marketUrls,
  ];
}
