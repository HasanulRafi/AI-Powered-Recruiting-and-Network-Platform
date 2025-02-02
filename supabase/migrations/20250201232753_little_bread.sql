/*
  # Initial Schema for Recruiting Network Platform

  1. New Tables
    - `profiles`
      - Stores user profiles for both recruiters and applicants
      - Contains basic user information and role type
    - `connections`
      - Manages connections between recruiters and applicants
      - Tracks connection status
    - `messages`
      - Stores direct messages between connected users
    - `jobs`
      - Stores job postings created by recruiters

  2. Security
    - Enable RLS on all tables
    - Add policies for proper access control
*/

-- Create enum for user roles
CREATE TYPE user_role AS ENUM ('recruiter', 'applicant');

-- Profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  role user_role NOT NULL,
  full_name text NOT NULL,
  headline text,
  bio text,
  company text, -- For recruiters
  location text,
  skills text[], -- For applicants
  experience jsonb, -- For applicants
  education jsonb, -- For applicants
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid REFERENCES profiles(id),
  applicant_id uuid REFERENCES profiles(id),
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(recruiter_id, applicant_id)
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id uuid REFERENCES connections(id),
  sender_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  created_at timestamptz DEFAULT now(),
  read_at timestamptz
);

-- Jobs table
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recruiter_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  company text NOT NULL,
  location text NOT NULL,
  description text NOT NULL,
  requirements text[],
  salary_range jsonb,
  status text DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Connections policies
CREATE POLICY "Users can view their own connections"
  ON connections FOR SELECT
  USING (
    auth.uid() = recruiter_id OR 
    auth.uid() = applicant_id
  );

CREATE POLICY "Users can create appropriate connections"
  ON connections FOR INSERT
  WITH CHECK (
    (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'recruiter' AND
      auth.uid() = recruiter_id AND
      (SELECT role FROM profiles WHERE id = applicant_id) = 'applicant'
    ) OR
    (
      (SELECT role FROM profiles WHERE id = auth.uid()) = 'applicant' AND
      auth.uid() = applicant_id AND
      (SELECT role FROM profiles WHERE id = recruiter_id) = 'recruiter'
    )
  );

-- Messages policies
CREATE POLICY "Users can view messages in their connections"
  ON messages FOR SELECT
  USING (
    auth.uid() IN (
      SELECT recruiter_id FROM connections WHERE id = messages.connection_id
      UNION
      SELECT applicant_id FROM connections WHERE id = messages.connection_id
    )
  );

CREATE POLICY "Users can send messages in their connections"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid() = sender_id AND
    auth.uid() IN (
      SELECT recruiter_id FROM connections WHERE id = connection_id
      UNION
      SELECT applicant_id FROM connections WHERE id = connection_id
    )
  );

-- Jobs policies
CREATE POLICY "Jobs are viewable by everyone"
  ON jobs FOR SELECT
  USING (true);

CREATE POLICY "Recruiters can create jobs"
  ON jobs FOR INSERT
  WITH CHECK (
    auth.uid() = recruiter_id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'recruiter'
  );

CREATE POLICY "Recruiters can update own jobs"
  ON jobs FOR UPDATE
  USING (
    auth.uid() = recruiter_id AND
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'recruiter'
  );