import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import RecruitingProgress from '../components/RecruitingProgress';

export default function Jobs() {
  const { profile } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {profile?.role === 'recruiter' && <RecruitingProgress />}
      {/* Rest of the jobs page content */}
    </div>
  );
}