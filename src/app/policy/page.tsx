import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "利用規約・プライバシーポリシー | ロケピタ",
  description: "ロケピタの利用規約・免責事項・プライバシーポリシーについて。",
};

export default function PolicyPage() {
  const sections = [
    {
      title: "免責事項",
      content: [
        "当サイト『ロケピタ』が提供するシミュレーション結果・補助金情報・坪単価データは、公開情報および統計データに基づく参考値であり、実際の融資審査結果、物件契約内容、補助金の採択・交付を保証するものではありません。",
        "当サイトのシミュレーション結果は統計に基づく目安であり、実際の契約や融資を保証するものではありません。",
        "最終的な判断は必ず専門家（中小企業診断士・税理士・金融機関担当者・不動産業者等）にご相談ください。",
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
