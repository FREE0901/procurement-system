"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Quote, QuoteStatus } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Eye, MapPin, FileText } from "lucide-react";
import { useState } from "react";

export default function AdminQuotesPage() {
    const { quotes, updateQuoteStatus } = useStore();
    const [viewQuote, setViewQuote] = useState<Quote | null>(null);

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

    const fmt = (n: number) => (n === 0 || !n ? "ー" : `¥${n.toLocaleString()}`);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900">見積もり依頼管理</h1>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead>依頼番号</TableHead>
                            <TableHead>日付</TableHead>
                            <TableHead>顧客名</TableHead>
                            <TableHead>ランク</TableHead>
                            <TableHead>品目数</TableHead>
                            <TableHead>ステータス</TableHead>
                            <TableHead>操作</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {quotes.map(q => (
                            <TableRow key={q.id} className="hover:bg-gray-50/50">
                                <TableCell className="font-mono font-medium">{q.id}</TableCell>
                                <TableCell className="text-gray-500">{q.date}</TableCell>
                                <TableCell className="font-medium">{q.company}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">{q.userRank === 1 ? "Standard" : q.userRank === 2 ? "Premium" : "VIP"}</Badge>
                                </TableCell>
                                <TableCell>{q.items.length}</TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={statusColor(q.status)}>
                                        {q.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="flex gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-500 hover:text-orange-600 hover:bg-orange-50"
                                        onClick={() => setViewQuote(q)}
                                    >
                                        <Eye className="w-4 h-4" />
                                    </Button>
                                    <Select
                                        defaultValue={q.status}
                                        onValueChange={(val) => updateQuoteStatus(q.id, val as QuoteStatus)}
                                    >
                                        <SelectTrigger className="w-[110px] h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="新規">新規</SelectItem>
                                            <SelectItem value="依頼中">依頼中</SelectItem>
                                            <SelectItem value="対応中">対応中</SelectItem>
                                            <SelectItem value="回答済">回答済</SelectItem>
                                            <SelectItem value="受注済">受注済</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={!!viewQuote} onOpenChange={(open) => !open && setViewQuote(null)}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            見積もり依頼詳細
                            <span className="font-mono text-base font-normal text-gray-500">#{viewQuote?.id}</span>
                        </DialogTitle>
                    </DialogHeader>

                    {viewQuote && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
                                <div>
                                    <div className="text-gray-500 text-xs mb-1">顧客情報</div>
                                    <div className="font-bold">{viewQuote.company}</div>
                                    <div className="text-gray-600 mt-1 flex items-start gap-1">
                                        <MapPin className="w-3 h-3 mt-0.5" />
                                        {viewQuote.shippingAddress || "住所登録なし"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-gray-500 text-xs mb-1">依頼情報</div>
                                    <div>依頼日: {viewQuote.date}</div>
                                    <div className="flex items-center gap-2 mt-1">
                                        ステータス:
                                        <Badge variant="secondary" className={statusColor(viewQuote.status)}>
                                            {viewQuote.status}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="font-bold mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" /> 依頼明細
                                </h3>
                                <div className="border rounded-md overflow-hidden">
                                    <Table>
                                        <TableHeader className="bg-gray-50">
                                            <TableRow>
                                                <TableHead>商品</TableHead>
                                                <TableHead>単価(参考)</TableHead>
                                                <TableHead>数量</TableHead>
                                                <TableHead className="text-right">小計(参考)</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {viewQuote.items.map((item, i) => (
                                                <TableRow key={i}>
                                                    <TableCell>
                                                        <div className="font-medium">{item.name}</div>
                                                        <div className="text-xs text-gray-500">サイズ: {item.size} / {item.code}</div>
                                                    </TableCell>
                                                    <TableCell>{fmt(item.price)}</TableCell>
                                                    <TableCell>{item.qty} {item.unit}</TableCell>
                                                    <TableCell className="text-right font-mono">{fmt(item.price * item.qty)}</TableCell>
                                                </TableRow>
                                            ))}
                                            <TableRow className="bg-gray-50 font-bold">
                                                <TableCell colSpan={3} className="text-right">合計 (参考)</TableCell>
                                                <TableCell className="text-right">{fmt(viewQuote.total)}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>

                            {viewQuote.note && (
                                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 text-sm">
                                    <div className="font-bold text-yellow-800 mb-1">備考・要望</div>
                                    <p className="text-yellow-900 whitespace-pre-wrap">{viewQuote.note}</p>
                                </div>
                            )}
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setViewQuote(null)}>閉じる</Button>
                        <Button className="bg-orange-500 hover:bg-orange-600">見積書作成へ進む</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

