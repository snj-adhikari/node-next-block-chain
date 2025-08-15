import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  try {
    // For demo purposes, return some sample blockchains
    // In production, this would come from a database
    const sampleBlockchains = [
      {
        id: "1",
        name: "EduCoin",
        symbol: "EDU",
        createdAt: new Date().toISOString(),
        blocks: [],
        published: true,
        description: "Educational blockchain for learning"
      }
    ]
    
    return NextResponse.json(sampleBlockchains)
  } catch (error) {
    console.error('Error reading blockchains:', error)
    return NextResponse.json({ error: 'Failed to load blockchains' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('Blockchain creation request received')
    
    const blockchain = await request.json()
    console.log('Received blockchain data:', blockchain)
    
    // Basic validation
    if (!blockchain.name || !blockchain.symbol) {
      console.log('Validation failed: missing name or symbol')
      return NextResponse.json({ error: 'Name and symbol are required' }, { status: 400 })
    }
    
    // Add timestamp and ID
    const newBlockchain = {
      ...blockchain,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      blocks: [],
      published: false
    }
    
    console.log('Created blockchain:', newBlockchain)
    
    return NextResponse.json(newBlockchain, { status: 201 })
  } catch (error) {
    console.error('Error creating blockchain:', error)
    console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    
    return NextResponse.json({ 
      error: 'Failed to create blockchain', 
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
