'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { 
  ArrowLeft, 
  Box, 
  Download, 
  Globe, 
  Loader2, 
  Search,
  Filter,
  Calendar,
  Zap,
  TrendingUp,
  Coffee,
  ExternalLink
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface Blockchain {
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
  creator?: string
  downloads?: number
}

interface GalleryStats {
  totalBlockchains: number
  totalDownloads: number
  averageDifficulty: number
  mostPopular: string
}

export default function GalleryPage() {
  const [blockchains, setBlockchains] = useState<Blockchain[]>([])
  const [stats, setStats] = useState<GalleryStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all')
  const [sortBy, setSortBy] = useState<'newest' | 'popular' | 'difficulty'>('newest')

  useEffect(() => {
    fetchGalleryData()
  }, [])

  const fetchGalleryData = async () => {
    try {
      // For MVP, we'll show demo data since publishing isn't implemented yet
      const demoBlockchains: Blockchain[] = [
        {
          id: 'demo-1',
          name: 'DemoCoin',
          symbol: 'DEMO',
          description: 'A demonstration blockchain showcasing basic features and mining capabilities.',
          difficulty: 3,
          reward: 50,
          maxSupply: 1000000,
          blocks: [],
          createdAt: '2024-01-15T10:30:00Z',
          published: true,
          creator: 'demo-user',
          downloads: 245
        },
        {
          id: 'demo-2',
          name: 'EcoCoin',
          symbol: 'ECO',
          description: 'An environmentally conscious blockchain designed for carbon credit tracking.',
          difficulty: 2,
          reward: 25,
          maxSupply: 500000,
          blocks: [],
          createdAt: '2024-01-12T14:20:00Z',
          published: true,
          creator: 'eco-builder',
          downloads: 189
        },
        {
          id: 'demo-3',
          name: 'GameToken',
          symbol: 'GAME',
          description: 'A gaming-focused blockchain for in-game asset management and rewards.',
          difficulty: 4,
          reward: 100,
          maxSupply: 2000000,
          blocks: [],
          createdAt: '2024-01-10T09:15:00Z',
          published: true,
          creator: 'game-dev',
          downloads: 312
        },
        {
          id: 'demo-4',
          name: 'LearnChain',
          symbol: 'LEARN',
          description: 'Educational blockchain perfect for understanding basic cryptocurrency concepts.',
          difficulty: 1,
          reward: 10,
          maxSupply: 100000,
          blocks: [],
          createdAt: '2024-01-08T16:45:00Z',
          published: true,
          creator: 'teacher-crypto',
          downloads: 156
        }
      ]

      setBlockchains(demoBlockchains)
      
      const demoStats: GalleryStats = {
        totalBlockchains: demoBlockchains.length,
        totalDownloads: demoBlockchains.reduce((sum, bc) => sum + (bc.downloads || 0), 0),
        averageDifficulty: Math.round(demoBlockchains.reduce((sum, bc) => sum + bc.difficulty, 0) / demoBlockchains.length),
        mostPopular: demoBlockchains.sort((a, b) => (b.downloads || 0) - (a.downloads || 0))[0].name
      }
      
      setStats(demoStats)
    } catch (error) {
      console.error('Error fetching gallery data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const filteredAndSortedBlockchains = blockchains
    .filter(blockchain => {
      const matchesSearch = blockchain.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           blockchain.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           blockchain.description.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesDifficulty = selectedDifficulty === 'all' || 
                               blockchain.difficulty.toString() === selectedDifficulty
      
      return matchesSearch && matchesDifficulty
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return (b.downloads || 0) - (a.downloads || 0)
        case 'difficulty':
          return b.difficulty - a.difficulty
        case 'newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      }
    })

  const handleDownload = async (blockchainId: string, name: string) => {
    try {
      // For demo purposes, simulate download
      const demoBlockchainData = {
        blockchain: blockchains.find(bc => bc.id === blockchainId),
        downloadedAt: new Date().toISOString()
      }
      
      const blob = new Blob([JSON.stringify(demoBlockchainData, null, 2)], {
        type: 'application/json'
      })
      
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.style.display = 'none'
      a.href = url
      a.download = `${name}-blockchain.json`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      
      // Update download count
      setBlockchains(prev => prev.map(bc => 
        bc.id === blockchainId 
          ? { ...bc, downloads: (bc.downloads || 0) + 1 }
          : bc
      ))
    } catch (error) {
      console.error('Download error:', error)
      alert('Failed to download blockchain. Please try again.')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDifficultyColor = (difficulty: number) => {
    if (difficulty <= 2) return 'bg-green-100 text-green-800 border-green-200'
    if (difficulty <= 4) return 'bg-yellow-100 text-yellow-800 border-yellow-200'
    return 'bg-red-100 text-red-800 border-red-200'
  }

  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['', 'Very Easy', 'Easy', 'Medium', 'Hard', 'Very Hard', 'Extreme']
    return labels[difficulty] || 'Unknown'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading blockchain gallery...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
            <Globe className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Blockchain Gallery</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Explore and download community-created blockchains
          </p>
          
          {/* Coming Soon Banner */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <div className="flex items-center justify-center mb-2">
              <Zap className="w-5 h-5 text-blue-600 mr-2" />
              <span className="font-medium text-blue-900">Community Publishing Coming Soon!</span>
            </div>
            <p className="text-sm text-blue-700">
              Currently showing demo blockchains. User publishing and sharing features will be available in the next update.
            </p>
          </div>
        </motion.div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-primary">{stats.totalBlockchains}</div>
                <p className="text-sm text-muted-foreground">Total Blockchains</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.totalDownloads}</div>
                <p className="text-sm text-muted-foreground">Total Downloads</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.averageDifficulty}</div>
                <p className="text-sm text-muted-foreground">Avg Difficulty</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-lg font-bold text-purple-600 truncate">{stats.mostPopular}</div>
                <p className="text-sm text-muted-foreground">Most Popular</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search blockchains..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
            />
          </div>
          
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          >
            <option value="all">All Difficulties</option>
            <option value="1">Very Easy</option>
            <option value="2">Easy</option>
            <option value="3">Medium</option>
            <option value="4">Hard</option>
            <option value="5">Very Hard</option>
            <option value="6">Extreme</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="px-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Popular</option>
            <option value="difficulty">Difficulty</option>
          </select>
        </div>

        {/* Blockchain Grid */}
        {filteredAndSortedBlockchains.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Box className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No blockchains found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or filters
              </p>
              <Link href="/create">
                <Button>Create Your Own</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredAndSortedBlockchains.map((blockchain, index) => (
              <motion.div
                key={blockchain.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{blockchain.name}</CardTitle>
                        <CardDescription className="text-sm font-medium">
                          {blockchain.symbol}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant="outline"
                        className={getDifficultyColor(blockchain.difficulty)}
                      >
                        {getDifficultyLabel(blockchain.difficulty)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {blockchain.description}
                    </p>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Reward:</span>
                        <span className="font-medium">{blockchain.reward}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Max Supply:</span>
                        <span className="font-medium">{blockchain.maxSupply.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Downloads:</span>
                        <span className="font-medium flex items-center">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {blockchain.downloads || 0}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span className="font-medium flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDate(blockchain.createdAt)}
                        </span>
                      </div>
                    </div>
                    
                    <Button
                      onClick={() => handleDownload(blockchain.id, blockchain.name)}
                      className="w-full"
                      size="sm"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <Card className="inline-block p-8 bg-gradient-to-r from-blockchain-50 to-mining-50 border-blockchain-200">
            <CardContent className="text-center">
              <Box className="w-12 h-12 mx-auto text-blockchain-600 mb-4" />
              <h3 className="text-xl font-bold mb-2">Create Your Own Blockchain</h3>
              <p className="text-muted-foreground mb-4">
                Join the community and share your unique blockchain with others
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/create">
                  <Button size="lg">
                    <Box className="w-4 h-4 mr-2" />
                    Start Creating
                  </Button>
                </Link>
                <a 
                  href="https://buymeacoffee.com/notjustweb" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="lg">
                    <Coffee className="w-4 h-4 mr-2" />
                    Support Project
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
