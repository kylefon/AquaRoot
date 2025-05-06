import { useState, useEffect } from 'react'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Slot, useRouter } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'

export default function Main() {
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setIsLoading(false)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription?.unsubscribe()
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (session) {
        router.navigate('/my-home')
      } else {
        router.navigate('/sign-in')
      }
    }
  }, [session, isLoading])

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#557153" />
      </View>
    )
  }

  return null;
}
