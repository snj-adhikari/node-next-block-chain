import { render, screen } from '../test-utils'
import { BackNavigation } from '@/components/common/BackNavigation'

describe('BackNavigation', () => {
  it('renders back navigation with required props', () => {
    render(<BackNavigation href="/dashboard" label="Back to Dashboard" />)
    
    expect(screen.getByTestId('back-navigation')).toBeInTheDocument()
    expect(screen.getByText('Back to Dashboard')).toBeInTheDocument()
  })

  it('renders with custom label', () => {
    render(<BackNavigation href="/home" label="Go Back to Home" />)
    
    expect(screen.getByText('Go Back to Home')).toBeInTheDocument()
  })

  it('has correct href attribute', () => {
    render(<BackNavigation href="/dashboard" label="Back" />)
    
    const link = screen.getByTestId('back-navigation')
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('applies custom className', () => {
    render(
      <BackNavigation 
        href="/home" 
        label="Back" 
        className="custom-nav-class" 
      />
    )
    
    const navigation = screen.getByTestId('back-navigation')
    expect(navigation).toHaveClass('custom-nav-class')
  })

  it('renders arrow icon', () => {
    render(<BackNavigation href="/home" label="Back" />)
    
    const link = screen.getByTestId('back-navigation')
    const svg = link.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('has proper accessibility attributes', () => {
    render(<BackNavigation href="/dashboard" label="Back to Dashboard" />)
    
    const link = screen.getByTestId('back-navigation')
    expect(link).toBeInstanceOf(HTMLAnchorElement)
  })

  it('handles different href formats', () => {
    render(<BackNavigation href="/products/123" label="Back to Product" />)
    
    const link = screen.getByTestId('back-navigation')
    expect(link).toHaveAttribute('href', '/products/123')
  })

  it('renders with long labels', () => {
    const longLabel = 'Back to the very detailed product listing page'
    render(<BackNavigation href="/products" label={longLabel} />)
    
    expect(screen.getByText(longLabel)).toBeInTheDocument()
  })
})
