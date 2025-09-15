import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  // For now, let's redirect to a static screenshot
  // You can replace this with an actual screenshot of your landing page
  return new Response(null, {
    status: 302,
    headers: {
      Location: '/casalink-screenshot.png',
    },
  })
}
