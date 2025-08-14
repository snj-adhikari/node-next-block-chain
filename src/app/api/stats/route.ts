import { NextRequest, NextResponse } from 'next/server'
import { readFileSync } from 'fs'
import { join } from 'path'

export async function GET() {
  try {
    // Read blockchains data to get stats
    const dataPath = join(process.cwd(), 'backend', 'data', 'blockchains.json')
    let blockchains = []
    
    try {
      const data = readFileSync(dataPath, 'utf8')
      blockchains = JSON.parse(data)
    } catch (error) {
      // File might not exist yet
      blockchains = []
    }

    const stats = {
      totalBlockchains: blockchains.length || 0,
      totalUsers: 0, // Placeholder - can be implemented later  
      totalPublished: blockchains.filter((b: any) => b.isPublished).length || 0,
      totalBlocks: blockchains.reduce((acc: number, blockchain: any) => {
        return acc + (blockchain.blocks ? blockchain.blocks.length : 0)
      }, 0),
      connectedUsers: 0 // Placeholder for WebSocket connections
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
