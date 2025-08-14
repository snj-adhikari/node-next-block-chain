'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'

export interface BlockchainFormData {
  name: string
  symbol: string
  description: string
  difficulty: number
  reward: number
  maxSupply: number
}

interface Props {
  onSubmit: (formData: BlockchainFormData) => void
  isLoading: boolean
  errors: Record<string, string>
  initialData?: Partial<BlockchainFormData>
}

const defaultFormData: BlockchainFormData = {
  name: '',
  symbol: '',
  description: '',
  difficulty: 2,
  reward: 50,
  maxSupply: 1000000
}

export function BlockchainConfigForm({ onSubmit, isLoading, errors, initialData }: Props) {
  const [formData, setFormData] = useState<BlockchainFormData>({
    ...defaultFormData,
    ...initialData
  })

  const handleInputChange = (field: keyof BlockchainFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto" data-testid="blockchain-config-form">
      <CardHeader>
        <CardTitle className="flex items-center" data-testid="form-title">
          <Zap className="w-5 h-5 mr-2" />
          Blockchain Configuration
        </CardTitle>
        <CardDescription data-testid="form-description">
          Fill in the details to create your custom blockchain
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6" data-testid="blockchain-form">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2" data-testid="name-label">
                Blockchain Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background ${
                  errors.name ? 'border-red-500' : 'border-input'
                }`}
                placeholder="e.g., MyCoin"
                data-testid="blockchain-name-input"
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1 flex items-center" data-testid="name-error">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="symbol" className="block text-sm font-medium text-foreground mb-2" data-testid="symbol-label">
                Symbol *
              </label>
              <input
                id="symbol"
                name="symbol"
                type="text"
                value={formData.symbol}
                onChange={(e) => handleInputChange('symbol', e.target.value.toUpperCase())}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background ${
                  errors.symbol ? 'border-red-500' : 'border-input'
                }`}
                placeholder="e.g., MYC"
                maxLength={5}
                data-testid="blockchain-symbol-input"
              />
              {errors.symbol && (
                <p className="text-sm text-red-500 mt-1 flex items-center" data-testid="symbol-error">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  {errors.symbol}
                </p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2" data-testid="description-label">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background resize-none ${
                errors.description ? 'border-red-500' : 'border-input'
              }`}
              placeholder="Describe your blockchain's purpose..."
              data-testid="blockchain-description-input"
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1 flex items-center" data-testid="description-error">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.description}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="difficulty" className="block text-sm font-medium text-foreground mb-2" data-testid="difficulty-label">
                Mining Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={(e) => handleInputChange('difficulty', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                data-testid="blockchain-difficulty-select"
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
              <label htmlFor="reward" className="block text-sm font-medium text-foreground mb-2" data-testid="reward-label">
                Block Reward
              </label>
              <input
                id="reward"
                name="reward"
                type="number"
                min="1"
                value={formData.reward}
                onChange={(e) => handleInputChange('reward', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background ${
                  errors.reward ? 'border-red-500' : 'border-input'
                }`}
                placeholder="50"
                data-testid="blockchain-reward-input"
              />
              {errors.reward && (
                <p className="text-sm text-red-500 mt-1" data-testid="reward-error">
                  {errors.reward}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="maxSupply" className="block text-sm font-medium text-foreground mb-2" data-testid="maxsupply-label">
                Max Supply
              </label>
              <input
                id="maxSupply"
                name="maxSupply"
                type="number"
                min="1000"
                value={formData.maxSupply}
                onChange={(e) => handleInputChange('maxSupply', parseInt(e.target.value) || 0)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-ring bg-background ${
                  errors.maxSupply ? 'border-red-500' : 'border-input'
                }`}
                placeholder="1000000"
                data-testid="blockchain-maxsupply-input"
              />
              {errors.maxSupply && (
                <p className="text-sm text-red-500 mt-1" data-testid="maxsupply-error">
                  {errors.maxSupply}
                </p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
            size="lg"
            data-testid="create-blockchain-button"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 mr-2 spinner" />
                Creating Blockchain...
              </>
            ) : (
              'Create Blockchain'
            )}
          </Button>

          <div className="text-center text-sm text-muted-foreground" data-testid="form-note">
            No account required • Free to use • Instant creation
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
