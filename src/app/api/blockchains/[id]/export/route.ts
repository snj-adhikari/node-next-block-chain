import { NextRequest, NextResponse } from 'next/server'
import { BlockchainService } from '../../../../../../backend/src/services/BlockchainService'

const blockchainService = new BlockchainService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const blockchainId = params.id
    console.log(`📥 GET /api/blockchains/${blockchainId}/export - Exporting blockchain`)
    
    const exportedData = await blockchainService.exportBlockchain(blockchainId)
    
    // Create a downloadable file response
    const fileName = `blockchain-${exportedData.metadata.name.replace(/\s+/g, '-').toLowerCase()}-${blockchainId.substring(0, 8)}.json`
    
    console.log(`✅ Successfully exported blockchain ${blockchainId} as ${fileName}`)
    
    return new NextResponse(JSON.stringify(exportedData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Cache-Control': 'no-cache',
        'X-Blockchain-Id': blockchainId,
        'X-Export-Timestamp': new Date().toISOString()
      }
    })
    
  } catch (error) {
    console.error(`❌ Error exporting blockchain ${params.id}:`, error)
    
    if (error instanceof Error && error.message.includes('not found')) {
      return NextResponse.json({ 
        error: 'Blockchain not found',
        blockchainId: params.id
      }, { status: 404 })
    }
    
    return NextResponse.json({ 
      error: 'Failed to export blockchain',
      blockchainId: params.id,
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
