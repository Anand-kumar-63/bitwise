// ─── Product ────────────────────────────────────────────────────────────────
export interface Product {
  _id: string;
  name: string;
  slug: string;
  category: "anarkali" | "lehenga" | "saree" | "kurta";
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  sizes: string[];
  colors: Color[];
  fabric: string;
  occasion: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  stock: number;
  isBestseller?: boolean;
  isNew?: boolean;
  isBridal?: boolean;
  createdAt?: string;
}

export interface Color {
  name: string;
  hex: string;
}

// ─── Cart ────────────────────────────────────────────────────────────────────
export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

// ─── Order ───────────────────────────────────────────────────────────────────
export interface OrderItem {
  productId: string;
  name: string;
  image: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
}

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Order {
  _id: string;
  userId?: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  shippingAddress: ShippingAddress;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  razorpay_signature?: string;
  status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface CheckoutFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}
