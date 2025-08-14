'use client'

import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

interface Props {
  href: string
  label: string
  className?: string
}

export function BackNavigation({ href, label, className = "" }: Props) {
  return (
    <Link 
      href={href} 
      className={`inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors ${className}`}
      data-testid="back-navigation"
    >
      <ArrowLeft className="w-4 h-4 mr-2" />
      {label}
    </Link>
  )
}
