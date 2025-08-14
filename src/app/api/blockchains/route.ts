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
    const blockchain = await request.json()
    
    // Basic validation
    if (!blockchain.name || !blockchain.symbol) {
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
    
    // For Vercel, we'll store in a temporary location or use environment variables
    // Since Vercel's file system is read-only, we'll return the blockchain without saving
    // In production, you'd use a database like MongoDB, PostgreSQL, or Vercel KV
    
    console.log('Created blockchain:', newBlockchain)
    
    return NextResponse.json(newBlockchain, { status: 201 })
  } catch (error) {
    console.error('Error creating blockchain:', error)
    return NextResponse.json({ 
      error: 'Failed to create blockchain', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
