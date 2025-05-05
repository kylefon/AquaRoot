import { useState, useEffect } from 'react'
import { SafeAreaView, View } from 'react-native'
import { Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import { Redirect } from 'expo-router'

export default function Main() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  return <Redirect href={session ? "/my-home" : "/sign-in"} />;
}