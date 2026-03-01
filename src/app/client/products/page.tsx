"use client";

import { useState, useMemo } from "react";
import { useStore } from "@/lib/store";
import { PRODUCTS, CATEGORIES } from "@/lib/mockData";
import { ProductDialog } from "@/components/client/ProductDialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Star, ArrowUpDown, Filter, ChevronRight, ChevronDown, Tag, Sparkles, Zap, LayoutGrid } from "lucide-react";
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
    const quotes = useStore((state) => state.quotes);
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("all");
    const [activeSubcategory, setActiveSubcategory] = useState<string | null>(null);
    const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState("name-asc");
    const [priceRange, setPriceRange] = useState("all");
    const [showOnlyFavs, setShowOnlyFavs] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [detailOpen, setDetailOpen] = useState(false);

    const favorites = useStore((state) => state.favorites);
    const toggleFavorite = useStore((state) => state.toggleFavorite);

    const fmt = (n: number) => (n === 0 || !n ? "要相談" : `¥${n.toLocaleString()}`);

    // おすすめ商品ロジック: 過去見積もりのカテゴリから未購入の同カテゴリ商品を推薦
    const recommendedProducts = useMemo(() => {
        if (!user) return [];
        const myQuotes = quotes.filter(q => q.userId === user.id);
        const orderedProductIds = new Set(myQuotes.flatMap(q => q.items.map(i => i.productId)));
        const orderedCategories = new Set(
            myQuotes.flatMap(q => q.items.map(i => {
                const product = PRODUCTS.find(p => p.id === i.productId);
                return product?.category ?? "";
            }))
        );

        // 過去に注文したカテゴリの未注文商品を推薦
        let recs = PRODUCTS.filter(p =>
            p.minRank <= user.rank &&
            orderedCategories.has(p.category) &&
            !orderedProductIds.has(p.id)
        );

        // 履歴がない場合はピックアップ商品を表示
        if (recs.length === 0) {
            recs = PRODUCTS.filter(p => p.minRank <= user.rank && p.isPickup);
        }

        return recs.slice(0, 8);
    }, [user, quotes]);

    // ピックアップ商品
    const pickupProducts = useMemo(() => {
        if (!user) return [];
        return PRODUCTS.filter(p => p.minRank <= user.rank && p.isPickup).slice(0, 8);
    }, [user]);

    // セール商品
    const saleProducts = useMemo(() => {
        if (!user) return [];
        return PRODUCTS.filter(p => p.minRank <= user.rank && p.saleRate && p.saleRate > 0).slice(0, 8);
    }, [user]);

    const filteredProducts = useMemo(() => {
        if (!user) return [];

        // "おすすめ商品"カテゴリ選択時は recommendedProducts を使用
        if (activeCategory === "recommended") {
            return recommendedProducts;
        }

        let result = PRODUCTS.filter((p) => {
            const rankMatch = p.minRank <= user.rank;
            const catMatch = activeCategory === "all" || p.category === activeCategory;
            const subCatMatch = !activeSubcategory || p.subcategoryId === activeSubcategory;
            const searchMatch = p.name.includes(search) || p.code.toLowerCase().includes(search.toLowerCase());
            const favMatch = !showOnlyFavs || favorites.includes(p.id);
            const minPrice = Math.min(...Object.values(p.prices).filter(v => v > 0));
            let priceMatch = true;
            if (priceRange === "under1000") priceMatch = minPrice < 1000;
            else if (priceRange === "1000-5000") priceMatch = minPrice >= 1000 && minPrice <= 5000;
            else if (priceRange === "over5000") priceMatch = minPrice > 5000;
            return rankMatch && catMatch && subCatMatch && searchMatch && favMatch && priceMatch;
        });

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
    }, [user, search, activeCategory, activeSubcategory, favorites, showOnlyFavs, sortBy, priceRange, recommendedProducts]);

    const availableCategories = useMemo(() => {
        if (!user) return [];
        const productCatIds = new Set(PRODUCTS.filter(p => p.minRank <= user.rank).map(p => p.category));
        return CATEGORIES.filter(c => productCatIds.has(c.id) && c.id !== "c5"); // c5は「おすすめ」など特殊カテゴリとして除外
    }, [user]);

    const activeCatData = availableCategories.find(c => c.id === activeCategory);

    const toggleCategoryExpand = (catId: string) => {
        setExpandedCategories(prev =>
            prev.includes(catId) ? prev.filter(id => id !== catId) : [...prev, catId]
        );
    };

    const openDetail = (p: Product) => {
        setSelectedProduct(p);
        setDetailOpen(true);
    };

    if (!user) return null;

    const isInTopSection = activeCategory === "all" && !search && !showOnlyFavs;

    // 商品カード共通コンポーネント
    const ProductCard = ({ product, compact = false }: { product: Product; compact?: boolean }) => (
        <Card
            className="overflow-hidden cursor-pointer hover:shadow-lg hover:border-orange-200 transition-all group flex-shrink-0"
            style={compact ? { width: 180 } : undefined}
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
                {product.saleRate && (
                    <div className="absolute top-2 right-8 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {product.saleRate}%OFF
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    className={`absolute top-2 right-2 h-7 w-7 rounded-full backdrop-blur transition-all ${favorites.includes(product.id)
                        ? "bg-amber-500 text-white hover:bg-amber-600"
                        : "bg-white/50 text-gray-600 hover:bg-white"
                        }`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(product.id); }}
                >
                    <Star className={`h-3.5 w-3.5 ${favorites.includes(product.id) ? "fill-current" : ""}`} />
                </Button>
            </div>
            <CardContent className="p-3 pb-1">
                <h3 className="font-medium text-sm text-gray-900 line-clamp-2 min-h-[2.5em] leading-snug mb-1">
                    {product.name}
                </h3>
                <p className="text-xs text-gray-500">{product.sizes.length}サイズ</p>
            </CardContent>
            <CardFooter className="p-3 pt-1 flex items-center justify-between">
                <span className="text-xs text-gray-400">{product.unit}</span>
                <span className="text-sm font-bold text-orange-600">
                    {fmt(Math.min(...Object.values(product.prices).filter(p => p > 0)))}
                    <span className="text-[10px] font-normal text-gray-400 ml-0.5">〜</span>
                </span>
            </CardFooter>
        </Card>
    );

    // 横スクロールセクション
    const HorizontalSection = ({
        title, icon, products, accentColor = "orange", onMore
    }: {
        title: string;
        icon: React.ReactNode;
        products: Product[];
        accentColor?: string;
        onMore?: () => void;
    }) => {
        if (products.length === 0) return null;
        return (
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h2 className={`flex items-center gap-2 text-base font-bold text-gray-900`}>
                        <span className={`p-1.5 rounded-lg ${accentColor === "orange" ? "bg-orange-100 text-orange-600" : accentColor === "red" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-600"}`}>
                            {icon}
                        </span>
                        {title}
                    </h2>
                    {onMore && (
                        <button onClick={onMore} className="text-xs text-gray-400 hover:text-orange-600 flex items-center gap-0.5 transition-colors">
                            もっと見る <ChevronRight className="w-3 h-3" />
                        </button>
                    )}
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                    {products.map(product => (
                        <div key={product.id} className="flex-shrink-0 w-44">
                            <ProductCard product={product} compact />
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar for Desktop */}
            <aside className="hidden md:flex w-64 flex-col shrink-0 gap-4 border-r pr-4 sticky top-6 h-[calc(100vh-3rem)] overflow-y-auto pb-8 scrollbar-hide">
                <div className="font-bold text-gray-900 mt-2 mb-2 flex items-center gap-2">
                    <LayoutGrid className="w-5 h-5 text-orange-600" />
                    商品を探す
                </div>

                <div className="space-y-1 w-full">
                    <Button
                        variant={activeCategory === "all" && !showOnlyFavs ? "default" : "ghost"}
                        className={`w-full justify-start ${activeCategory === "all" && !showOnlyFavs ? "bg-orange-500 hover:bg-orange-600" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"}`}
                        onClick={() => { setActiveCategory("all"); setActiveSubcategory(null); setShowOnlyFavs(false); }}
                    >
                        すべて
                    </Button>
                    {availableCategories.map(c => {
                        const isExpanded = expandedCategories.includes(c.id) || activeCategory === c.id;
                        return (
                            <div key={c.id} className="space-y-0.5">
                                <Button
                                    variant={activeCategory === c.id && !activeSubcategory ? "secondary" : "ghost"}
                                    className={`w-full justify-between hover:bg-orange-50 hover:text-orange-600 ${activeCategory === c.id && !activeSubcategory ? "bg-orange-100 text-orange-900 font-bold" : "text-gray-600"}`}
                                    onClick={() => {
                                        setActiveCategory(c.id);
                                        setActiveSubcategory(null);
                                        setShowOnlyFavs(false);
                                        if (!expandedCategories.includes(c.id)) {
                                            setExpandedCategories([...expandedCategories, c.id]);
                                        }
                                    }}
                                >
                                    <span className="flex items-center">
                                        <span className="mr-2 text-lg">{c.icon}</span> {c.name}
                                    </span>
                                    {c.subcategories && c.subcategories.length > 0 && (
                                        <span onClick={(e) => { e.stopPropagation(); toggleCategoryExpand(c.id); }} className="p-1.5 hover:bg-orange-200 rounded text-gray-400 hover:text-orange-700 transition-colors">
                                            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                                        </span>
                                    )}
                                </Button>
                                {isExpanded && c.subcategories && (
                                    <div className="pl-6 space-y-0.5 mt-0.5 mb-1 relative before:absolute before:left-3 before:top-0 before:bottom-2 before:w-px before:bg-gray-200">
                                        {c.subcategories.map(sub => (
                                            <Button
                                                key={sub.id}
                                                variant="ghost"
                                                size="sm"
                                                className={`w-full justify-start text-xs h-8 pl-4 relative before:absolute before:left-[-11px] before:top-1/2 before:w-3 before:h-px before:bg-gray-200 ${activeSubcategory === sub.id ? "text-orange-600 font-bold bg-orange-50" : "text-gray-500 hover:text-orange-600 hover:bg-orange-50"}`}
                                                onClick={() => { setActiveCategory(c.id); setActiveSubcategory(sub.id); setShowOnlyFavs(false); }}
                                            >
                                                {sub.name}
                                            </Button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    <div className="pt-4 mt-2 border-t space-y-1">
                        <Button
                            variant={activeCategory === "recommended" ? "default" : "ghost"}
                            className={`w-full justify-start ${activeCategory === "recommended" ? "bg-orange-500 hover:bg-orange-600" : "text-gray-600 hover:bg-orange-50 hover:text-orange-600"}`}
                            onClick={() => { setActiveCategory("recommended"); setActiveSubcategory(null); setShowOnlyFavs(false); }}
                        >
                            <span className="mr-2">👍</span> おすすめ商品
                        </Button>
                        <Button
                            variant={showOnlyFavs ? "secondary" : "ghost"}
                            className={`w-full justify-start ${showOnlyFavs ? "bg-amber-100 text-amber-900 font-bold" : "text-gray-600 hover:bg-amber-50"}`}
                            onClick={() => { setShowOnlyFavs(true); setActiveCategory("all"); setActiveSubcategory(null); }}
                        >
                            <Star className={`h-4 w-4 mr-2 ${showOnlyFavs ? "fill-amber-500 text-amber-500" : ""}`} />
                            お気に入り
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6 pt-2">
                {/* ヘッダー & 検索 */}
                <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">商品一覧</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            ランク: <span className="font-medium text-orange-600">{user.rankName}</span>
                            {activeCategory !== "recommended" && (
                                <>{' / '}該当: {filteredProducts.length}件</>
                            )}
                        </p>
                    </div>
                    <div className="w-full md:w-auto flex flex-wrap gap-2">
                        <div className="relative group flex-1 md:flex-none min-w-[200px]">
                            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                            <Input
                                placeholder="商品名・型番で検索..."
                                className="pl-9 w-full md:w-[240px]"
                                value={search}
                                onChange={(e) => { setSearch(e.target.value); setActiveCategory("all"); setActiveSubcategory(null); setShowOnlyFavs(false); }}
                            />
                        </div>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0 bg-white">
                                    <ArrowUpDown className="h-4 w-4 cursor-pointer" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuLabel>並び替え</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
                                    <DropdownMenuRadioItem value="name-asc" className="cursor-pointer">名前順</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="price-asc" className="cursor-pointer">価格の安い順</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="price-desc" className="cursor-pointer">価格の高い順</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon" className="shrink-0 bg-white">
                                    <Filter className="h-4 w-4 cursor-pointer" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[180px]">
                                <DropdownMenuLabel>価格フィルター</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={priceRange} onValueChange={setPriceRange}>
                                    <DropdownMenuRadioItem value="all" className="cursor-pointer">すべての価格</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="under1000" className="cursor-pointer">1,000円未満</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="1000-5000" className="cursor-pointer">1,000円〜5,000円</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="over5000" className="cursor-pointer">5,000円以上</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                {/* Mobile Categories (Horizontal Scroll) */}
                <div className="md:hidden flex flex-col gap-2">
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center">
                        <Button
                            variant={activeCategory === "all" && !showOnlyFavs ? "default" : "outline"}
                            className={activeCategory === "all" && !showOnlyFavs ? "bg-orange-500 hover:bg-orange-600 shrink-0" : "bg-white shrink-0"}
                            onClick={() => { setActiveCategory("all"); setActiveSubcategory(null); setShowOnlyFavs(false); }}
                            size="sm"
                        >
                            すべて
                        </Button>
                        {availableCategories.map(c => (
                            <Button
                                key={c.id}
                                variant={activeCategory === c.id ? "default" : "outline"}
                                className={activeCategory === c.id ? "bg-orange-500 hover:bg-orange-600 shrink-0" : "bg-white shrink-0"}
                                onClick={() => { setActiveCategory(c.id); setActiveSubcategory(null); setShowOnlyFavs(false); }}
                                size="sm"
                            >
                                <span className="mr-1">{c.icon}</span> {c.name}
                            </Button>
                        ))}
                        {/* おすすめ商品タブ */}
                        <Button
                            variant={activeCategory === "recommended" ? "default" : "outline"}
                            className={activeCategory === "recommended" ? "bg-orange-500 hover:bg-orange-600 shrink-0" : "bg-white shrink-0"}
                            onClick={() => { setActiveCategory("recommended"); setActiveSubcategory(null); setShowOnlyFavs(false); }}
                            size="sm"
                        >
                            <span className="mr-1">👍</span> おすすめ
                        </Button>
                        <div className="ml-auto flex items-center gap-2 pl-2 border-l shrink-0">
                            <Button
                                variant={showOnlyFavs ? "default" : "ghost"}
                                size="sm"
                                onClick={() => { setShowOnlyFavs(true); setActiveCategory("all"); setActiveSubcategory(null); }}
                                className={showOnlyFavs ? "bg-amber-500 hover:bg-amber-600 text-white" : "text-gray-500"}
                            >
                                <Star className={`h-4 w-4 mr-1 ${showOnlyFavs ? "fill-current" : ""}`} />
                                お気に入り
                            </Button>
                        </div>
                    </div>
                    {/* Mobile Subcategories */}
                    {activeCatData?.subcategories && activeCatData.subcategories.length > 0 && (
                        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide items-center pl-1">
                            <Button
                                variant={!activeSubcategory ? "secondary" : "outline"}
                                className={`shrink-0 h-7 text-xs px-3 rounded-full ${!activeSubcategory ? "bg-orange-100 text-orange-900 border-none font-bold" : "bg-white text-gray-500 border-dashed"}`}
                                onClick={() => setActiveSubcategory(null)}
                            >
                                すべて
                            </Button>
                            {activeCatData.subcategories.map(sub => (
                                <Button
                                    key={sub.id}
                                    variant={activeSubcategory === sub.id ? "secondary" : "outline"}
                                    className={`shrink-0 h-7 text-xs px-3 rounded-full transition-colors ${activeSubcategory === sub.id ? "bg-orange-500 text-white border-orange-500 font-bold" : "bg-white text-gray-600"}`}
                                    onClick={() => setActiveSubcategory(sub.id)}
                                >
                                    {sub.name}
                                </Button>
                            ))}
                        </div>
                    )}
                </div>

                {/* トップセクション（全表示・検索なし時のみ） */}
                {isInTopSection && (
                    <div className="space-y-8">
                        {/* おすすめ商品 */}
                        {recommendedProducts.length > 0 && (
                            <HorizontalSection
                                title="あなたへのおすすめ"
                                icon={<Sparkles className="w-4 h-4" />}
                                products={recommendedProducts}
                                accentColor="orange"
                                onMore={() => setActiveCategory("recommended")}
                            />
                        )}

                        {/* セール品 */}
                        {saleProducts.length > 0 && (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h2 className="flex items-center gap-2 text-base font-bold text-gray-900">
                                        <span className="p-1.5 rounded-lg bg-red-100 text-red-600">
                                            <Tag className="w-4 h-4" />
                                        </span>
                                        セール・特価品
                                        <Badge className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 ml-1">SALE</Badge>
                                    </h2>
                                </div>
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {saleProducts.map(product => (
                                        <div key={product.id} className="flex-shrink-0 w-44">
                                            <ProductCard product={product} compact />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ピックアップ */}
                        {pickupProducts.length > 0 && (
                            <HorizontalSection
                                title="ピックアップ商品"
                                icon={<Zap className="w-4 h-4" />}
                                products={pickupProducts}
                                accentColor="blue"
                            />
                        )}

                        {/* 区切り */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-xs text-gray-400 font-medium px-2">全商品</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>
                    </div>
                )}

                {/* おすすめカテゴリ選択時の説明 */}
                {activeCategory === "recommended" && (
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-orange-800">あなたへのおすすめ商品</p>
                            <p className="text-xs text-orange-600 mt-0.5">
                                {quotes.filter(q => q.userId === user.id).length > 0
                                    ? "過去の見積もり履歴をもとに、おすすめ商品を表示しています"
                                    : "人気のピックアップ商品を表示しています"}
                            </p>
                        </div>
                    </div>
                )}

                {/* 商品グリッド */}
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed text-gray-500">
                        <div className="text-4xl mb-4 opacity-50">🔍</div>
                        <h3 className="text-lg font-medium text-gray-900">商品が見つかりません</h3>
                        <p className="text-sm mt-1">検索条件やカテゴリを変更して再度お試しください</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => { setSearch(""); setActiveCategory("all"); setActiveSubcategory(null); setShowOnlyFavs(false); }}
                        >
                            条件をクリア
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                        {filteredProducts.map(product => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                <ProductDialog
                    product={selectedProduct}
                    open={detailOpen}
                    onOpenChange={setDetailOpen}
                />
            </div>
        </div>
    );
}

