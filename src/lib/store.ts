import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, Quote, QuoteStatus, Rank, User } from "./types";
import { MOCK_QUOTES, PRODUCTS, USERS } from "./mockData";

interface AppState {
    // Auth
    user: User | null;
    login: (email: string) => void;
    logout: () => void;

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

    // Actions
    submitQuote: (note: string, address: string) => void;
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
            logout: () => set({ user: null, cart: [] }),

            products: PRODUCTS,
            quotes: MOCK_QUOTES,
            users: USERS,

            cart: [],
            addToCart: (product, size, qty) => {
                // Simple add - check existing
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

            submitQuote: (note, address) => {
                const state = get();
                if (!state.user) return;
                const total = state.cart.reduce((s, c) => s + c.price * c.qty, 0);
                const newQuote: Quote = {
                    id: `Q-${new Date().getFullYear()}-${String(state.quotes.length + 1).padStart(3, "0")}`,
                    userId: state.user.id,
                    company: state.user.company,
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
                // We persist data changes to simulate "Backend" persistence
            }),
        }
    )
);
