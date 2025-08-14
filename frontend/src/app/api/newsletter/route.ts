import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'

interface NewsletterSubscriber {
  id: string
  email: string
  subscribedAt: string
  status: 'active' | 'unsubscribed'
  source?: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const NEWSLETTER_FILE = path.join(DATA_DIR, 'newsletter_subscribers.json')

// Ensure data directory exists
async function ensureDataDirectory() {
  if (!existsSync(DATA_DIR)) {
    await mkdir(DATA_DIR, { recursive: true })
  }
}

// Load existing subscribers
async function loadSubscribers(): Promise<NewsletterSubscriber[]> {
  try {
    if (!existsSync(NEWSLETTER_FILE)) {
      return []
    }
    const data = await readFile(NEWSLETTER_FILE, 'utf-8')
    return JSON.parse(data)
  } catch (error) {
    console.error('Error loading subscribers:', error)
    return []
  }
}

// Save subscribers
async function saveSubscribers(subscribers: NewsletterSubscriber[]) {
  await ensureDataDirectory()
  await writeFile(NEWSLETTER_FILE, JSON.stringify(subscribers, null, 2))
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Generate unique ID
function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, source = 'website' } = body

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()

    if (!isValidEmail(normalizedEmail)) {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Load existing subscribers
    const subscribers = await loadSubscribers()

    // Check if email already exists
    const existingSubscriber = subscribers.find(sub => sub.email === normalizedEmail)
    
    if (existingSubscriber) {
      if (existingSubscriber.status === 'active') {
        return NextResponse.json(
          { success: false, message: 'Email is already subscribed to our newsletter' },
          { status: 409 }
        )
      } else {
        // Reactivate unsubscribed email
        existingSubscriber.status = 'active'
        existingSubscriber.subscribedAt = new Date().toISOString()
        await saveSubscribers(subscribers)
        
        return NextResponse.json({
          success: true,
          message: 'Successfully resubscribed to newsletter!',
          subscriber: {
            id: existingSubscriber.id,
            email: existingSubscriber.email,
            subscribedAt: existingSubscriber.subscribedAt
          }
        })
      }
    }

    // Create new subscriber
    const newSubscriber: NewsletterSubscriber = {
      id: generateId(),
      email: normalizedEmail,
      subscribedAt: new Date().toISOString(),
      status: 'active',
      source
    }

    subscribers.push(newSubscriber)
    await saveSubscribers(subscribers)

    return NextResponse.json({
      success: true,
      message: 'Successfully subscribed to newsletter! We\'ll keep you updated on new features.',
      subscriber: {
        id: newSubscriber.id,
        email: newSubscriber.email,
        subscribedAt: newSubscriber.subscribedAt
      }
    })

  } catch (error) {
    console.error('Newsletter subscription error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to process subscription. Please try again.' },
      { status: 500 }
    )
  }
}

// Get subscriber stats (for admin use)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get('action')
    
    if (action === 'stats') {
      const subscribers = await loadSubscribers()
      const activeSubscribers = subscribers.filter(sub => sub.status === 'active')
      
      // Group by source
      const sourceStats = activeSubscribers.reduce((acc, sub) => {
        const source = sub.source || 'unknown'
        acc[source] = (acc[source] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      // Group by month
      const monthlyStats = activeSubscribers.reduce((acc, sub) => {
        const month = new Date(sub.subscribedAt).toISOString().slice(0, 7) // YYYY-MM
        acc[month] = (acc[month] || 0) + 1
        return acc
      }, {} as Record<string, number>)
      
      return NextResponse.json({
        success: true,
        stats: {
          totalSubscribers: activeSubscribers.length,
          totalUnsubscribed: subscribers.filter(sub => sub.status === 'unsubscribed').length,
          sourceBreakdown: sourceStats,
          monthlyGrowth: monthlyStats,
          latestSubscribers: activeSubscribers
            .sort((a, b) => new Date(b.subscribedAt).getTime() - new Date(a.subscribedAt).getTime())
            .slice(0, 10)
            .map(sub => ({
              email: sub.email.replace(/(.{3}).*(@.*)/, '$1***$2'), // Mask email
              subscribedAt: sub.subscribedAt,
              source: sub.source
            }))
        }
      })
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )
    
  } catch (error) {
    console.error('Newsletter stats error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch stats' },
      { status: 500 }
    )
  }
}

// Handle unsubscribe
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get('email')
    const id = searchParams.get('id')
    
    if (!email && !id) {
      return NextResponse.json(
        { success: false, message: 'Email or ID is required' },
        { status: 400 }
      )
    }
    
    const subscribers = await loadSubscribers()
    const subscriberIndex = subscribers.findIndex(sub => 
      (email && sub.email === email.toLowerCase().trim()) ||
      (id && sub.id === id)
    )
    
    if (subscriberIndex === -1) {
      return NextResponse.json(
        { success: false, message: 'Subscriber not found' },
        { status: 404 }
      )
    }
    
    subscribers[subscriberIndex].status = 'unsubscribed'
    await saveSubscribers(subscribers)
    
    return NextResponse.json({
      success: true,
      message: 'Successfully unsubscribed from newsletter'
    })
    
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to unsubscribe. Please try again.' },
      { status: 500 }
    )
  }
}
