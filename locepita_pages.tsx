// ============================================================
// FILE 1: src/app/about/page.tsx
// ============================================================
// PASTE THIS AS: src/app/about/page.tsx

export const metadata = {
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


// ============================================================
// FILE 2: src/app/policy/page.tsx
// ============================================================
// PASTE THIS AS: src/app/policy/page.tsx

export const metadata2 = {
  title: "利用規約・プライバシーポリシー | ロケピタ",
  description: "ロケピタの利用規約・免責事項・プライバシーポリシーについて。",
};

export default function PolicyPage() {
  const sections = [
    {
      title: "免責事項",
      content: [
        "当サイト『ロケピタ』が提供するシミュレーション結果・補助金情報・坪単価データは、公開情報および統計データに基づく参考値であり、実際の融資審査結果、物件契約内容、補助金の採択・交付を保証するものではありません。",
        "当サイトのシミュレーション結果はあくまで統計に基づく目安であり、実際の融資や物件契約を保証するものではありません。最終的な判断は必ず専門家（中小企業診断士・税理士・金融機関担当者・不動産業者等）にご相談ください。",
        "補助金・融資制度の内容・金額・申請期間は年度ごとに変更される場合があります。開業前に必ず各区の公式サイト・産業振興窓口にてご確認ください。",
        "当サイトの情報を利用したことによって生じたいかなる損害についても、運営者は一切の責任を負いかねます。",
      ]
    },
    {
      title: "プライバシーポリシー",
      content: [
        "当サイトでは、Google Analytics 4（GA4）を使用してアクセス状況を計測しています。GA4はCookieを使用してデータを収集しますが、個人を特定する情報は含まれません。Googleによるデータ収集・処理については、Googleのプライバシーポリシーをご確認ください。",
        "当サイトでは、Google AdSenseによる広告配信を行う場合があります。広告配信にあたり、Cookieを使用してユーザーの興味に応じた広告が表示される場合があります。Cookieの使用を無効にする場合は、ブラウザの設定からCookieを無効にしてください。",
        "当サイトへのお問い合わせ時にご提供いただいた個人情報は、お問い合わせへの回答以外の目的には使用しません。",
      ]
    },
    {
      title: "著作権について",
      content: [
        "当サイトに掲載されているコンテンツ（テキスト・デザイン・構造等）の著作権は運営者に帰属します。無断転載・複製はお断りします。",
        "当サイトが参照・掲載している各区の公式情報・補助金データの著作権は各自治体に帰属します。",
      ]
    },
    {
      title: "利用規約",
      content: [
        "当サイトは、飲食店開業を検討される方への情報提供を目的としています。商業目的での無断利用・転載はお断りします。",
        "当サイトは予告なく内容の変更・追加・削除を行う場合があります。",
        "当サイトへのリンクは自由です。ただし、フレーム内での表示はお断りします。",
        "本ポリシーは予告なく変更される場合があります。変更後のポリシーは当ページに掲載した時点で効力を生じるものとします。",
      ]
    },
    {
      title: "お問い合わせ",
      content: [
        "当サイトに関するお問い合わせは、サイト内のお問い合わせフォームまたは運営者のSNSアカウントよりご連絡ください。",
      ]
    },
  ];

  return (
    <div style={{
      minHeight: "100vh", background: "#f8fafc",
      fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;700;900&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap');
        @media (max-width: 768px) {
          .policy-pad { padding: 40px 24px !important; }
          .policy-hero { padding: 60px 24px !important; }
          .nav-links { display: none !important; }
        }
      `}</style>

      {/* ナビゲーション */}
      <nav style={{
        background: "#1e293b", padding: "16px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        position: "sticky", top: 0, zIndex: 100,
      }}>
        <a href="/" style={{ display: "flex", alignItems: "baseline", gap: 4, textDecoration: "none" }}>
          <span style={{ fontSize: 20, fontWeight: 900, color: "white", fontFamily: "'Noto Serif JP', serif" }}>ロケピタ</span>
          <span style={{ fontSize: 18, color: "#fbbf24" }}>.</span>
        </a>
        <div className="nav-links" style={{ display: "flex", gap: 24 }}>
          {[["トップ", "/"], ["シミュレーター", "/sim"], ["運営者について", "/about"], ["利用規約", "/policy"]].map(([label, href]) => (
            <a key={href} href={href} style={{
              fontSize: 11, color: href === "/policy" ? "#fbbf24" : "rgba(255,255,255,0.5)",
              textDecoration: "none", letterSpacing: "0.06em", fontWeight: href === "/policy" ? 700 : 400,
            }}>{label}</a>
          ))}
        </div>
      </nav>

      {/* ヒーロー */}
      <header className="policy-hero" style={{
        background: "#1e293b", padding: "80px 40px 60px", position: "relative", overflow: "hidden",
      }}>
        <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
          <filter id="g4"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" /></filter>
          <rect width="100%" height="100%" filter="url(#g4)" />
        </svg>
        <div style={{ maxWidth: 720, margin: "0 auto", position: "relative", zIndex: 1 }}>
          <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", letterSpacing: "0.15em", marginBottom: 16 }}>LEGAL</p>
          <h1 style={{
            fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "white",
            fontFamily: "'Noto Serif JP', serif", margin: "0 0 16px", letterSpacing: "-0.02em",
          }}>利用規約・免責事項<br />プライバシーポリシー</h1>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.4)", margin: 0 }}>最終更新：2026年3月</p>
        </div>
      </header>

      {/* 本文 */}
      <main className="policy-pad" style={{ maxWidth: 720, margin: "0 auto", padding: "60px 40px 120px" }}>
        {sections.map((sec, i) => (
          <section key={i} style={{ marginBottom: 56 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{
                fontSize: 10, fontWeight: 700, color: "#94a3b8",
                letterSpacing: "0.12em", minWidth: 24,
              }}>
                {String(i + 1).padStart(2, "0")}
              </span>
              <div style={{ flex: 1, height: 1, background: "#e2e8f0" }} />
              <h2 style={{
                fontSize: 16, fontWeight: 800, color: "#1e293b", margin: 0,
                fontFamily: "'Noto Serif JP', serif", whiteSpace: "nowrap",
              }}>{sec.title}</h2>
            </div>
            {sec.content.map((para, j) => (
              <p key={j} style={{
                fontSize: 13, color: "#475569", lineHeight: 2, margin: "0 0 14px",
              }}>{para}</p>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
