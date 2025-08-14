import { renderHook, act } from '@testing-library/react'
import { useNotification } from '@/hooks/useNotification'

describe('useNotification', () => {
  it('initializes with correct default state', () => {
    const { result } = renderHook(() => useNotification())
    
    expect(result.current.notification).toEqual({
      isOpen: false,
      type: 'info',
      title: '',
      message: ''
    })
  })

  it('shows notification with correct data', () => {
    const { result } = renderHook(() => useNotification())
    
    act(() => {
      result.current.showNotification('success', 'Test Title', 'Test Message')
    })
    
    expect(result.current.notification).toEqual({
      isOpen: true,
      type: 'success',
      title: 'Test Title',
      message: 'Test Message'
    })
  })

  it('closes notification correctly', () => {
    const { result } = renderHook(() => useNotification())
    
    // First show a notification
    act(() => {
      result.current.showNotification('error', 'Error Title', 'Error Message')
    })
    
    expect(result.current.notification.isOpen).toBe(true)
    
    // Then close it
    act(() => {
      result.current.closeNotification()
    })
    
    expect(result.current.notification.isOpen).toBe(false)
    // Other properties should remain
    expect(result.current.notification.type).toBe('error')
    expect(result.current.notification.title).toBe('Error Title')
    expect(result.current.notification.message).toBe('Error Message')
  })

  it('handles different notification types', () => {
    const { result } = renderHook(() => useNotification())
    
    const testCases = [
      { type: 'success' as const, title: 'Success!', message: 'Operation completed' },
      { type: 'error' as const, title: 'Error!', message: 'Something went wrong' },
      { type: 'warning' as const, title: 'Warning!', message: 'Be careful' },
      { type: 'info' as const, title: 'Info', message: 'Just so you know' }
    ]
    
    testCases.forEach(({ type, title, message }) => {
      act(() => {
        result.current.showNotification(type, title, message)
      })
      
      expect(result.current.notification).toEqual({
        isOpen: true,
        type,
        title,
        message
      })
    })
  })

  it('overwrites previous notification when showing new one', () => {
    const { result } = renderHook(() => useNotification())
    
    // Show first notification
    act(() => {
      result.current.showNotification('info', 'First Title', 'First Message')
    })
    
    expect(result.current.notification.title).toBe('First Title')
    
    // Show second notification
    act(() => {
      result.current.showNotification('success', 'Second Title', 'Second Message')
    })
    
    expect(result.current.notification).toEqual({
      isOpen: true,
      type: 'success',
      title: 'Second Title',
      message: 'Second Message'
    })
  })

  it('handles empty strings for title and message', () => {
    const { result } = renderHook(() => useNotification())
    
    act(() => {
      result.current.showNotification('info', '', '')
    })
    
    expect(result.current.notification).toEqual({
      isOpen: true,
      type: 'info',
      title: '',
      message: ''
    })
  })

  it('handles long title and message strings', () => {
    const { result } = renderHook(() => useNotification())
    
    const longTitle = 'This is a very long title that might be used in some edge cases'
    const longMessage = 'This is an extremely long message that contains a lot of information and details about what happened in the application and what the user should do next'
    
    act(() => {
      result.current.showNotification('warning', longTitle, longMessage)
    })
    
    expect(result.current.notification.title).toBe(longTitle)
    expect(result.current.notification.message).toBe(longMessage)
  })
})
