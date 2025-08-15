import React from 'react'
import { render, screen } from '../test-utils'
import { PageHeader } from '@/components/common/PageHeader'
import { Box, Star } from 'lucide-react'

describe('PageHeader', () => {
  const defaultProps = {
    title: 'Test Page Title',
    description: 'This is a test page description'
  }

  it('renders with title and description', () => {
    render(<PageHeader {...defaultProps} />)
    
    expect(screen.getByTestId('page-header')).toBeInTheDocument()
    expect(screen.getByTestId('page-title')).toHaveTextContent('Test Page Title')
    expect(screen.getByTestId('page-description')).toHaveTextContent('This is a test page description')
  })

  it('renders with default icon when no icon provided', () => {
    render(<PageHeader {...defaultProps} />)
    
    // The default Box icon should be present
    const iconContainer = screen.getByTestId('page-header').querySelector('.rounded-full')
    expect(iconContainer).toBeInTheDocument()
  })

  it('renders with custom icon when provided', () => {
    render(<PageHeader {...defaultProps} icon={<Star className="w-8 h-8 text-white" data-testid="custom-icon" />} />)
    
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('applies custom className', () => {
    const customClass = 'custom-test-class'
    render(<PageHeader {...defaultProps} className={customClass} />)
    
    const header = screen.getByTestId('page-header')
    expect(header).toHaveClass(customClass)
  })

  it('has proper structure and styling classes', () => {
    render(<PageHeader {...defaultProps} />)
    
    const header = screen.getByTestId('page-header')
    expect(header).toHaveClass('text-center', 'mb-12')
    
    const title = screen.getByTestId('page-title')
    expect(title).toHaveClass('text-3xl', 'md:text-4xl', 'font-bold', 'mb-4')
    
    const description = screen.getByTestId('page-description')
    expect(description).toHaveClass('text-xl', 'text-muted-foreground')
  })

  it('handles long titles and descriptions', () => {
    const longProps = {
      title: 'This is a very long title that might span multiple lines and test how the component handles extensive text content',
      description: 'This is an extremely long description that contains a lot of information about the page and its purpose, which might wrap to multiple lines and should be handled gracefully by the component layout'
    }
    
    render(<PageHeader {...longProps} />)
    
    expect(screen.getByTestId('page-title')).toHaveTextContent(longProps.title)
    expect(screen.getByTestId('page-description')).toHaveTextContent(longProps.description)
  })

  it('handles empty strings gracefully', () => {
    render(<PageHeader title="" description="" />)
    
    expect(screen.getByTestId('page-title')).toBeInTheDocument()
    expect(screen.getByTestId('page-description')).toBeInTheDocument()
  })

  it('maintains accessibility with proper heading structure', () => {
    render(<PageHeader {...defaultProps} />)
    
    const title = screen.getByTestId('page-title')
    expect(title.tagName).toBe('H1')
  })
})
