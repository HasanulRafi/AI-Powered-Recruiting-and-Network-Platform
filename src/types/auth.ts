export interface Profile {
  id: string;
  role: 'recruiter' | 'applicant';
  full_name: string;
  headline?: string;
  bio?: string;
  company?: string | null;
  location?: string;
  skills?: string[];
  experience?: any[];
  education?: any[];
  resume?: {
    name: string;
    lastUpdated: string;
    content?: string;
  };
} 