'use client'

import { motion } from 'framer-motion'
import { 
  CheckCircle, 
  Box, 
  Download, 
  Globe, 
  Loader2, 
  Coffee
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

export interface CreatedBlockchain {
  id: string
  name: string
  symbol: string
  description: string
  difficulty: number
  reward: number
  maxSupply: number
  blocks: any[]
  createdAt: string
  published: boolean
}

interface Props {
  blockchain: CreatedBlockchain
  onDownload: () => void
  onPublish: () => void
  onCreateAnother: () => void
  isDownloading: boolean
}

export function BlockchainSuccessView({ 
  blockchain, 
  onDownload, 
  onPublish, 
  onCreateAnother,
  isDownloading 
}: Props) {
  return (
    <div className="max-w-4xl mx-auto" data-testid="blockchain-success-view">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-12"
      >
        <div className="w-20 h-20 mx-auto bg-green-100 rounded-full flex items-center justify-center mb-4">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Blockchain Created Successfully!</h1>
        <p className="text-xl text-muted-foreground">
          Your custom blockchain <strong data-testid="blockchain-name">{blockchain.name}</strong> is ready
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        <Card data-testid="blockchain-details-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Box className="w-5 h-5 mr-2" />
              Blockchain Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Name</label>
              <p className="font-semibold" data-testid="detail-name">{blockchain.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Symbol</label>
              <p className="font-semibold" data-testid="detail-symbol">{blockchain.symbol}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Description</label>
              <p className="text-sm" data-testid="detail-description">{blockchain.description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                <p className="font-semibold" data-testid="detail-difficulty">{blockchain.difficulty}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Reward</label>
                <p className="font-semibold" data-testid="detail-reward">{blockchain.reward}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Status</label>
              <div className="flex items-center mt-1">
                <Badge variant="outline" className="text-green-600 border-green-600" data-testid="blockchain-status">
                  Active
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="actions-card">
          <CardHeader>
            <CardTitle>What's Next?</CardTitle>
            <CardDescription>
              Download your blockchain or share it with the community
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={onDownload}
              disabled={isDownloading}
              className="w-full"
              data-testid="download-button"
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  Download Blockchain
                </>
              )}
            </Button>

            <Button 
              onClick={onPublish}
              variant="outline"
              className="w-full"
              data-testid="publish-button"
            >
              <Globe className="w-4 h-4 mr-2" />
              Publish to Gallery
            </Button>

            <div className="border-t pt-4">
              <h4 className="font-medium mb-3">Support Development</h4>
              <a
                href="https://buymeacoffee.com/notjustweb" 
                target="_blank"
                rel="noopener noreferrer"
                className="block"
                data-testid="coffee-link"
              >
                <Button variant="outline" className="w-full bg-yellow-50 hover:bg-yellow-100 border-yellow-200">
                  <Coffee className="w-4 h-4 mr-2" />
                  Buy Me a Coffee
                </Button>
              </a>
            </div>

            <div className="text-center pt-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onCreateAnother}
                data-testid="create-another-button"
              >
                Create Another Blockchain
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
