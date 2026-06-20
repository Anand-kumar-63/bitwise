import mongoose, { Schema, Document, Model } from "mongoose";
import { OfferScope } from "@/types";

export interface IOffer extends Document {
  title: string;
  description: string;
  bannerText: string;
  code?: string;
  discountPercent: number;
  scope: OfferScope;
  category?: "anarkali" | "lehenga" | "saree" | "kurta";
  productIds?: string[];
  isActive: boolean;
  startsAt?: Date;
  endsAt?: Date;
  createdAt?: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    bannerText: { type: String, required: true },
    code: { type: String },
    discountPercent: { type: Number, required: true, min: 1, max: 90 },
    scope: {
      type: String,
      enum: ["sitewide", "category", "product"],
      required: true,
    },
    category: {
      type: String,
      enum: ["anarkali", "lehenga", "saree", "kurta"],
    },
    productIds: [{ type: String }],
    isActive: { type: Boolean, default: true },
    startsAt: { type: Date },
    endsAt: { type: Date },
  },
  { timestamps: true }
);

const Offer: Model<IOffer> =
  mongoose.models.Offer ?? mongoose.model<IOffer>("Offer", OfferSchema);

export default Offer;
