// QR Code utility functions

export interface QRData {
  type: 'visitor' | 'amenity'
  id: string
  expiresAt: string
  timestamp: string
}

export function generateQRData(type: 'visitor' | 'amenity', id: string, expiresAt: Date): string {
  const data: QRData = {
    type,
    id,
    expiresAt: expiresAt.toISOString(),
    timestamp: new Date().toISOString()
  }
  return JSON.stringify(data)
}

export function validateQRData(qrData: string): { valid: boolean; data?: QRData; error?: string; expired?: boolean } {
  try {
    const data: QRData = JSON.parse(qrData)
    const now = new Date()
    const expiresAt = new Date(data.expiresAt)
    
    return {
      valid: now < expiresAt,
      data,
      expired: now >= expiresAt
    }
  } catch {
    return { 
      valid: false, 
      error: 'Invalid QR code format' 
    }
  }
}

export function generateVisitorQR(visitorId: string, expiresAt: Date): string {
  return generateQRData('visitor', visitorId, expiresAt)
}

export function generateAmenityQR(bookingId: string, expiresAt: Date): string {
  return generateQRData('amenity', bookingId, expiresAt)
}
