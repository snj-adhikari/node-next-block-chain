import React from 'react'
import { render, screen, fireEvent } from '../../src/test-utils'
import userEvent from '@testing-library/user-event'
import { BlockchainSuccessView, CreatedBlockchain } from '@/components/blockchain/BlockchainSuccessView'

const mockBlockchain: CreatedBlockchain = {
  id: '123e4567-e89b-12d3-a456-426614174000',
  name: 'TestCoin',
  symbol: 'TST',
  description: 'A test cryptocurrency for unit testing',
  difficulty: 3,
  reward: 75,
  maxSupply: 2000000,
  blocks: [],
  createdAt: '2025-08-14T12:00:00Z',
  published: false
}

const mockProps = {
  blockchain: mockBlockchain,
  onDownload: jest.fn(),
  onPublish: jest.fn(),
  onCreateAnother: jest.fn(),
  isDownloading: false
}

describe('BlockchainSuccessView', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders successfully with blockchain data', () => {
    render(<BlockchainSuccessView {...mockProps} />)
    
    expect(screen.getByTestId('blockchain-success-view')).toBeInTheDocument()
    expect(screen.getByText('Blockchain Created Successfully!')).toBeInTheDocument()
    expect(screen.getByTestId('blockchain-name')).toHaveTextContent('TestCoin')
  })

  it('displays blockchain details correctly', () => {
    render(<BlockchainSuccessView {...mockProps} />)
    
    expect(screen.getByTestId('detail-name')).toHaveTextContent('TestCoin')
    expect(screen.getByTestId('detail-symbol')).toHaveTextContent('TST')
    expect(screen.getByTestId('detail-description')).toHaveTextContent('A test cryptocurrency for unit testing')
    expect(screen.getByTestId('detail-difficulty')).toHaveTextContent('3')
    expect(screen.getByTestId('detail-reward')).toHaveTextContent('75')
    expect(screen.getByTestId('blockchain-status')).toHaveTextContent('Active')
  })

  it('calls onDownload when download button is clicked', async () => {
    const user = userEvent.setup()
    render(<BlockchainSuccessView {...mockProps} />)
    
    const downloadButton = screen.getByTestId('download-button')
    await user.click(downloadButton)
    
    expect(mockProps.onDownload).toHaveBeenCalledTimes(1)
  })

  it('calls onPublish when publish button is clicked', async () => {
    const user = userEvent.setup()
    render(<BlockchainSuccessView {...mockProps} />)
    
    const publishButton = screen.getByTestId('publish-button')
    await user.click(publishButton)
    
    expect(mockProps.onPublish).toHaveBeenCalledTimes(1)
  })

  it('calls onCreateAnother when create another button is clicked', async () => {
    const user = userEvent.setup()
    render(<BlockchainSuccessView {...mockProps} />)
    
    const createAnotherButton = screen.getByTestId('create-another-button')
    await user.click(createAnotherButton)
    
    expect(mockProps.onCreateAnother).toHaveBeenCalledTimes(1)
  })

  it('shows loading state when downloading', () => {
    render(<BlockchainSuccessView {...mockProps} isDownloading={true} />)
    
    const downloadButton = screen.getByTestId('download-button')
    expect(downloadButton).toHaveTextContent('Downloading...')
    expect(downloadButton).toBeDisabled()
  })

  it('renders cards with correct structure', () => {
    render(<BlockchainSuccessView {...mockProps} />)
    
    expect(screen.getByTestId('blockchain-details-card')).toBeInTheDocument()
    expect(screen.getByTestId('actions-card')).toBeInTheDocument()
    expect(screen.getByText('Blockchain Details')).toBeInTheDocument()
    expect(screen.getByText('What\'s Next?')).toBeInTheDocument()
  })

  it('has correct external link for coffee support', () => {
    render(<BlockchainSuccessView {...mockProps} />)
    
    const coffeeLink = screen.getByTestId('coffee-link')
    expect(coffeeLink).toHaveAttribute('href', 'https://buymeacoffee.com/notjustweb')
    expect(coffeeLink).toHaveAttribute('target', '_blank')
    expect(coffeeLink).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('shows proper button states and icons', () => {
    render(<BlockchainSuccessView {...mockProps} />)
    
    expect(screen.getByTestId('download-button')).toHaveTextContent('Download Blockchain')
    expect(screen.getByTestId('publish-button')).toHaveTextContent('Publish to Gallery')
    expect(screen.getByTestId('create-another-button')).toHaveTextContent('Create Another Blockchain')
  })

  it('handles long blockchain names properly', () => {
    const longNameBlockchain = {
      ...mockBlockchain,
      name: 'This is a very long blockchain name that might cause layout issues'
    }
    
    render(<BlockchainSuccessView {...mockProps} blockchain={longNameBlockchain} />)
    
    expect(screen.getByTestId('blockchain-name')).toHaveTextContent(longNameBlockchain.name)
    expect(screen.getByTestId('detail-name')).toHaveTextContent(longNameBlockchain.name)
  })

  it('displays correct success message with blockchain name', () => {
    render(<BlockchainSuccessView {...mockProps} />)
    
    const successMessage = screen.getByText(/Your custom blockchain/i)
    expect(successMessage).toBeInTheDocument()
    expect(successMessage).toHaveTextContent('TestCoin')
  })
})
