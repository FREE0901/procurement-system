"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Mail, Plus, MapPin, FileText } from "lucide-react";

export default function AdminCustomersPage() {
    const { users, quotes } = useStore();
    const customers = users.filter(u => !u.isAdmin);

    const getQuoteCount = (userId: string) => quotes.filter(q => q.userId === userId).length;

    const rankColor = (r: number) => {
        switch (r) {
            case 1: return "bg-gray-100 text-gray-700";
            case 2: return "bg-blue-100 text-blue-700";
            case 3: return "bg-amber-100 text-amber-700";
            default: return "bg-gray-100";
        }
    };

    const rankLabel = (r: number) => {
        switch (r) {
            case 1: return "スタンダード";
            case 2: return "プレミアム";
            case 3: return "VIP";
            default: return "-";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">顧客管理</h1>
                <Button className="bg-orange-500 hover:bg-orange-600 gap-2">
                    <Plus className="w-4 h-4" /> 顧客を招待
                </Button>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead>会社名 / 担当者</TableHead>
                            <TableHead>連絡先 / 住所</TableHead>
                            <TableHead>ランク</TableHead>
                            <TableHead>ステータス</TableHead>
                            <TableHead>実績</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {customers.map(c => (
                            <TableRow key={c.id} className="hover:bg-gray-50/50">
                                <TableCell>
                                    <div className="font-bold text-gray-900">{c.company}</div>
                                    <div className="text-sm text-gray-500">{c.name} 様</div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm flex items-center gap-1 mb-1">
                                        <Mail className="w-3 h-3 text-gray-400" /> {c.email}
                                    </div>
                                    {c.shippingAddress && (
                                        <div className="text-xs text-gray-500 flex items-start gap-1">
                                            <MapPin className="w-3 h-3 text-gray-400 mt-0.5 shrink-0" />
                                            {c.shippingAddress}
                                        </div>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="secondary" className={rankColor(c.rank)}>
                                        {rankLabel(c.rank)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={c.status === "有効" ? "border-green-200 text-green-700 bg-green-50" : "bg-gray-100"}>
                                        {c.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm">
                                        <div className="flex items-center gap-1">
                                            <FileText className="w-3 h-3 text-gray-400" />
                                            見積: {getQuoteCount(c.id)}件
                                        </div>
                                        <div className="text-xs text-gray-400 mt-0.5">最終: {c.lastOrder || "-"}</div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">詳細</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}

