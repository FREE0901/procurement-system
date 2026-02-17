"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PRODUCTS, CATEGORIES } from "@/lib/mockData";
import { ProductDialog } from "@/components/client/ProductDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, SlidersHorizontal, Star, ArrowUpDown, Filter } from "lucide-react";
import { Product } from "@/lib/types";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ProductsPage() {
    const user = useStore((state) => state.user);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [sortBy, setSortBy] = useState("name-asc");
    const [priceRange, setPriceRange] = useState("all");
    const [showOnlyFavs, setShowOnlyFavs] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const favorites = useStore((state) => state.favorites);
    const toggleFavorite = useStore((state) => state.toggleFavorite);

    const filteredProducts = useMemo(() => {
        if (!user) return [];
        let result = PRODUCTS.filter((p) => {
            const rankMatch = p.minRank <= user.rank;
            const catMatch = activeCategory === "all" || p.category === activeCategory;
            const searchMatch = p.name.includes(search) || p.code.toLowerCase().includes(search.toLowerCase());
            const favMatch = !showOnlyFavs || favorites.includes(p.id);

            // Price filtering
            const minPrice = Math.min(...Object.values(p.prices).filter(v => v > 0));
            let priceMatch = true;
            if (priceRange === "under1000") priceMatch = minPrice < 1000;
            else if (priceRange === "1000-5000") priceMatch = minPrice >= 1000 && minPrice <= 5000;
            else if (priceRange === "over5000") priceMatch = minPrice > 5000;

            return rankMatch && catMatch && searchMatch && favMatch && priceMatch;
        });

        // Sorting
        result.sort((a, b) => {
            if (sortBy === "name-asc") return a.name.localeCompare(b.name, "ja");
            if (sortBy === "price-asc") {
                const aMin = Math.min(...Object.values(a.prices).filter(v => v > 0));
                const bMin = Math.min(...Object.values(b.prices).filter(v => v > 0));
                return aMin - bMin;
            }
            if (sortBy === "price-desc") {
                const aMin = Math.min(...Object.values(a.prices).filter(v => v > 0));
                const bMin = Math.min(...Object.values(b.prices).filter(v => v > 0));
                return bMin - aMin;
            }
            return 0;
        });

        return result;
    }, [user, search, activeCategory, favorites, showOnlyFavs, sortBy, priceRange]);

    const availableCategories = useMemo(() => {
        if (!user) return [];
        const productIds = new Set(PRODUCTS.filter(p => p.minRank <= user.rank).map(p => p.category));
        return CATEGORIES.filter(c => productIds.has(c.id));
    }, [user]);

    const openDetail = (p: Product) => {
        setSelectedProduct(p);
        setDetailOpen(true);
    };

    const fmt = (n: number) => (n === 0 || !n ? "要相談" : `¥${n.toLocaleString()}`);

    if (!user) return null; // Hydration guard handled in layout usually

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">商品一覧</h1>
                    <p className="text-sm text-gray-500">
                        ランク: <span className="font-medium text-orange-600">{user.rankName}</span>
                        {' / '}
                        閲覧可能: {filteredProducts.length}件
                    </p>
                </div>
                <div className="w-full md:w-auto flex gap-2">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                        <Input
                            placeholder="商品名・型番で検索..."
                            className="pl-9 w-full md:w-[240px]"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 bg-white">
                                <ArrowUpDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>並び替え</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                <DropdownMenuRadioItem value="name-asc">名前順</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price-asc">価格の安い順</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="price-desc">価格の高い順</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="shrink-0 bg-white">
                                <Filter className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[180px]">
                            <DropdownMenuLabel>フィルター</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuRadioGroup value={priceRange} onValueChange={setPriceRange}>
                                <DropdownMenuRadioItem value="all">すべての価格</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="under1000">1,000円未満</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="1000-5000">1,000円〜5,000円</DropdownMenuRadioItem>
                                <DropdownMenuRadioItem value="over5000">5,000円以上</DropdownMenuRadioItem>
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
                <Button
                    variant={activeCategory === "all" ? "default" : "outline"}
                    className={activeCategory === "all" ? "bg-orange-500 hover:bg-orange-600" : "bg-white"}
                    onClick={() => setActiveCategory("all")}
                    size="sm"
                >
                    すべて
                </Button>
                {availableCategories.map(c => (
                    <Button
                        key={c.id}
                        variant={activeCategory === c.id ? "default" : "outline"}
                        className={activeCategory === c.id ? "bg-orange-500 hover:bg-orange-600" : "bg-white"}
                        onClick={() => setActiveCategory(c.id)}
                        size="sm"
                    >
                        <span className="mr-1">{c.icon}</span> {c.name}
                    </Button>
                ))}
                <div className="ml-auto flex items-center gap-2 pl-4 border-l">
                    <Button
                        variant={showOnlyFavs ? "default" : "ghost"}
                        size="sm"
                        onClick={() => setShowOnlyFavs(!showOnlyFavs)}
                        className={showOnlyFavs ? "bg-amber-500 hover:bg-amber-600 text-white" : "text-gray-500"}
                    >
                        <Star className={`h-4 w-4 mr-1 ${showOnlyFavs ? "fill-current" : ""}`} />
                        お気に入り
                    </Button>
                </div>
            </div>

            {filteredProducts.length === 0 ? (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-lg font-medium text-gray-900">商品が見つかりません</h3>
                    <p className="text-gray-500">検索条件を変更して再度お試しください</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredProducts.map(product => (
                        <Card
                            key={product.id}
                            className="overflow-hidden cursor-pointer hover:shadow-lg hover:border-orange-200 transition-all group"
                            onClick={() => openDetail(product)}
                        >
                            <div className="aspect-[4/3] bg-gray-50 overflow-hidden relative">
                                <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <Badge variant="secondary" className="absolute top-2 left-2 opacity-90 backdrop-blur bg-white/80 text-[10px] px-1.5 h-5">
                                    {product.code}
                                </Badge>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className={`absolute top-2 right-2 h-8 w-8 rounded-full backdrop-blur transition-all ${favorites.includes(product.id)
                                        ? "bg-amber-500 text-white hover:bg-amber-600"
                                        : "bg-white/50 text-gray-600 hover:bg-white"
                                        }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(product.id);
                                    }}
                                >
                                    <Star className={`h-4 w-4 ${favorites.includes(product.id) ? "fill-current" : ""}`} />
                                </Button>
                            </div>
                            <CardContent className="p-3 pb-1">
                                <h3 className="font-medium text-sm text-gray-900 line-clamp-2 min-h-[2.5em] leading-snug mb-1">
                                    {product.name}
                                </h3>
                                <p className="text-xs text-gray-500">
                                    {product.sizes.length}サイズ
                                </p>
                            </CardContent>
                            <CardFooter className="p-3 pt-1 flex items-center justify-between">
                                <span className="text-xs text-gray-400">{product.unit}</span>
                                <span className="text-sm font-bold text-orange-600">
                                    {fmt(Math.min(...Object.values(product.prices).filter(p => p > 0)))}
                                    <span className="text-[10px] font-normal text-gray-400 ml-0.5">〜</span>
                                </span>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            )}

            <ProductDialog
                product={selectedProduct}
                open={detailOpen}
                onOpenChange={setDetailOpen}
            />
        </div>
    );
}
