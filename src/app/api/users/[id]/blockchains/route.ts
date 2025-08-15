import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../../../backend/src/services/UserService';
import { BlockchainService } from '../../../../../../backend/src/services/BlockchainService';

const userService = new UserService();
const blockchainService = new BlockchainService();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const user = await userService.getUserById(id);
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get detailed blockchain information
    const blockchainDetails = [];
    for (const blockchainId of user.blockchains) {
      try {
        const blockchain = await blockchainService.getBlockchain(blockchainId);
        if (blockchain) {
          blockchainDetails.push({
            id: blockchain.id,
            name: blockchain.metadata.name,
            symbol: blockchain.metadata.name.substring(0, 3).toUpperCase(),
            description: blockchain.metadata.description,
            difficulty: blockchain.difficulty,
            reward: blockchain.miningReward,
            createdAt: blockchain.metadata.createdAt,
            status: blockchain.status,
            blockCount: blockchain.chain.length,
          });
        }
      } catch (error) {
        console.error(`❌ Error fetching blockchain ${blockchainId}:`, error);
      }
    }

    return NextResponse.json({
      success: true,
      blockchains: blockchainDetails,
      count: blockchainDetails.length,
    });

  } catch (error) {
    console.error('❌ Error fetching user blockchains:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user blockchains', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const { blockchainId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!blockchainId) {
      return NextResponse.json(
        { error: 'Blockchain ID is required' },
        { status: 400 }
      );
    }

    // Verify blockchain exists
    const blockchain = await blockchainService.getBlockchain(blockchainId);
    if (!blockchain) {
      return NextResponse.json(
        { error: 'Blockchain not found' },
        { status: 404 }
      );
    }

    // Add blockchain to user
    const updatedUser = await userService.addBlockchainToUser(id, blockchainId);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to add blockchain to user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blockchain added to user successfully',
      blockchains: updatedUser.blockchains,
    });

  } catch (error) {
    console.error('❌ Error adding blockchain to user:', error);
    return NextResponse.json(
      { error: 'Failed to add blockchain to user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { searchParams } = new URL(request.url);
    const blockchainId = searchParams.get('blockchainId');

    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!blockchainId) {
      return NextResponse.json(
        { error: 'Blockchain ID is required as query parameter' },
        { status: 400 }
      );
    }

    // Remove blockchain from user
    const updatedUser = await userService.removeBlockchainFromUser(id, blockchainId);
    
    if (!updatedUser) {
      return NextResponse.json(
        { error: 'Failed to remove blockchain from user' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blockchain removed from user successfully',
      blockchains: updatedUser.blockchains,
    });

  } catch (error) {
    console.error('❌ Error removing blockchain from user:', error);
    return NextResponse.json(
      { error: 'Failed to remove blockchain from user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}