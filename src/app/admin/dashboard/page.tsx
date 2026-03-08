"use client";

import { useStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { QuoteStatus } from "@/lib/types";
import { TrendingUp, Users, Package, FileText } from "lucide-react";

export default function AdminDashboard() {
    const { quotes, users, products } = useStore();

    const totalQuotes = quotes.length;
    // Mock calculation just for demo
    const totalAmount = quotes.reduce((acc, q) => acc + q.total, 0);
    const activeUsers = users.filter(u => u.status === "有効" && !u.isAdmin).length;
    const productCount = products.length;

    const statCards = [
        { label: "今月の見積依頼", value: totalQuotes, sub: "前月比 +15%", icon: <FileText className="w-4 h-4" />, color: "bg-gradient-to-br from-orange-400 to-orange-600" },
        { label: "参考合計金額", value: `¥${(totalAmount / 1000000).toFixed(1)}M`, sub: "今月累計", icon: <TrendingUp className="w-4 h-4" />, color: "bg-gradient-to-br from-blue-400 to-blue-600" },
        { label: "アクティブ顧客", value: activeUsers, sub: `全${users.length - 1}社中`, icon: <Users className="w-4 h-4" />, color: "bg-gradient-to-br from-green-400 to-green-600" },
        { label: "登録商品数", value: productCount, sub: "14カテゴリ", icon: <Package className="w-4 h-4" />, color: "bg-gradient-to-br from-purple-400 to-purple-600" },
    ];

    const statusColor = (s: QuoteStatus) => {
        switch (s) {
            case "新規": return "bg-blue-100 text-blue-700";
            case "依頼中": return "bg-yellow-100 text-yellow-700";
            case "対応中": return "bg-purple-100 text-purple-700";
            case "回答済": return "bg-green-100 text-green-700";
            case "受注済": return "bg-gray-100 text-gray-700";
            default: return "bg-gray-100";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">ダッシュボード</h1>
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">期間:</span>
                    <Select defaultValue="this_month">
                        <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue placeholder="期間を選択" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="today">今日</SelectItem>
                            <SelectItem value="this_week">今週</SelectItem>
                            <SelectItem value="this_month">今月</SelectItem>
                            <SelectItem value="last_month">先月</SelectItem>
                            <SelectItem value="this_year">今年</SelectItem>
                            <SelectItem value="custom">カスタム期間...</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, i) => (
                    <Card key={i} className={`${stat.color} text-white border-none shadow-lg`}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between mb-2 opacity-80">
                                <span className="text-sm font-medium">{stat.label}</span>
                                {stat.icon}
                            </div>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <div className="text-xs opacity-60 mt-1">{stat.sub}</div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">最近の見積もり依頼</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {quotes.slice(0, 5).map(q => (
                                <div key={q.id} className="flex items-center justify-between py-2 border-b last:border-0 border-gray-100">
                                    <div>
                                        <div className="font-medium text-sm text-gray-900">{q.company}</div>
                                        <div className="text-xs text-gray-400">{q.date}</div>
                                    </div>
                                    <Badge variant="secondary" className={statusColor(q.status)}>
                                        {q.status}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">月間依頼推移</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {(() => {
                            const data = [45, 62, 38, 71, 55, 68, 82, 59, 73, 61, 88];
                            const maxVal = Math.max(...data);
                            const BAR_AREA = 160; // px available for bars (200px total - ~20px label - ~20px padding)
                            return (
                                <div className="h-[200px] flex items-end justify-between gap-2 px-2">
                                    {data.map((v, i) => {
                                        const barH = Math.round((v / maxVal) * BAR_AREA);
                                        return (
                                            <div key={i} className="flex-1 flex flex-col items-center gap-1 group cursor-pointer">
                                                <div
                                                    className="w-full bg-orange-100 rounded-t relative transition-all group-hover:bg-orange-200"
                                                    style={{ height: `${barH}px` }}
                                                >
                                                    <div className="absolute bottom-0 w-full bg-orange-500 rounded-t opacity-80 group-hover:opacity-100 transition-all h-full" />
                                                </div>
                                                <span className="text-[10px] text-gray-400">{i + 1}月</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })()}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
