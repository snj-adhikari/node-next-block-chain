import { NextRequest, NextResponse } from 'next/server'

// Simple health check endpoint
export async function GET() {
  return NextResponse.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    message: 'Blockchain Generator API is running'
  })
}
