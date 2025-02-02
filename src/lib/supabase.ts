import { createClient } from '@supabase/supabase-js'
import { Database } from './databaseTypes'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables:', { supabaseUrl, supabaseAnonKey })
}

export const supabase = createClient<Database>(
  supabaseUrl || '',
  supabaseAnonKey || ''
)

supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state changed:', event, session)
})

supabase.auth.signInWithPassword({
  email: 'your-email@example.com',
  password: 'your-password'
})
.then(() => console.log('✅ Successfully connected to Supabase'))
.catch((error: Error) => console.error('❌ Error connecting to Supabase:', error.message))