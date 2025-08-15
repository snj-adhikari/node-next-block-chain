import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../../../../backend/src/services/UserService';
import { UserModel } from '../../../../backend/src/models/User';

const userService = new UserService();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, image, provider, googleId } = body;

    // Validate required fields
    if (!email || !name || !provider) {
      return NextResponse.json(
        { error: 'Missing required fields: email, name, provider' },
        { status: 400 }
      );
    }

    // Validate user data
    const validation = UserModel.validateUser({ email, name, provider });
    if (!validation.isValid) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    // Create user
    const user = await userService.createUser({
      email,
      name,
      image,
      provider,
      googleId,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        image: user.image,
        provider: user.provider,
        createdAt: user.createdAt,
        blockchains: user.blockchains,
      },
    }, { status: 201 });

  } catch (error) {
    console.error('❌ Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const googleId = searchParams.get('googleId');

    if (email) {
      const user = await userService.getUserByEmail(email);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: user.provider,
          createdAt: user.createdAt,
          blockchains: user.blockchains,
        },
      });
    }

    if (googleId) {
      const user = await userService.getUserByGoogleId(googleId);
      if (!user) {
        return NextResponse.json(
          { error: 'User not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          provider: user.provider,
          createdAt: user.createdAt,
          blockchains: user.blockchains,
        },
      });
    }

    return NextResponse.json(
      { error: 'Missing query parameter: email or googleId required' },
      { status: 400 }
    );

  } catch (error) {
    console.error('❌ Error fetching user:', error);
    return NextResponse.json(
      { error: 'Failed to fetch user', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}