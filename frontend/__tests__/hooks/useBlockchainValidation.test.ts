import { renderHook, act } from '@testing-library/react'
import { useBlockchainValidation } from '@/hooks/useBlockchainValidation'
import { BlockchainFormData } from '@/components/blockchain/BlockchainConfigForm'

describe('useBlockchainValidation', () => {
  it('initializes with empty errors', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    expect(result.current.errors).toEqual({})
  })

  it('validates form with valid data', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    const validFormData: BlockchainFormData = {
      name: 'TestCoin',
      symbol: 'TST',
      description: 'A valid test cryptocurrency',
      difficulty: 3,
      reward: 50,
      maxSupply: 1000000
    }
    
    const isValid = result.current.validateForm(validFormData)
    
    expect(isValid).toBe(true)
    expect(result.current.errors).toEqual({})
  })

  it('validates name field correctly', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    // Test empty name
    let formData: BlockchainFormData = {
      name: '',
      symbol: 'TST',
      description: 'Valid description',
      difficulty: 3,
      reward: 50,
      maxSupply: 1000000
    }
    
    let isValid = result.current.validateForm(formData)
    expect(isValid).toBe(false)
    expect(result.current.errors.name).toBe('Blockchain name is required')
    
    // Test short name
    formData.name = 'A'
    isValid = result.current.validateForm(formData)
    expect(isValid).toBe(false)
    expect(result.current.errors.name).toBe('Blockchain name must be at least 2 characters')
    
    // Test long name
    formData.name = 'A'.repeat(51)
    isValid = result.current.validateForm(formData)
    expect(isValid).toBe(false)
    expect(result.current.errors.name).toBe('Blockchain name must be less than 50 characters')
  })

  it('validates symbol field correctly', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    const baseFormData: BlockchainFormData = {
      name: 'TestCoin',
      symbol: '',
      description: 'Valid description',
      difficulty: 3,
      reward: 50,
      maxSupply: 1000000
    }
    
    // Test empty symbol
    let isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.symbol).toBe('Symbol is required')
    
    // Test long symbol
    baseFormData.symbol = 'TOOLONG'
    isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.symbol).toBe('Symbol should be 5 characters or less')
    
    // Test lowercase symbol
    baseFormData.symbol = 'tst'
    isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.symbol).toBe('Symbol should only contain uppercase letters')
  })

  it('validates description field correctly', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    const baseFormData: BlockchainFormData = {
      name: 'TestCoin',
      symbol: 'TST',
      description: '',
      difficulty: 3,
      reward: 50,
      maxSupply: 1000000
    }
    
    // Test empty description
    let isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.description).toBe('Description is required')
    
    // Test short description
    baseFormData.description = 'Too short'
    isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.description).toBe('Description must be at least 10 characters')
    
    // Test long description
    baseFormData.description = 'A'.repeat(501)
    isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.description).toBe('Description must be less than 500 characters')
  })

  it('validates difficulty field correctly', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    const baseFormData: BlockchainFormData = {
      name: 'TestCoin',
      symbol: 'TST',
      description: 'Valid description',
      difficulty: 0,
      reward: 50,
      maxSupply: 1000000
    }
    
    // Test difficulty too low
    let isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.difficulty).toBe('Difficulty must be between 1 and 6')
    
    // Test difficulty too high
    baseFormData.difficulty = 7
    isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.difficulty).toBe('Difficulty must be between 1 and 6')
  })

  it('validates reward field correctly', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    const baseFormData: BlockchainFormData = {
      name: 'TestCoin',
      symbol: 'TST',
      description: 'Valid description',
      difficulty: 3,
      reward: 0,
      maxSupply: 1000000
    }
    
    // Test reward too low
    let isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.reward).toBe('Reward must be greater than 0')
    
    // Test reward too high
    baseFormData.reward = 10001
    isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.reward).toBe('Reward must be less than 10,000')
  })

  it('validates maxSupply field correctly', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    const baseFormData: BlockchainFormData = {
      name: 'TestCoin',
      symbol: 'TST',
      description: 'Valid description',
      difficulty: 3,
      reward: 50,
      maxSupply: 500
    }
    
    // Test max supply too low
    let isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.maxSupply).toBe('Max supply must be at least 1,000')
    
    // Test max supply too high
    baseFormData.maxSupply = 1000000001
    isValid = result.current.validateForm(baseFormData)
    expect(isValid).toBe(false)
    expect(result.current.errors.maxSupply).toBe('Max supply must be less than 1 billion')
  })

  it('clears specific error', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    const invalidFormData: BlockchainFormData = {
      name: '',
      symbol: '',
      description: '',
      difficulty: 3,
      reward: 50,
      maxSupply: 1000000
    }
    
    // Create some errors
    result.current.validateForm(invalidFormData)
    expect(Object.keys(result.current.errors)).toHaveLength(3)
    
    // Clear one error
    act(() => {
      result.current.clearError('name')
    })
    
    expect(result.current.errors.name).toBeUndefined()
    expect(result.current.errors.symbol).toBeDefined()
    expect(result.current.errors.description).toBeDefined()
  })

  it('clears all errors', () => {
    const { result } = renderHook(() => useBlockchainValidation())
    
    const invalidFormData: BlockchainFormData = {
      name: '',
      symbol: '',
      description: '',
      difficulty: 0,
      reward: 0,
      maxSupply: 500
    }
    
    // Create errors
    result.current.validateForm(invalidFormData)
    expect(Object.keys(result.current.errors).length).toBeGreaterThan(0)
    
    // Clear all errors
    act(() => {
      result.current.clearAllErrors()
    })
    
    expect(result.current.errors).toEqual({})
  })
})
