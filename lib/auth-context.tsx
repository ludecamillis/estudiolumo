'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

interface UserProfile {
  id: string
  email: string
  plan: 'free' | 'pro'
  prompts_used_this_month: number
  month_reset_date: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Check if Supabase is configured at runtime
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!supabaseUrl) {
      setLoading(false)
      return
    }

    const getUser = async () => {
      try {
        // Use getUser() instead of getSession() for better security
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser()

        if (authUser) {
          setUser(authUser)
          // Fetch user profile - wrapped in try/catch to handle table not yet created
          try {
            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', authUser.id)
              .single()

            if (profileData) {
              setProfile({
                id: profileData.id,
                email: authUser.email || '',
                plan: profileData.plan || 'free',
                prompts_used_this_month: profileData.prompts_used_this_month || 0,
                month_reset_date: profileData.month_reset_date,
                created_at: profileData.created_at,
              })
            } else {
              // Create default profile if not exists
              setProfile({
                id: authUser.id,
                email: authUser.email || '',
                plan: 'free',
                prompts_used_this_month: 0,
                month_reset_date: new Date().toISOString().split('T')[0],
                created_at: new Date().toISOString(),
              })
            }
          } catch (profileError) {
            console.debug('Profile table not ready, using default:', profileError)
            // Use default profile if table doesn't exist
            setProfile({
              id: authUser.id,
              email: authUser.email || '',
              plan: 'free',
              prompts_used_this_month: 0,
              month_reset_date: new Date().toISOString().split('T')[0],
              created_at: new Date().toISOString(),
            })
          }
        }
      } catch (error) {
        console.debug('Error fetching user:', error)
      } finally {
        setLoading(false)
      }
    }

    getUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user ?? null
      setUser(user)
      if (user) {
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

          if (profileData) {
            setProfile({
              id: profileData.id,
              email: user.email || '',
              plan: profileData.plan || 'free',
              prompts_used_this_month: profileData.prompts_used_this_month || 0,
              month_reset_date: profileData.month_reset_date,
              created_at: profileData.created_at,
            })
          } else {
            setProfile({
              id: user.id,
              email: user.email || '',
              plan: 'free',
              prompts_used_this_month: 0,
              month_reset_date: new Date().toISOString().split('T')[0],
              created_at: new Date().toISOString(),
            })
          }
        } catch (profileError) {
          console.debug('Profile table not ready, using default:', profileError)
          setProfile({
            id: user.id,
            email: user.email || '',
            plan: 'free',
            prompts_used_this_month: 0,
            month_reset_date: new Date().toISOString().split('T')[0],
            created_at: new Date().toISOString(),
          })
        }
      } else {
        setProfile(null)
      }
      setLoading(false)
    })

    return () => subscription?.unsubscribe()
  }, [supabase])

  const signOut = async () => {
    try {
      // Clear state first
      setUser(null)
      setProfile(null)
      // Then sign out from Supabase
      await supabase.auth.signOut()
      // Force full page reload to clear all cached state
      window.location.href = '/'
    } catch (error) {
      console.error('Error signing out:', error)
      // Even on error, redirect to landing page
      window.location.href = '/'
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
