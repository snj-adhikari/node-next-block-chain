import { NextRequest, NextResponse } from 'next/server'
import { BlockchainService } from '../../../../../../backend/src/services/BlockchainService'

const blockchainService = new BlockchainService()

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blockchainId = params.id
    console.log(`⛏️ POST /api/blockchains/${blockchainId}/mine - Starting mining process`)
    
    // Check if blockchain exists
    const blockchain = await blockchainService.getBlockchain(blockchainId)
    if (!blockchain) {
      console.log(`❌ Blockchain ${blockchainId} not found`)
      return NextResponse.json({ 
        error: 'Blockchain not found',
        blockchainId 
      }, { status: 404 })
    }
    
    // Check if already mining
    if (blockchainService.isBlockchainMining(blockchainId)) {
      console.log(`⏳ Blockchain ${blockchainId} is already being mined`)
      return NextResponse.json({ 
        error: 'Blockchain is already being mined',
        blockchainId,
        status: 'mining_in_progress'
      }, { status: 409 })
    }
    
    // Parse request body for transactions (optional)
    let transactions = []
    try {
      const body = await request.json()
      transactions = body.transactions || []
    } catch {
      // No body or invalid JSON, use empty transactions
      transactions = []
    }
    
    console.log(`🚀 Mining blockchain ${blockchainId} with ${transactions.length} transactions`)
    
    // Mine blockchain with progress tracking
    let lastProgress = { progress: 0, stage: 'Initializing...', blockIndex: 0 }
    
    const minedBlockchain = await blockchainService.mineBlockchain(
      blockchainId,
      transactions,
      (progress) => {
        lastProgress = progress
        // In a real application, you'd emit this via WebSocket
        console.log(`⚡ Mining progress: ${Math.round(progress.progress * 100)}% - ${progress.stage}`)
      }
    )
    
    // Get the newly mined block
    const latestBlock = minedBlockchain.getLatestBlock()
    
    const response = {
      success: true,
      blockchainId,
      blockchain: {
        id: minedBlockchain.id,
        name: minedBlockchain.metadata.name,
        blocks: minedBlockchain.chain.length,
        status: minedBlockchain.status,
        stats: minedBlockchain.metadata.stats
      },
      newBlock: {
        index: latestBlock.index,
        hash: latestBlock.hash,
        previousHash: latestBlock.previousHash,
        timestamp: latestBlock.timestamp,
        transactions: latestBlock.transactions.length,
        nonce: latestBlock.nonce,
        miningTime: latestBlock.miningTime
      },
      miningProgress: lastProgress,
      minedAt: new Date().toISOString()
    }
    
    console.log(`✅ Successfully mined block ${latestBlock.index} for blockchain ${blockchainId}`)
    return NextResponse.json(response, { status: 200 })
    
  } catch (error) {
    console.error(`❌ Error mining blockchain ${params.id}:`, error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      error: 'Failed to mine blockchain',
      blockchainId: params.id,
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blockchainId = params.id
    console.log(`🔍 GET /api/blockchains/${blockchainId}/mine - Checking mining status`)
    
    const isMining = blockchainService.isBlockchainMining(blockchainId)
    const blockchain = await blockchainService.getBlockchain(blockchainId)
    
    if (!blockchain) {
      return NextResponse.json({ 
        error: 'Blockchain not found',
        blockchainId 
      }, { status: 404 })
    }
    
    const response = {
      blockchainId,
      isMining,
      status: blockchain.status,
      totalBlocks: blockchain.chain.length,
      pendingTransactions: blockchain.pendingTransactions.length,
      lastUpdated: blockchain.metadata.updatedAt
    }
    
    console.log(`✅ Mining status for ${blockchainId}: ${isMining ? 'Active' : 'Idle'}`)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error(`❌ Error checking mining status for ${params.id}:`, error)
    
    return NextResponse.json({ 
      error: 'Failed to check mining status',
      blockchainId: params.id,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
