'use client'

import { Coffee } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'

interface Props {
  className?: string
}

export function SupportBanner({ className = "" }: Props) {
  return (
    <div className={`text-center ${className}`}>
      <Card className="inline-block p-6 bg-yellow-50 border-yellow-200" data-testid="support-banner">
        <CardContent className="flex items-center space-x-4">
          <Coffee className="w-8 h-8 text-yellow-600" />
          <div className="text-left">
            <h3 className="font-medium text-yellow-900">Enjoying our blockchain generator?</h3>
            <p className="text-sm text-yellow-700">Support development with a coffee!</p>
          </div>
          <a
            href="https://buymeacoffee.com/notjustweb" 
            target="_blank"
            rel="noopener noreferrer"
            data-testid="support-link"
          >
            <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
              Buy Coffee
            </Button>
          </a>
        </CardContent>
      </Card>
    </div>
  )
}
