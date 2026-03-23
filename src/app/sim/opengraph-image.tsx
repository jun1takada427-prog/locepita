import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ロケピタ 初期費用シミュレーター'
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
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0,
          height: '6px', background: '#fbbf24', display: 'flex',
        }} />

        <div style={{
          display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '40px',
        }}>
          <span style={{ fontSize: '36px', fontWeight: 900, color: 'rgba(255,255,255,0.5)' }}>ロケピタ</span>
          <span style={{ fontSize: '32px', color: '#fbbf24' }}>.</span>
          <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.3)', marginLeft: '12px', letterSpacing: '0.15em' }}>SIM</span>
        </div>

        <div style={{
          fontSize: '48px', fontWeight: 700, color: 'white',
          lineHeight: 1.4, letterSpacing: '-0.02em', marginBottom: '32px',
        }}>
          初期費用シミュレーター
        </div>

        <div style={{
          fontSize: '24px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.7,
        }}>
          坪数を動かすだけで、<br />補助金活用後の実質負担額がリアルタイムでわかる。
        </div>

        <div style={{
          position: 'absolute', bottom: '48px', right: '100px',
          fontSize: '18px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em',
        }}>
          locepita.vercel.app/sim
        </div>
      </div>
    ),
    { ...size }
  )
}
