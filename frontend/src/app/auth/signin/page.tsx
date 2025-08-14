'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, ArrowLeft, Coffee, Bell } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleNewsletterSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) return
    
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setIsSubscribed(true)
        setEmail('')
      } else {
        throw new Error(data.message || 'Failed to subscribe')
      }
    } catch (error) {
      console.error('Newsletter signup error:', error)
      alert('Failed to subscribe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blockchain-50 to-mining-50">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blockchain-500 to-mining-500 rounded-full flex items-center justify-center mb-4">
              <Coffee className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight">Authentication Coming Soon!</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              We're building something amazing for you
            </p>
          </motion.div>
        </div>

        {/* Main Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Stay Updated</CardTitle>
            <CardDescription>
              Be the first to know when authentication features are ready
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {!isSubscribed ? (
              <form onSubmit={handleNewsletterSignup} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent bg-background"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Subscribing...' : 'Notify Me When Ready'}
                  <Bell className="ml-2 w-4 h-4" />
                </Button>
              </form>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-4"
              >
                <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-600 mb-2">Successfully Subscribed!</h3>
                <p className="text-sm text-muted-foreground">
                  We'll notify you as soon as authentication features are available.
                </p>
              </motion.div>
            )}

            {/* Coming Soon Features */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">Coming Soon:</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Google & Facebook Sign-in</li>
                <li>• Personal Dashboard</li>
                <li>• Blockchain Management</li>
                <li>• Advanced Analytics</li>
              </ul>
            </div>

            {/* For now, allow direct blockchain creation */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3">Available Now:</h4>
              <Link href="/create" className="block">
                <Button variant="outline" className="w-full">
                  Create Blockchain Without Login
                </Button>
              </Link>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                No account needed for basic blockchain creation
              </p>
            </div>

            {/* Buy Me Coffee */}
            <div className="border-t pt-6 text-center">
              <h4 className="font-medium mb-3">Support Our Development</h4>
              <a 
                href="https://buymeacoffee.com/blockchainbuilder" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="sm" className="bg-yellow-50 hover:bg-yellow-100 border-yellow-200">
                  <Coffee className="w-4 h-4 mr-2" />
                  Buy Me a Coffee
                </Button>
              </a>
              <p className="text-xs text-muted-foreground mt-2">
                Help us build amazing blockchain tools
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
