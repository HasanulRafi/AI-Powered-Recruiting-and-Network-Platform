import React, { createContext, useContext, useState } from 'react';
import type { Profile } from '../types/auth';

interface User {
  id: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, role: 'recruiter' | 'applicant') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simulated local storage keys
const USERS_KEY = 'local_users';
const CURRENT_USER_KEY = 'current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [profile, setProfile] = useState<Profile | null>(() => {
    const savedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (!savedUser) return null;
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    return users.find((u: any) => u.id === JSON.parse(savedUser).id)?.profile || null;
  });
  const [loading, setLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const user = users.find((u: any) => u.email === email && u.password === password);
      
      if (!user) {
        throw new Error('Invalid credentials');
      }

      const userData = { id: user.id, email: user.email };
      setUser(userData);
      setProfile(user.profile);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, role: 'recruiter' | 'applicant') => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      
      if (users.some((u: any) => u.email === email)) {
        throw new Error('Email already in use');
      }

      // Use sample UUIDs for testing
      const id = role === 'recruiter' 
        ? 'd7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f'  // Sarah Wilson (recruiter)
        : 'e8c6f6c6-9d8g-5d8g-9d8g-9d8g9d8g9d8g';  // John Doe (applicant)

      const newUser = {
        id,
        email,
        password,
        profile: {
          id,
          role,
          full_name: role === 'recruiter' ? 'Sarah Wilson' : 'John Doe',
          headline: role === 'recruiter' ? 'Senior Recruiter' : 'Software Engineer',
          company: role === 'recruiter' ? 'Tech Corp' : null,
        } as Profile,
      };

      users.push(newUser);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));

      // Auto sign in after signup
      const userData = { id: newUser.id, email: newUser.email };
      setUser(userData);
      setProfile(newUser.profile);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setProfile(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return;

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === user.id) {
        const updatedProfile = { ...u.profile, ...updates };
        setProfile(updatedProfile);
        return { ...u, profile: updatedProfile };
      }
      return u;
    });
    localStorage.setItem(USERS_KEY, JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}