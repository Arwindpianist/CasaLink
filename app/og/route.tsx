import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fcf8f9',
          backgroundImage: 'linear-gradient(45deg, #c64e80 0%, #dcbc93 50%, #d3cc78 100%)',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            borderRadius: '20px',
            padding: '60px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
            maxWidth: '800px',
            margin: '0 40px',
          }}
        >
          <div
            style={{
              fontSize: '72px',
              fontWeight: 'bold',
              color: '#c64e80',
              marginBottom: '20px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            CasaLink
          </div>
          <div
            style={{
              fontSize: '32px',
              color: '#17070e',
              textAlign: 'center',
              marginBottom: '30px',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            Condominium Management System
          </div>
          <div
            style={{
              fontSize: '24px',
              color: '#666',
              textAlign: 'center',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            A smarter, friendlier way to manage your condominium
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
