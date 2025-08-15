'use client'

import { PageHeader } from '@/components/common/PageHeader'
import { SupportBanner } from '@/components/common/SupportBanner'
import { BlockchainConfigForm } from '@/components/blockchain/BlockchainConfigForm'
import { BlockchainSuccessView } from '@/components/blockchain/BlockchainSuccessView'
import { useBlockchainApi } from '@/hooks/useBlockchainApi'
import { useState } from 'react'
import type { CreatedBlockchain } from '@/components/blockchain/BlockchainSuccessView'
import type { BlockchainFormData } from '@/components/blockchain/BlockchainConfigForm'

export default function CreateBlockchainPage() {
  const [createdBlockchain, setCreatedBlockchain] = useState<CreatedBlockchain | null>(null)
  const [isDownloading, setIsDownloading] = useState(false)
  const { createBlockchain, isLoading, errors } = useBlockchainApi()

  const handleSubmit = async (formData: BlockchainFormData) => {
    try {
      const blockchain = await createBlockchain(formData)
      setCreatedBlockchain(blockchain)
    } catch (err) {
      console.error('Error creating blockchain:', err)
    }
  }

  const handleDownload = () => {
    if (!createdBlockchain) return
    
    setIsDownloading(true)
    const dataStr = JSON.stringify(createdBlockchain, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `${createdBlockchain.name}-blockchain.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
    
    setTimeout(() => setIsDownloading(false), 1000)
  }

  const handlePublish = () => {
    // TODO: Implement publishing to gallery
    console.log('Publishing blockchain:', createdBlockchain)
  }

  const handleCreateAnother = () => {
    setCreatedBlockchain(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <PageHeader
          title={createdBlockchain ? 'Blockchain Created Successfully!' : 'Create Your Blockchain'}
          description={
            createdBlockchain
              ? 'Your blockchain has been generated and is ready to use'
              : 'Configure your custom blockchain with advanced settings'
          }
        />

        {createdBlockchain ? (
          <BlockchainSuccessView
            blockchain={createdBlockchain}
            onDownload={handleDownload}
            onPublish={handlePublish}
            onCreateAnother={handleCreateAnother}
            isDownloading={isDownloading}
          />
        ) : (
          <>
            <BlockchainConfigForm
              onSubmit={handleSubmit}
              isLoading={isLoading}
              errors={errors}
            />
            <SupportBanner />
          </>
        )}
      </div>
    </div>
  )
}