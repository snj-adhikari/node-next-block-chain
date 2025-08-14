'use client'

import { useState } from 'react'
import { BlockchainFormData } from '@/components/blockchain/BlockchainConfigForm'

interface ValidationErrors {
  [key: string]: string
}

export function useBlockchainValidation() {
  const [errors, setErrors] = useState<ValidationErrors>({})

  const validateForm = (formData: BlockchainFormData): boolean => {
    const newErrors: ValidationErrors = {}
    
    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = 'Blockchain name is required'
    } else if (formData.name.length < 2) {
      newErrors.name = 'Blockchain name must be at least 2 characters'
    } else if (formData.name.length > 50) {
      newErrors.name = 'Blockchain name must be less than 50 characters'
    }
    
    // Symbol validation
    if (!formData.symbol.trim()) {
      newErrors.symbol = 'Symbol is required'
    } else if (formData.symbol.length > 5) {
      newErrors.symbol = 'Symbol should be 5 characters or less'
    } else if (!/^[A-Z]+$/.test(formData.symbol)) {
      newErrors.symbol = 'Symbol should only contain uppercase letters'
    }
    
    // Description validation
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    } else if (formData.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters'
    }
    
    // Difficulty validation
    if (formData.difficulty < 1 || formData.difficulty > 6) {
      newErrors.difficulty = 'Difficulty must be between 1 and 6'
    }
    
    // Reward validation
    if (formData.reward < 1) {
      newErrors.reward = 'Reward must be greater than 0'
    } else if (formData.reward > 10000) {
      newErrors.reward = 'Reward must be less than 10,000'
    }
    
    // Max supply validation
    if (formData.maxSupply < 1000) {
      newErrors.maxSupply = 'Max supply must be at least 1,000'
    } else if (formData.maxSupply > 1000000000) {
      newErrors.maxSupply = 'Max supply must be less than 1 billion'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  const clearAllErrors = () => {
    setErrors({})
  }

  return {
    errors,
    validateForm,
    clearError,
    clearAllErrors
  }
}
