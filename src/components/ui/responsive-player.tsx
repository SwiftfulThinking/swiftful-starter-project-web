'use client'

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
  return (
    <div className={cn("w-full h-full relative overflow-hidden rounded-md", className)}>
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        style={{ position: 'absolute', top: 0, left: 0 }}
        muted={muted}
        volume={volume}
        playing={playing}
        playsinline
        loop={playbackMode === 'loop'}
        controls={controls}
      />
    </div>
  )
}