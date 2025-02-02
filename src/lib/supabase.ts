import { createClient } from '@supabase/supabase-js'
import { Database } from './databaseTypes'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing environment variables:', {
    url: !!supabaseUrl,
    key: !!supabaseAnonKey
  })
  throw new Error('Missing Supabase environment variables')
}

console.log('Initializing Supabase client with URL:', supabaseUrl)

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey
)

// Log auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth state changed:', event, {
    session: session ? {
      user: session.user.id,
      expires: session.expires_at
    } : null
  })
})