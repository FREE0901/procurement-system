import { User, Category, Product, Quote } from "./types";

export const USERS: User[] = [
    { id: "u1", email: "standard@example.com", password: "demo", name: "田中 太郎", company: "田中配管工業", rank: 1, rankName: "スタンダード", status: "有効", lastOrder: "2026-02-14", shippingAddress: "東京都大田区蒲田5-13-23" },
    { id: "u2", email: "premium@example.com", password: "demo", name: "鈴木 一郎", company: "鈴木機械製作所", rank: 2, rankName: "プレミアム", status: "有効", lastOrder: "2026-02-05", shippingAddress: "神奈川県川崎市川崎区駅前本町11-2" },
    { id: "u3", email: "vip@example.com", password: "demo", name: "佐藤 健二", company: "佐藤溶接工業", rank: 3, rankName: "VIP", status: "有効", lastOrder: "2026-01-20", shippingAddress: "千葉県市川市八幡2-15-10" },
    { id: "a1", email: "admin@example.com", password: "admin", name: "管理者", company: "戸高工業所", rank: 99, rankName: "管理者", isAdmin: true, status: "有効" },
];

export const CATEGORIES: Category[] = [
    {
        id: "c1",
        name: "住宅設備関係",
        icon: "🏠",
        subcategories: [
            { id: "c1-1", name: "管継手・バルブ" },
            { id: "c1-2", name: "配管・ホース" },
            { id: "c1-3", name: "水回り・衛生設備" }
        ]
    },
    {
        id: "c2",
        name: "工場・プラント関係",
        icon: "🏭",
        subcategories: [
            { id: "c2-1", name: "ステンレス管・継手" },
            { id: "c2-2", name: "工業用バルブ" },
            { id: "c2-3", name: "フランジ・パッキン" },
            { id: "c2-4", name: "ボルト・ナット" },
            { id: "c2-5", name: "特殊材料・受注生産品" }
        ]
    },
    {
        id: "c3",
        name: "事務用品",
        icon: "📄",
        subcategories: [
            { id: "c3-1", name: "用紙・ノート" },
            { id: "c3-2", name: "筆記具・ファイル" }
        ]
    },
    {
        id: "c4",
        name: "オリジナル商品",
        icon: "⭐",
        subcategories: [
            { id: "c4-1", name: "工具・作業用品" },
            { id: "c4-2", name: "安全保護具" }
        ]
    },
    { id: "c5", name: "おすすめ商品", icon: "👍" },
];

