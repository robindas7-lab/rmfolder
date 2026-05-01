import mongoose, { Schema, Document, Model } from 'mongoose';
import Result from './Result';

export interface IMarket extends Document {
  name: string;
  slug: string;
  openTime: string;
  closeTime: string;
  status: 'active' | 'inactive';
  seoTitle?: string;
  seoDescription?: string;
}

const MarketSchema: Schema = new Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true, index: true },
  openTime: { type: String },
  closeTime: { type: String },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  seoTitle: { type: String },
  seoDescription: { type: String }
}, { timestamps: true });

// Cascading delete
MarketSchema.pre('findOneAndDelete', async function(next) {
  const market = await this.model.findOne(this.getQuery());
  if (market) {
    await Result.deleteMany({ marketId: market._id });
  }
  next();
});

MarketSchema.pre('deleteOne', { document: true, query: false }, async function(next) {
  await Result.deleteMany({ marketId: this._id });
  next();
});

const Market: Model<IMarket> = mongoose.models.Market || mongoose.model<IMarket>('Market', MarketSchema);
export default Market;
