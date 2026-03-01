export type Rank = 1 | 2 | 3 | 99; // 1: Standard, 2: Premium, 3: VIP, 99: Admin

export interface User {
  id: string;
  email: string;
  password?: string;
  name: string;
  company: string;
  rank: Rank;
  rankName: string;
  isAdmin?: boolean;
  isGuest?: boolean;
  status: "有効" | "無効";
  lastOrder?: string;
  shippingAddress?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories?: { id: string; name: string }[];
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  subcategoryId?: string;
  minRank: Rank;
  unit: string;
  sizes: string[];
  prices: Record<string, number>;
  image: string;
  isPickup?: boolean;
  saleRate?: number; // 割引率 例: 10 = 10%OFF
}

export interface CartItem {
  productId: string;
  name: string;
  code: string;
  size: string;
  qty: number;
  price: number;
  unit: string;
  image: string;
}

export interface QuoteItem {
  productId: string;
  name: string;
  code: string;
  size: string;
  qty: number;
  price: number;
  unit: string;
}

export type QuoteStatus = "新規" | "依頼中" | "対応中" | "回答済" | "受注済";

export interface Quote {
  id: string;
  userId: string;
  company: string;
  personInCharge?: string;
  userRank: Rank;
  date: string;
  status: QuoteStatus;
  items: QuoteItem[];
  total: number;
  note?: string;
  shippingAddress?: string;
  desiredDelivery?: string; // 希望納期
}
