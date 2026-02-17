"use client";

import { useState } from "react";
import { Product } from "@/lib/types";
import { CATEGORIES } from "@/lib/mockData";
import { useStore } from "@/lib/store";
import { Dialog, DialogContent, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, X, Heart } from "lucide-react";

interface ProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function ProductDialog({ product, open, onOpenChange }: ProductDialogProps) {
    const addToCart = useStore((state) => state.addToCart);
    const [size, setSize] = useState<string>("");
    const [qty, setQty] = useState(1);
    const [added, setAdded] = useState(false);
    const favorites = useStore((state) => state.favorites);
    const toggleFavorite = useStore((state) => state.toggleFavorite);

    // Reset state when product changes
    if (product && !size && product.sizes.length > 0) {
        setSize(product.sizes[0]);
    }

    const handleAddToCart = () => {
        if (!product || !size) return;
        addToCart(product, size, qty);
        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            onOpenChange(false);
        }, 1000);
    };

    if (!product) return null;

    const currentPrice = product.prices[size];
    const fmt = (n: number) => (n === 0 || !n ? "要相談" : `¥${n.toLocaleString()}`);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl p-0 overflow-hidden gap-0">
                <div className="grid md:grid-cols-2">
                    <div className="relative aspect-square md:aspect-auto bg-gray-100">
                        <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`absolute top-4 right-4 h-10 w-10 rounded-full shadow-lg backdrop-blur transition-all ${favorites.includes(product.id)
                                ? "bg-amber-500 text-white hover:bg-amber-600"
                                : "bg-white/80 text-gray-600 hover:bg-white"
                                }`}
                            onClick={() => toggleFavorite(product.id)}
                        >
                            <Heart className={`h-5 w-5 ${favorites.includes(product.id) ? "fill-current" : ""}`} />
                        </Button>
                    </div>
                    <div className="p-6 flex flex-col h-full">
                        <div className="mb-4">
                            <Badge variant="outline" className="mb-2">{product.code}</Badge>
                            <h2 className="text-2xl font-bold text-gray-900 leading-tight mb-1">{product.name}</h2>
                            <p className="text-sm text-gray-500">
                                {CATEGORIES.find(c => c.id === product.category)?.name} / 単位: {product.unit}
                            </p>
                        </div>

                        <div className="space-y-4 flex-1">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">サイズ</label>
                                <Select value={size} onValueChange={setSize}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="サイズを選択" />
                                    </SelectTrigger>
                                    <SelectContent className="max-h-[200px]">
                                        {product.sizes.map(s => (
                                            <SelectItem key={s} value={s}>
                                                {s} — {fmt(product.prices[s])}/{product.unit}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700">数量</label>
                                <div className="flex items-center">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQty(Math.max(1, qty - 1))}
                                    >
                                        -
                                    </Button>
                                    <Input
                                        type="number"
                                        min={1}
                                        value={qty}
                                        onChange={(e) => setQty(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="mx-2 w-20 text-center"
                                    />
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        onClick={() => setQty(qty + 1)}
                                    >
                                        +
                                    </Button>
                                </div>
                            </div>

                            {currentPrice > 0 && (
                                <div className="bg-orange-50 p-4 rounded-lg flex items-center justify-between border border-orange-100">
                                    <span className="text-sm font-medium text-orange-800">参考小計</span>
                                    <span className="text-xl font-bold text-orange-600">{fmt(currentPrice * qty)}</span>
                                </div>
                            )}
                        </div>

                        <div className="mt-6 pt-4 border-t">
                            <Button
                                className={`w-full py-6 text-lg transition-all ${added ? "bg-green-600 hover:bg-green-700" : "bg-orange-500 hover:bg-orange-600"}`}
                                onClick={handleAddToCart}
                                disabled={added}
                            >
                                {added ? (
                                    <span className="flex items-center gap-2"><Check className="w-5 h-5" /> カートに追加済み</span>
                                ) : (
                                    <span className="flex items-center gap-2"><ShoppingCart className="w-5 h-5" /> カートに追加</span>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
