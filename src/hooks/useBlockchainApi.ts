'use client'

import { useState } from 'react'
import { BlockchainFormData } from '@/components/blockchain/BlockchainConfigForm'
import { CreatedBlockchain } from '@/components/blockchain/BlockchainSuccessView'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

interface UseBlockchainApiReturn {
  createBlockchain: (formData: BlockchainFormData) => Promise<CreatedBlockchain>
  isLoading: boolean
  error: string | null
}

export function useBlockchainApi(): UseBlockchainApiReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createBlockchain = async (formData: BlockchainFormData): Promise<CreatedBlockchain> => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${API_BASE_URL}/blockchains`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to create blockchain')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createBlockchain,
    isLoading,
    error
  }
}
