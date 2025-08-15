import { NextRequest, NextResponse } from 'next/server'
import { BlockchainService } from '../../../../../backend/src/services/BlockchainService'

const blockchainService = new BlockchainService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blockchainId = params.id
    console.log(`🔍 GET /api/blockchains/${blockchainId} - Fetching blockchain details`)
    
    const blockchain = await blockchainService.getBlockchain(blockchainId)
    if (!blockchain) {
      console.log(`❌ Blockchain ${blockchainId} not found`)
      return NextResponse.json({ 
        error: 'Blockchain not found',
        blockchainId 
      }, { status: 404 })
    }
    
    // Format detailed response
    const response = {
      id: blockchain.id,
      metadata: blockchain.metadata,
      difficulty: blockchain.difficulty,
      miningReward: blockchain.miningReward,
      maxSupply: blockchain.maxSupply,
      status: blockchain.status,
      totalBlocks: blockchain.chain.length,
      pendingTransactions: blockchain.pendingTransactions.length,
      blocks: blockchain.chain.map(block => ({
        index: block.index,
        hash: block.hash,
        previousHash: block.previousHash,
        timestamp: block.timestamp,
        transactions: block.transactions.length,
        nonce: block.nonce,
        miningTime: block.miningTime,
        creator: block.creator,
        data: block.data
      })),
      validation: blockchain.validateChain(),
      isMining: blockchainService.isBlockchainMining(blockchainId),
      exportUrl: `/api/blockchains/${blockchainId}/export`
    }
    
    console.log(`✅ Successfully fetched blockchain ${blockchainId} with ${response.totalBlocks} blocks`)
    return NextResponse.json(response)
    
  } catch (error) {
    console.error(`❌ Error fetching blockchain ${params.id}:`, error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      error: 'Failed to fetch blockchain',
      blockchainId: params.id,
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blockchainId = params.id
    console.log(`🗑️ DELETE /api/blockchains/${blockchainId} - Deleting blockchain`)
    
    // For demo purposes, we'll use a demo user ID
    // In production, this would come from authentication
    const userId = 'demo-user'
    
    const success = await blockchainService.deleteBlockchain(blockchainId, userId)
    
    if (!success) {
      return NextResponse.json({ 
        error: 'Blockchain not found or already deleted',
        blockchainId 
      }, { status: 404 })
    }
    
    console.log(`✅ Successfully deleted blockchain ${blockchainId}`)
    return NextResponse.json({ 
      success: true,
      blockchainId,
      deletedAt: new Date().toISOString()
    })
    
  } catch (error) {
    console.error(`❌ Error deleting blockchain ${params.id}:`, error)
    
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json({ 
        error: 'Unauthorized: You can only delete your own blockchains',
        blockchainId: params.id
      }, { status: 403 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to delete blockchain',
      blockchainId: params.id,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blockchainId = params.id
    const body = await request.json()
    console.log(`📝 PUT /api/blockchains/${blockchainId} - Updating blockchain`)
    
    const blockchain = await blockchainService.getBlockchain(blockchainId)
    if (!blockchain) {
      return NextResponse.json({ 
        error: 'Blockchain not found',
        blockchainId 
      }, { status: 404 })
    }
    
    // Handle publishing/unpublishing
    if (body.action === 'publish') {
      const publishData = {
        description: body.description,
        tags: body.tags
      }
      
      const success = await blockchainService.publishBlockchain(blockchainId, publishData)
      
      if (!success) {
        return NextResponse.json({ 
          error: 'Cannot publish blockchain. Ensure it has been mined.',
          blockchainId 
        }, { status: 400 })
      }
      
      console.log(`📢 Published blockchain ${blockchainId}`)
      return NextResponse.json({ 
        success: true,
        action: 'published',
        blockchainId,
        publishedAt: new Date().toISOString()
      })
      
    } else if (body.action === 'unpublish') {
      const success = await blockchainService.unpublishBlockchain(blockchainId)
      
      console.log(`🔒 Unpublished blockchain ${blockchainId}`)
      return NextResponse.json({ 
        success: true,
        action: 'unpublished',
        blockchainId,
        unpublishedAt: new Date().toISOString()
      })
    }
    
    return NextResponse.json({ 
      error: 'Invalid action. Supported actions: publish, unpublish',
      blockchainId 
    }, { status: 400 })
    
  } catch (error) {
    console.error(`❌ Error updating blockchain ${params.id}:`, error)
    
    return NextResponse.json({ 
      error: 'Failed to update blockchain',
      blockchainId: params.id,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
