'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Box, 
  Download, 
  Globe, 
  Loader2, 
  CheckCircle, 
  AlertCircle,
  Zap,
  Coffee
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { NotificationModal } from '@/components/ui/Modal'
import Link from 'next/link'

interface BlockchainFormData {
  name: string
  symbol: string
  description: string
  difficulty: number
  reward: number
  maxSupply: number
}

interface CreatedBlockchain {
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

export default function CreateBlockchainPage() {
  const [formData, setFormData] = useState<BlockchainFormData>({
    name: '',
    symbol: '',
    description: '',
    difficulty: 2,
    reward: 50,
    maxSupply: 1000000
  })
  
  const [isCreating, setIsCreating] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [createdBlockchain, setCreatedBlockchain] = useState<CreatedBlockchain | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [notification, setNotification] = useState<{
    isOpen: boolean
    type: 'success' | 'error' | 'warning' | 'info'
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  })

  const showNotification = (type: 'success' | 'error' | 'warning' | 'info', title: string, message: string) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    })
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }))
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = 'Blockchain name is required'
    }
    
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required'
    } else if (formData.symbol.length > 5) {
      newErrors.symbol = 'Symbol should be 5 characters or less'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }
    
    if (formData.difficulty < 1 || formData.difficulty > 6) {
      newErrors.difficulty = 'Difficulty must be between 1 and 6'
    }
    
    if (formData.reward < 1) {
      newErrors.reward = 'Reward must be greater than 0'
    }
    
    if (formData.maxSupply < 1000) {
      newErrors.maxSupply = 'Max supply must be at least 1000'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return
    
    setIsCreating(true)
    
    try {
      // Use the backend API endpoint that expects config and userId
      const response = await fetch('http://localhost:8001/api/blockchain/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          config: formData,
          userId: 'anonymous-user-' + Date.now()
        }),
      })
      
      const data = await response.json()
      
      if (response.ok) {
        setCreatedBlockchain(data.blockchain)
        showNotification('success', 'Blockchain Created!', `Your blockchain "${formData.name}" has been created successfully.`)
      } else {
        throw new Error(data.error || data.message || 'Failed to create blockchain')
      }
    } catch (error) {
      console.error('Blockchain creation error:', error)
      showNotification('error', 'Creation Failed', 'Failed to create blockchain. Please check your connection and try again.')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDownload = async () => {
    if (!createdBlockchain) return
    
    setIsDownloading(true)
    
    try {
      // Create blockchain folder and save file
      const blockchainData = {
        ...createdBlockchain,
        downloadedAt: new Date().toISOString(),
        format: 'Blockchain Generator JSON v1.0'
      }
      
      const blob = new Blob([JSON.stringify(blockchainData, null, 2)], {
        type: 'application/json'
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${createdBlockchain.name}-blockchain.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      
      showNotification('success', 'Download Complete', 'Your blockchain file has been downloaded successfully!')
    } catch (error) {
      console.error('Download error:', error)
      showNotification('error', 'Download Failed', 'Failed to download blockchain. Please try again.')
    } finally {
      setIsDownloading(false)
    }
  }

  const handlePublish = () => {
    showNotification('info', 'Coming Soon!', 'Publishing feature is coming soon! 🚀\\n\\nWe\'re working on a community gallery where you can share your blockchains with others. Stay tuned!')
  }

  const handleInputChange = (field: keyof BlockchainFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (createdBlockchain) {
    return (
      <>
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>

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
                Your custom blockchain <strong>{createdBlockchain.name}</strong> is ready
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Box className="w-5 h-5 mr-2" />
                    Blockchain Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Name</label>
                    <p className="font-semibold">{createdBlockchain.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Symbol</label>
                    <p className="font-semibold">{createdBlockchain.symbol}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Description</label>
                    <p className="text-sm">{createdBlockchain.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Difficulty</label>
                      <p className="font-semibold">{createdBlockchain.difficulty}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Reward</label>
                      <p className="font-semibold">{createdBlockchain.reward}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Status</label>
                    <div className="flex items-center mt-1">
                      <Badge variant="outline" className="text-green-600 border-green-600">
                        Active
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>What's Next?</CardTitle>
                  <CardDescription>
                    Download your blockchain or share it with the community
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button 
                    onClick={handleDownload}
                    disabled={isDownloading}
                    className="w-full"
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
                    onClick={handlePublish}
                    variant="outline"
                    className="w-full"
                  >
                    <Globe className="w-4 h-4 mr-2" />
                    Publish to Gallery
                  </Button>

                  <div className="border-t pt-4">
                    <h4 className="font-medium mb-3">Support Development</h4>
                    <a 
                      href="https://buymeacoffee.com/blockchainbuilder" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block"
                    >
                      <Button variant="outline" className="w-full bg-yellow-50 hover:bg-yellow-100 border-yellow-200">
                        <Coffee className="w-4 h-4 mr-2" />
                        Buy Me a Coffee
                      </Button>
                    </a>
                  </div>

                  <div className="text-center pt-4">
                    <Link href="/create">
                      <Button variant="ghost" size="sm">
                        Create Another Blockchain
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <NotificationModal
          isOpen={notification.isOpen}
          onClose={closeNotification}
          type={notification.type}
          title={notification.title}
          message={notification.message}
        />
      </>
    )
  }

  return (
    <>
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blockchain-500 to-mining-500 rounded-full flex items-center justify-center mb-4">
              <Box className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Create Your Blockchain</h1>
            <p className="text-xl text-muted-foreground">
              Configure your custom blockchain parameters and generate it instantly
            </p>
          </motion.div>

          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Blockchain Configuration
              </CardTitle>
              <CardDescription>
                Fill in the details to create your custom blockchain
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                      Blockchain Name *
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background ${
                        errors.name ? 'border-red-500' : 'border-input'
                      }`}
                      placeholder="e.g., MyCoin"
                    />
                    {errors.name && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.name}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="symbol" className="block text-sm font-medium text-foreground mb-2">
                      Symbol *
                    </label>
                    <input
                      id="symbol"
                      type="text"
                      value={formData.symbol}
                      onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background ${
                        errors.symbol ? 'border-red-500' : 'border-input'
                      }`}
                      placeholder="e.g., MYC"
                      maxLength={5}
                    />
                    {errors.symbol && (
                      <p className="text-sm text-red-500 mt-1 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        {errors.symbol}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none ${
                      errors.description ? 'border-red-500' : 'border-input'
                    }`}
                    placeholder="Describe your blockchain's purpose..."
                  />
                  {errors.description && (
                    <p className="text-sm text-red-500 mt-1 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="difficulty" className="block text-sm font-medium text-foreground mb-2">
                      Mining Difficulty
                    </label>
                    <select
                      id="difficulty"
                      value={formData.difficulty}
                      onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
                      className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    >
                      <option value={1}>1 (Very Easy)</option>
                      <option value={2}>2 (Easy)</option>
                      <option value={3}>3 (Medium)</option>
                      <option value={4}>4 (Hard)</option>
                      <option value={5}>5 (Very Hard)</option>
                      <option value={6}>6 (Extreme)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="reward" className="block text-sm font-medium text-foreground mb-2">
                      Block Reward
                    </label>
                    <input
                      id="reward"
                      type="number"
                      min="1"
                      value={formData.reward}
                      onChange={(e) => handleInputChange('reward', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background ${
                        errors.reward ? 'border-red-500' : 'border-input'
                      }`}
                      placeholder="50"
                    />
                    {errors.reward && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.reward}
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="maxSupply" className="block text-sm font-medium text-foreground mb-2">
                      Max Supply
                    </label>
                    <input
                      id="maxSupply"
                      type="number"
                      min="1000"
                      value={formData.maxSupply}
                      onChange={(e) => handleInputChange('maxSupply', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background ${
                        errors.maxSupply ? 'border-red-500' : 'border-input'
                      }`}
                      placeholder="1000000"
                    />
                    {errors.maxSupply && (
                      <p className="text-sm text-red-500 mt-1">
                        {errors.maxSupply}
                      </p>
                    )}
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isCreating}
                  size="lg"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Creating Blockchain...
                    </>
                  ) : (
                    <>
                      <Box className="w-4 h-4 mr-2" />
                      Create Blockchain
                    </>
                  )}
                </Button>

                <div className="text-center text-sm text-muted-foreground">
                  No account required • Free to use • Instant creation
                </div>
              </form>
            </CardContent>
          </Card>

          <div className="text-center mt-12">
            <Card className="inline-block p-6 bg-yellow-50 border-yellow-200">
              <CardContent className="flex items-center space-x-4">
                <Coffee className="w-8 h-8 text-yellow-600" />
                <div className="text-left">
                  <h3 className="font-medium text-yellow-900">Enjoying our blockchain generator?</h3>
                  <p className="text-sm text-yellow-700">Support development with a coffee!</p>
                </div>
                <a 
                  href="https://buymeacoffee.com/blockchainbuilder" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    Buy Coffee
                  </Button>
                </a>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <NotificationModal
        isOpen={notification.isOpen}
        onClose={closeNotification}
        type={notification.type}
        title={notification.title}
        message={notification.message}
      />
    </>
  )
}
