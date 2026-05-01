import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Result from "@/models/Result";

export async function POST(req: Request) {
  try {
    const { marketId, date, openPanna, jodi, closePanna } = await req.json();

    if (!marketId || !date) {
      return NextResponse.json({ error: "Missing marketId or date" }, { status: 400 });
    }

    await connectToDatabase();

    const targetDate = new Date(date);
    targetDate.setHours(0, 0, 0, 0);

    const updatedResult = await Result.findOneAndUpdate(
      { marketId, date: targetDate },
      {
        openPanna,
        jodi,
        closePanna,
        isManualOverride: true, // Lock this record from scraper
      },
      { upsert: true, new: true }
    );

    // If you want to push this to Socket.io directly from Next.js, it's slightly complex without the instance.
    // However, the simplest way is to let the frontend refresh or just rely on the API success.
    // The scraper will skip it on the next tick anyway.

    return NextResponse.json({ success: true, result: updatedResult });
  } catch (error) {
    console.error("Manual Override Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
