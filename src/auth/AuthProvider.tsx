import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabaseClient } from '../lib/supabase'

type AuthContextValue = {
  session: Session | null
  loading: boolean
  configurationError: string | null
  sessionError: string | null
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [configurationError, setConfigurationError] = useState<string | null>(
    null,
  )
  const [sessionError, setSessionError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    let unsubscribe = () => {}

    try {
      const supabase = getSupabaseClient()
      const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
        if (!active) return
        setSession(nextSession)
        setSessionError(null)
        setLoading(false)
      })

      unsubscribe = () => data.subscription.unsubscribe()

      void supabase.auth
        .getSession()
        .then(({ data: result, error }) => {
          if (!active) return
          if (error) {
            setSessionError('Unable to restore your session. Check your connection and try again.')
          } else {
            setSession(result.session)
          }
          setLoading(false)
        })
        .catch(() => {
          if (!active) return
          setSessionError('Unable to restore your session. Check your connection and try again.')
          setLoading(false)
        })
    } catch {
      setConfigurationError(
        'Supabase is not configured. Set VITE_SUPABASE_URL and a public Supabase key in the project root environment file.',
      )
      setLoading(false)
    }

    return () => {
      active = false
      unsubscribe()
    }
  }, [])

  async function signIn(email: string, password: string) {
    const { error } = await getSupabaseClient().auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  async function signOut() {
    const { error } = await getSupabaseClient().auth.signOut()
    if (error) throw error
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        configurationError,
        sessionError,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}