import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Quote, QuoteStatus, Rank, User } from "./types";
import { MOCK_QUOTES, PRODUCTS, USERS } from "./mockData";

interface AppState {
    // Auth
    user: User | null;
    login: (email: string) => void;
    loginAsGuest: () => void;
    logout: () => void;
    registerUser: (data: { name: string; company: string; email: string; password: string }) => { success: boolean; error?: string };

    // Data (Mock DB)
    products: Product[];
    quotes: Quote[];
    users: User[];

    // Cart
    cart: CartItem[];
    addToCart: (product: Product, size: string, qty: number) => void;
    removeFromCart: (index: number) => void;
    updateCartQty: (index: number, qty: number) => void;
    clearCart: () => void;
    addQuoteItemsToCart: (quoteId: string) => void;

    // Actions
    submitQuote: (note: string, address: string, desiredDelivery: string, company: string, personInCharge: string) => void;
    updateQuoteStatus: (id: string, status: QuoteStatus) => void;
    addProduct: (product: Product) => void;
    updateUserAddress: (address: string) => void;

    // Favorites
    favorites: string[];
    toggleFavorite: (productId: string) => void;
}

export const useStore = create<AppState>()(
    persist(
        (set, get) => ({
            user: null,
            login: (email) => {
                const u = USERS.find((u) => u.email === email);
                if (u) set({ user: u });
            },
            loginAsGuest: () => {
                const guestUser: User = {
                    id: `guest-${Date.now()}`,
                    email: "",
                    name: "ゲスト",
                    company: "",
                    rank: 1,
                    rankName: "ゲスト",
                    isGuest: true,
                    status: "有効",
                };
                set({ user: guestUser, cart: [] });
            },
            logout: () => set({ user: null, cart: [] }),
            registerUser: ({ name, company, email, password }) => {
                const state = get();
                // Check duplicate email
                const allUsers = [...USERS, ...state.users.filter(u => !USERS.find(bu => bu.id === u.id))];
                if (allUsers.find(u => u.email === email)) {
                    return { success: false, error: "このメールアドレスはすでに登録されています" };
                }
                const newUser: User = {
                    id: `u-${Date.now()}`,
                    email,
                    password,
                    name,
                    company,
                    rank: 1,
                    rankName: "スタンダード",
                    status: "有効",
                };
                set({ users: [...state.users, newUser], user: newUser });
                return { success: true };
            },

            products: PRODUCTS,
            quotes: MOCK_QUOTES,
            users: USERS,

            cart: [],
            addToCart: (product, size, qty) => {
                const state = get();
                const existingIdx = state.cart.findIndex(
                    (c) => c.productId === product.id && c.size === size
                );
                if (existingIdx >= 0) {
                    const newCart = [...state.cart];
                    newCart[existingIdx].qty += qty;
                    set({ cart: newCart });
                } else {
                    set({
                        cart: [
                            ...state.cart,
                            {
                                productId: product.id,
                                name: product.name,
                                code: product.code,
                                size,
                                qty,
                                price: product.prices[size] || 0,
                                unit: product.unit,
                                image: product.image,
                            },
                        ],
                    });
                }
            },
            removeFromCart: (idx) => {
                set({ cart: get().cart.filter((_, i) => i !== idx) });
            },
            updateCartQty: (idx, qty) => {
                const newCart = [...get().cart];
                if (qty <= 0) return;
                newCart[idx].qty = qty;
                set({ cart: newCart });
            },
            clearCart: () => set({ cart: [] }),

            addQuoteItemsToCart: (quoteId) => {
                const state = get();
                const quote = state.quotes.find(q => q.id === quoteId);
                if (!quote) return;
                let newCart = [...state.cart];
                quote.items.forEach(item => {
                    const existingIdx = newCart.findIndex(c => c.productId === item.productId && c.size === item.size);
                    const product = state.products.find(p => p.id === item.productId);
                    if (existingIdx >= 0) {
                        newCart[existingIdx].qty += item.qty;
                    } else {
                        newCart.push({
                            productId: item.productId,
                            name: item.name,
                            code: item.code,
                            size: item.size,
                            qty: item.qty,
                            price: item.price,
                            unit: item.unit,
                            image: product?.image || "https://placehold.co/400x300/e8e8e8/666?text=No+Image",
                        });
                    }
                });
                set({ cart: newCart });
            },

            submitQuote: (note, address, desiredDelivery, company, personInCharge) => {
                const state = get();
                if (!state.user) return;
                const total = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
                const newQuote: Quote = {
                    id: `Q-${new Date().getFullYear()}-${String(state.quotes.length + 1).padStart(3, "0")}`,
                    userId: state.user.id,
                    company: company || state.user.company || state.user.name,
                    personInCharge: personInCharge || state.user.name,
                    userRank: state.user.rank,
                    date: new Date().toISOString().split("T")[0],
                    status: "依頼中",
                    items: state.cart.map((c) => ({
                        productId: c.productId,
                        name: c.name,
                        code: c.code,
                        size: c.size,
                        qty: c.qty,
                        price: c.price,
                        unit: c.unit,
                    })),
                    total,
                    note,
                    shippingAddress: address,
                    desiredDelivery,
                };
                set({ quotes: [newQuote, ...state.quotes], cart: [] });
            },

            updateQuoteStatus: (id, status) => {
                set({
                    quotes: get().quotes.map((q) => (q.id === id ? { ...q, status } : q)),
                });
            },

            addProduct: (product) => {
                set({ products: [...get().products, product] });
            },

            updateUserAddress: (address) => {
                const state = get();
                if (state.user) {
                    const updatedUser = { ...state.user, shippingAddress: address };
                    set({ user: updatedUser });
                }
            },

            favorites: [],
            toggleFavorite: (id) => {
                const favs = get().favorites;
                if (favs.includes(id)) {
                    set({ favorites: favs.filter((f) => f !== id) });
                } else {
                    set({ favorites: [...favs, id] });
                }
            },
        }),
        {
            name: "procurement-storage",
            partialize: (state) => ({
                user: state.user,
                cart: state.cart,
                quotes: state.quotes,
                favorites: state.favorites,
                users: state.users,
            }),
        }
    )
);
