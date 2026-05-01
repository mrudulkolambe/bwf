import mongoose, { Schema, Document } from 'mongoose';

interface ILocalizedContent {
  en: string;
  hi: string;
  mr: string;
}

export interface ITag extends Document {
  title: ILocalizedContent;
  isActive: boolean;
}

const LocalizedContentSchema = {
  en: { type: String, required: true },
  hi: { type: String, required: true },
  mr: { type: String, required: true }
};

const TagSchema: Schema = new Schema(
  {
    title: LocalizedContentSchema,
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.model<ITag>('Tag', TagSchema);
