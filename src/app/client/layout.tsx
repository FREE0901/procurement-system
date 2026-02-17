"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, LogOut, Package, History } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, cart, logout } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (!user) {
            // Allow a brief moment for hydration, but if no user, redirect
            // Ideally we check hydration state. For now, rely on mounted check + user check.
            // If we want to be strict: router.push("/login");
        }
    }, [user, router]);

    // Protect route
    if (mounted && !user) {
        router.push("/login");
        return null;
    }

    // If user is admin trying to access client, redirect (optional, but good practice)
    if (mounted && user?.isAdmin) {
        router.push("/admin/dashboard");
        return null;
    }

    if (!mounted) return null; // Prevent hydration mismatch

    const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <Link href="/client/products" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">T</span>
                            </div>
                            <span className="font-bold text-gray-800 hidden md:block">戸高工業所</span>
                        </Link>
                        <nav className="hidden md:flex items-center gap-1">
                            <Link href="/client/products">
                                <Button variant={pathname === "/client/products" ? "secondary" : "ghost"} size="sm" className="gap-2">
                                    <Package className="w-4 h-4" />
                                    商品一覧
                                </Button>
                            </Link>
                            <Link href="/client/history">
                                <Button variant={pathname === "/client/history" ? "secondary" : "ghost"} size="sm" className="gap-2">
                                    <History className="w-4 h-4" />
                                    見積履歴
                                </Button>
                            </Link>
                        </nav>
                    </div>

                    <div className="flex items-center gap-4">
                        <Link href="/client/cart">
                            <Button variant="ghost" size="icon" className="relative">
                                <ShoppingCart className="w-5 h-5" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                                    <Avatar className="h-8 w-8">
                                        <AvatarFallback className="bg-orange-100 text-orange-600 font-bold">
                                            {user?.name.charAt(0)}
                                        </AvatarFallback>
                                    </Avatar>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-56" align="end" forceMount>
                                <DropdownMenuLabel className="font-normal">
                                    <div className="flex flex-col space-y-1">
                                        <p className="text-sm font-medium leading-none">{user?.name}</p>
                                        <p className="text-xs leading-none text-muted-foreground">
                                            {user?.company}
                                        </p>
                                    </div>
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <div className="p-2">
                                    <Badge variant="outline" className={`w-full justify-center ${user?.rank === 1 ? "bg-gray-100 text-gray-700" :
                                        user?.rank === 2 ? "bg-blue-100 text-blue-700" :
                                            "bg-amber-100 text-amber-700"
                                        }`}>
                                        {user?.rankName}ランク
                                    </Badge>
                                </div>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => { logout(); router.push("/login"); }} className="text-red-600 focus:text-red-600 cursor-pointer">
                                    <LogOut className="mr-2 h-4 w-4" />
                                    ログアウト
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>
            </header>
            <main className="container mx-auto p-4 sm:p-6 pb-20">
                {children}
            </main>

            <footer className="bg-slate-900 text-slate-400 py-12 md:pb-12 pb-24 border-t border-slate-800">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">T</span>
                                </div>
                                <span className="font-bold text-white text-lg">戸高工業所</span>
                            </div>
                            <p className="text-sm opacity-80">
                                確かな技術と信頼で<br />
                                産業を支えるパートナー
                            </p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">商品カテゴリ</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-orange-500 transition">継手・フィッティング</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition">バルブ</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition">フランジ</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition">パイプ・管材</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">サポート</h4>
                            <ul className="space-y-2 text-sm">
                                <li><a href="#" className="hover:text-orange-500 transition">ご利用ガイド</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition">よくある質問</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition">お問い合わせ</a></li>
                                <li><a href="#" className="hover:text-orange-500 transition">特定商取引法に基づく表記</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-4">お問い合わせ</h4>
                            <p className="text-sm mb-2">TEL: 03-1234-5678</p>
                            <p className="text-sm mb-4">平日 9:00 - 18:00</p>
                            <Button className="w-full bg-slate-800 border border-slate-700 hover:bg-slate-700">お問合せフォーム</Button>
                        </div>
                    </div>
                    <div className="pt-8 border-t border-slate-800 text-center text-xs opacity-60">
                        &copy; 2026 Todaka Kogyosho Co., Ltd. All Rights Reserved.
                    </div>
                </div>
            </footer>

            {/* Mobile Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t p-2 flex justify-around z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                <Link href="/client/products" className="flex-1">
                    <Button variant="ghost" className={`w-full flex-col h-auto py-2 gap-1 ${pathname === "/client/products" ? "text-orange-600" : "text-gray-500"}`}>
                        <Package className="w-5 h-5" />
                        <span className="text-[10px]">一覧</span>
                    </Button>
                </Link>
                <Link href="/client/cart" className="flex-1 relative">
                    <Button variant="ghost" className={`w-full flex-col h-auto py-2 gap-1 ${pathname === "/client/cart" ? "text-orange-600" : "text-gray-500"}`}>
                        <div className="relative">
                            <ShoppingCart className="w-5 h-5" />
                            {cartCount > 0 && (
                                <span className="absolute -top-2 -right-2 w-4 h-4 bg-orange-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span className="text-[10px]">カート</span>
                    </Button>
                </Link>
                <Link href="/client/history" className="flex-1">
                    <Button variant="ghost" className={`w-full flex-col h-auto py-2 gap-1 ${pathname === "/client/history" ? "text-orange-600" : "text-gray-500"}`}>
                        <History className="w-5 h-5" />
                        <span className="text-[10px]">履歴</span>
                    </Button>
                </Link>
            </div>
        </div>
    );
}
