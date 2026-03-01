"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, User, Mail, Lock, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const registerUser = useStore((state) => state.registerUser);

    const [form, setForm] = useState({
        name: "",
        company: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    const [isLoading, setIsLoading] = useState(false);
    const [done, setDone] = useState(false);

    const validate = () => {
        const errs: Record<string, string> = {};
        if (!form.name.trim()) errs.name = "氏名を入力してください";
        if (!form.company.trim()) errs.company = "会社名を入力してください";
        if (!form.email.trim()) errs.email = "メールアドレスを入力してください";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "正しいメールアドレスを入力してください";
        if (!form.password) errs.password = "パスワードを入力してください";
        else if (form.password.length < 6) errs.password = "パスワードは6文字以上にしてください";
        if (form.password !== form.confirmPassword) errs.confirmPassword = "パスワードが一致しません";
        return errs;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const errs = validate();
        setFieldErrors(errs);
        if (Object.keys(errs).length > 0) return;

        setIsLoading(true);
        await new Promise(r => setTimeout(r, 600));

        const result = registerUser({
            name: form.name,
            company: form.company,
            email: form.email,
            password: form.password,
        });

        setIsLoading(false);
        if (result.success) {
            setDone(true);
            setTimeout(() => router.push("/client/products"), 2000);
        } else {
            setError(result.error || "登録に失敗しました");
        }
    };

    const update = (field: string, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
        setFieldErrors(prev => ({ ...prev, [field]: "" }));
    };

    if (done) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
                <div className="text-center text-white space-y-4">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-green-500/30">
                        <CheckCircle2 className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">登録が完了しました！</h2>
                    <p className="text-slate-300">商品一覧ページへ移動します...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
            <Card className="w-full max-w-md shadow-2xl border-slate-700 bg-white/95 backdrop-blur">
                <CardHeader className="text-center space-y-2 pb-6">
                    <div className="mx-auto w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg shadow-orange-500/30 mb-2">
                        <span className="text-white text-3xl font-bold">T</span>
                    </div>
                    <CardTitle className="text-2xl font-bold text-slate-800">アカウント登録</CardTitle>
                    <CardDescription>戸高工業所 部材見積もり依頼システム</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-200">{error}</div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* 会社名 */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">会社名 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className={`pl-9 ${fieldErrors.company ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                                    placeholder="株式会社○○○"
                                    value={form.company}
                                    onChange={e => update("company", e.target.value)}
                                />
                            </div>
                            {fieldErrors.company && <p className="text-xs text-red-500">{fieldErrors.company}</p>}
                        </div>

                        {/* 氏名 */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">担当者氏名 <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <User className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className={`pl-9 ${fieldErrors.name ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                                    placeholder="山田 太郎"
                                    value={form.name}
                                    onChange={e => update("name", e.target.value)}
                                />
                            </div>
                            {fieldErrors.name && <p className="text-xs text-red-500">{fieldErrors.name}</p>}
                        </div>

                        {/* メールアドレス */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">メールアドレス <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className={`pl-9 ${fieldErrors.email ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                                    type="email"
                                    placeholder="name@company.com"
                                    value={form.email}
                                    onChange={e => update("email", e.target.value)}
                                />
                            </div>
                            {fieldErrors.email && <p className="text-xs text-red-500">{fieldErrors.email}</p>}
                        </div>

                        {/* パスワード */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">パスワード <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className={`pl-9 ${fieldErrors.password ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                                    type="password"
                                    placeholder="6文字以上"
                                    value={form.password}
                                    onChange={e => update("password", e.target.value)}
                                />
                            </div>
                            {fieldErrors.password && <p className="text-xs text-red-500">{fieldErrors.password}</p>}
                        </div>

                        {/* パスワード確認 */}
                        <div className="space-y-1.5">
                            <label className="text-sm font-medium">パスワード（確認） <span className="text-red-500">*</span></label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    className={`pl-9 ${fieldErrors.confirmPassword ? "border-red-400 focus-visible:ring-red-400" : ""}`}
                                    type="password"
                                    placeholder="もう一度入力してください"
                                    value={form.confirmPassword}
                                    onChange={e => update("confirmPassword", e.target.value)}
                                />
                            </div>
                            {fieldErrors.confirmPassword && <p className="text-xs text-red-500">{fieldErrors.confirmPassword}</p>}
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-orange-500 hover:bg-orange-600 h-11 text-base font-semibold mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? "登録中..." : "アカウントを作成する"}
                        </Button>
                    </form>

                    <div className="text-center text-sm">
                        <Link href="/login" className="text-muted-foreground hover:text-orange-600 flex items-center justify-center gap-1">
                            <ArrowLeft className="w-3 h-3" />
                            ログイン画面に戻る
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
