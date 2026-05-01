import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IResult extends Document {
  marketId: mongoose.Types.ObjectId;
  date: Date;
  openPanna: string;
  openNumber: string;
  closeNumber: string;
  closePanna: string;
  jodi: string;
  isManualOverride: boolean;
}

const ResultSchema: Schema = new Schema({
  marketId: { type: Schema.Types.ObjectId, ref: 'Market', required: true, index: true },
  date: { type: Date, required: true },
  openPanna: { type: String, default: '***' },
  openNumber: { type: String, default: '*' },
  closeNumber: { type: String, default: '*' },
  closePanna: { type: String, default: '***' },
  jodi: { type: String, default: '**' },
  isManualOverride: { type: Boolean, default: false },
}, { timestamps: true });

// Compound index to ensure one result per market per date
ResultSchema.index({ marketId: 1, date: 1 }, { unique: true });

const Result: Model<IResult> = mongoose.models.Result || mongoose.model<IResult>('Result', ResultSchema);
export default Result;
