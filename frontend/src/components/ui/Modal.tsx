'use client'

import { ReactNode, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  closeOnBackdrop?: boolean
}

interface NotificationModalProps {
  isOpen: boolean
  onClose: () => void
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  actionLabel?: string
  onAction?: () => void
}

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  closeOnBackdrop = true 
}: ModalProps) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl'
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={closeOnBackdrop ? onClose : undefined}
            />

            {/* Modal */}
            <div className="inline-block align-bottom bg-background rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:p-6 sm:w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.15 }}
                className={`mx-auto ${sizeClasses[size]}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {title}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-muted-foreground hover:text-foreground transition-colors p-1 hover:bg-muted rounded-md"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Content */}
                <div className="text-foreground">
                  {children}
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      )}
    </AnimatePresence>
  )
}

const NotificationModal = ({
  isOpen,
  onClose,
  type,
  title,
  message,
  actionLabel,
  onAction
}: NotificationModalProps) => {
  const iconMap = {
    success: <CheckCircle className="w-6 h-6 text-green-600" />,
    error: <AlertCircle className="w-6 h-6 text-red-600" />,
    warning: <AlertTriangle className="w-6 h-6 text-yellow-600" />,
    info: <Info className="w-6 h-6 text-blue-600" />
  }

  const colorMap = {
    success: 'bg-green-50 border-green-200',
    error: 'bg-red-50 border-red-200',
    warning: 'bg-yellow-50 border-yellow-200',
    info: 'bg-blue-50 border-blue-200'
  }

  return (
    <div data-testid="notification-modal">
      <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
        <div className={`rounded-lg border p-4 ${colorMap[type]}`}>
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              {iconMap[type]}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground mb-2" data-testid="modal-title">
                {title}
              </p>
              <p className="text-sm text-muted-foreground" data-testid="modal-message">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onClose} data-testid="modal-close-button">
            Close
          </Button>
          {actionLabel && onAction && (
            <Button onClick={onAction} data-testid="modal-action-button">
              {actionLabel}
            </Button>
          )}
        </div>
      </Modal>
    </div>
  )
}

export { Modal, NotificationModal }
