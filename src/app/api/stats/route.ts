import { NextRequest, NextResponse } from 'next/server'
import { BlockchainService } from '../../../../backend/src/services/BlockchainService'

const blockchainService = new BlockchainService()

export async function GET() {
  try {
    console.log('📊 GET /api/stats - Fetching blockchain statistics')
    
    // Get comprehensive stats from service
    const serviceStats = await blockchainService.getBlockchainStats()
    
    // Get published blockchains for additional metrics
    const publishedBlockchains = await blockchainService.getPublishedBlockchains()
    
    // Calculate additional metrics
    const totalBlocks = publishedBlockchains.reduce((total, blockchain) => 
      total + blockchain.chain.length, 0
    )
    
    const totalTransactions = publishedBlockchains.reduce((total, blockchain) => 
      total + blockchain.metadata.stats.totalTransactions, 0
    )
    
    const avgMiningTime = publishedBlockchains.length > 0 
      ? publishedBlockchains.reduce((total, blockchain) => 
          total + blockchain.metadata.stats.avgMiningTime, 0
        ) / publishedBlockchains.length
      : 0
    
    // Combine stats
    const stats = {
      totalBlockchains: serviceStats.totalBlockchains || 0,
      totalUsers: serviceStats.totalUsers || 127, // Demo value until user system is implemented
      totalPublished: publishedBlockchains.length,
      totalBlocks,
      totalTransactions,
      avgMiningTime: Math.round(avgMiningTime * 100) / 100,
      connectedUsers: Math.floor(Math.random() * 10) + 1, // Demo real-time value
      lastUpdated: new Date().toISOString(),
      systemHealth: 'healthy'
    }

    console.log('✅ Successfully calculated stats:', stats)
    return NextResponse.json(stats)
    
  } catch (error) {
    console.error('❌ Error getting stats:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    // Return fallback stats on error to prevent homepage crashes
    const fallbackStats = {
      totalBlockchains: 0,
      totalUsers: 127,
      totalPublished: 0,
      totalBlocks: 0,
      totalTransactions: 0,
      avgMiningTime: 0,
      connectedUsers: 1,
      lastUpdated: new Date().toISOString(),
      systemHealth: 'degraded',
      error: 'Some statistics may be unavailable'
    }
    
    return NextResponse.json(fallbackStats, { status: 200 }) // Return 200 to prevent frontend crashes
  }
}
