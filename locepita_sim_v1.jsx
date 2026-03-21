"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useSpring, useTransform } from "framer-motion";

// ─────────────────────────────────────────────
// 型定義
// ─────────────────────────────────────────────
interface WardSim {
  area_name: string;
  rent_tsubo: number;
  deposit_months: number;
  subsidy_max: number;
  finance_rate: string;
  analysis: {
    needs: string;
    avg_spend: string;
    strategy: string;
    hidden_gem: string;
  };
  alert: { headline: string; body: string } | null;
}

// ─────────────────────────────────────────────
// 区データ（事業用リアル数値・深掘りモデル）
// ─────────────────────────────────────────────
const WARDS: WardSim[] = [
  {
    area_name: "世田谷区",
    rent_tsubo: 25000,
    deposit_months: 8,
    subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "経堂・千歳船橋エリアの団地・UR層を狙った「高品質な日常食」。リモートワーク層の増加で、静かな環境でゆっくり食べたいランチ需要が急増しています。",
      avg_spend: "昼 1,200〜1,600円 / 夜 3,500〜4,800円",
      strategy: "商店街から一本入った路地裏が狙い目。家賃を2〜3割抑えつつ、地元のリピーターを着実に積み上げるモデルが安定しています。",
      hidden_gem: "下北沢・三軒茶屋は競合が多いが、経堂・千歳烏山は優良商圏のわりに空き物件が残っている穴場エリアです。"
    },
    alert: { headline: "申請前に保健所の管轄支所を確認しよう", body: "世田谷区は保健所が5支所に分かれています。物件探しの段階で管轄を調べておくと、後の申請がスムーズになります。" }
  },
  {
    area_name: "新宿区",
    rent_tsubo: 45000,
    deposit_months: 10,
    subsidy_max: 5000000,
    finance_rate: "実質0.2%",
    analysis: {
      needs: "圧倒的な集客力を背景にした、回転率重視の専門店。深夜需要やインバウンド対応も視野に入れると収益の柱が増えます。",
      avg_spend: "昼 1,000〜1,500円 / 夜 5,000〜7,000円",
      strategy: "家賃は高いが補助金も23区トップ。初期費用の大半を補助金でカバーする「新宿モデル」で短期回収を狙う戦略が有効です。",
      hidden_gem: "商店街の空き店舗に出店すれば、利子・保証料が全額補助される制度あり。家賃の高さを融資コストゼロで相殺できます。"
    },
    alert: null
  },
  {
    area_name: "中野区",
    rent_tsubo: 16000,
    deposit_months: 7,
    subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "再開発エリアの新住民と長年の地元住民が混在。両者に刺さる「普段使いできる上質な食事」への需要が高まっています。",
      avg_spend: "昼 900〜1,300円 / 夜 2,800〜4,000円",
      strategy: "中野駅前は賃料が上昇中。1〜2駅ずらした野方・鷺ノ宮エリアが賃料コスパ最高水準。地域密着で固定客を作るモデルが向いています。",
      hidden_gem: "中野区は再開発で2026年以降のテナント需要が急増見込み。今のうちに低賃料で入居し、開発後の集客増を享受できる可能性があります。"
    },
    alert: null
  },
  {
    area_name: "北区",
    rent_tsubo: 13000,
    deposit_months: 6,
    subsidy_max: 4200000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "赤羽・十条・王子エリアは昔ながらの商店街文化が根強い。地元に長く愛される「定食屋・大衆酒場」スタイルへの需要が底堅い。",
      avg_spend: "昼 800〜1,200円 / 夜 2,500〜3,800円",
      strategy: "23区内で物件マッチングを公的に支援してくれる唯一に近いエリア。区の不動産業団体連携を活用すれば、物件探しの手間と費用を大幅に削減できます。",
      hidden_gem: "赤羽の商店街は空き物件のオーナーが高齢化しており、条件交渉がしやすい物件が多く出てきています。"
    },
    alert: { headline: "物件探しから公的サポートを活用できます", body: "北区は不動産業団体との包括連携協定があり、商店街の空き店舗物件を行政と連携しながら紹介してもらえる珍しい区です。まず区の産業振興窓口に相談してみましょう。" }
  },
  {
    area_name: "足立区",
    rent_tsubo: 9000,
    deposit_months: 5,
    subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "北千住エリアを中心に、複数の大学キャンパス誘致で若年層が急増。手頃な価格で満足度の高い食事を求めるニーズが強い。",
      avg_spend: "昼 700〜1,000円 / 夜 2,000〜3,500円",
      strategy: "23区最安クラスの家賃で広い物件を確保し、フードデリバリーとの併用で売上の柱を2本立てにする戦略が最適。固定費を抑えた分を商品品質に還元できます。",
      hidden_gem: "ゴミ分別がシンプルで、開業後のオペレーション管理が23区の中でも最も楽な区のひとつ。現場負担を減らしたい方に向いています。"
    },
    alert: null
  },
  {
    area_name: "荒川区",
    rent_tsubo: 11000,
    deposit_months: 6,
    subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "日暮里・町屋エリアは長年の地元住民が多く、毎日通える「飽きない日常食」への需要が根強い。",
      avg_spend: "昼 800〜1,100円 / 夜 2,500〜3,600円",
      strategy: "区独自の賃料補助制度を活用して初期コストを下げつつ、日暮里繊維街など地域資源と連携したユニークな業態で差別化するのが有効。",
      hidden_gem: "日暮里は外国人観光客の動線上にあり、インバウンド向け業態の伸びしろが意外に大きい穴場エリアです。"
    },
    alert: null
  },
  {
    area_name: "板橋区",
    rent_tsubo: 11000,
    deposit_months: 6,
    subsidy_max: 4000000,
    finance_rate: "0.4〜1.0%",
    analysis: {
      needs: "大山・ときわ台エリアは子育て世代が多く、テイクアウト惣菜や家族向けのカジュアルダイニングへの需要が高い。",
      avg_spend: "昼 800〜1,100円 / 夜 2,500〜3,800円",
      strategy: "ハッピーロード大山商店街は集客力が高く空き物件も出やすい。商店街との関係を作りながら入居すると、イベント連携で集客の底上げが狙えます。",
      hidden_gem: "板橋区のビジネスグランプリに入賞すると、東京都の創業助成事業への申請要件を満たせます。コンテスト参加がそのまま補助金への近道になります。"
    },
    alert: null
  }
];

