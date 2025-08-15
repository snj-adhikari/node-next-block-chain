import { NextRequest, NextResponse } from 'next/server'
import { BlockchainService } from '../../../../backend/src/services/BlockchainService'

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
    
    // Comprehensive validation
    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      console.log('❌ Validation failed: Invalid name')
      return NextResponse.json({ 
        error: 'Blockchain name is required and must be at least 3 characters long',
        field: 'name'
      }, { status: 400 })
    }
    
    if (name.length > 50) {
      console.log('❌ Validation failed: Name too long')
      return NextResponse.json({ 
        error: 'Blockchain name must be less than 50 characters',
        field: 'name'
      }, { status: 400 })
    }
    
    if (difficulty < 1 || difficulty > 6) {
      console.log('❌ Validation failed: Invalid difficulty')
      return NextResponse.json({ 
        error: 'Difficulty must be between 1 and 6',
        field: 'difficulty'
      }, { status: 400 })
    }
    
    if (miningReward < 0 || miningReward > 1000) {
      console.log('❌ Validation failed: Invalid mining reward')
      return NextResponse.json({ 
        error: 'Mining reward must be between 0 and 1000',
        field: 'miningReward'
      }, { status: 400 })
    }
    
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
    
    // Handle specific blockchain service errors
    if (error instanceof Error && error.message.includes('Invalid blockchain configuration')) {
      return NextResponse.json({ 
        error: 'Invalid blockchain configuration',
        details: error.message,
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
