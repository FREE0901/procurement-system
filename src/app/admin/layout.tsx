"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { LogOut, LayoutDashboard, Package, Users, FileText } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useStore();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (mounted && (!user || !user.isAdmin)) {
        router.push("/login");
        return null;
    }

    if (!mounted) return null;

    const navItems = [
        { href: "/admin/dashboard", label: "ダッシュボード", icon: <LayoutDashboard className="w-4 h-4" /> },
        { href: "/admin/products", label: "商品管理", icon: <Package className="w-4 h-4" /> },
        { href: "/admin/customers", label: "顧客管理", icon: <Users className="w-4 h-4" /> },
        { href: "/admin/quotes", label: "見積もり管理", icon: <FileText className="w-4 h-4" /> },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="sticky top-0 z-50 w-full bg-slate-900 text-white shadow-md">
                <div className="container mx-auto px-4 h-14 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <div className="w-7 h-7 bg-orange-500 rounded flex items-center justify-center">
                                <span className="text-white font-bold text-xs">T</span>
                            </div>
                            <span className="font-bold text-sm">管理画面</span>
                        </div>
                        <nav className="hidden md:flex items-center gap-1">
                            {navItems.map(item => (
                                <Link key={item.href} href={item.href}>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className={`gap-2 h-9 text-xs font-medium ${pathname === item.href
                                                ? "bg-white/10 text-white hover:bg-white/20"
                                                : "text-slate-300 hover:text-white hover:bg-white/5"
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </Button>
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => { logout(); router.push("/login"); }}
                        className="text-slate-400 hover:text-white hover:bg-white/5"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        ログアウト
                    </Button>
                </div>
            </header>

            {/* Mobile Nav */}
            <div className="md:hidden bg-slate-800 p-2 flex overflow-x-auto gap-2">
                {navItems.map(item => (
                    <Link key={item.href} href={item.href}>
                        <Button
                            variant="ghost"
                            size="sm"
                            className={`gap-2 text-xs whitespace-nowrap ${pathname === item.href
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400"
                                }`}
                        >
                            {item.icon}
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </div>

            <main className="container mx-auto p-4 sm:p-6 pb-20">
                {children}
            </main>
        </div>
    );
}