// ─────────────────────────────────────────────
// カウントアップフック
// ─────────────────────────────────────────────
function useCountUp(target: number, duration = 0.9) {
  const spring = useSpring(0, { duration: duration * 1000, bounce: 0 });
  const display = useTransform(spring, v => Math.round(v));

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  return display;
}

// ─────────────────────────────────────────────
// カウントアップ数値表示
// ─────────────────────────────────────────────
function AnimatedYen({ value, size = 36, color = "#1e293b" }: { value: number; size?: number; color?: string }) {
  const displayed = useCountUp(value);
  return (
    <motion.span style={{ fontSize: size, fontWeight: 900, color, letterSpacing: "-0.03em",
      fontFamily: "'Noto Serif JP', serif", display: "inline-block" }}>
      {displayed.get().toLocaleString()}
    </motion.span>
  );
}

// ─────────────────────────────────────────────
// グレインテクスチャ
// ─────────────────────────────────────────────
const Grain = ({ opacity = 0.045 }: { opacity?: number }) => (
  <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%",
    opacity, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
    <filter id="g">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#g)" />
  </svg>
);

// ─────────────────────────────────────────────
// 定数
// ─────────────────────────────────────────────
const INK = "#1e293b";
const AMBER = "#fbbf24";
const AMBER_DIM = "#d97706";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
  * { box-sizing: border-box; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 2px; }
  input[type=range] { -webkit-appearance: none; height: 4px; background: #e2e8f0; border-radius: 2px; outline: none; cursor: pointer; }
  input[type=range]::-webkit-slider-thumb { -webkit-appearance: none; width: 22px; height: 22px; background: ${INK}; border-radius: 50%; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,0.2); }
  .ward-card:hover { border-color: ${AMBER} !important; }
  @media (max-width: 768px) {
    .main-grid { grid-template-columns: 1fr !important; }
    .result-grid { grid-template-columns: 1fr !important; }
    .advice-grid { grid-template-columns: 1fr !important; }
    .header-inner { padding: 24px 20px !important; }
    .pad { padding: 16px !important; }
    .sim-card { padding: 20px !important; }
  }
