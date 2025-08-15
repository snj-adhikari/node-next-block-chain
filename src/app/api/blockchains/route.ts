import { NextRequest, NextResponse } from 'next/server'
import { BlockchainService } from '../../../../backend/src/services/BlockchainService'
import { BlockchainValidationError } from '../../../../backend/src/models/Errors'

const blockchainService = new BlockchainService()

export async function GET() {
  try {
    console.log('🔍 GET /api/blockchains - Fetching published blockchains')
    
    // Get all published blockchains
    const publishedBlockchains = await blockchainService.getPublishedBlockchains()
    
    // Transform to frontend-friendly format
    const formattedBlockchains = publishedBlockchains.map(blockchain => ({
      id: blockchain.id,
      name: blockchain.metadata.name,
      symbol: blockchain.metadata.name.substring(0, 3).toUpperCase(),
      description: blockchain.metadata.description,
      createdAt: blockchain.metadata.createdAt,
      creator: blockchain.metadata.creator,
      blocks: blockchain.chain.length,
      published: blockchain.metadata.isPublished,
      publishedAt: blockchain.metadata.publishedAt,
      tags: blockchain.metadata.tags,
      stats: blockchain.metadata.stats
    }))
    
    console.log(`✅ Successfully fetched ${formattedBlockchains.length} published blockchains`)
    return NextResponse.json(formattedBlockchains)
    
  } catch (error) {
    console.error('❌ Error reading blockchains:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      error: 'Failed to load blockchains',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 POST /api/blockchains - Creating new blockchain')
    
    const body = await request.json()
    console.log('📦 Received blockchain creation request:', body)
    
    // Extract blockchain configuration
    const { name, description, difficulty = 2, miningReward = 50, maxSupply, tags = [], creatorId = 'demo-user' } = body
    
    // Create blockchain configuration
    const blockchainConfig = {
      name: name.trim(),
      description: description || `Custom blockchain: ${name}`,
      difficulty: parseInt(difficulty.toString()),
      miningReward: parseFloat(miningReward.toString()),
      maxSupply: maxSupply ? parseFloat(maxSupply.toString()) : undefined,
      tags: Array.isArray(tags) ? tags : [],
      genesisData: `Genesis block for ${name} - Created on ${new Date().toISOString()}`
    }
    
    console.log('⚙️ Blockchain configuration:', blockchainConfig)
    
    // Create blockchain using service
    const blockchain = await blockchainService.createBlockchain(blockchainConfig, creatorId)
    
    // Format response for frontend
    const response = {
      id: blockchain.id,
      name: blockchain.metadata.name,
      description: blockchain.metadata.description,
      difficulty: blockchain.difficulty,
      miningReward: blockchain.miningReward,
      maxSupply: blockchain.maxSupply,
      status: blockchain.status,
      createdAt: blockchain.metadata.createdAt,
      blocks: blockchain.chain.length,
      published: blockchain.metadata.isPublished,
      tags: blockchain.metadata.tags,
      stats: blockchain.metadata.stats,
      genesisBlock: {
        index: blockchain.chain[0]?.index,
        hash: blockchain.chain[0]?.hash,
        timestamp: blockchain.chain[0]?.timestamp
      }
    }
    
    console.log('✅ Successfully created blockchain:', response.id)
    return NextResponse.json(response, { status: 201 })
    
  } catch (error) {
    console.error('❌ Error creating blockchain:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    if (error instanceof BlockchainValidationError) {
      return NextResponse.json({ 
        error: 'Invalid blockchain configuration',
        details: error.errors,
        timestamp: new Date().toISOString()
      }, { status: 400 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to create blockchain', 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      requestId: Date.now().toString()
    }, { status: 500 })
  }
}
