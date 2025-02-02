import React from 'react';
import { BriefcaseIcon, MapPinIcon, DollarSignIcon, StarIcon } from 'lucide-react';
import type { JobRecommendation } from '../lib/ai';

interface JobRecommendationsProps {
  jobs: JobRecommendation[];
  isLoading?: boolean;
}

export default function JobRecommendations({ jobs, isLoading }: JobRecommendationsProps) {
  if (isLoading) {
    return (
      <div className="mt-6 space-y-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!jobs.length) {
    return null;
  }

  return (
    <div className="mt-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">
        Recommended Jobs Based on Your Resume
      </h3>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.title} className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="text-lg font-medium text-gray-900">{job.title}</h4>
                <p className="text-gray-600">{job.company}</p>
              </div>
              <div className="flex items-center space-x-1 bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full">
                <StarIcon className="h-4 w-4" />
                <span className="text-sm font-medium">{job.matchScore}% Match</span>
              </div>
            </div>
            
            <p className="mt-3 text-gray-600">{job.description}</p>
            
            <div className="mt-4 flex flex-wrap gap-4">
              <div className="flex items-center text-gray-500">
                <MapPinIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{job.location}</span>
              </div>
              <div className="flex items-center text-gray-500">
                <DollarSignIcon className="h-4 w-4 mr-1" />
                <span className="text-sm">{job.salary}</span>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex flex-wrap gap-2">
                {job.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <button
                className="inline-flex items-center px-4 py-2 border border-indigo-600 text-sm font-medium rounded-md text-indigo-600 hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <BriefcaseIcon className="h-4 w-4 mr-2" />
                Apply Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 