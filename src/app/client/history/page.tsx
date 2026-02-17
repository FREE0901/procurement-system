"use client";

import { useStore } from "@/lib/store";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuoteStatus } from "@/lib/types";

export default function HistoryPage() {
    const { user, quotes } = useStore();

    if (!user) return null;

    // Filter quotes for current user
    const myQuotes = quotes.filter(q => q.userId === user.id);

    const statusColor = (s: QuoteStatus) => {
        switch (s) {
            case "新規": return "bg-blue-100 text-blue-700 hover:bg-blue-200";
            case "依頼中": return "bg-yellow-100 text-yellow-700 hover:bg-yellow-200";
            case "対応中": return "bg-purple-100 text-purple-700 hover:bg-purple-200";
            case "回答済": return "bg-green-100 text-green-700 hover:bg-green-200";
            case "受注済": return "bg-gray-100 text-gray-700 hover:bg-gray-200";
            default: return "bg-gray-100";
        }
    };

    const fmt = (n: number) => (n === 0 || !n ? "ー" : `¥${n.toLocaleString()}`);

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">見積もり履歴</h1>

            {myQuotes.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-dashed">
                    <p className="text-gray-500">まだ見積もり依頼の履歴がありません</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {myQuotes.map(q => (
                        <Card key={q.id} className="overflow-hidden hover:shadow-md transition-shadow">
                            <CardHeader className="bg-gray-50/50 py-3 px-4 border-b">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="font-mono font-medium text-gray-700">#{q.id}</span>
                                        <span className="text-xs text-gray-400">{q.date}</span>
                                    </div>
                                    <Badge variant="secondary" className={statusColor(q.status)}>
                                        {q.status}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="p-4">
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <p className="text-sm text-gray-600">{q.items.length} 品目</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs text-gray-400 block">参考合計</span>
                                        <span className="font-bold text-gray-900">{fmt(q.total)}</span>
                                    </div>
                                </div>

                                <div className="bg-gray-50/50 rounded-lg p-3 text-sm space-y-2">
                                    {q.items.slice(0, 3).map((item, idx) => (
                                        <div key={idx} className="flex justify-between text-gray-600">
                                            <span className="truncate max-w-[200px]">{item.name}</span>
                                            <span className="text-xs font-mono">x{item.qty}</span>
                                        </div>
                                    ))}
                                    {q.items.length > 3 && (
                                        <p className="text-xs text-gray-400 text-center pt-1">+ 他 {q.items.length - 3} 点</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
