'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false })

interface ResponsivePlayerProps {
  url: string
  playbackMode?: 'loop' | 'once'
  className?: string
  controls?: boolean
  volume?: number
  muted?: boolean
  playing?: boolean
}

export function ResponsivePlayer({ 
  url, 
  playbackMode = 'loop',
  className,
  controls = false,
  volume = 1,
  muted = true,
  playing = true
}: ResponsivePlayerProps) {
  const [isClient, setIsClient] = useState(false)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className={cn("w-full h-full relative overflow-hidden rounded-md bg-muted", className)}>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-muted-foreground">Loading player...</span>
        </div>
      </div>
    )
  }

  return (
    <div className={cn("w-full h-full relative overflow-hidden rounded-md", className)}>
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        muted={muted}
        volume={volume}
        playing={playing && isReady}
        playsinline
        loop={playbackMode === 'loop'}
        controls={controls}
        onReady={() => setIsReady(true)}
        onError={(error) => console.error('Player error:', error)}
        config={{
          youtube: {
            playerVars: {
              modestbranding: 1,
              rel: 0
            }
          }
        }}
      />
    </div>
  )
}