`;

// ─────────────────────────────────────────────
// メインアプリ
// ─────────────────────────────────────────────
export default function LocepitaSim() {
  const [ward, setWard] = useState<WardSim>(WARDS[0]);
  const [tsubo, setTsubo] = useState(12);

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
        fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif" }}>

        {/* ─── 藍色グレインヘッダー ─── */}
        <header style={{ background: INK, position: "relative", overflow: "hidden",
          borderBottom: `3px solid ${AMBER}` }}>
          <Grain opacity={0.05} />
          <div className="header-inner" style={{ position: "relative", zIndex: 1,
            maxWidth: 1200, margin: "0 auto", padding: "36px 40px",
            display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 6 }}>
                <h1 style={{ fontSize: 28, fontWeight: 900, color: "white", margin: 0,
                  fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em" }}>ロケピタ</h1>
                <span style={{ fontSize: 26, color: AMBER, lineHeight: 1 }}>.</span>
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", marginLeft: 6,
                  letterSpacing: "0.15em", fontFamily: "monospace" }}>SIM</span>
              </div>
              <p style={{ margin: 0, fontSize: 14, color: "rgba(255,255,255,0.65)", fontWeight: 500, lineHeight: 1.6 }}>
                「家賃で諦める」を、この街からなくしたい。<br />
                <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                  坪数を動かすだけで、あなたの挑戦コストがリアルに見えてきます。
                </span>
              </p>
            </div>
            <div style={{ fontSize: 10, color: "rgba(255,255,255,0.25)", fontFamily: "monospace",
              letterSpacing: "0.12em" }}>
              LOCEPITA SIM v1.0
            </div>
          </div>
        </header>

        {/* ─── メインコンテンツ ─── */}
        <div className="pad" style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 40px" }}>
          <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 28, alignItems: "start" }}>

            {/* 左：入力パネル */}
            <aside style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* エリア選択 */}
              <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: 14, padding: "18px 16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <p style={{ margin: "0 0 12px", fontSize: 10, fontWeight: 700, color: "#94a3b8",
                  letterSpacing: "0.12em" }}>エリアを選択</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {WARDS.map(w => (
                    <button key={w.area_name} className="ward-card"
                      onClick={() => setWard(w)} style={{
                        padding: "11px 14px", borderRadius: 9, textAlign: "left", cursor: "pointer",
                        background: ward.area_name === w.area_name ? INK : "transparent",
                        border: `1.5px solid ${ward.area_name === w.area_name ? "rgba(255,255,255,0.1)" : "#f1f5f9"}`,
                        color: ward.area_name === w.area_name ? AMBER : "#475569",
                        fontSize: 13, fontWeight: ward.area_name === w.area_name ? 700 : 400,
                        position: "relative", overflow: "hidden", transition: "all 0.15s",
                        display: "flex", alignItems: "center", justifyContent: "space-between"
                      }}>
                      {ward.area_name === w.area_name && <Grain opacity={0.06} />}
                      <span style={{ position: "relative", zIndex: 1 }}>{w.area_name}</span>
                      <span style={{ position: "relative", zIndex: 1, fontSize: 10, fontFamily: "monospace",
                        color: ward.area_name === w.area_name ? "rgba(251,191,36,0.6)" : "#94a3b8" }}>
                        {w.rent_tsubo.toLocaleString()}円/坪
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 坪数スライダー */}
              <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: 14, padding: "18px 16px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.04)" }}>
                <p style={{ margin: "0 0 14px", fontSize: 10, fontWeight: 700, color: "#94a3b8",
                  letterSpacing: "0.12em" }}>希望の広さ</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
                  <input type="range" min="5" max="40" step="1" value={tsubo}
                    onChange={e => setTsubo(Number(e.target.value))}
                    style={{ flex: 1 }} />
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <span style={{ fontSize: 26, fontWeight: 900, color: INK,
                      fontFamily: "'Noto Serif JP', serif" }}>{tsubo}</span>
                    <span style={{ fontSize: 11, color: "#64748b", marginLeft: 2 }}>坪</span>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9,
                  color: "#94a3b8", marginBottom: 10 }}>
                  <span>5坪（極小）</span><span>20坪（標準）</span><span>40坪（大型）</span>
                </div>
                <div style={{ background: "#f8fafc", borderRadius: 8, padding: "10px 12px",
                  border: "1px solid #f1f5f9" }}>
                  <p style={{ margin: "0 0 4px", fontSize: 9, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.08em" }}>参考規模</p>
                  <p style={{ margin: 0, fontSize: 11, color: "#334155", lineHeight: 1.7 }}>
                    {tsubo <= 8 && "テイクアウト専門・スタンド形式"}
                    {tsubo >= 9 && tsubo <= 14 && "カフェ・小料理屋（個人店の標準サイズ）"}
                    {tsubo >= 15 && tsubo <= 22 && "落ち着いたダイニング・ビストロ"}
                    {tsubo >= 23 && tsubo <= 30 && "ファミリーレストラン・宴会対応店"}
                    {tsubo >= 31 && "大型店舗・複合業態"}
                  </p>
                </div>
              </div>

              {/* 融資条件 */}
              <div style={{ background: INK, borderRadius: 14, padding: "16px",
                position: "relative", overflow: "hidden" }}>
                <Grain opacity={0.05} />
                <div style={{ position: "relative", zIndex: 1 }}>
                  <p style={{ margin: "0 0 8px", fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.4)",
                    letterSpacing: "0.12em" }}>このエリアの融資条件</p>
                  <p style={{ margin: "0 0 4px", fontSize: 20, fontWeight: 900, color: AMBER,
                    fontFamily: "'Noto Serif JP', serif" }}>{ward.finance_rate}</p>
                  <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.45)", lineHeight: 1.6 }}>
                    特定創業支援等事業の証明書取得で金利優遇。登録免許税半減の特典も。
                  </p>
                </div>
              </div>
            </aside>

            {/* 右：シミュレーター結果 */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* メインシム結果カード */}
              <div className="sim-card" style={{ background: "white", borderRadius: 18, padding: "28px",
                border: "1.5px solid #f1f5f9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}>

                <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #f8fafc" }}>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: "#94a3b8", margin: "0 0 2px",
                    letterSpacing: "0.08em" }}>
                    {ward.area_name} · {tsubo}坪 の挑戦コスト
                  </h2>
                  <p style={{ margin: 0, fontSize: 10, color: "#cbd5e1" }}>
                    保証金{ward.deposit_months}ヶ月 + 仲介料1.1ヶ月 + 前家賃1ヶ月で試算
                  </p>
                </div>

                {/* 数値2つ */}
                <div className="result-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>

                  {/* 通常費用 */}
                  <div style={{ padding: "18px", background: "#f8fafc", borderRadius: 14,
                    border: "1px solid #e2e8f0" }}>
                    <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: "#64748b",
                      letterSpacing: "0.06em" }}>物件取得費（参考）</p>
                    <div style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>¥ </span>
                      <AnimatedNum value={initialCost} size={30} color={INK} />
                    </div>
                    <p style={{ margin: 0, fontSize: 9, color: "#94a3b8", lineHeight: 1.6 }}>
                      月額 {monthlyRent.toLocaleString()}円 × 保証金{ward.deposit_months}ヶ月分ベース
                    </p>
                  </div>

                  {/* 実質負担 */}
                  <div style={{ padding: "18px", background: "#fffbeb", borderRadius: 14,
                    border: "1.5px solid #fde68a", position: "relative", overflow: "hidden" }}>
                    <Grain opacity={0.04} />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <p style={{ margin: "0 0 6px", fontSize: 10, fontWeight: 700, color: AMBER_DIM,
                        letterSpacing: "0.06em" }}>補助金活用後の実質負担</p>
                      <div style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: AMBER }}>¥ </span>
                        <AnimatedNum value={realCost} size={30} color={AMBER_DIM} />
                      </div>
                      <motion.p key={coverPct}
                        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
                        style={{ margin: 0, fontSize: 11, fontWeight: 700, color: AMBER_DIM }}>
                        初期費用の約 {coverPct}% をカバー
                      </motion.p>
                    </div>
                  </div>
                </div>

                {/* カバー率バー */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 10 }}>
                    <span style={{ fontWeight: 700, color: "#64748b" }}>補助金による負担軽減</span>
                    <motion.span key={coverPct} initial={{ scale: 1.2, color: AMBER }}
                      animate={{ scale: 1, color: INK }}
                      style={{ fontWeight: 900, display: "inline-block" }}>
                      {coverPct}% ダウン
                    </motion.span>
                  </div>
                  <div style={{ height: 10, background: "#f1f5f9", borderRadius: 5, overflow: "hidden" }}>
                    <motion.div key={`bar-${coverPct}`}
                      initial={{ width: 0 }} animate={{ width: `${coverPct}%` }}
                      transition={{ duration: 1.0, ease: "circOut" }}
                      style={{ height: "100%", background: `linear-gradient(90deg, ${INK}, #475569)`,
                        borderRadius: 5 }} />
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6,
                    fontSize: 9, color: "#94a3b8" }}>
                    <span>補助金：¥{subsidyAmount.toLocaleString()}</span>
                    <span>月額家賃：¥{monthlyRent.toLocaleString()}</span>
                  </div>
                </div>

                {/* 内訳テーブル */}
                <div style={{ background: "#f8fafc", borderRadius: 10, padding: "12px 14px" }}>
                  <p style={{ margin: "0 0 8px", fontSize: 9, fontWeight: 700, color: "#94a3b8",
                    letterSpacing: "0.1em" }}>費用内訳</p>
                  {[
                    ["月額家賃（想定）", monthlyRent],
                    [`保証金（${ward.deposit_months}ヶ月）`, deposit],
                    ["仲介手数料（1.1ヶ月）", agencyFee],
                    ["前家賃（1ヶ月）", frontRent],
                  ].map(([label, val]) => (
                    <div key={label as string} style={{ display: "flex", justifyContent: "space-between",
                      padding: "5px 0", borderBottom: "1px solid #f1f5f9", fontSize: 11 }}>
                      <span style={{ color: "#64748b" }}>{label}</span>
                      <span style={{ fontWeight: 700, color: INK }}>¥{(val as number).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* アラート */}
              <AnimatePresence>
                {ward.alert && (
                  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 12,
                      padding: "14px 16px", display: "flex", gap: 10 }}>
                    <span style={{ fontSize: 14, color: "#16a34a", flexShrink: 0 }}>✓</span>
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

              {/* エリア深掘りアドバイス */}
              <AnimatePresence mode="wait">
                <motion.div key={ward.area_name}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
                  <div className="advice-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>

                    {/* 隠れたニーズ */}
                    <div style={{ background: "white", border: "1px solid #f1f5f9", borderRadius: 14,
                      padding: "18px", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}>
                      <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700, color: "#64748b",
                        letterSpacing: "0.08em" }}>エリアの隠れたニーズ</p>
                      <p style={{ margin: "0 0 8px", fontSize: 12, color: "#334155", lineHeight: 1.8 }}>
                        {ward.analysis.needs}
                      </p>
                      <div style={{ background: "#f8fafc", borderRadius: 8, padding: "8px 10px",
                        border: "1px solid #f1f5f9" }}>
                        <p style={{ margin: "0 0 3px", fontSize: 9, fontWeight: 700, color: "#94a3b8" }}>穴場情報</p>
                        <p style={{ margin: 0, fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
                          {ward.analysis.hidden_gem}
                        </p>
                      </div>
                    </div>

                    {/* 戦略アドバイス */}
                    <div style={{ background: INK, border: "none", borderRadius: 14,
                      padding: "18px", position: "relative", overflow: "hidden" }}>
                      <Grain opacity={0.05} />
                      <div style={{ position: "relative", zIndex: 1 }}>
                        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700,
                          color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>想定客単価</p>
                        <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 900, color: AMBER,
                          fontFamily: "'Noto Serif JP', serif" }}>{ward.analysis.avg_spend}</p>
                        <p style={{ margin: "0 0 8px", fontSize: 10, fontWeight: 700,
                          color: "rgba(255,255,255,0.4)", letterSpacing: "0.08em" }}>出店戦略アドバイス</p>
                        <p style={{ margin: 0, fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.8 }}>
                          {ward.analysis.strategy}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
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
            <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.25)", lineHeight: 1.9, maxWidth: 560 }}>
              本シミュレーションは参考値です。実際の坪単価・保証金・補助金額は物件・条件によって異なります。開業前に必ず各区の公式サイト・産業振興窓口でご確認ください。
            </p>
            <span style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontFamily: "monospace",
              letterSpacing: "0.15em", flexShrink: 0 }}>LOCEPITA SIM v1.0</span>
          </div>
        </footer>
      </div>
    </>
  );
}

// ─────────────────────────────────────────────
// AnimatedNum（カウントアップ）
// ─────────────────────────────────────────────
function AnimatedNum({ value, size = 30, color = "#1e293b" }: { value: number; size?: number; color?: string }) {
  const [displayed, setDisplayed] = useState(value);
  const ref = useRef<number>(value);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const start = ref.current;
    const end   = value;
    const dur   = 900;
    const startTime = performance.now();

    const step = (now: number) => {
      const t = Math.min(1, (now - startTime) / dur);
      const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
      setDisplayed(Math.round(start + (end - start) * eased));
      if (t < 1) { frameRef.current = requestAnimationFrame(step); }
      else { ref.current = end; }
    };
    cancelAnimationFrame(frameRef.current);
    frameRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frameRef.current);
  }, [value]);

  return (
    <span style={{ fontSize: size, fontWeight: 900, color,
      fontFamily: "'Noto Serif JP', serif", letterSpacing: "-0.02em" }}>
      {displayed.toLocaleString()}
    </span>
  );
}
