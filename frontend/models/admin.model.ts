import mongoose, { Schema, Document } from 'mongoose';

export interface IAdmin extends Document {
  phone: string;
  email: string;
  otp?: string;
  otpExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema: Schema = new Schema(
  {
    phone: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    otp: { type: String, select: false },
    otpExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Admin || mongoose.model<IAdmin>('Admin', AdminSchema);
