"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Mail, Plus, MapPin, FileText, Search, User, Shield } from "lucide-react";
import { useState } from "react";
import { User as UserType, Rank } from "@/lib/types";

export default function AdminCustomersPage() {
    const { users, quotes, updateUserRank } = useStore();
    const customers = users.filter(u => !u.isAdmin);

    const [search, setSearch] = useState("");
    const [detailCustomer, setDetailCustomer] = useState<UserType | null>(null);
    const [editRank, setEditRank] = useState<Rank>(1);
    const [inviteOpen, setInviteOpen] = useState(false);
    const [inviteEmail, setInviteEmail] = useState("");
    const [inviteCompany, setInviteCompany] = useState("");
    const [savedMsg, setSavedMsg] = useState<string | null>(null);

    const showMsg = (msg: string) => {
        setSavedMsg(msg);
        setTimeout(() => setSavedMsg(null), 3000);
    };

    const filtered = customers.filter(c =>
        search === "" ||
        c.company.includes(search) ||
        c.name.includes(search) ||
        c.email.toLowerCase().includes(search.toLowerCase())
    );

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

    const openDetail = (c: UserType) => {
        setDetailCustomer(c);
        setEditRank(c.rank as Rank);
    };

    const handleSaveRank = () => {
        if (!detailCustomer) return;
        updateUserRank(detailCustomer.id, editRank);
        showMsg(`${detailCustomer.company} のランクを「${rankLabel(editRank)}」に変更しました`);
        setDetailCustomer(null);
    };

    const handleInvite = () => {
        if (!inviteEmail || !inviteCompany) {
            showMsg("メールアドレスと会社名を入力してください");
            return;
        }
        setInviteOpen(false);
        setInviteEmail("");
        setInviteCompany("");
        showMsg(`${inviteCompany} (${inviteEmail}) に招待メールを送信しました`);
    };

    const customerQuotes = detailCustomer
        ? quotes.filter(q => q.userId === detailCustomer.id)
        : [];

    return (
        <div className="space-y-6">
            {savedMsg && (
                <div className="fixed top-4 right-4 z-50 bg-green-500 text-white px-6 py-3 rounded-xl shadow-lg flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    {savedMsg}
                </div>
            )}

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">顧客管理</h1>
                <Button className="bg-orange-500 hover:bg-orange-600 gap-2" onClick={() => setInviteOpen(true)}>
                    <Plus className="w-4 h-4" /> 顧客を招待
                </Button>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                    placeholder="会社名・担当者・メールで検索..."
                    className="pl-9"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
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
                        {filtered.map(c => (
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
                                    <Button
                                        variant="ghost" size="sm"
                                        className="text-orange-600 hover:text-orange-700 hover:bg-orange-50"
                                        onClick={() => openDetail(c)}
                                    >
                                        詳細
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filtered.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-gray-400">該当する顧客が見つかりません</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Customer Detail Modal */}
            <Dialog open={!!detailCustomer} onOpenChange={(o) => !o && setDetailCustomer(null)}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            顧客詳細
                        </DialogTitle>
                    </DialogHeader>
                    {detailCustomer && (
                        <div className="space-y-6">
                            {/* Basic Info */}
                            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg text-sm">
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">会社名</div>
                                    <div className="font-bold text-gray-900">{detailCustomer.company}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">担当者名</div>
                                    <div>{detailCustomer.name}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">メールアドレス</div>
                                    <div>{detailCustomer.email}</div>
                                </div>
                                <div>
                                    <div className="text-xs text-gray-400 mb-1">ステータス</div>
                                    <Badge variant="outline" className={detailCustomer.status === "有効" ? "border-green-200 text-green-700 bg-green-50" : "bg-gray-100"}>
                                        {detailCustomer.status}
                                    </Badge>
                                </div>
                                {detailCustomer.shippingAddress && (
                                    <div className="col-span-2">
                                        <div className="text-xs text-gray-400 mb-1">住所</div>
                                        <div className="text-gray-700">{detailCustomer.shippingAddress}</div>
                                    </div>
                                )}
                            </div>

                            {/* Rank Change */}
                            <div className="border rounded-lg p-4 space-y-3">
                                <div className="flex items-center gap-2 font-bold text-sm">
                                    <Shield className="w-4 h-4 text-orange-500" />
                                    ランク変更
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-sm text-gray-500">現在:</div>
                                    <Badge variant="secondary" className={rankColor(detailCustomer.rank)}>
                                        {rankLabel(detailCustomer.rank)}
                                    </Badge>
                                    <div className="text-gray-300">→</div>
                                    <Select
                                        value={String(editRank)}
                                        onValueChange={(v) => setEditRank(parseInt(v) as Rank)}
                                    >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="1">スタンダード</SelectItem>
                                            <SelectItem value="2">プレミアム</SelectItem>
                                            <SelectItem value="3">VIP</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Quote History */}
                            <div>
                                <div className="font-bold text-sm mb-2 flex items-center gap-2">
                                    <FileText className="w-4 h-4" />
                                    見積依頼履歴 ({customerQuotes.length}件)
                                </div>
                                {customerQuotes.length > 0 ? (
                                    <div className="space-y-2">
                                        {customerQuotes.map(q => (
                                            <div key={q.id} className="flex items-center justify-between py-2 px-3 rounded-lg bg-gray-50 text-sm">
                                                <div>
                                                    <span className="font-mono text-gray-500 text-xs">#{q.id}</span>
                                                    <span className="ml-2 text-gray-700">{q.items.length}品目</span>
                                                </div>
                                                <div className="text-gray-400 text-xs">{q.date}</div>
                                                <Badge variant="secondary" className={
                                                    q.status === "新規" ? "bg-blue-100 text-blue-700" :
                                                    q.status === "依頼中" ? "bg-yellow-100 text-yellow-700" :
                                                    q.status === "対応中" ? "bg-purple-100 text-purple-700" :
                                                    q.status === "回答済" ? "bg-green-100 text-green-700" :
                                                    "bg-gray-100 text-gray-700"
                                                }>
                                                    {q.status}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-gray-400 text-sm py-4 text-center">依頼履歴なし</div>
                                )}
                            </div>
                        </div>
                    )}
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDetailCustomer(null)}>キャンセル</Button>
                        <Button
                            className="bg-orange-500 hover:bg-orange-600"
                            onClick={handleSaveRank}
                            disabled={detailCustomer?.rank === editRank}
                        >
                            ランクを保存
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Invite Modal */}
            <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <Mail className="w-5 h-5" />
                            顧客を招待
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-2">
                        <div className="space-y-2">
                            <Label>会社名 *</Label>
                            <Input
                                placeholder="例: 株式会社〇〇商事"
                                value={inviteCompany}
                                onChange={(e) => setInviteCompany(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>メールアドレス *</Label>
                            <Input
                                type="email"
                                placeholder="例: tanaka@example.co.jp"
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                            />
                        </div>
                        <div className="bg-blue-50 text-blue-700 text-sm p-3 rounded-lg">
                            招待メールが送信されます。受信者はメール内のリンクからアカウントを作成できます。
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setInviteOpen(false)}>キャンセル</Button>
                        <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleInvite}>
                            招待メールを送信
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
