import mongoose, { Schema, Document } from 'mongoose';

export interface IPartner extends Document {
  firstname: string;
  lastname: string;
  email?: string;
  phone: string;
  code?: string;
  available: boolean;
  business?: {
    name?: string;
    coordinates?: {
      lat?: number;
      lng?: number;
    };
    location?: string;
    tags?: mongoose.Types.ObjectId[];
  };
  businessCategory?: mongoose.Types.ObjectId;
  onboarding: {
    basic: boolean;
    business: boolean;
    completed: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PartnerSchema: Schema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true },
    code: { type: String, select: false, uppercase: true },
    available: { type: Boolean, default: true },
    business: {
      name: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
      location: { type: String },
      tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    },
    businessCategory: { type: Schema.Types.ObjectId, ref: 'Category' },
    onboarding: {
      basic: { type: Boolean, default: false },
      business: { type: Boolean, default: false },
      completed: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);



export default mongoose.model<IPartner>('Partner', PartnerSchema);
