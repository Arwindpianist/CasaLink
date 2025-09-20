"use client"

import QRCode from 'react-qr-code'

interface QRGeneratorProps {
  data: string
  size?: number
  className?: string
}

export function QRGenerator({ data, size = 200, className = "" }: QRGeneratorProps) {
  return (
    <div className={`flex flex-col items-center space-y-4 ${className}`}>
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCode value={data} size={size} />
      </div>
      <p className="text-sm text-muted-foreground text-center">
        Scan this QR code for access
      </p>
    </div>
  )
}
