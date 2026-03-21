"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform, animate } from "framer-motion";

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────
interface Analysis {
  needs: string;
  avg_spend: string;
  strategy: string;
  hidden_gem: string;
}
interface WardSim {
  area_name: string;
  id: string;
  rent_tsubo: number;
  deposit_months: number;
  subsidy_max: number;
  finance_rate: string;
  analysis: Analysis;
  alert: { headline: string; body: string } | null;
}

// ─────────────────────────────────────────────
// 全区データ（深掘りコピー版）
// ─────────────────────────────────────────────
const WARDS: WardSim[] = [
  {
    area_name: "世田谷区", id: "setagaya",
    rent_tsubo: 25000, deposit_months: 8, subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "経堂・千歳船橋などの団地・URエリアは、実はテイクアウトの宝庫。住民の8割近くが「近所に惣菜を気軽に買える店が足りない」と感じており、電源完備のサードプレイスカフェや、リモートワーカー向けのランチ需要も圧倒的に不足しています。",
      avg_spend: "昼 1,200〜1,600円 / 夜 3,500〜4,800円",
      strategy: "商店街のメイン通りから一本入った「路地裏1F」が狙い目。賃料を2〜3割抑えつつ、テイクアウト窓口の設置とInstagram集客を組み合わせるのが世田谷での勝ち筋です。",
      hidden_gem: "下北沢・三軒茶屋は競合過多ですが、経堂・千歳烏山は優良商圏のわりに空き物件が残っている穴場。補助金でテイクアウト設備に投資すれば、固定費を抑えたまま利益率を高めることができます。"
    },
    alert: { headline: "申請前に保健所の管轄支所を確認しよう", body: "世田谷区は保健所が5支所に分かれています。物件探しの段階で管轄を調べておくと、後の申請がスムーズになります。" }
  },
  {
    area_name: "新宿区", id: "shinjuku",
    rent_tsubo: 45000, deposit_months: 10, subsidy_max: 5000000,
    finance_rate: "実質0.2%",
    analysis: {
      needs: "圧倒的なトラフィックを活かした「特化型専門店」が勝つエリア。インバウンド需要も復活し、ヴィーガン対応や高単価な夜のバー・日本酒専門店への需要が急増しています。",
      avg_spend: "昼 1,000〜1,500円 / 夜 5,000〜7,000円",
      strategy: "家賃は高いが補助金も23区トップクラス。商店街の空き店舗なら利子・保証料が全額補助される「新宿スキーム」を活用し、初期費用の大半をカバーしながら短期回収を狙えます。",
      hidden_gem: "商店街の空き店舗に出店すれば、利子・保証料が全額補助される制度あり。融資コストをゼロにして高い家賃を相殺するのが新宿流の合理的な開業戦略です。"
    },
    alert: null
  },
  {
    area_name: "中野区", id: "nakano",
    rent_tsubo: 16000, deposit_months: 7, subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "再開発エリアの新住民と長年の地元住民が混在。「普段使いできる上質な食事」への需要が急速に高まっており、どちらの層にも刺さる業態が求められています。",
      avg_spend: "昼 900〜1,300円 / 夜 2,800〜4,000円",
      strategy: "中野駅前は賃料が上昇中。1〜2駅ずらした野方・鷺ノ宮エリアが賃料コスパ最高水準。地域密着で固定客を着実に積み上げるモデルが安定収益につながります。",
      hidden_gem: "中野区は2026年以降の再開発でテナント需要が急増見込み。今のうちに低賃料で入居し、開発後の集客増を享受できる「先乗り戦略」が使えます。"
    },
    alert: null
  },
  {
    area_name: "北区", id: "kita",
    rent_tsubo: 13000, deposit_months: 6, subsidy_max: 4200000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "赤羽・十条・王子エリアは昔ながらの商店街文化が根強い。毎日通える「定食屋・大衆酒場」スタイルへの需要が底堅く、価格感度が高い分、コスパに優れた店は強力なリピーターを獲得できます。",
      avg_spend: "昼 800〜1,200円 / 夜 2,500〜3,800円",
      strategy: "北区は不動産業団体との包括連携で物件マッチングを公的にサポート。物件探しから補助金申請まで行政と連携しながら進められるため、初めての開業でも安心のエリアです。",
      hidden_gem: "赤羽の商店街は空き物件のオーナーが高齢化しており、条件交渉がしやすい物件が増えています。23区でも珍しい「物件マッチング公的支援」を最大限活用しましょう。"
    },
    alert: { headline: "物件探しから公的サポートを活用できます", body: "北区は不動産業団体との包括連携協定があり、商店街の空き店舗物件を行政と連携しながら紹介してもらえます。まず区の産業振興窓口に相談してみましょう。" }
  },
  {
    area_name: "足立区", id: "adachi",
    rent_tsubo: 9000, deposit_months: 5, subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "北千住エリアを中心に複数の大学キャンパス誘致で若年層が急増。手頃な価格で満足度の高い食事を求めるニーズが強く、価格訴求と品質のバランスが問われます。",
      avg_spend: "昼 700〜1,000円 / 夜 2,000〜3,500円",
      strategy: "23区最安クラスの家賃で広い物件を確保し、フードデリバリーとの併用で売上の柱を2本立てにする戦略が最適。固定費を抑えた分を商品品質に全振りできます。",
      hidden_gem: "ゴミ分別がシンプルで開業後のオペレーション管理が楽。仕込みや接客に集中できる環境を整えたい料理人に特に向いているエリアです。"
    },
    alert: null
  },
  {
    area_name: "荒川区", id: "arakawa",
    rent_tsubo: 11000, deposit_months: 6, subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "日暮里・町屋エリアは長年の地元住民が多く、毎日通える「飽きない日常食」への需要が根強い。外食頻度は高くないが、一度気に入った店には週複数回通うリピート性の高い客層です。",
      avg_spend: "昼 800〜1,100円 / 夜 2,500〜3,600円",
      strategy: "区独自の賃料補助制度を活用して初期コストを下げつつ、日暮里繊維街など地域資源と連携したユニークな業態で差別化するのが荒川区での勝ち筋です。",
      hidden_gem: "日暮里は外国人観光客の動線上にあり、インバウンド向け業態の伸びしろが意外に大きい穴場エリア。観光×地元の2軸で集客できる立地です。"
    },
    alert: null
  },
  {
    area_name: "板橋区", id: "itabashi",
    rent_tsubo: 11000, deposit_months: 6, subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "大山・ときわ台エリアは子育て世代が多く、テイクアウト惣菜や家族向けのカジュアルダイニングへの需要が高い。週末の食需要が特に強く、ファミリー向け業態が刺さります。",
      avg_spend: "昼 800〜1,100円 / 夜 2,500〜3,800円",
      strategy: "ハッピーロード大山商店街は集客力が高く空き物件も出やすい。商店街との関係を作りながら入居すると、イベント連携で集客の底上げが自然に狙えます。",
      hidden_gem: "板橋区のビジネスグランプリに入賞すると、東京都の創業助成事業への申請要件を満たせます。コンテスト参加が補助金への近道になる珍しい区です。"
    },
    alert: null
  }
];

