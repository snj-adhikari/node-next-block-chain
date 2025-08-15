'use client'

import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Link from 'next/link'

export default function AuthErrorPage() {
  const searchParams = useSearchParams()
  const error = searchParams.get('error')

  const getErrorMessage = (errorType: string | null) => {
    switch (errorType) {
      case 'Configuration':
        return {
          title: 'Configuration Error',
          description: 'There is a problem with the server configuration. Please contact support.',
          action: 'Contact Support'
        }
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          description: 'You do not have permission to sign in. Please contact an administrator.',
          action: 'Try Again'
        }
      case 'Verification':
        return {
          title: 'Verification Failed',
          description: 'Unable to verify your account. The sign-in link may be expired or invalid.',
          action: 'Get New Link'
        }
      case 'Default':
      default:
        return {
          title: 'Authentication Error',
          description: 'Something went wrong during the sign-in process. Please try again.',
          action: 'Try Again'
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-orange-100">
      <motion.div 
        className="max-w-md w-full space-y-8"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <div className="text-center">
          <Link 
            href="/"
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
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-red-500 to-orange-600 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">Authentication Failed</h2>
            <p className="mt-2 text-sm text-gray-600">
              We encountered an issue signing you in
            </p>
          </motion.div>
        </div>

        {/* Main Card */}
        <Card className="w-full shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-gray-900">{errorInfo.title}</CardTitle>
            <CardDescription>
              {errorInfo.description}
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Error Details */}
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-red-800 mb-1">
                    Error Code: {error || 'UNKNOWN'}
                  </h4>
                  <p className="text-sm text-red-700">
                    {errorInfo.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link href="/auth/signin" className="block">
                <Button className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-white">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Signing In Again
                </Button>
              </Link>
              
              <Link href="/" className="block">
                <Button variant="outline" className="w-full">
                  Continue as Guest
                </Button>
              </Link>
            </div>

            {/* Troubleshooting */}
            <div className="border-t pt-6">
              <h4 className="font-medium mb-3 text-gray-900">Troubleshooting Tips:</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Make sure you're using the correct Google account
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Clear your browser cookies and cache
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Try using an incognito/private browsing window
                </li>
                <li className="flex items-start">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                  Contact support if the problem persists
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Support Link */}
        <div className="text-center">
          <p className="text-xs text-gray-500 mb-2">
            Need help? Contact our support team
          </p>
          <a 
            href="mailto:support@blockchainapp.com" 
            className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
          >
            support@blockchainapp.com
          </a>
        </div>
      </motion.div>
    </div>
  )
}