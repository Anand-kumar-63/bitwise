import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Omit<Document, "isNew"> {
  name: string;
  slug: string;
  category: "anarkali" | "lehenga" | "saree" | "kurta";
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  colors: { name: string; hex: string }[];
  fabric: string;
  occasion: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isBridal?: boolean;
  createdAt?: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: ["anarkali", "lehenga", "saree", "kurta"],
      required: true,
    },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [{ name: String, hex: String }],
    fabric: { type: String, default: "" },
    occasion: [{ type: String }],
    tags: [{ type: String }],
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    isBestseller: { type: Boolean, default: false },
    isNew: { type: Boolean, default: false },
    isBridal: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product ?? mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
