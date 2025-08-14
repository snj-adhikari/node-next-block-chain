import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // For demo purposes, return sample stats
    // In production, this would come from a database
    const stats = {
      totalBlockchains: 1,
      totalUsers: 127,
      totalPublished: 1,
      totalBlocks: 5,
      connectedUsers: 3
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting stats:', error)
    return NextResponse.json(
      { error: 'Failed to get stats' },
      { status: 500 }
    )
  }
}
