"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, ArrowRight, MapPin, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

export default function CartPage() {
    const { cart, removeFromCart, clearCart, updateCartQty, submitQuote, user, updateUserAddress } = useStore();
    const router = useRouter();
    const [note, setNote] = useState("");
    const [address, setAddress] = useState("");
    const [saveAddress, setSaveAddress] = useState(false);
    const [desiredDelivery, setDesiredDelivery] = useState("");
    const [company, setCompany] = useState("");
    const [personInCharge, setPersonInCharge] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (user) {
            if (user.shippingAddress) {
                setAddress(user.shippingAddress);
                setSaveAddress(true);
            }
            if (user.company) setCompany(user.company);
            if (user.name) setPersonInCharge(user.name);
        }
    }, [user]);

    const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
    const fmt = (n: number) => (n === 0 || !n ? "ー" : `¥${n.toLocaleString()}`);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 800));
        if (saveAddress) {
            updateUserAddress(address);
        }
        submitQuote(note, address, desiredDelivery, company, personInCharge);
        router.push("/client/history");
    };

    if (cart.length === 0 && !isSubmitting) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                <div className="bg-gray-50 p-4 rounded-full mb-4">
                    <Trash2 className="w-8 h-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-2">カートは空です</h2>
                <p className="text-gray-500 mb-6">商品詳細ページから見積もりを追加してください</p>
                <Button onClick={() => router.push("/client/products")} className="bg-orange-500 hover:bg-orange-600">
                    商品一覧に戻る
                </Button>
            </div>
        );
    }

    return (
        <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
                <Card className="border-none shadow-md overflow-hidden">
                    <CardHeader className="bg-gray-50/50 border-b pb-4">
                        <CardTitle className="text-lg flex items-center gap-2">
                            見積もり対象商品
                            <span className="text-sm font-normal text-gray-500 ml-2">({cart.length}点)</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[100px] pl-6">画像</TableHead>
                                    <TableHead>商品情報</TableHead>
                                    <TableHead>単価(参考)</TableHead>
                                    <TableHead className="w-[100px]">数量</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {cart.map((item, idx) => (
                                    <TableRow key={`${item.productId}-${item.size}`} className="hover:bg-gray-50/50">
                                        <TableCell className="pl-6 py-4">
                                            <div className="w-16 h-16 bg-gray-100 rounded-md overflow-hidden border border-gray-100">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="font-bold text-gray-900">{item.name}</div>
                                            <div className="text-xs text-gray-500 font-mono mt-1">{item.code}</div>
                                            <div className="text-xs text-orange-600 mt-1 bg-orange-50 w-fit px-1.5 py-0.5 rounded">
                                                サイズ: {item.size}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-gray-600 font-mono">
                                            {fmt(item.price)}
                                        </TableCell>
                                        <TableCell>
                                            <Input
                                                type="number"
                                                min={1}
                                                className="w-16 h-8 text-center"
                                                value={item.qty}
                                                onChange={(e) => updateCartQty(idx, parseInt(e.target.value) || 0)}
                                            />
                                            <div className="text-center text-xs text-gray-400 mt-1">{item.unit}</div>
                                        </TableCell>
                                        <TableCell className="pr-6">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="text-gray-400 hover:text-red-500 hover:bg-red-50 h-8 w-8"
                                                onClick={() => removeFromCart(idx)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

            <div className="lg:col-span-1">
                <Card className="sticky top-24 border-none shadow-xl bg-slate-900 text-white">
                    <CardHeader className="pb-4">
                        <CardTitle>ご依頼内容の確認</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-5">
                        {/* 金額サマリー */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm text-slate-300">
                                <span>商品合計 (参考)</span>
                                <span>{fmt(total)}</span>
                            </div>
                            <div className="border-t border-slate-700 pt-2 flex justify-between font-bold text-lg">
                                <span>合計金額 (概算)</span>
                                <span className="text-orange-400">{fmt(total)}</span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">※ 正式な金額は回答時にお知らせします</p>
                        </div>

                        {/* 希望納期 */}
                        <div className="space-y-2 pt-4 border-t border-slate-700">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-orange-500" />
                                希望納期
                            </Label>
                            <Input
                                type="date"
                                className="bg-slate-800 border-slate-700 text-white [color-scheme:dark]"
                                value={desiredDelivery}
                                onChange={(e) => setDesiredDelivery(e.target.value)}
                                min={new Date().toISOString().split("T")[0]}
                            />
                            <p className="text-[10px] text-slate-400">※ ご要望に添えない場合もございます</p>
                        </div>

                        {/* 依頼者情報 */}
                        <div className="space-y-3 pt-4 border-t border-slate-700">
                            <Label className="text-sm font-medium">会社名</Label>
                            <Input
                                placeholder="会社名"
                                className="bg-slate-800 border-slate-700 text-white"
                                value={company}
                                onChange={(e) => setCompany(e.target.value)}
                            />

                            <Label className="text-sm font-medium mt-3 block">担当者名</Label>
                            <Input
                                placeholder="担当者名"
                                className="bg-slate-800 border-slate-700 text-white"
                                value={personInCharge}
                                onChange={(e) => setPersonInCharge(e.target.value)}
                            />
                        </div>

                        {/* 納品先住所 */}
                        <div className="space-y-3 pt-4 border-t border-slate-700">
                            <Label className="text-sm font-medium flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-orange-500" />
                                納品先住所
                            </Label>
                            <Textarea
                                placeholder="納品先の住所を入力してください"
                                className="bg-slate-800 border-slate-700 text-white min-h-[80px]"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                            />
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="save-address"
                                    checked={saveAddress}
                                    onCheckedChange={(checked) => setSaveAddress(checked as boolean)}
                                    className="border-slate-500 data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
                                />
                                <Label htmlFor="save-address" className="text-xs text-slate-400 cursor-pointer">
                                    この住所を次回も使用する
                                </Label>
                            </div>
                        </div>

                        {/* 備考 */}
                        <div className="space-y-2">
                            <Label className="text-sm font-medium">備考・ご要望</Label>
                            <Textarea
                                placeholder="特記事項があればご記入ください"
                                className="bg-slate-800 border-slate-700 text-white"
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="pt-2">
                        <Button
                            className="w-full h-12 text-base font-bold bg-orange-500 hover:bg-orange-600 border-none relative overflow-hidden group"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {isSubmitting ? "送信中..." : "見積もり依頼を送信する"}
                                {!isSubmitting && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
                            </span>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
