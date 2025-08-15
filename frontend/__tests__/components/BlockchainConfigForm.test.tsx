import React from 'react'
import { render, screen, fireEvent, waitFor } from '../test-utils'
import userEvent from '@testing-library/user-event'
import { BlockchainConfigForm, BlockchainFormData } from '@/components/blockchain/BlockchainConfigForm'

const mockOnSubmit = jest.fn()

const defaultProps = {
  onSubmit: mockOnSubmit,
  isLoading: false,
  errors: {}
}

describe('BlockchainConfigForm', () => {
  beforeEach(() => {
    mockOnSubmit.mockClear()
  })

  it('renders all form fields', () => {
    render(<BlockchainConfigForm {...defaultProps} />)
    
    expect(screen.getByTestId('blockchain-form')).toBeInTheDocument()
    expect(screen.getByTestId('blockchain-name-input')).toBeInTheDocument()
    expect(screen.getByTestId('blockchain-symbol-input')).toBeInTheDocument()
    expect(screen.getByTestId('blockchain-description-input')).toBeInTheDocument()
    expect(screen.getByTestId('blockchain-difficulty-select')).toBeInTheDocument()
    expect(screen.getByTestId('blockchain-reward-input')).toBeInTheDocument()
    expect(screen.getByTestId('blockchain-maxsupply-input')).toBeInTheDocument()
    expect(screen.getByTestId('create-blockchain-button')).toBeInTheDocument()
  })

  it('displays form title and description', () => {
    render(<BlockchainConfigForm {...defaultProps} />)
    
    expect(screen.getByText('Blockchain Configuration')).toBeInTheDocument()
    expect(screen.getByText('Fill in the details to create your custom blockchain')).toBeInTheDocument()
  })

  it('handles input changes correctly', async () => {
    const user = userEvent.setup()
    render(<BlockchainConfigForm {...defaultProps} />)
    
    const nameInput = screen.getByTestId('blockchain-name-input')
    const symbolInput = screen.getByTestId('blockchain-symbol-input')
    const descriptionInput = screen.getByTestId('blockchain-description-input')
    
    await user.type(nameInput, 'TestCoin')
    await user.type(symbolInput, 'TST')
    await user.type(descriptionInput, 'A test cryptocurrency')
    
    expect(nameInput).toHaveValue('TestCoin')
    expect(symbolInput).toHaveValue('TST')
    expect(descriptionInput).toHaveValue('A test cryptocurrency')
  })

  it('converts symbol to uppercase', async () => {
    const user = userEvent.setup()
    render(<BlockchainConfigForm {...defaultProps} />)
    
    const symbolInput = screen.getByTestId('blockchain-symbol-input')
    await user.type(symbolInput, 'tst')
    
    expect(symbolInput).toHaveValue('TST')
  })

  it('handles difficulty selection', async () => {
    const user = userEvent.setup()
    render(<BlockchainConfigForm {...defaultProps} />)
    
    const difficultySelect = screen.getByTestId('blockchain-difficulty-select')
    await user.selectOptions(difficultySelect, '4')
    
    expect(difficultySelect).toHaveValue('4')
  })

  it('handles numeric inputs correctly', async () => {
    const user = userEvent.setup()
    render(<BlockchainConfigForm {...defaultProps} />)
    
    const rewardInput = screen.getByTestId('blockchain-reward-input')
    const maxSupplyInput = screen.getByTestId('blockchain-maxsupply-input')
    
    await user.clear(rewardInput)
    await user.type(rewardInput, '100')
    await user.clear(maxSupplyInput)
    await user.type(maxSupplyInput, '2000000')
    
    expect(rewardInput).toHaveValue(100)
    expect(maxSupplyInput).toHaveValue(2000000)
  })

  it('submits form with correct data', async () => {
    const user = userEvent.setup()
    render(<BlockchainConfigForm {...defaultProps} />)
    
    // Fill form
    await user.type(screen.getByTestId('blockchain-name-input'), 'TestCoin')
    await user.type(screen.getByTestId('blockchain-symbol-input'), 'TST')
    await user.type(screen.getByTestId('blockchain-description-input'), 'A test cryptocurrency')
    await user.selectOptions(screen.getByTestId('blockchain-difficulty-select'), '3')
    await user.clear(screen.getByTestId('blockchain-reward-input'))
    await user.type(screen.getByTestId('blockchain-reward-input'), '75')
    await user.clear(screen.getByTestId('blockchain-maxsupply-input'))
    await user.type(screen.getByTestId('blockchain-maxsupply-input'), '2000000')
    
    // Submit
    await user.click(screen.getByTestId('create-blockchain-button'))
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'TestCoin',
        symbol: 'TST',
        description: 'A test cryptocurrency',
        difficulty: 3,
        reward: 75,
        maxSupply: 2000000
      })
    })
  })

  it('shows loading state when isLoading is true', () => {
    render(<BlockchainConfigForm {...defaultProps} isLoading={true} />)
    
    const button = screen.getByTestId('create-blockchain-button')
    expect(button).toHaveTextContent('Creating Blockchain...')
    expect(button).toBeDisabled()
    expect(screen.getByText('Creating Blockchain...')).toBeInTheDocument()
  })

  it('displays validation errors', () => {
    const errors = {
      name: 'Name is required',
      symbol: 'Symbol is too long',
      description: 'Description is required',
      reward: 'Reward must be positive',
      maxSupply: 'Max supply too low'
    }
    
    render(<BlockchainConfigForm {...defaultProps} errors={errors} />)
    
    expect(screen.getByTestId('name-error')).toHaveTextContent('Name is required')
    expect(screen.getByTestId('symbol-error')).toHaveTextContent('Symbol is too long')
    expect(screen.getByTestId('description-error')).toHaveTextContent('Description is required')
    expect(screen.getByTestId('reward-error')).toHaveTextContent('Reward must be positive')
    expect(screen.getByTestId('maxsupply-error')).toHaveTextContent('Max supply too low')
  })

  it('uses initial data when provided', () => {
    const initialData = {
      name: 'InitialCoin',
      symbol: 'INC',
      description: 'Initial description',
      difficulty: 4,
      reward: 25,
      maxSupply: 500000
    }
    
    render(<BlockchainConfigForm {...defaultProps} initialData={initialData} />)
    
    expect(screen.getByTestId('blockchain-name-input')).toHaveValue('InitialCoin')
    expect(screen.getByTestId('blockchain-symbol-input')).toHaveValue('INC')
    expect(screen.getByTestId('blockchain-description-input')).toHaveValue('Initial description')
    expect(screen.getByTestId('blockchain-difficulty-select')).toHaveValue('4')
    expect(screen.getByTestId('blockchain-reward-input')).toHaveValue(25)
    expect(screen.getByTestId('blockchain-maxsupply-input')).toHaveValue(500000)
  })

  it('shows placeholder text correctly', () => {
    render(<BlockchainConfigForm {...defaultProps} />)
    
    expect(screen.getByTestId('blockchain-name-input')).toHaveAttribute('placeholder', 'e.g., MyCoin')
    expect(screen.getByTestId('blockchain-symbol-input')).toHaveAttribute('placeholder', 'e.g., MYC')
    expect(screen.getByTestId('blockchain-description-input')).toHaveAttribute('placeholder', 'Describe your blockchain\'s purpose...')
    expect(screen.getByTestId('blockchain-reward-input')).toHaveAttribute('placeholder', '50')
    expect(screen.getByTestId('blockchain-maxsupply-input')).toHaveAttribute('placeholder', '1000000')
  })
})