// ─────────────────────────────────────────────
// useSpring カウントアップ
// ─────────────────────────────────────────────
function useAnimatedValue(target: number) {
  const spring = useSpring(target, { stiffness: 60, damping: 20, mass: 0.8 });
  const display = useTransform(spring, v => Math.round(v));

  useEffect(() => { spring.set(target); }, [target, spring]);
  return display;
}

// ─────────────────────────────────────────────
// カウントアップ表示コンポーネント
// ─────────────────────────────────────────────
function SpringNum({ value, prefix = "", suffix = "", size = 32, color = "#1e293b" }:
  { value: number; prefix?: string; suffix?: string; size?: number; color?: string }) {
  const animated = useAnimatedValue(value);
  return (
    <span style={{ fontSize: size, fontWeight: 900, color,
      fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em" }}>
      {prefix}
      <motion.span style={{ display: "inline-block" }}>
        {useTransform(animated, v => v.toLocaleString())}
      </motion.span>
      {suffix}
    </span>
  );
}

// ─────────────────────────────────────────────
// Grain
// ─────────────────────────────────────────────
const Grain = ({ opacity = 0.05 }: { opacity?: number }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
    opacity, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
    <filter id="gr">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#gr)" />
  </svg>
);

// ─────────────────────────────────────────────
// 定数
// ─────────────────────────────────────────────
const INK   = "#1e293b";
const AMBER = "#fbbf24";
const AMBER_DIM = "#d97706";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  input[type=range] { -webkit-appearance: none; height: 4px; background: #e2e8f0; border-radius: 2px; outline: none; cursor: pointer; width: 100%; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: ${INK}; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.25); }
  .ward-btn { transition: all 0.15s ease; }
  .ward-btn:hover { border-color: ${AMBER} !important; color: ${AMBER_DIM} !important; }

  /* ─── モバイル ─── */
  @media (max-width: 768px) {
    .main-wrap   { flex-direction: column !important; }
    .left-panel  { width: 100% !important; }
    .ward-grid   { display: grid !important; grid-template-columns: repeat(3, 1fr) !important; gap: 6px !important; }
    .result-card { padding: 18px !important; }
    .result-nums { grid-template-columns: 1fr !important; }
    .advice-grid { grid-template-columns: 1fr !important; }
    .header-wrap { padding: 20px 20px !important; }
    .pad         { padding: 16px !important; }

    /* Sticky Footer：モバイルで実質負担額を画面下に固定 */
    .sticky-footer {
      position: fixed !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      z-index: 200 !important;
      display: flex !important;
    }
  }
  @media (min-width: 769px) {
    .sticky-footer { display: none !important; }
  }
  @media (max-width: 480px) {
    .ward-grid { grid-template-columns: repeat(2, 1fr) !important; }
  }
`;

// ─────────────────────────────────────────────
// メインアプリ
// ─────────────────────────────────────────────
export default function LocepitaSimV2() {
  const [ward, setWard] = useState<WardSim>(WARDS[0]);
  const [tsubo, setTsubo] = useState(12);
  const [stickyVisible, setStickyVisible] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  // URLパラメータから初期区を設定
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const areaParam = params.get("area");
    if (areaParam) {
      const found = WARDS.find(w => w.area_name === areaParam || w.id === areaParam);
      if (found) setWard(found);
    }
  }, []);

  // スクロール監視：結果カードが画面外に出たらStickyを表示
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0.3 }
    );
    if (resultRef.current) obs.observe(resultRef.current);
    return () => obs.disconnect();
  }, []);

  // シミュレーション計算
  const monthlyRent   = ward.rent_tsubo * tsubo;
  const deposit       = monthlyRent * ward.deposit_months;
  const agencyFee     = monthlyRent * 1.1;
  const frontRent     = monthlyRent;
  const initialCost   = deposit + agencyFee + frontRent;
  const subsidyAmount = Math.min(ward.subsidy_max, Math.floor(initialCost * 0.66));
  const realCost      = initialCost - subsidyAmount;
  const coverPct      = Math.round((subsidyAmount / initialCost) * 100);

  return (
    <>
      <style>{CSS}</style>
      <div style={{ minHeight: "100vh", background: "#f8fafc",
        fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
        paddingBottom: 80 /* モバイルStickyの高さ分 */ }}>

        {/* ─── 藍色グレインヘッダー ─── */}
        <header style={{ background: INK, position: "relative", overflow: "hidden",
          borderBottom: `3px solid ${AMBER}` }}>
          <Grain opacity={0.05} />
          <div className="header-wrap" style={{ position: "relative", zIndex: 1,
            maxWidth: 1200, margin: "0 auto", padding: "32px 40px",
            display: "flex", alignItems: "flex-end", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <h1 style={{ fontSize: 26, fontWeight: 900, color: "white", margin: 0,
                  fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em" }}>ロケピタ</h1>
                <span style={{ fontSize: 24, color: AMBER }}>.</span>
                <span style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", marginLeft: 6,
                  letterSpacing: "0.15em", fontFamily: "monospace" }}>SIM</span>
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={ward.area_name}
                  initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.25 }}
                  style={{ margin: 0, fontSize: 13, color: "rgba(255,255,255,0.55)",
                    fontWeight: 500, lineHeight: 1.6 }}>
                  {ward.area_name}での出店シミュレーション中。夢を数値で設計しましょう。
                </motion.p>
              </AnimatePresence>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ margin: "0 0 2px", fontSize: 9, color: "rgba(255,255,255,0.25)",
                letterSpacing: "0.12em", fontFamily: "monospace" }}>融資条件</p>
              <p style={{ margin: 0, fontSize: 16, fontWeight: 900, color: AMBER,
                fontFamily: "'Noto Serif JP', serif" }}>{ward.finance_rate}</p>
            </div>
          </div>
        </header>

        {/* ─── メインコンテンツ ─── */}
        <div className="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 40px" }}>
          <div className="main-wrap" style={{ display: "flex", gap: 24, alignItems: "flex-start" }}>

            {/* 左：入力パネル */}
            <div className="left-panel" style={{ width: 240, flexShrink: 0,
              display: "flex", flexDirection: "column", gap: 14 }}>

              {/* エリア選択 */}
              <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: 14,
                padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <p style={{ margin: "0 0 10px", fontSize: 9, fontWeight: 700, color: "#94a3b8",
                  letterSpacing: "0.12em" }}>STEP 1 · エリアを選択</p>
                <div className="ward-grid"
                  style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                  {WARDS.map(w => (
                    <button key={w.id} className="ward-btn"
                      onClick={() => setWard(w)} style={{
                        padding: "9px 12px", borderRadius: 8, textAlign: "left", cursor: "pointer",
                        background: ward.id === w.id ? INK : "transparent",
                        border: `1.5px solid ${ward.id === w.id ? "rgba(255,255,255,0.1)" : "#f1f5f9"}`,
                        color: ward.id === w.id ? AMBER : "#475569",
                        fontSize: 12, fontWeight: ward.id === w.id ? 700 : 400,
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        position: "relative", overflow: "hidden"
                      }}>
                      {ward.id === w.id && <Grain opacity={0.06} />}
                      <span style={{ position: "relative", zIndex: 1 }}>{w.area_name}</span>
                      <span style={{ position: "relative", zIndex: 1, fontSize: 9,
                        color: ward.id === w.id ? "rgba(251,191,36,0.5)" : "#cbd5e1",
                        fontFamily: "monospace" }}>
                        {w.rent_tsubo.toLocaleString()}円
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* スライダー */}
              <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: 14,
                padding: "16px", boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <p style={{ margin: "0 0 12px", fontSize: 9, fontWeight: 700, color: "#94a3b8",
                  letterSpacing: "0.12em" }}>STEP 2 · 希望の広さ</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                  <input type="range" min="5" max="40" step="1" value={tsubo}
                    onChange={e => setTsubo(Number(e.target.value))} />
                  <div style={{ flexShrink: 0, textAlign: "right" }}>
                    <span style={{ fontSize: 24, fontWeight: 900, color: INK,
                      fontFamily: "'Noto Serif JP', serif" }}>{tsubo}</span>
                    <span style={{ fontSize: 10, color: "#64748b", marginLeft: 2 }}>坪</span>
                  </div>
                </div>
                <div style={{ fontSize: 9, color: "#94a3b8", display: "flex",
                  justifyContent: "space-between", marginBottom: 10 }}>
                  <span>5坪</span><span>20坪</span><span>40坪</span>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "9px 11px",
                  border: "1px solid #f1f5f9" }}>
                  <p style={{ margin: 0, fontSize: 10, color: "#334155", lineHeight: 1.6 }}>
                    {tsubo <= 8 && "テイクアウト専門・スタンド形式"}
                    {tsubo >= 9 && tsubo <= 14 && "カフェ・小料理屋（個人店の標準サイズ）"}
                    {tsubo >= 15 && tsubo <= 22 && "落ち着いたダイニング・ビストロ"}
                    {tsubo >= 23 && tsubo <= 30 && "ファミリーレストラン・宴会対応店"}
                    {tsubo >= 31 && "大型店舗・複合業態"}
                  </p>
                </div>
              </div>

              {/* 融資条件ミニカード */}
              <div style={{ background: INK, borderRadius: 12, padding: "14px 16px",
                position: "relative", overflow: "hidden" }}>
                <Grain opacity={0.05} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700,
                    color: "rgba(255,255,255,0.35)", letterSpacing: "0.12em" }}>このエリアの融資条件</p>
                  <p style={{ margin: "0 0 6px", fontSize: 18, fontWeight: 900, color: AMBER,
                    fontFamily: "'Noto Serif JP', serif" }}>{ward.finance_rate}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                    特定創業支援証明書取得で金利優遇。登録免許税も半減。
                  </p>
                </div>
              </div>
            </div>

            {/* 右：シミュレーター結果 */}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 14 }}>

              {/* メイン結果カード */}
              <div ref={resultRef} className="result-card"
                style={{ background: "white", borderRadius: 18, padding: "24px",
                  border: "1.5px solid #f1f5f9",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>

                <div style={{ paddingBottom: 14, marginBottom: 16,
                  borderBottom: "1px solid #f8fafc" }}>
                  <AnimatePresence mode="wait">
                    <motion.h2 key={`${ward.area_name}-${tsubo}`}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
                      style={{ fontSize: 12, fontWeight: 800, color: "#94a3b8",
                        margin: "0 0 2px", letterSpacing: "0.08em" }}>
                      {ward.area_name} · {tsubo}坪 の挑戦コスト
                    </motion.h2>
                  </AnimatePresence>
                  <p style={{ margin: 0, fontSize: 9, color: "#cbd5e1" }}>
                    保証金{ward.deposit_months}ヶ月 + 仲介料1.1ヶ月 + 前家賃1ヶ月で試算
                  </p>
                </div>

                {/* 2カラム数値 */}
                <div className="result-nums"
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 18 }}>

                  {/* 通常費用 */}
                  <div style={{ padding: "16px", background: "#f8fafc", borderRadius: 12,
                    border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 9, fontWeight: 700, color: "#94a3b8",
                      letterSpacing: "0.08em" }}>物件取得費（参考）</p>
                    <div>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>¥ </span>
                      <SpringNum value={initialCost} size={26} color={INK} />
                    </div>
                    <p style={{ margin: "4px 0 0", fontSize: 9, color: "#94a3b8" }}>
                      月額 {monthlyRent.toLocaleString()}円 × 諸費用込み
                    </p>
                  </div>

                  {/* 実質負担 — ここが主役 */}
                  <div style={{ padding: "16px", background: "#fffbeb", borderRadius: 12,
                    border: "1.5px solid #fde68a", position: "relative", overflow: "hidden" }}>
                    <Grain opacity={0.04} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p style={{ margin: "0 0 6px", fontSize: 9, fontWeight: 700, color: AMBER_DIM,
                        letterSpacing: "0.08em" }}>補助金活用後の実質負担</p>
                      <div>
                        <span style={{ fontSize: 11, color: AMBER }}>¥ </span>
                        <SpringNum value={realCost} size={26} color={AMBER_DIM} />
                      </div>
                      <motion.p key={coverPct}
                        initial={{ scale: 1.15, color: AMBER }}
                        animate={{ scale: 1, color: AMBER_DIM }}
                        transition={{ duration: 0.4 }}
                        style={{ margin: "6px 0 0", fontSize: 11, fontWeight: 800,
                          display: "inline-block" }}>
                        初期費用の約 {coverPct}% をカバー
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* カバー率バー */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    fontSize: 10, marginBottom: 6 }}>
                    <span style={{ fontWeight: 700, color: "#64748b" }}>補助金による負担軽減</span>
                    <motion.span key={coverPct}
                      initial={{ scale: 1.2 }} animate={{ scale: 1 }}
                      style={{ fontWeight: 900, color: INK, display: "inline-block" }}>
                      {coverPct}% ダウン
                    </motion.span>
                  </div>
                  <div style={{ height: 8, background: "#f1f5f9", borderRadius: 4, overflow: "hidden" }}>
                    <motion.div key={`pct-${coverPct}`}
                      initial={{ width: 0 }} animate={{ width: `${coverPct}%` }}
                      transition={{ duration: 1.0, ease: "circOut" }}
                      style={{ height: "100%", background: `linear-gradient(90deg, ${INK}, #475569)`,
                        borderRadius: 4 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between",
                    marginTop: 5, fontSize: 9, color: "#94a3b8" }}>
                    <span>補助金：¥{subsidyAmount.toLocaleString()}</span>
                    <span>月額家賃：¥{monthlyRent.toLocaleString()}</span>
                  </div>
                </div>

                {/* 費用内訳 */}
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "11px 13px" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 9, fontWeight: 700, color: "#94a3b8",
                    letterSpacing: "0.1em" }}>費用内訳</p>
                  {([
                    ["月額家賃（想定）", monthlyRent],
                    [`保証金（${ward.deposit_months}ヶ月）`, deposit],
                    ["仲介手数料（1.1ヶ月）", agencyFee],
                    ["前家賃（1ヶ月）", frontRent],
                  ] as [string, number][]).map(([label, val]) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between",
                      padding: "5px 0", borderBottom: "1px solid #f1f5f9", fontSize: 11 }}>
                      <span style={{ color: "#64748b" }}>{label}</span>
                      <span style={{ fontWeight: 700, color: INK }}>¥{val.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* アラート */}
              <AnimatePresence>
                {ward.alert && (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0",
                      borderRadius: 12, padding: "13px 15px", display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 13, color: "#16a34a", flexShrink: 0 }}>✓</span>
                    <div>
                      <p style={{ margin: "0 0 3px", fontSize: 12, fontWeight: 700, color: "#166534" }}>
                        {ward.alert.headline}
                      </p>
                      <p style={{ margin: 0, fontSize: 11, color: "#14532d", lineHeight: 1.7 }}>
                        {ward.alert.body}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 深掘りアドバイス */}
              <AnimatePresence mode="wait">
                <motion.div key={ward.id}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.28 }}>
                  <div className="advice-grid"
                    style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                    {/* 隠れたニーズ */}
                    <div style={{ background: "white", border: "1px solid #f1f5f9",
                      borderRadius: 14, padding: "16px",
                      boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                      <p style={{ margin: "0 0 8px", fontSize: 9, fontWeight: 700, color: "#64748b",
                        letterSpacing: "0.08em" }}>エリアの隠れたニーズ</p>
                      <p style={{ margin: "0 0 10px", fontSize: 12, color: "#334155",
                        lineHeight: 1.8 }}>{ward.analysis.needs}</p>
                      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "9px 10px",
                        border: "1px solid #f1f5f9" }}>
                        <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700,
                          color: "#94a3b8" }}>穴場情報</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#475569",
                          lineHeight: 1.7 }}>{ward.analysis.hidden_gem}</p>
                      </div>
                    </div>

                    {/* 戦略アドバイス（藍色カード） */}
                    <div style={{ background: INK, borderRadius: 14, padding: "16px",
                      position: "relative", overflow: "hidden" }}>
                      <Grain opacity={0.05} />
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700,
                          color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>想定客単価</p>
                        <p style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 900,
                          color: AMBER, fontFamily: "'Noto Serif JP', serif" }}>
                          {ward.analysis.avg_spend}
                        </p>
                        <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700,
                          color: "rgba(255,255,255,0.35)", letterSpacing: "0.08em" }}>
                          出店戦略アドバイス
                        </p>
                        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.65)",
                          lineHeight: 1.8 }}>{ward.analysis.strategy}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* ─── モバイル Sticky Footer ─── */}
        <div className="sticky-footer"
          style={{ background: INK, borderTop: `3px solid ${AMBER}`,
            padding: "12px 20px", alignItems: "center", justifyContent: "space-between",
            gap: 12, boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
            position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 200,
            display: stickyVisible ? "flex" : "none" }}>
          <Grain opacity={0.04} />
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{ margin: "0 0 1px", fontSize: 9, color: "rgba(255,255,255,0.4)",
              letterSpacing: "0.1em" }}>補助金活用後の実質負担</p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
              <span style={{ fontSize: 10, color: AMBER }}>¥</span>
              <SpringNum value={realCost} size={22} color={AMBER} />
            </div>
          </div>
          <div style={{ position: "relative", zIndex: 1, textAlign: "right" }}>
            <p style={{ margin: "0 0 1px", fontSize: 9, color: "rgba(255,255,255,0.4)" }}>
              {coverPct}% カバー
            </p>
            <div style={{ height: 4, width: 80, background: "rgba(255,255,255,0.1)",
              borderRadius: 2, overflow: "hidden" }}>
              <motion.div animate={{ width: `${coverPct}%` }}
                transition={{ duration: 0.6, ease: "circOut" }}
                style={{ height: "100%", background: AMBER, borderRadius: 2 }} />
            </div>
          </div>
        </div>

        {/* フッター */}
        <footer style={{ background: INK, marginTop: 40, padding: "14px 40px",
          position: "relative", overflow: "hidden" }}>
          <Grain opacity={0.04} />
          <div style={{ position: "relative", zIndex: 1, maxWidth: 1200, margin: "0 auto",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            flexWrap: "wrap", gap: 10 }}>
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.25)",
              lineHeight: 1.9, maxWidth: 560 }}>
              本シミュレーションは参考値です。実際の坪単価・保証金・補助金額は物件・条件によって異なります。開業前に必ず各区の公式サイト・産業振興窓口でご確認ください。
            </p>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "monospace",
              letterSpacing: "0.15em", flexShrink: 0 }}>LOCEPITA SIM v2.0</span>
          </div>
        </footer>
      </div>
    </>
  );
}
