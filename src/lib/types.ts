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
  status: "有効" | "無効";
  lastOrder?: string;
  shippingAddress?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: string;
  minRank: Rank;
  unit: string;
  sizes: string[];
  prices: Record<string, number>;
  image: string;
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
  userRank: Rank;
  date: string;
  status: QuoteStatus;
  items: QuoteItem[];
  total: number;
  note?: string;
  shippingAddress?: string;
}

