'use client'

import { useState } from 'react'

export interface NotificationState {
  isOpen: boolean
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
}

export function useNotification() {
  const [notification, setNotification] = useState<NotificationState>({
    isOpen: false,
    type: 'info',
    title: '',
    message: ''
  })

  const showNotification = (
    type: 'success' | 'error' | 'warning' | 'info', 
    title: string, 
    message: string
  ) => {
    setNotification({
      isOpen: true,
      type,
      title,
      message
    })
  }

  const closeNotification = () => {
    setNotification(prev => ({ ...prev, isOpen: false }))
  }

  return {
    notification,
    showNotification,
    closeNotification
  }
}
