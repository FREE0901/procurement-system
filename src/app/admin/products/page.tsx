"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CATEGORIES } from "@/lib/mockData";
import { Plus, Search, Edit, ArrowUpDown } from "lucide-react";
import { useState } from "react";
import { Product } from "@/lib/types";
import { AdminProductDialog } from "@/components/admin/AdminProductDialog";

export default function AdminProductsPage() {
    const { products, addProduct } = useStore();
    const [search, setSearch] = useState("");
    const [sortKey, setSortKey] = useState<"name" | "category" | "updated">("updated");

    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Sorting logic (mock updated date just by index order for simplicity, or random)
    const sortedProducts = [...products].sort((a, b) => {
        if (sortKey === "name") return a.name.localeCompare(b.name);
        if (sortKey === "category") return a.category.localeCompare(b.category);
        return 0; // Default order
    });

    const filtered = sortedProducts.filter(p =>
        search === "" ||
        p.name.includes(search) ||
        p.code.toLowerCase().includes(search.toLowerCase())
    );

    const handleEdit = (p: Product) => {
        setEditingProduct(p);
        setDialogOpen(true);
    };

    const handleCreate = () => {
        setEditingProduct(null);
        setDialogOpen(true);
    };

    const handleSave = (product: Product) => {
        if (editingProduct) {
            // Update existing (Store mock action for update is missing, so we'll just add/overwrite for demo or ignore)
            // In a real app we would call updateProduct(product)
            alert("製品情報を更新しました（デモのためデータは永続化されません）");
        } else {
            addProduct(product);
            alert("新規製品を登録しました");
        }
    };

    const rankColor = (r: number) => {
        switch (r) {
            case 1: return "bg-gray-100 text-gray-700";
            case 2: return "bg-blue-100 text-blue-700";
            case 3: return "bg-amber-100 text-amber-700";
            default: return "bg-gray-100";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">商品管理</h1>
                <div className="flex gap-2">
                    <Button variant="outline">CSV一括登録</Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 gap-2" onClick={handleCreate}>
                        <Plus className="w-4 h-4" /> 新規登録
                    </Button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                        placeholder="商品名・型番で検索..."
                        className="pl-9"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <Select value={sortKey} onValueChange={(val: any) => setSortKey(val)}>
                    <SelectTrigger className="w-[180px] bg-white">
                        <ArrowUpDown className="w-4 h-4 mr-2 text-gray-400" />
                        <SelectValue placeholder="並び替え" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="updated">登録順</SelectItem>
                        <SelectItem value="name">商品名順</SelectItem>
                        <SelectItem value="category">カテゴリ順</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[80px]">画像</TableHead>
                            <TableHead>商品名</TableHead>
                            <TableHead>型番</TableHead>
                            <TableHead>カテゴリ</TableHead>
                            <TableHead>公開ランク</TableHead>
                            <TableHead>サイズ数</TableHead>
                            <TableHead className="w-[100px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filtered.map(p => (
                            <TableRow key={p.id} className="hover:bg-gray-50/50">
                                <TableCell>
                                    <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden">
                                        <img src={p.image} alt="" className="w-full h-full object-cover" />
                                    </div>
                                </TableCell>
                                <TableCell className="font-medium">{p.name}</TableCell>
                                <TableCell className="font-mono text-xs text-gray-500">{p.code}</TableCell>
                                <TableCell>{CATEGORIES.find(c => c.id === p.category)?.name}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={rankColor(p.minRank)}>
                                        {p.minRank === 1 ? "Standard" : p.minRank === 2 ? "Premium" : "VIP"}
                                    </Badge>
                                </TableCell>
                                <TableCell>{p.sizes.length}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost" size="sm"
                                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                        onClick={() => handleEdit(p)}
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <AdminProductDialog
                open={dialogOpen}
                onOpenChange={setDialogOpen}
                product={editingProduct}
                onSave={handleSave}
            />
        </div>
    );
}
