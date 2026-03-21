import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ロケピタについて | ロケピタ",
  description: "ロケピタ開発の背景と、運営者の想いについて。クリエイティブディレクターが妻と、その仲間たちの夢のために作ったツールの物語。",
};

export default function AboutPage() {
  return (
    <div style={{
      minHeight: "100vh",
      background: "#f8fafc",
      fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@300;400;700;900&family=Zen+Kaku+Gothic+New:wght@300;400;500;700&display=swap');
        .about-lead { font-size: clamp(13px, 2vw, 15px); line-height: 2.2; color: #334155; }
        .about-pull { font-size: clamp(18px, 3.5vw, 26px); font-weight: 700; color: #1e293b; line-height: 1.6; font-family: 'Noto Serif JP', serif; letter-spacing: -0.02em; }
        .about-divider { width: 40px; height: 2px; background: #1e293b; margin: 48px 0; }
        .about-caption { font-size: 11px; color: #94a3b8; letter-spacing: 0.15em; font-weight: 500; }
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; }
          .about-hero-pad { padding: 60px 24px !important; }
          .about-body-pad { padding: 0 24px !important; }
        }
      `}</style>

      {/* ナビゲーション */}
      <nav style={{
        background: "#1e293b", padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <a href="/" style={{
          display: "flex", alignItems: "baseline", gap: 4,
          textDecoration: "none",
        }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: "white", fontFamily: "'Noto Serif JP', serif" }}>ロケピタ</span>
          <span style={{ fontSize: 18, color: "#fbbf24" }}>.</span>
        </a>
        <div style={{ display: "flex", gap: 24 }}>
          {[["トップ", "/"], ["シミュレーター", "/sim"], ["運営者について", "/about"], ["利用規約", "/policy"]].map(([label, href]) => (
            <a key={href} href={href} style={{
              fontSize: 11, color: href === "/about" ? "#fbbf24" : "rgba(255,255,255,0.5)",
              textDecoration: "none", letterSpacing: "0.06em", fontWeight: href === "/about" ? 700 : 400,
            }}>{label}</a>
          ))}
        </div>
      </nav>

      {/* ヒーロー */}
      <header className="about-hero-pad" style={{
        background: "#1e293b", padding: "100px 40px 80px",
        position: "relative", overflow: "hidden",
      }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
          <filter id="g2"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
          <rect width="100%" height="100%" filter="url(#g2)" />
        </svg>
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p className="about-caption" style={{ color: "rgba(255,255,255,0.35)", marginBottom: 24 }}>ABOUT LOCEPITA</p>
          <h1 style={{
            fontSize: "clamp(22px, 4vw, 38px)", fontWeight: 900, color: "white",
            fontFamily: "'Noto Serif JP', serif", lineHeight: 1.5,
            letterSpacing: "-0.02em", margin: "0 0 32px",
          }}>
            『ロケピタ』に込めた、<br />個人的な「祈り」と「算盤」。
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", lineHeight: 2, maxWidth: 480 }}>
            クリエイティブディレクター・プランナー・コピーライターとして東京で働く、40歳の生活者が作ったツール。その背景にある、ごく個人的な話をさせてください。
          </p>
        </div>
      </header>

      {/* 本文 */}
      <main style={{ maxWidth: 720, margin: "0 auto", padding: "80px 40px 120px" }} className="about-body-pad">

        {/* セクション1 */}
        <section style={{ marginBottom: 80 }}>
          <p className="about-caption" style={{ marginBottom: 20 }}>01 — きっかけ</p>
          <p className="about-lead">
            私は、東京でクリエイティブディレクター・プランナー・コピーライターとして働く40歳です。
            同時に、食べること、飲むことが何よりも好きな一人の生活者でもあります。
          </p>
          <p className="about-lead" style={{ marginTop: 20 }}>
            実は、今の妻と出会ったきっかけも、その「大好き」の延長線上にありました。
            かつてシェフとして厨房に立っていた彼女は、今、二人の子育てに専念しながら、私の仕事のパートナーとして家庭を支えてくれています。
          </p>
        </section>

        {/* プルクオート */}
        <div style={{
          borderLeft: "3px solid #1e293b", paddingLeft: 32, margin: "0 0 80px",
        }}>
          <p className="about-pull">
            「自分の城を持つ」という<br />輝かしい夢の裏側には、<br />あまりに過酷で複雑な<br />調整事項が山積していた。
          </p>
        </div>

        {/* セクション2 */}
        <section style={{ marginBottom: 80 }}>
          <p className="about-caption" style={{ marginBottom: 20 }}>02 — 現実との衝突</p>
          <p className="about-lead">
            そんな彼女の昔の同僚たちが、今、続々と独立し、自分の店を持ち始めています。
            彼らの挑戦を耳にするたび、私はある現実に直面しました。
          </p>
          <p className="about-lead" style={{ marginTop: 20 }}>
            役所、銀行、不動産、そして何より重くのしかかる「固定費」という、あまりに不透明な壁の存在。
            多くの才能ある料理人が、夢を追う過程で何かを妥協せざるを得ない姿を見てきました。
            それは、いつか再び夢を追い始めるかもしれない妻が、いつか直面するかもしれない壁でもあります。
          </p>
        </section>

        {/* 区切り装飾 */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2,
          margin: "0 0 80px", height: 3,
        }}>
          {["#1e293b", "#94a3b8", "#e2e8f0"].map((c, i) => (
            <div key={i} style={{ background: c, borderRadius: 2 }} />
          ))}
        </div>

        {/* セクション3 */}
        <section style={{ marginBottom: 80 }}>
          <p className="about-caption" style={{ marginBottom: 20 }}>03 — ロケピタが生まれた理由</p>
          <p className="about-lead">
            私は、妻の夢を応援する側でありたい。
            そして、彼女の友人たちや、これから独立という荒波に漕ぎ出そうとするすべての人たちが、暗闇の中で羅針盤を失わないようにしたい。
          </p>
          <p className="about-lead" style={{ marginTop: 20 }}>
            『ロケピタ』は、クリエイティブの視点と、生活者の実感、そして大切な人を守りたいという個人的な想いから生まれたツールです。
          </p>
        </section>

        {/* フィナーレ */}
        <div style={{
          background: "#1e293b", borderRadius: 16, padding: "48px 40px",
          position: "relative", overflow: "hidden",
        }}>
          <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.05, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
            <filter id="g3"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
            <rect width="100%" height="100%" filter="url(#g3)" />
          </svg>
          <div style={{ position: "relative", zIndex: 1 }}>
            <p style={{
              fontSize: "clamp(20px, 3.5vw, 30px)", fontWeight: 900, color: "#fbbf24",
              fontFamily: "'Noto Serif JP', serif", lineHeight: 1.6,
              letterSpacing: "-0.02em", margin: "0 0 20px",
            }}>
              「数字を、味方にする。<br />夢を、地図にする。」
            </p>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.5)", lineHeight: 2, margin: 0 }}>
              この場所が、あなたの最初の一歩を支える<br />確かな灯台になりますように。
            </p>
          </div>
        </div>

        {/* CTAボタン */}
        <div style={{ marginTop: 60, display: "flex", gap: 12, flexWrap: "wrap" }}>
          <a href="/" style={{
            display: "inline-block", padding: "14px 28px", background: "#1e293b",
            color: "#fbbf24", textDecoration: "none", borderRadius: 99,
            fontSize: 13, fontWeight: 700, letterSpacing: "0.04em",
          }}>エリアを探す →</a>
          <a href="/sim" style={{
            display: "inline-block", padding: "14px 28px", background: "transparent",
            color: "#1e293b", textDecoration: "none", borderRadius: 99,
            fontSize: 13, fontWeight: 700, border: "1.5px solid #1e293b",
            letterSpacing: "0.04em",
          }}>費用をシミュレーションする →</a>
        </div>
      </main>
    </div>
  );
}
