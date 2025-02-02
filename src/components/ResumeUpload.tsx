import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { FileTextIcon, UploadCloudIcon, CheckCircleIcon, AlertCircleIcon } from 'lucide-react';
import { extractSkillsFromResume, generateJobRecommendations } from '../lib/ai';
import { toast } from 'react-hot-toast';
import JobRecommendations from './JobRecommendations';
import type { JobRecommendation } from '../lib/ai';
import type { Profile } from '../types/auth';

export default function ResumeUpload() {
  const { profile, updateProfile } = useAuth();
  const { aiEnabled } = useAI();
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [resumeData, setResumeData] = useState<{name: string, lastUpdated: string} | null>(null);
  const [recommendedJobs, setRecommendedJobs] = useState<JobRecommendation[]>([]);
  const [loadingJobs, setLoadingJobs] = useState(false);

  // Load saved resume data on component mount
  useEffect(() => {
    if (profile?.resume) {
      setResumeData({
        name: profile.resume.name,
        lastUpdated: profile.resume.lastUpdated
      });
    }
  }, [profile]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    if (!aiEnabled) {
      toast.error('Please enable AI Agent to use this feature');
      return;
    }

    if (file.type !== 'application/pdf' && !file.type.includes('word')) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    setProcessing(true);
    setUploadedFile(file);
    setRecommendedJobs([]);

    try {
      // Read file content
      const text = await readFileContent(file);
      
      // Extract skills using AI
      const extractedSkills = await extractSkillsFromResume(text);
      
      // Create updated profile data
      const updatedProfileData: Profile = {
        ...profile!,
        skills: Array.from(new Set([...(profile?.skills || []), ...extractedSkills])),
        resume: {
          name: file.name,
          lastUpdated: new Date().toISOString(),
          content: text
        }
      };
      
      // Update profile with extracted skills and resume data
      const users = JSON.parse(localStorage.getItem('local_users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.id === profile?.id) {
          return {
            ...u,
            profile: updatedProfileData
          };
        }
        return u;
      });
      
      // Update localStorage
      localStorage.setItem('local_users', JSON.stringify(updatedUsers));
      
      // Update AuthContext
      updateProfile(updatedProfileData);

      // Update local state
      setResumeData({
        name: file.name,
        lastUpdated: new Date().toISOString()
      });

      // Generate job recommendations
      setLoadingJobs(true);
      const jobs = await generateJobRecommendations(extractedSkills);
      setRecommendedJobs(jobs);

      toast.success('Resume processed successfully! Skills have been updated.');
    } catch (error) {
      toast.error('Error processing resume');
      console.error('Resume processing error:', error);
    } finally {
      setProcessing(false);
      setLoadingJobs(false);
    }
  };

  const handleRemoveResume = () => {
    if (!profile?.id) return;

    // Create updated profile without resume
    const updatedProfileData = { ...profile };
    delete updatedProfileData.resume;

    // Remove resume data from localStorage
    const users = JSON.parse(localStorage.getItem('local_users') || '[]');
    const updatedUsers = users.map((u: any) => {
      if (u.id === profile.id) {
        return {
          ...u,
          profile: updatedProfileData
        };
      }
      return u;
    });
    
    // Update localStorage
    localStorage.setItem('local_users', JSON.stringify(updatedUsers));
    
    // Update AuthContext
    updateProfile(updatedProfileData);

    // Clear local state
    setUploadedFile(null);
    setResumeData(null);
    toast.success('Resume removed successfully');
  };

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.onerror = (e) => reject(e);
      reader.readAsText(file);
    });
  };

  if (profile?.role !== 'applicant') return null;

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileTextIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-gray-900">Resume Upload</h2>
        </div>

        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-500'
          }`}
        >
          {processing ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600">Processing your resume...</p>
            </div>
          ) : resumeData ? (
            <div className="flex flex-col items-center space-y-3">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div>
                <p className="font-medium text-gray-900">{resumeData.name}</p>
                <p className="text-sm text-gray-500">
                  Last updated: {new Date(resumeData.lastUpdated).toLocaleDateString()}
                </p>
              </div>
              <div className="flex space-x-4">
                <button
                  onClick={() => setUploadedFile(null)}
                  className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                >
                  Upload new resume
                </button>
                <button
                  onClick={handleRemoveResume}
                  className="text-red-600 hover:text-red-700 text-sm font-medium"
                >
                  Remove resume
                </button>
              </div>
            </div>
          ) : (
            <>
              <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-gray-600">
                  Drag and drop your resume here, or{' '}
                  <label className="text-indigo-600 hover:text-indigo-700 cursor-pointer">
                    browse
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileInput}
                    />
                  </label>
                </p>
                <p className="text-sm text-gray-500 mt-1">PDF or Word documents only</p>
              </div>
            </>
          )}
        </div>

        {!aiEnabled && (
          <div className="mt-4 flex items-center space-x-2 text-amber-600 bg-amber-50 p-3 rounded-lg">
            <AlertCircleIcon className="h-5 w-5" />
            <p className="text-sm">Enable AI Agent to automatically extract skills from your resume</p>
          </div>
        )}
      </div>

      <JobRecommendations jobs={recommendedJobs} isLoading={loadingJobs} />
    </div>
  );
}