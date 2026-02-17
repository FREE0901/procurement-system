import { User, Category, Product, Quote } from "./types";

export const USERS: User[] = [
    { id: "u1", email: "standard@example.com", password: "demo", name: "田中 太郎", company: "田中配管工業", rank: 1, rankName: "スタンダード", status: "有効", lastOrder: "2026-02-14", shippingAddress: "東京都大田区蒲田5-13-23" },
    { id: "u2", email: "premium@example.com", password: "demo", name: "鈴木 一郎", company: "鈴木機械製作所", rank: 2, rankName: "プレミアム", status: "有効", lastOrder: "2026-02-05", shippingAddress: "神奈川県川崎市川崎区駅前本町11-2" },
    { id: "u3", email: "vip@example.com", password: "demo", name: "佐藤 健二", company: "佐藤溶接工業", rank: 3, rankName: "VIP", status: "有効", lastOrder: "2026-01-20", shippingAddress: "千葉県市川市八幡2-15-10" },
    { id: "a1", email: "admin@example.com", password: "admin", name: "管理者", company: "戸高工業所", rank: 99, rankName: "管理者", isAdmin: true, status: "有効" },
];

export const CATEGORIES: Category[] = [
    { id: "c1", name: "継手・フィッティング", icon: "🔧" },
    { id: "c2", name: "バルブ", icon: "🔴" },
    { id: "c3", name: "フランジ", icon: "⚙️" },
    { id: "c4", name: "パイプ・管材", icon: "🔩" },
    { id: "c5", name: "ボルト・ナット", icon: "🪛" },
    { id: "c6", name: "特注品", icon: "⭐" },
];

export const PRODUCTS: Product[] = [
    { id: "p1", name: "ステンレス溶接エルボ 90°", code: "SUS-EL90", category: "c1", minRank: 1, unit: "個", sizes: ["25A", "32A", "40A", "50A", "65A", "80A", "100A"], prices: { "25A": 480, "32A": 620, "40A": 780, "50A": 1050, "65A": 1380, "80A": 1680, "100A": 2200 }, image: "https://placehold.co/400x300/e8e8e8/666?text=SUS+Elbow+90" },
    { id: "p2", name: "炭素鋼レジューサ（同心）", code: "CS-RDC", category: "c1", minRank: 1, unit: "個", sizes: ["50A×25A", "65A×40A", "80A×50A", "100A×65A"], prices: { "50A×25A": 520, "65A×40A": 780, "80A×50A": 1100, "100A×65A": 1450 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Reducer" },
    { id: "p3", name: "SUSゲートバルブ 10K", code: "SUS-GV10K", category: "c2", minRank: 2, unit: "台", sizes: ["25A", "40A", "50A", "80A", "100A"], prices: { "25A": 3200, "40A": 4800, "50A": 6500, "80A": 12000, "100A": 18500 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Gate+Valve" },
    { id: "p4", name: "SUSボールバルブ フルボア", code: "SUS-BV-FB", category: "c2", minRank: 2, unit: "台", sizes: ["15A", "20A", "25A", "32A", "40A", "50A"], prices: { "15A": 1800, "20A": 2200, "25A": 2800, "32A": 3500, "40A": 4200, "50A": 5800 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Ball+Valve" },
    { id: "p5", name: "SUS304溶接フランジ JIS10K", code: "SUS-WNF-10K", category: "c3", minRank: 2, unit: "枚", sizes: ["25A", "40A", "50A", "65A", "80A", "100A", "150A"], prices: { "25A": 1200, "40A": 1800, "50A": 2400, "65A": 3200, "80A": 4200, "100A": 6000, "150A": 12000 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Flange+10K" },
    { id: "p6", name: "SUSスリップオンフランジ JIS5K", code: "SUS-SOF-5K", category: "c3", minRank: 1, unit: "枚", sizes: ["25A", "40A", "50A", "80A", "100A"], prices: { "25A": 800, "40A": 1200, "50A": 1600, "80A": 2800, "100A": 4000 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Flange+5K" },
    { id: "p7", name: "配管用ステンレス鋼管 Sch10S", code: "SUS-PIPE-10S", category: "c4", minRank: 1, unit: "m", sizes: ["25A", "32A", "40A", "50A", "65A", "80A", "100A", "150A"], prices: { "25A": 1100, "32A": 1400, "40A": 1700, "50A": 2200, "65A": 2900, "80A": 3600, "100A": 5200, "150A": 9800 }, image: "https://placehold.co/400x300/e8e8e8/666?text=SUS+Pipe" },
    { id: "p8", name: "SUS六角ボルト M12", code: "SUS-HB-M12", category: "c5", minRank: 1, unit: "本", sizes: ["M12×30", "M12×40", "M12×50", "M12×60", "M12×80"], prices: { "M12×30": 45, "M12×40": 52, "M12×50": 58, "M12×60": 65, "M12×80": 78 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Hex+Bolt" },
    { id: "p9", name: "SUSフランジボルト・ナットセット", code: "SUS-FBNS", category: "c5", minRank: 1, unit: "セット", sizes: ["M16×60", "M16×70", "M16×80", "M20×70", "M20×80", "M20×90"], prices: { "M16×60": 280, "M16×70": 310, "M16×80": 340, "M20×70": 420, "M20×80": 460, "M20×90": 520 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Bolt+Set" },
    { id: "p10", name: "チタン製特殊継手（受注生産）", code: "TI-SP-FTG", category: "c6", minRank: 3, unit: "個", sizes: ["要相談"], prices: { "要相談": 0 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Titanium+Special" },
    { id: "p11", name: "ハステロイ製バルブ（特注）", code: "HAS-VLV-SP", category: "c6", minRank: 3, unit: "台", sizes: ["要相談"], prices: { "要相談": 0 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Hastelloy+Valve" },
    { id: "p12", name: "バタフライバルブ 10K", code: "BFV-10K", category: "c2", minRank: 2, unit: "台", sizes: ["50A", "65A", "80A", "100A", "150A", "200A"], prices: { "50A": 8500, "65A": 11000, "80A": 14000, "100A": 19000, "150A": 32000, "200A": 48000 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Butterfly+Valve" },
    { id: "p13", name: "SUS配管用パッキン（ノンアス）", code: "SUS-GASKET-NA", category: "c5", minRank: 1, unit: "枚", sizes: ["25A", "40A", "50A", "65A", "80A", "100A", "150A"], prices: { "25A": 120, "40A": 180, "50A": 240, "65A": 320, "80A": 420, "100A": 600, "150A": 1100 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Gasket" },
    { id: "p14", name: "インコネル600 溶接継手", code: "INC600-WF", category: "c6", minRank: 3, unit: "個", sizes: ["25A", "50A", "80A"], prices: { "25A": 15000, "50A": 28000, "80A": 45000 }, image: "https://placehold.co/400x300/e8e8e8/666?text=Inconel+600" },
];

export const MOCK_QUOTES: Quote[] = [
    { id: "Q-2026-003", userId: "u1", company: "田中配管工業", userRank: 1, date: "2026-02-14", status: "新規", items: [], total: 0 }, // Simplified for mock
    { id: "Q-2026-002", userId: "u2", company: "鈴木機械製作所", userRank: 2, date: "2026-02-05", status: "対応中", items: [], total: 128300 },
    { id: "Q-2026-001", userId: "u3", company: "佐藤溶接工業", userRank: 3, date: "2026-01-20", status: "回答済", items: [], total: 45600 },
];
