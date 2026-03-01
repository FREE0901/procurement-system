"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Product, Rank } from "@/lib/types";
import { CATEGORIES } from "@/lib/mockData";

interface AdminProductDialogProps {
    product: Product | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave: (product: Product) => void;
}

export function AdminProductDialog({ product, open, onOpenChange, onSave }: AdminProductDialogProps) {
    const [formData, setFormData] = useState<Partial<Product>>({
        name: "",
        code: "",
        category: "",
        minRank: 1,
        unit: "個",
        sizes: [],
        prices: {},
        image: "https://placehold.co/400x300/e8e8e8/666?text=New+Product",
    });

    useEffect(() => {
        if (open) {
            if (product) {
                setFormData({ ...product });
            } else {
                setFormData({
                    name: "",
                    code: "",
                    category: "c1",
                    subcategoryId: "c1-1",
                    minRank: 1,
                    unit: "個",
                    sizes: [],
                    prices: {},
                    image: "https://placehold.co/400x300/e8e8e8/666?text=New+Product",
                    isPickup: false,
                    saleRate: 0,
                });
            }
        }
    }, [open, product]);

    const handleCategoryChange = (catId: string) => {
        const cat = CATEGORIES.find(c => c.id === catId);
        const subId = cat?.subcategories ? cat.subcategories[0].id : undefined;
        setFormData(prev => ({ ...prev, category: catId, subcategoryId: subId }));
    };

    const activeCat = CATEGORIES.find(c => c.id === formData.category);

    const handleChange = (field: keyof Product, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Validate basic fields
        if (!formData.name || !formData.code || !formData.category) {
            alert("必須項目を入力してください");
            return;
        }

        // Construct final product object
        const newProduct = {
            id: product ? product.id : `p-${Date.now()}`,
            ...formData,
        } as Product;

        onSave(newProduct);
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{product ? "商品編集" : "新規商品登録"}</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>商品名 *</Label>
                            <Input
                                value={formData.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                                placeholder="例: ステンレスエルボ"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>型番 *</Label>
                            <Input
                                value={formData.code}
                                onChange={(e) => handleChange("code", e.target.value)}
                                placeholder="例: SUS-EL-01"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>カテゴリ *</Label>
                            <Select
                                value={formData.category}
                                onValueChange={handleCategoryChange}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="カテゴリ選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(c => (
                                        <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        {activeCat?.subcategories && activeCat.subcategories.length > 0 && (
                            <div className="space-y-2">
                                <Label>小カテゴリ</Label>
                                <Select
                                    value={formData.subcategoryId || ""}
                                    onValueChange={(val) => handleChange("subcategoryId", val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="小カテゴリ選択" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {activeCat.subcategories.map(s => (
                                            <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        )}
                        <div className="space-y-2">
                            <Label>公開ランク *</Label>
                            <Select
                                value={String(formData.minRank)}
                                onValueChange={(val) => handleChange("minRank", parseInt(val))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="ランク選択" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="1">スタンダード以上</SelectItem>
                                    <SelectItem value="2">プレミアム以上</SelectItem>
                                    <SelectItem value="3">VIPのみ</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>単位</Label>
                            <Input
                                value={formData.unit}
                                onChange={(e) => handleChange("unit", e.target.value)}
                                placeholder="個, 台, m, set"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>画像URL</Label>
                            <Input
                                value={formData.image}
                                onChange={(e) => handleChange("image", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex items-center space-x-2 pt-8">
                            <input
                                type="checkbox"
                                id="isPickup"
                                checked={!!formData.isPickup}
                                onChange={(e) => handleChange("isPickup", e.target.checked)}
                                className="w-4 h-4 text-orange-600 rounded border-gray-300 focus:ring-orange-500"
                            />
                            <Label htmlFor="isPickup">ピックアップ商品として表示</Label>
                        </div>
                        <div className="space-y-2">
                            <Label>割引率 (セール) %</Label>
                            <Input
                                type="number"
                                min={0}
                                max={100}
                                value={formData.saleRate || 0}
                                onChange={(e) => handleChange("saleRate", parseInt(e.target.value) || 0)}
                                placeholder="例: 10 (10%OFF)"
                            />
                        </div>
                    </div>

                    {/* Sizes and Prices would be complex UI, skipping for demo simplicity */}
                    <div className="p-4 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                        ※ サイズ・価格設定の詳細は、このデモでは省略されています。
                        （保存時に既存データは保持されます）
                    </div>

                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>キャンセル</Button>
                    <Button onClick={handleSave} className="bg-orange-500 hover:bg-orange-600">保存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
