// Types for future Supabase integration
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'recruiter' | 'applicant'
          full_name: string
          headline: string | null
          bio: string | null
          company: string | null
          location: string | null
          skills: string[] | null
          experience: Json | null
          education: Json | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'recruiter' | 'applicant'
          full_name: string
          headline?: string | null
          bio?: string | null
          company?: string | null
          location?: string | null
          skills?: string[] | null
          experience?: Json | null
          education?: Json | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'recruiter' | 'applicant'
          full_name?: string
          headline?: string | null
          bio?: string | null
          company?: string | null
          location?: string | null
          skills?: string[] | null
          experience?: Json | null
          education?: Json | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          recruiter_id: string
          applicant_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          applicant_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          applicant_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          connection_id: string
          sender_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          connection_id: string
          sender_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          connection_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          read_at?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          recruiter_id: string
          title: string
          company: string
          location: string
          description: string
          requirements: string[]
          salary_range: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          title: string
          company: string
          location: string
          description: string
          requirements: string[]
          salary_range?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          title?: string
          company?: string
          location?: string
          description?: string
          requirements?: string[]
          salary_range?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
/*
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: 'recruiter' | 'applicant'
          full_name: string
          headline: string | null
          bio: string | null
          company: string | null
          location: string | null
          skills: string[] | null
          experience: Json | null
          education: Json | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: 'recruiter' | 'applicant'
          full_name: string
          headline?: string | null
          bio?: string | null
          company?: string | null
          location?: string | null
          skills?: string[] | null
          experience?: Json | null
          education?: Json | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: 'recruiter' | 'applicant'
          full_name?: string
          headline?: string | null
          bio?: string | null
          company?: string | null
          location?: string | null
          skills?: string[] | null
          experience?: Json | null
          education?: Json | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      connections: {
        Row: {
          id: string
          recruiter_id: string
          applicant_id: string
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          applicant_id: string
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          applicant_id?: string
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          connection_id: string
          sender_id: string
          content: string
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          connection_id: string
          sender_id: string
          content: string
          created_at?: string
          read_at?: string | null
        }
        Update: {
          id?: string
          connection_id?: string
          sender_id?: string
          content?: string
          created_at?: string
          read_at?: string | null
        }
      }
      jobs: {
        Row: {
          id: string
          recruiter_id: string
          title: string
          company: string
          location: string
          description: string
          requirements: string[]
          salary_range: Json | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          recruiter_id: string
          title: string
          company: string
          location: string
          description: string
          requirements: string[]
          salary_range?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          recruiter_id?: string
          title?: string
          company?: string
          location?: string
          description?: string
          requirements?: string[]
          salary_range?: Json | null
          status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
*/ 