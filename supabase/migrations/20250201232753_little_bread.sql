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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL CHECK (role IN ('recruiter', 'applicant')),
  full_name TEXT NOT NULL,
  headline TEXT,
  bio TEXT,
  company TEXT,
  location TEXT,
  skills TEXT[],
  experience JSONB,
  education JSONB,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Connections table
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  recruiter_id UUID REFERENCES profiles(id),
  applicant_id UUID REFERENCES profiles(id),
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  connection_id UUID REFERENCES connections(id),
  sender_id UUID REFERENCES profiles(id),
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  read_at TIMESTAMP WITH TIME ZONE
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

-- Insert sample data
INSERT INTO profiles (id, role, full_name, headline, company)
VALUES 
  ('d7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f', 'recruiter', 'Sarah Wilson', 'Senior Recruiter', 'Tech Corp'),
  ('e8c6f6c6-9d8g-5d8g-9d8g-9d8g9d8g9d8g', 'applicant', 'John Doe', 'Software Engineer', NULL);

INSERT INTO connections (id, recruiter_id, applicant_id, status)
VALUES 
  ('f9d7g7d7-0e9h-6e9h-0e9h-0e9h0e9h0e9h', 
   'd7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f',
   'e8c6f6c6-9d8g-5d8g-9d8g-9d8g9d8g9d8g',
   'accepted');

INSERT INTO messages (connection_id, sender_id, content)
VALUES 
  ('f9d7g7d7-0e9h-6e9h-0e9h-0e9h0e9h0e9h', 'd7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f', 'Hi John, I saw your profile and would like to discuss some opportunities.'),
  ('f9d7g7d7-0e9h-6e9h-0e9h-0e9h0e9h0e9h', 'e8c6f6c6-9d8g-5d8g-9d8g-9d8g9d8g9d8g', 'Hi Sarah, I would be interested in learning more about the opportunities.');