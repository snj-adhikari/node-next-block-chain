'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronRight, Box, Zap, Globe, Users, TrendingUp, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import Link from 'next/link'

interface Stats {
  totalBlockchains: number
  totalUsers: number
  totalPublished: number
  totalBlocks: number
  connectedUsers: number
}

export default function HomePage() {
  const [stats, setStats] = useState<Stats>({
    totalBlockchains: 0,
    totalUsers: 0,
    totalPublished: 0,
    totalBlocks: 0,
    connectedUsers: 0,
  })

  useEffect(() => {
    // Fetch initial stats
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(console.error)
  }, [])

  const features = [
    {
      icon: <Box className="h-6 w-6" />,
      title: "Custom Blockchain Creation",
      description: "Configure and create your own blockchain with custom parameters, mining difficulty, and genesis block data.",
      color: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Zap className="h-6 w-6" />,
      title: "Real-time Mining",
      description: "Watch your blocks being mined in real-time with live progress updates and visual mining indicators.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: <Globe className="h-6 w-6" />,
      title: "Publish & Share",
      description: "Make your blockchains public and share them with the community. Browse others' creations.",
      color: "from-green-500 to-emerald-500"
    },
    {
      icon: <Users className="h-6 w-6" />,
      title: "Social Authentication",
      description: "Sign in with Google or Facebook. Your blockchains are securely associated with your account.",
      color: "from-purple-500 to-pink-500"
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-r from-blockchain-500/10 to-mining-500/10 opacity-50" />
        <div className="absolute inset-0 bg-blockchain-pattern opacity-5" />
        
        <motion.div 
          className="relative max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="text-center">
            <motion.div variants={itemVariants} className="mb-6">
              <Badge variant="outline" className="text-sm font-medium px-4 py-2">
                <Zap className="w-4 h-4 mr-2" />
                Real-time Blockchain Generation
              </Badge>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
            >
              <span className="gradient-text">Create Your Own</span>
              <br />
              <span className="text-foreground">Blockchain</span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8 leading-relaxed"
            >
              Generate, mine, and publish custom blockchains with an intuitive interface. 
              Experience real-time mining with live progress tracking and interactive visualizations.
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12"
            >
              import { SignInButton } from '@/components/auth/SignInButton'

// ...

              <SignInButton />
              <Button size="lg" variant="outline" className="text-lg px-8 py-3 h-auto" asChild>
                <Link href="/gallery">
                  Browse Gallery
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div 
              variants={itemVariants}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              {[
                { label: 'Blockchains Created', value: stats.totalBlockchains || 0, icon: Box },
                { label: 'Active Users', value: stats.totalUsers || 0, icon: Users },
                { label: 'Published Blockchains', value: stats.totalPublished || 0, icon: Globe },
                { label: 'Total Blocks Mined', value: stats.totalBlocks || 0, icon: TrendingUp },
              ].map((stat) => (
                <Card key={stat.label} className="text-center">
                  <CardContent className="pt-4">
                    <stat.icon className="h-8 w-8 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <motion.div 
          className="max-w-7xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <div className="text-center mb-16">
            <motion.h2 
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Powerful Features
            </motion.h2>
            <motion.p 
              variants={itemVariants}
              className="text-xl text-muted-foreground max-w-2xl mx-auto"
            >
              Everything you need to create, manage, and share your custom blockchains
            </motion.p>
          </div>
          
          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center text-white mb-4`}>
                      {feature.icon}
                    </div>
                    <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <Card className="blockchain-card p-8 md:p-12">
            <CardContent className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to Build Your Blockchain?
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Join thousands of developers and blockchain enthusiasts creating the future of decentralized technology.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <SignInButton />
                <Button size="lg" variant="outline" className="text-lg px-8 py-3 h-auto" asChild>
                  <Link href="/gallery">
                    Explore Examples
                  </Link>
                </Button>
              </div>
              {stats.connectedUsers > 0 && (
                <div className="flex items-center justify-center text-sm text-muted-foreground">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse mr-2" />
                  {stats.connectedUsers} users currently online
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </section>
    </div>
  )
}
