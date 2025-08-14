'use client'

import { motion } from 'framer-motion'
import { Box } from 'lucide-react'

interface Props {
  title: string
  description: string
  icon?: React.ReactNode
  className?: string
}

export function PageHeader({ 
  title, 
  description, 
  icon = <Box className="w-8 h-8 text-white" />,
  className = ""
}: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className={`text-center mb-12 ${className}`}
      data-testid="page-header"
    >
      <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blockchain-500 to-mining-500 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-4" data-testid="page-title">
        {title}
      </h1>
      <p className="text-xl text-muted-foreground" data-testid="page-description">
        {description}
      </p>
    </motion.div>
  )
}
