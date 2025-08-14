import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  try {
    const blockchainsPath = path.join(process.cwd(), 'backend', 'data', 'blockchains.json')
    
    if (!fs.existsSync(blockchainsPath)) {
      return NextResponse.json([])
    }
    
    const data = fs.readFileSync(blockchainsPath, 'utf8')
    const blockchains = JSON.parse(data)
    return NextResponse.json(blockchains)
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
    
    // Save to file
    const blockchainsPath = path.join(process.cwd(), 'backend', 'data', 'blockchains.json')
    let blockchains: any[] = []
    
    try {
      if (fs.existsSync(blockchainsPath)) {
        const data = fs.readFileSync(blockchainsPath, 'utf8')
        blockchains = JSON.parse(data)
      }
    } catch (error) {
      // File might not exist or be invalid, start with empty array
      blockchains = []
    }
    
    // Ensure directory exists
    const dataDir = path.dirname(blockchainsPath)
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true })
    }
    
    blockchains.push(newBlockchain)
    fs.writeFileSync(blockchainsPath, JSON.stringify(blockchains, null, 2))
    
    return NextResponse.json(newBlockchain, { status: 201 })
  } catch (error) {
    console.error('Error creating blockchain:', error)
    return NextResponse.json({ error: 'Failed to create blockchain' }, { status: 500 })
  }
}