export const PRODUCTS: Product[] = [
    // --- 住宅設備関係 ---
    { id: "p1", name: "水栓バルブ（ボール式）", code: "HM-BV-13", category: "c1", subcategoryId: "c1-1", minRank: 1, unit: "個", sizes: ["13A", "20A", "25A"], prices: { "13A": 1200, "20A": 1600, "25A": 2100 }, image: "https://placehold.co/400x300/fff3e0/e65100?text=水栓バルブ", isPickup: true },
    { id: "p2", name: "給湯用フレキシブルホース", code: "HM-FH-600", category: "c1", subcategoryId: "c1-2", minRank: 1, unit: "本", sizes: ["300mm", "450mm", "600mm", "900mm"], prices: { "300mm": 580, "450mm": 680, "600mm": 780, "900mm": 980 }, image: "https://placehold.co/400x300/fff3e0/e65100?text=フレキシブルホース" },
    { id: "p3", name: "塩ビ製排水管（VU管）", code: "HM-VU-100", category: "c1", subcategoryId: "c1-2", minRank: 1, unit: "m", sizes: ["50A", "75A", "100A", "150A"], prices: { "50A": 450, "75A": 680, "100A": 950, "150A": 1800 }, image: "https://placehold.co/400x300/fff3e0/e65100?text=VU管", saleRate: 15 },
    { id: "p4", name: "洗面台用排水トラップ", code: "HM-DT-32", category: "c1", subcategoryId: "c1-3", minRank: 1, unit: "個", sizes: ["32A", "38A"], prices: { "32A": 1800, "38A": 2200 }, image: "https://placehold.co/400x300/fff3e0/e65100?text=排水トラップ" },

    // --- 工場・プラント関係 ---
    { id: "p5", name: "ステンレス溶接エルボ 90°", code: "SUS-EL90", category: "c2", subcategoryId: "c2-1", minRank: 1, unit: "個", sizes: ["25A", "32A", "40A", "50A", "65A", "80A", "100A"], prices: { "25A": 480, "32A": 620, "40A": 780, "50A": 1050, "65A": 1380, "80A": 1680, "100A": 2200 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=SUS+Elbow+90", isPickup: true },
    { id: "p6", name: "炭素鋼レジューサ（同心）", code: "CS-RDC", category: "c2", subcategoryId: "c2-1", minRank: 1, unit: "個", sizes: ["50A×25A", "65A×40A", "80A×50A", "100A×65A"], prices: { "50A×25A": 520, "65A×40A": 780, "80A×50A": 1100, "100A×65A": 1450 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Reducer" },
    { id: "p7", name: "SUSゲートバルブ 10K", code: "SUS-GV10K", category: "c2", subcategoryId: "c2-2", minRank: 2, unit: "台", sizes: ["25A", "40A", "50A", "80A", "100A"], prices: { "25A": 3200, "40A": 4800, "50A": 6500, "80A": 12000, "100A": 18500 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Gate+Valve" },
    { id: "p8", name: "SUSボールバルブ フルボア", code: "SUS-BV-FB", category: "c2", subcategoryId: "c2-2", minRank: 2, unit: "台", sizes: ["15A", "20A", "25A", "32A", "40A", "50A"], prices: { "15A": 1800, "20A": 2200, "25A": 2800, "32A": 3500, "40A": 4200, "50A": 5800 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Ball+Valve", saleRate: 10 },
    { id: "p9", name: "SUS304溶接フランジ JIS10K", code: "SUS-WNF-10K", category: "c2", subcategoryId: "c2-3", minRank: 2, unit: "枚", sizes: ["25A", "40A", "50A", "65A", "80A", "100A", "150A"], prices: { "25A": 1200, "40A": 1800, "50A": 2400, "65A": 3200, "80A": 4200, "100A": 6000, "150A": 12000 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Flange+10K" },
    { id: "p10", name: "SUSスリップオンフランジ JIS5K", code: "SUS-SOF-5K", category: "c2", subcategoryId: "c2-3", minRank: 1, unit: "枚", sizes: ["25A", "40A", "50A", "80A", "100A"], prices: { "25A": 800, "40A": 1200, "50A": 1600, "80A": 2800, "100A": 4000 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Flange+5K" },
    { id: "p11", name: "配管用ステンレス鋼管 Sch10S", code: "SUS-PIPE-10S", category: "c2", subcategoryId: "c2-1", minRank: 1, unit: "m", sizes: ["25A", "32A", "40A", "50A", "65A", "80A", "100A", "150A"], prices: { "25A": 1100, "32A": 1400, "40A": 1700, "50A": 2200, "65A": 2900, "80A": 3600, "100A": 5200, "150A": 9800 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=SUS+Pipe" },
    { id: "p12", name: "SUS六角ボルト M12", code: "SUS-HB-M12", category: "c2", subcategoryId: "c2-4", minRank: 1, unit: "本", sizes: ["M12×30", "M12×40", "M12×50", "M12×60", "M12×80"], prices: { "M12×30": 45, "M12×40": 52, "M12×50": 58, "M12×60": 65, "M12×80": 78 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Hex+Bolt" },
    { id: "p13", name: "SUSフランジボルト・ナットセット", code: "SUS-FBNS", category: "c2", subcategoryId: "c2-4", minRank: 1, unit: "セット", sizes: ["M16×60", "M16×70", "M16×80", "M20×70", "M20×80", "M20×90"], prices: { "M16×60": 280, "M16×70": 310, "M16×80": 340, "M20×70": 420, "M20×80": 460, "M20×90": 520 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Bolt+Set" },
    { id: "p14", name: "バタフライバルブ 10K", code: "BFV-10K", category: "c2", subcategoryId: "c2-2", minRank: 2, unit: "台", sizes: ["50A", "65A", "80A", "100A", "150A", "200A"], prices: { "50A": 8500, "65A": 11000, "80A": 14000, "100A": 19000, "150A": 32000, "200A": 48000 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Butterfly+Valve" },
    { id: "p15", name: "SUS配管用パッキン（ノンアス）", code: "SUS-GASKET-NA", category: "c2", subcategoryId: "c2-3", minRank: 1, unit: "枚", sizes: ["25A", "40A", "50A", "65A", "80A", "100A", "150A"], prices: { "25A": 120, "40A": 180, "50A": 240, "65A": 320, "80A": 420, "100A": 600, "150A": 1100 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Gasket", saleRate: 20 },
    { id: "p16", name: "チタン製特殊継手（受注生産）", code: "TI-SP-FTG", category: "c2", subcategoryId: "c2-5", minRank: 3, unit: "個", sizes: ["要相談"], prices: { "要相談": 0 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Titanium+Special" },
    { id: "p17", name: "ハステロイ製バルブ（特注）", code: "HAS-VLV-SP", category: "c2", subcategoryId: "c2-5", minRank: 3, unit: "台", sizes: ["要相談"], prices: { "要相談": 0 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Hastelloy+Valve" },
    { id: "p18", name: "インコネル600 溶接継手", code: "INC600-WF", category: "c2", subcategoryId: "c2-5", minRank: 3, unit: "個", sizes: ["25A", "50A", "80A"], prices: { "25A": 15000, "50A": 28000, "80A": 45000 }, image: "https://placehold.co/400x300/e3f2fd/1565c0?text=Inconel+600" },

    // --- 事務用品 ---
    { id: "p19", name: "コピー用紙 A4（500枚入）", code: "OFF-CP-A4", category: "c3", subcategoryId: "c3-1", minRank: 1, unit: "冊", sizes: ["1冊", "5冊パック", "10冊パック"], prices: { "1冊": 580, "5冊パック": 2600, "10冊パック": 4800 }, image: "https://placehold.co/400x300/e8f5e9/2e7d32?text=コピー用紙+A4", isPickup: true },
    { id: "p20", name: "ボールペン（10本セット）", code: "OFF-BP-10", category: "c3", subcategoryId: "c3-2", minRank: 1, unit: "セット", sizes: ["黒", "赤", "青", "3色セット"], prices: { "黒": 380, "赤": 380, "青": 380, "3色セット": 950 }, image: "https://placehold.co/400x300/e8f5e9/2e7d32?text=ボールペン" },
    { id: "p21", name: "クリアファイル A4（10枚入）", code: "OFF-CF-A4", category: "c3", subcategoryId: "c3-2", minRank: 1, unit: "パック", sizes: ["10枚", "20枚", "50枚"], prices: { "10枚": 280, "20枚": 480, "50枚": 980 }, image: "https://placehold.co/400x300/e8f5e9/2e7d32?text=クリアファイル", saleRate: 10 },

    // --- オリジナル商品 ---
    { id: "p22", name: "戸高オリジナル 工具セット（20点）", code: "ORI-TS-20", category: "c4", subcategoryId: "c4-1", minRank: 1, unit: "セット", sizes: ["スタンダード", "プロ仕様"], prices: { "スタンダード": 12800, "プロ仕様": 24800 }, image: "https://placehold.co/400x300/fce4ec/880e4f?text=工具セット", isPickup: true },
    { id: "p23", name: "戸高ロゴ入り安全ベスト", code: "ORI-SV-01", category: "c4", subcategoryId: "c4-2", minRank: 1, unit: "枚", sizes: ["S", "M", "L", "XL", "2XL"], prices: { "S": 2200, "M": 2200, "L": 2200, "XL": 2400, "2XL": 2600 }, image: "https://placehold.co/400x300/fce4ec/880e4f?text=安全ベスト" },
    { id: "p24", name: "戸高オリジナル 保護メガネ", code: "ORI-PG-01", category: "c4", subcategoryId: "c4-2", minRank: 1, unit: "個", sizes: ["フリーサイズ"], prices: { "フリーサイズ": 1800 }, image: "https://placehold.co/400x300/fce4ec/880e4f?text=保護メガネ", saleRate: 15 },
];

export const MOCK_QUOTES: Quote[] = [
    { id: "Q-2026-003", userId: "u1", company: "田中配管工業", userRank: 1, date: "2026-02-14", status: "新規", items: [{ productId: "p5", name: "ステンレス溶接エルボ 90°", code: "SUS-EL90", size: "50A", qty: 10, price: 1050, unit: "個" }], total: 10500 },
    { id: "Q-2026-002", userId: "u2", company: "鈴木機械製作所", userRank: 2, date: "2026-02-05", status: "対応中", items: [{ productId: "p7", name: "SUSゲートバルブ 10K", code: "SUS-GV10K", size: "50A", qty: 4, price: 6500, unit: "台" }, { productId: "p10", name: "SUSスリップオンフランジ JIS5K", code: "SUS-SOF-5K", size: "50A", qty: 8, price: 1600, unit: "枚" }], total: 128300 },
    { id: "Q-2026-001", userId: "u3", company: "佐藤溶接工業", userRank: 3, date: "2026-01-20", status: "回答済", items: [{ productId: "p18", name: "インコネル600 溶接継手", code: "INC600-WF", size: "50A", qty: 2, price: 28000, unit: "個" }], total: 45600 },
];
