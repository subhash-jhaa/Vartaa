'use client'

import { useEffect, useRef } from 'react'
import { useMutation } from 'convex/react'
import { api } from '../../convex/_generated/api'
import { useCurrentUser } from './useCurrentUser'

const HEARTBEAT_INTERVAL = 30000 // 30 seconds

/**
 * Automates presence tracking by sending heartbeats and handling 
 * visibility changes (Away/Online).
 */
export function usePresence() {
  const { isAuthenticated } = useCurrentUser()
  const heartbeat = useMutation(api.users.heartbeat)
  const updatePresence = useMutation(api.users.updatePresence)
  const lastPresenceRef = useRef<'online' | 'away'>('online')

  useEffect(() => {
    if (!isAuthenticated) return

    // Initial online status
    updatePresence({ presence: 'online' }).catch(console.error)

    // Heartbeat loop
    const interval = setInterval(() => {
      heartbeat().catch(console.error)
    }, HEARTBEAT_INTERVAL)

    // Visibility change listener (Away detection)
    const handleVisibilityChange = () => {
      const isVisible = document.visibilityState === 'visible'
      const newPresence = isVisible ? 'online' : 'away'
      
      if (newPresence !== lastPresenceRef.current) {
        lastPresenceRef.current = newPresence
        updatePresence({ presence: newPresence }).catch(console.error)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isAuthenticated, heartbeat, updatePresence])
}
