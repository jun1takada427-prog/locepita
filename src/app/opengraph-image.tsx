import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ロケピタ - 数字を、味方にする。夢を、地図に記す。'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#1e293b',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px 100px',
          position: 'relative',
        }}
      >
        {/* アクセントライン */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '6px', background: '#fbbf24', display: 'flex',
        }} />

        {/* ロゴ */}
        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '40px',
        }}>
          <span style={{
            fontSize: '52px', fontWeight: 900, color: 'white', letterSpacing: '-0.02em',
          }}>ロケピタ</span>
          <span style={{ fontSize: '48px', color: '#fbbf24' }}>.</span>
        </div>

        {/* キャッチコピー */}
        <div style={{
          fontSize: '42px', fontWeight: 700, color: 'white',
          lineHeight: 1.5, letterSpacing: '-0.02em', marginBottom: '40px',
        }}>
          数字を、味方にする。<br />夢を、地図に記す。
        </div>

        {/* サブコピー */}
        <div style={{
          fontSize: '22px', color: 'rgba(255,255,255,0.5)', marginBottom: '60px',
        }}>
          東京23区 飲食店開業支援ナビ
        </div>

        {/* URL */}
        <div style={{
          position: 'absolute', bottom: '48px', right: '100px',
          fontSize: '18px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em',
        }}>
          locepita.vercel.app
        </div>
      </div>
    ),
    { ...size }
  )
}
