import React from 'react'
import { render, screen } from '../../src/test-utils'
import { SupportBanner } from '@/components/common/SupportBanner'

describe('SupportBanner', () => {
  it('renders support banner with coffee emoji', () => {
    render(<SupportBanner />)
    
    expect(screen.getByTestId('support-banner')).toBeInTheDocument()
    expect(screen.getByText('☕')).toBeInTheDocument()
  })

  it('renders support text', () => {
    render(<SupportBanner />)
    
    expect(screen.getByText(/support this project/i)).toBeInTheDocument()
    expect(screen.getByText(/buy me a coffee/i)).toBeInTheDocument()
  })

  it('has correct link href', () => {
    render(<SupportBanner />)
    
    const link = screen.getByTestId('coffee-link')
    expect(link).toHaveAttribute('href')
    expect(link.getAttribute('href')).toMatch(/buymeacoffee|ko-fi|paypal/i)
  })

  it('opens link in new tab', () => {
    render(<SupportBanner />)
    
    const link = screen.getByTestId('support-link')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noopener noreferrer')
  })

  it('applies custom className when provided', () => {
    render(<SupportBanner className="custom-banner-class" />)
    
    const container = screen.getByTestId('support-banner').parentElement
    expect(container).toHaveClass('custom-banner-class')
  })

  it('has proper styling classes', () => {
    render(<SupportBanner />)
    
    const container = screen.getByTestId('support-banner').parentElement
    expect(container).toHaveClass('text-center')
  })

  it('renders with accessible link text', () => {
    render(<SupportBanner />)
    
    const link = screen.getByRole('link')
    expect(link).toBeInTheDocument()
    expect(link).toHaveAccessibleName()
  })

  it('handles missing className gracefully', () => {
    render(<SupportBanner />)
    
    const banner = screen.getByTestId('support-banner')
    expect(banner).toBeInTheDocument()
    // Should not throw error without className
  })
})
