import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import RecruitingProgress from '../components/RecruitingProgress';
import { JobService } from '../lib/services/JobService';
import type { JobRecommendation } from '../lib/ai';
import { 
  BriefcaseIcon, 
  MapPinIcon, 
  DollarSignIcon, 
  StarIcon,
  SearchIcon,
  FilterIcon,
  CalendarIcon,
  FileTextIcon
} from 'lucide-react';
import { format } from 'date-fns';

export default function Jobs() {
  const { profile } = useAuth();
  const [jobs, setJobs] = useState<JobRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    setError(null);
    
    const keywords = searchTerm.split(' ').filter(k => k.length > 0);
    const { data, error: jobError } = await JobService.getInstance().searchJobs(keywords, location);
    
    if (jobError) {
      setError(jobError);
      setJobs([]);
    } else {
      setJobs(data);
    }
    setLoading(false);
  };

  const generateResumeBasedJobs = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Extract skills and other relevant information from profile
      const profileSkills = profile?.skills || [];
      const profileTitle = profile?.headline || '';
      const profileExperience = profile?.experience || [];
      
      // Build search keywords from profile information
      let searchKeywords = [...profileSkills];
      
      // Add job titles from experience
      const experienceTitles = profileExperience
        .map((exp: any) => exp.title)
        .filter((title: string) => title.length > 0);
      searchKeywords = [...searchKeywords, ...experienceTitles];
      
      // Add current title/headline
      if (profileTitle) {
        searchKeywords.push(profileTitle);
      }
      
      // Filter out duplicates and empty strings
      const uniqueKeywords = [...new Set(searchKeywords)]
        .filter(keyword => keyword.length > 0)
        .slice(0, 5); // Take top 5 keywords to avoid overloading
      
      // Use default keywords if no profile information is available
      const finalKeywords = uniqueKeywords.length > 0 
        ? uniqueKeywords 
        : ['software', 'developer', 'engineer'];
      
      const { data, error: jobError } = await JobService.getInstance().searchJobs(finalKeywords, location);
      
      if (jobError) {
        setError(jobError);
        setJobs([]);
      } else {
        setJobs(data);
        // Update search term to reflect the skills being searched
        setSearchTerm(finalKeywords.join(' '));
      }
    } catch (err) {
      setError('Failed to generate resume-based recommendations. Please try again.');
      setJobs([]);
    }
    
    setLoading(false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    
    const keywords = searchTerm.split(' ').filter(k => k.length > 0);
    const { data, error: jobError } = await JobService.getInstance().searchJobs(keywords, location.trim());
    
    if (jobError) {
      setError(jobError);
      setJobs([]);
    } else {
      setJobs(data);
    }
    setLoading(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {profile?.role === 'recruiter' && <RecruitingProgress />}
      
      {/* Search and Filter Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Location (city, state, or 'remote')"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="pl-10 w-full rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Search Jobs
            </button>
            <button
              onClick={generateResumeBasedJobs}
              className="flex items-center justify-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
              title="Generate job recommendations based on your resume"
            >
              <FileTextIcon className="h-5 w-5" />
              <span className="hidden sm:inline">Match Resume</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          // Loading skeleton
          Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))
        ) : jobs.length > 0 ? (
          jobs.map((job) => (
            <div key={`${job.company}-${job.title}`} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{job.title}</h3>
                  <p className="text-gray-600">{job.company}</p>
                </div>
                {job.matchScore > 0 && (
                  <div className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                    <StarIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{job.matchScore}% Match</span>
                  </div>
                )}
              </div>

              <p className="text-gray-600 text-sm line-clamp-3 mb-4">{job.description}</p>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <div className="text-sm text-gray-500 mt-2">
                      Posted {job.posted_date ? format(new Date(job.posted_date), 'MMM d, yyyy') : 'Date not available'}
                    </div>
                  </div>
                </div>
                
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <BriefcaseIcon className="h-4 w-4 mr-2" />
                  Apply
                </a>
              </div>
            </div>
          ))
        ) : !error && (
          <div className="text-center text-gray-500">
            No jobs found. Try adjusting your search terms.
          </div>
        )}
      </div>
    </div>
  );
}