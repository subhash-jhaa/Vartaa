'use client'
import { useQuery } from 'convex/react'
import { useConvexAuth } from 'convex/react'
import { api } from '../../convex/_generated/api'

export function useCurrentUser() {
  const { isAuthenticated, isLoading: isAuthLoading } = useConvexAuth()
  const user = useQuery(
    api.users.getMe,
    isAuthenticated ? {} : 'skip'
  )
  const isLoading = isAuthLoading || (isAuthenticated && user === undefined)
  return { user, isLoading, isAuthenticated }
}
