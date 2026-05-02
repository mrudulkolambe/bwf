import mongoose, { Schema, Document } from 'mongoose';

interface ILocalizedContent {
  en: string;
  hi: string;
  mr: string;
}

interface ILocalizedTags {
  en: string[];
  hi: string[];
  mr: string[];
}

export interface ICategory extends Document {
  title: ILocalizedContent;
  description: ILocalizedContent;
  tags: mongoose.Types.ObjectId[];
  codePrefix: string;
  icon?: string;
  isActive: boolean;
}

const LocalizedContentSchema = {
  en: { type: String, required: true },
  hi: { type: String, required: true },
  mr: { type: String, required: true }
};

const CategorySchema: Schema = new Schema(
  {
    title: LocalizedContentSchema,
    description: LocalizedContentSchema,
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    codePrefix: { type: String, required: true, uppercase: true },
    icon: { type: String },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
