// Keeping this file for future Supabase integration
import { supabase } from './supabase'
import type { Database } from './databaseTypes'

// Profile operations
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateProfile = async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  
  if (error) throw error
  return data
}

// Jobs operations
export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createJob = async (job: Database['public']['Tables']['jobs']['Insert']) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Connections operations
export const getConnections = async (userId: string) => {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      recruiter:profiles!connections_recruiter_id_fkey(*),
      applicant:profiles!connections_applicant_id_fkey(*)
    `)
    .or(`recruiter_id.eq.${userId},applicant_id.eq.${userId}`)
  
  if (error) throw error
  return data
}

export const createConnection = async (connection: Database['public']['Tables']['connections']['Insert']) => {
  const { data, error } = await supabase
    .from('connections')
    .insert(connection)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Messages operations
export const getMessages = async (connectionId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(*)
    `)
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export const createMessage = async (message: Database['public']['Tables']['messages']['Insert']) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Real-time subscriptions
export const subscribeToMessages = (connectionId: string, callback: (message: any) => void) => {
  return supabase
    .channel(`messages:${connectionId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `connection_id=eq.${connectionId}`
    }, callback)
    .subscribe()
}
/*
import { supabase } from './supabase'
import type { Database } from './databaseTypes'

// Profile operations
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  
  if (error) throw error
  return data
}

export const updateProfile = async (userId: string, updates: Database['public']['Tables']['profiles']['Update']) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
  
  if (error) throw error
  return data
}

// Jobs operations
export const getJobs = async () => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data
}

export const createJob = async (job: Database['public']['Tables']['jobs']['Insert']) => {
  const { data, error } = await supabase
    .from('jobs')
    .insert(job)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Connections operations
export const getConnections = async (userId: string) => {
  const { data, error } = await supabase
    .from('connections')
    .select(`
      *,
      recruiter:profiles!connections_recruiter_id_fkey(*),
      applicant:profiles!connections_applicant_id_fkey(*)
    `)
    .or(`recruiter_id.eq.${userId},applicant_id.eq.${userId}`)
  
  if (error) throw error
  return data
}

export const createConnection = async (connection: Database['public']['Tables']['connections']['Insert']) => {
  const { data, error } = await supabase
    .from('connections')
    .insert(connection)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Messages operations
export const getMessages = async (connectionId: string) => {
  const { data, error } = await supabase
    .from('messages')
    .select(`
      *,
      sender:profiles!messages_sender_id_fkey(*)
    `)
    .eq('connection_id', connectionId)
    .order('created_at', { ascending: true })
  
  if (error) throw error
  return data
}

export const createMessage = async (message: Database['public']['Tables']['messages']['Insert']) => {
  const { data, error } = await supabase
    .from('messages')
    .insert(message)
    .select()
    .single()
  
  if (error) throw error
  return data
}

// Real-time subscriptions
export const subscribeToMessages = (connectionId: string, callback: (message: any) => void) => {
  return supabase
    .channel(`messages:${connectionId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: 'messages',
      filter: `connection_id=eq.${connectionId}`
    }, callback)
    .subscribe()
}
*/ 