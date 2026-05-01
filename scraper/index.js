require('dotenv').config({ path: '../.env.local' });
const puppeteer = require('puppeteer');
const mongoose = require('mongoose');
const config = require('./config');
const { Server } = require('socket.io');

const io = new Server(4000, {
  cors: { origin: "*", methods: ["GET", "POST"] }
});
console.log('Socket.io server running on port 4000');

// Re-using the Mongoose schemas via require since this is a separate JS file
// Note: In a real environment, we'd compile the TS models or use a shared library.
// For the standalone JS scraper, we define lightweight schemas.
const Schema = mongoose.Schema;
const MarketSchema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  openTime: { type: String },
  closeTime: { type: String },
  status: { type: String, default: 'active' }
});
const ResultSchema = new Schema({
  marketId: { type: Schema.Types.ObjectId, ref: 'Market' },
  date: { type: Date, required: true },
  openPanna: { type: String, default: '***' },
  openNumber: { type: String, default: '*' },
  closeNumber: { type: String, default: '*' },
  closePanna: { type: String, default: '***' },
  jodi: { type: String, default: '**' },
  isManualOverride: { type: Boolean, default: false },
});
ResultSchema.index({ marketId: 1, date: 1 }, { unique: true });

const Market = mongoose.models.Market || mongoose.model('Market', MarketSchema);
const Result = mongoose.models.Result || mongoose.model('Result', ResultSchema);

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/rocket-matka';

async function connectDb() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(MONGODB_URI);
    console.log('Scraper DB Connected');
  }
}

function generateSlug(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
}

async function scrapeMainTable() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  
  try {
    console.log(`Navigating to ${config.SOURCE_URL}`);
    await page.goto(config.SOURCE_URL, { waitUntil: 'domcontentloaded', timeout: 30000 });
    
    // Simulate finding markets. Since we don't know the exact DOM of dpbossnat.com,
    // this is a functional mock-up based on common matka site structures.
    const marketsData = await page.evaluate((sel) => {
      // Mocked data extraction
      return [
        { name: 'KALYAN', openTime: '04:00 PM', closeTime: '06:00 PM', openPanna: '123', jodi: '45', closePanna: '678', chartLink: '/kalyan-panel-chart' },
        { name: 'MILAN DAY', openTime: '03:00 PM', closeTime: '05:00 PM', openPanna: '111', jodi: '22', closePanna: '333', chartLink: '/milan-day-chart' }
      ];
    }, config.SELECTORS);
    
    for (const data of marketsData) {
      let market = await Market.findOne({ name: data.name });
      
      if (!market) {
        console.log(`[Auto-Discovery] New market detected: ${data.name}`);
        const slug = generateSlug(data.name);
        market = new Market({
          name: data.name,
          slug: slug,
          openTime: data.openTime,
          closeTime: data.closeTime,
        });
        await market.save();
        
        // Deep Scrape History for the new market
        await scrapeHistory(browser, data.chartLink, market._id);
      }
      
      // Update Today's Result
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const existingResult = await Result.findOne({ marketId: market._id, date: today });
      
      if (existingResult && existingResult.isManualOverride) {
        console.log(`Skipped ${market.name} because manual override is active.`);
        continue; // Skip this market
      }
      
      const updatedResult = await Result.findOneAndUpdate(
        { marketId: market._id, date: today },
        {
          openPanna: data.openPanna,
          jodi: data.jodi,
          closePanna: data.closePanna
        },
        { upsert: true, new: true }
      );
      
      io.emit('market_updated', {
        marketId: market._id.toString(),
        result: {
          openPanna: updatedResult.openPanna,
          jodi: updatedResult.jodi,
          closePanna: updatedResult.closePanna,
        }
      });
      console.log(`Synced & pushed real-time Result for ${market.name}`);
    }
  } catch (error) {
    console.error('Scraping Error:', error);
  } finally {
    await browser.close();
  }
}

async function scrapeHistory(browser, link, marketId) {
  console.log(`[Deep Scrape] Fetching history from ${link}`);
  // Mocking history import
  const pastDates = [1, 2, 3].map(daysAgo => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    d.setHours(0,0,0,0);
    return d;
  });
  
  for (const date of pastDates) {
    await Result.findOneAndUpdate(
      { marketId, date },
      { openPanna: '123', jodi: '45', closePanna: '678' },
      { upsert: true }
    );
  }
  console.log(`Imported history for market ${marketId}`);
}

async function runScraper() {
  await connectDb();
  console.log('--- Starting Scraper Cycle ---');
  await scrapeMainTable();
  console.log(`Cycle complete. Waiting ${config.CRON_INTERVAL / 1000} seconds...`);
}

// Start interval
runScraper();
setInterval(runScraper, config.CRON_INTERVAL);
