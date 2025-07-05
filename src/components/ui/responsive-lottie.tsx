'use client'

import { useEffect, useState } from 'react'
import Player from 'lottie-react'

interface ResponsiveLottieProps {
  url: string
  playbackMode?: 'loop' | 'once'
  className?: string
}

export function ResponsiveLottie({ url, playbackMode = 'loop', className }: ResponsiveLottieProps) {
  const [animationData, setAnimationData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadAnimation = async () => {
      try {
        setError(null)
        const response = await fetch(url)
        
        if (!response.ok) {
          setError(`Unable to load animation`)
          return
        }
        
        const text = await response.text()
        const json = JSON.parse(text)
        setAnimationData(json)
      } catch (err) {
        setError('Unable to load animation')
      }
    }

    if (url) {
      loadAnimation()
    }
  }, [url])

  if (error) {
    return (
      <div className={`w-full h-full flex items-center justify-center text-muted-foreground ${className}`}>
        <span className="text-sm">Unable to load animation</span>
      </div>
    )
  }

  if (!animationData) {
    return (
      <div className={`w-full h-full flex items-center justify-center ${className}`}>
        <span className="text-sm text-muted-foreground">Loading...</span>
      </div>
    )
  }

  return (
    <div className={`w-full h-full flex items-center justify-center ${className}`}>
      <Player
        animationData={animationData}
        autoplay
        loop={playbackMode === 'loop'}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      />
    </div>
  )
}