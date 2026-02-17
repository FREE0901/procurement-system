"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { USERS } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Lock, Mail } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const login = useStore((state) => state.login);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = (e?: React.FormEvent) => {
        e?.preventDefault();
        const user = USERS.find((u) => u.email === email && u.password === password);
        if (user) {
            login(user.email);
            if (user.isAdmin) {
                router.push("/admin/dashboard");
            } else {
                router.push("/client/products");
            }
        } else {
            setError("メールアドレスまたはパスワードが正しくありません");
        }
    };

    const demoLogin = (u: typeof USERS[0]) => {
        setEmail(u.email);
        setPassword(u.password || "");
        // Auto submit after a short delay for visual feedback
        setTimeout(() => {
            login(u.email);
            if (u.isAdmin) {
                router.push("/admin/dashboard");
            } else {
                router.push("/client/products");
            }
        }, 500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-white/95 backdrop-blur">
                <CardHeader className="text-center space-y-2 pb-6">
                    <div className="mx-auto w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2">
                        <span className="text-white text-3xl font-bold">T</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">戸高工業所</CardTitle>
                    <CardDescription>部材見積もり依頼システム</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>}
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                メールアドレス
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                パスワード
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className="pl-9"
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                                />
                            </div>
                        </div>
                        <Button className="w-full bg-orange-500 hover:bg-orange-600" onClick={handleLogin}>
                            ログイン
                        </Button>
                    </div>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white/95 px-2 text-muted-foreground">デモアカウント</span>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        {USERS.map((u) => (
                            <Button
                                key={u.id}
                                variant="outline"
                                className="justify-between h-auto py-3 px-4 hover:bg-slate-50"
                                onClick={() => demoLogin(u)}
                            >
                                <div className="flex flex-col items-start">
                                    <span className="font-semibold text-xs">{u.company}</span>
                                    <span className="text-[10px] text-muted-foreground">{u.email}</span>
                                </div>
                                <Badge
                                    variant="secondary"
                                    className={
                                        u.isAdmin
                                            ? "bg-slate-800 text-white hover:bg-slate-700"
                                            : u.rank === 1
                                                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                : u.rank === 2
                                                    ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
                                                    : "bg-amber-100 text-amber-700 hover:bg-amber-200"
                                    }
                                >
                                    {u.rankName}
                                </Badge>
                            </Button>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
