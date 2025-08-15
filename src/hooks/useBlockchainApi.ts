'use client'

import { useState } from 'react'
import { BlockchainFormData } from '@/components/blockchain/BlockchainConfigForm'
import { CreatedBlockchain } from '@/components/blockchain/BlockchainSuccessView'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

interface UseBlockchainApiReturn {
  createBlockchain: (formData: BlockchainFormData) => Promise<CreatedBlockchain>
  isLoading: boolean
  errors: Record<string, string>
}

export function useBlockchainApi(): UseBlockchainApiReturn {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const createBlockchain = async (formData: BlockchainFormData): Promise<CreatedBlockchain> => {
    setIsLoading(true)
    setErrors({})

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
        if (data.details && Array.isArray(data.details)) {
          const newErrors: Record<string, string> = {};
          data.details.forEach((error: string) => {
            if (error.toLowerCase().includes('name')) {
              newErrors.name = error;
            } else if (error.toLowerCase().includes('symbol')) {
              newErrors.symbol = error;
            } else if (error.toLowerCase().includes('description')) {
              newErrors.description = error;
            }
          });
          setErrors(newErrors);
        } else {
          setErrors({ general: data.error || data.message || 'Failed to create blockchain' });
        }
        throw new Error(data.error || data.message || 'Failed to create blockchain')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred'
      setErrors({ general: errorMessage });
      throw new Error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createBlockchain,
    isLoading,
    errors
  }
}
