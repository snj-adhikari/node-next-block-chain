'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Chrome, Loader2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export default function SignInPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const callbackUrl = searchParams.get('callbackUrl') || '/'

  // Redirect if already signed in
  useEffect(() => {
    if (session) {
      router.push(callbackUrl)
    }
  }, [session, router, callbackUrl])

  // Check for auth errors in URL
  useEffect(() => {
    const errorParam = searchParams.get('error')
    if (errorParam) {
      switch (errorParam) {
        case 'Configuration':
          setError('Authentication configuration error. Please contact support.')
          break
        case 'AccessDenied':
          setError('Access denied. Please try again.')
          break
        case 'Verification':
          setError('Unable to verify your account. Please try again.')
          break
        default:
          setError('Authentication failed. Please try again.')
      }
    }
  }, [searchParams])

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('🔐 Initiating Google sign-in...')
      
      const result = await signIn('google', {
        callbackUrl,
        redirect: false,
      })
      
      if (result?.error) {
        console.error('❌ Sign-in error:', result.error)
        setError('Failed to sign in with Google. Please try again.')
      } else if (result?.url) {
        console.log('✅ Sign-in successful, redirecting...')
        router.push(result.url)
      }
    } catch (error) {
      console.error('❌ Sign-in error:', error)
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-100">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center">
          <Link 
            href={callbackUrl}
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-6"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Chrome className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Welcome Back</h2>
            <p className="mt-2 text-sm text-gray-600">
              Sign in to access your blockchain dashboard
            </p>
          </motion.div>
        </div>

        {/* Main Card */}
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">Sign In to Your Account</CardTitle>
            <CardDescription>
              Access your personalized blockchain management dashboard
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-md p-3 flex items-center"
              >
                <AlertCircle className="h-5 w-5 text-red-400 mr-3 flex-shrink-0" />
                <span className="text-sm text-red-800">{error}</span>
              </motion.div>
            )}

            {/* Google Sign-in Button */}
            <div className="space-y-4">
              <Button 
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full h-12 bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 shadow-sm flex items-center justify-center"
                variant="outline"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <>
                    <Chrome className="w-5 h-5 mr-3" />
                    Continue with Google
                  </>
                )}
              </Button>
            </div>

            {/* Features Preview */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3 text-gray-900">With your account you get:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Personal blockchain dashboard
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Save and manage your blockchains
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Advanced blockchain analytics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  Export and share capabilities
                </li>
              </ul>
            </div>

            {/* Alternative Access */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3 text-gray-900">No account needed?</h4>
              <Link href="/create" className="block">
                <Button variant="outline" className="w-full">
                  Create Blockchain as Guest
                </Button>
              </Link>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Limited features available without signing in
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </motion.div>
    </div>
  )
}