"use client";

export default function Footer() {
  const INK = "#1e293b";
  const AMBER = "#fbbf24";

  return (
    <footer style={{
      background: INK, color: "white",
      fontFamily: "'Zen Kaku Gothic New', 'Noto Sans JP', sans-serif",
      position: "relative", overflow: "hidden",
    }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.04, pointerEvents: "none" }} xmlns="http://www.w3.org/2000/svg">
        <filter id="gf"><feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="4" stitchTiles="stitch" /><feColorMatrix type="saturate" values="0" /></filter>
        <rect width="100%" height="100%" filter="url(#gf)" />
      </svg>

      <div style={{
        position: "relative", zIndex: 1,
        maxWidth: 1280, margin: "0 auto",
        padding: "48px 32px 24px",
      }}>
        {/* 上段 */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 32, marginBottom: 40,
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: 40,
        }}>
          {/* ブランド */}
          <div>
            <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 900, color: "white", fontFamily: "'Noto Serif JP', serif" }}>ロケピタ</span>
              <span style={{ fontSize: 18, color: AMBER }}>.</span>
            </div>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.8, margin: 0, maxWidth: 200 }}>
              「家賃で諦めない」を、<br />この街からなくしたい。
            </p>
          </div>

          {/* サイトマップ */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 12 }}>MENU</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                ["エリアを探す", "/"],
                ["費用シミュレーター", "/sim"],
                ["運営者について", "/about"],
                ["利用規約・ポリシー", "/policy"],
              ].map(([label, href]) => (
                <a key={href} href={href} style={{
                  fontSize: 12, color: "rgba(255,255,255,0.5)", textDecoration: "none",
                  transition: "color 0.15s",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = AMBER)}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
                >{label}</a>
              ))}
            </div>
          </div>

          {/* 対象エリア */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 12 }}>COVERAGE</p>
            <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", lineHeight: 1.9, margin: 0 }}>
              東京23区<br />
              千代田区 / 中央区 / 港区<br />
              新宿区 / 文京区 / 台東区<br />
              墨田区 / 江東区 / 品川区<br />
              目黒区 / 大田区 / 世田谷区<br />
              渋谷区 / 中野区 / 杉並区<br />
              豊島区 / 北区 / 荒川区<br />
              板橋区 / 練馬区 / 足立区<br />
              葛飾区 / 江戸川区
            </p>
          </div>

          {/* 免責 */}
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: "rgba(255,255,255,0.3)", letterSpacing: "0.15em", marginBottom: 12 }}>DISCLAIMER</p>
            <p style={{ fontSize: 10, color: "rgba(255,255,255,0.3)", lineHeight: 1.9, margin: 0 }}>
              掲載データは参考値です。<br />
              補助金・融資条件は年度により変更されます。<br />
              開業前に必ず各区の公式窓口でご確認ください。
            </p>
          </div>
        </div>

        {/* 下段 */}
        <div style={{
          display: "flex", justifyContent: "space-between",
          alignItems: "center", flexWrap: "wrap", gap: 10,
        }}>
          <p style={{ margin: 0, fontSize: 10, color: "rgba(255,255,255,0.2)" }}>
            © 2026 ロケピタ. All rights reserved.
          </p>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.15)", fontFamily: "monospace", letterSpacing: "0.12em" }}>
            LOCEPITA v5.3
          </span>
        </div>
      </div>
    </footer>
  );
}
