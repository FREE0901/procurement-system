"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function AccountPage() {
    const { user, updateUserAddress } = useStore();
    const [address, setAddress] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (user?.shippingAddress) {
            setAddress(user.shippingAddress);
        }
    }, [user]);

    if (!user) return null;

    const handleSave = () => {
        setIsSaving(true);
        updateUserAddress(address);
        setMessage("登録住所を更新しました。");
        setTimeout(() => {
            setIsSaving(false);
            setMessage("");
        }, 3000);
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">アカウント設定</h1>
                <p className="text-sm text-gray-500 mt-1">登録情報やお届け先住所の管理を行えます。</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>基本情報</CardTitle>
                    <CardDescription>お客様の基本情報です。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <Label className="text-gray-500">会社名</Label>
                            <p className="font-medium">{user.company || "未登録"}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-500">担当者名</Label>
                            <p className="font-medium">{user.name}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-500">メールアドレス</Label>
                            <p className="font-medium">{user.email}</p>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-gray-500">会員ランク</Label>
                            <div className="flex items-center gap-2">
                                <span className={`px-2 py-0.5 rounded text-xs font-bold ${user.rank === 1 ? "bg-gray-100 text-gray-700" :
                                        user.rank === 2 ? "bg-blue-100 text-blue-700" :
                                            "bg-amber-100 text-amber-700"
                                    }`}>
                                    {user.rankName}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>お届け先の管理</CardTitle>
                    <CardDescription>見積もり依頼時に自動入力される配送先住所を設定できます。</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="address">登録住所（標準の配送先）</Label>
                        <Textarea
                            id="address"
                            placeholder="東京都大田区蒲田X-Y-Z 〇〇ビル 階数"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className="min-h-[100px]"
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-orange-500 hover:bg-orange-600"
                        >
                            {isSaving ? "保存中..." : "住所を保存する"}
                        </Button>
                        {message && (
                            <span className="text-sm text-green-600 font-medium">{message}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
