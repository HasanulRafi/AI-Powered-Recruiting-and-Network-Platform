import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { analyzeProfile, suggestSkills } from '../lib/ai';
import { toast } from 'react-hot-toast';
import { UserIcon, BuildingIcon, MapPinIcon, SparklesIcon } from 'lucide-react';
import ResumeUpload from '../components/ResumeUpload';
import InterviewCoach from '../components/InterviewCoach';
import SalaryInsights from '../components/SalaryInsights';
import GamificationProfile from '../components/GamificationProfile';
import NetworkSection from '../components/NetworkSection';
import EndorsementsSection from '../components/EndorsementsSection';
import RecommendationsSection from '../components/RecommendationsSection';

export default function Profile() {
  const { user, profile, loading: authLoading } = useAuth();
  const { aiEnabled } = useAI();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    headline: '',
    bio: '',
    company: '',
    location: '',
    skills: [] as string[],
    experience: [] as any[],
    education: [] as any[],
  });

  const [profileSuggestions, setProfileSuggestions] = useState<string[]>([]);
  const [skillSuggestions, setSkillSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        headline: profile.headline || '',
        bio: profile.bio || '',
        company: profile.company || '',
        location: profile.location || '',
        skills: profile.skills || [],
        experience: profile.experience || [],
        education: profile.education || [],
      });
    }
  }, [user, profile, navigate]);

  useEffect(() => {
    if (profile && aiEnabled) {
      const suggestions = analyzeProfile(profile);
      setProfileSuggestions(suggestions);
      
      if (profile.role === 'applicant') {
        const suggestedSkills = suggestSkills(
          formData.skills,
          formData.headline || 'developer'
        );
        setSkillSuggestions(suggestedSkills);
      }
    } else {
      setProfileSuggestions([]);
      setSkillSuggestions([]);
    }
  }, [profile, formData.skills, formData.headline, aiEnabled]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      // Update profile in local storage
      const users = JSON.parse(localStorage.getItem('local_users') || '[]');
      const updatedUsers = users.map((u: any) => {
        if (u.id === user.id) {
          return {
            ...u,
            profile: {
              ...u.profile,
              ...formData,
            },
          };
        }
        return u;
      });
      localStorage.setItem('local_users', JSON.stringify(updatedUsers));
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData(prev => ({ ...prev, skills }));
  };

  const addExperience = () => {
    setFormData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { title: '', company: '', startDate: '', endDate: '', description: '' }
      ]
    }));
  };

  const updateExperience = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.map((exp, i) =>
        i === index ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const addEducation = () => {
    setFormData(prev => ({
      ...prev,
      education: [
        ...prev.education,
        { school: '', degree: '', field: '', graduationYear: '' }
      ]
    }));
  };

  const updateEducation = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.map((edu, i) =>
        i === index ? { ...edu, [field]: value } : edu
      )
    }));
  };

  const renderAISuggestions = () => {
    if (profileSuggestions.length === 0 && skillSuggestions.length === 0) return null;

    return (
      <div className="bg-indigo-50 rounded-xl p-6 mb-8">
        <div className="flex items-center space-x-2 mb-4">
          <SparklesIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-lg font-semibold text-indigo-900">AI Suggestions</h2>
        </div>
        
        {profileSuggestions.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-medium text-indigo-800 mb-2">Profile Improvements</h3>
            <ul className="list-disc list-inside space-y-1">
              {profileSuggestions.map((suggestion, index) => (
                <li key={index} className="text-indigo-700">{suggestion}</li>
              ))}
            </ul>
          </div>
        )}
        
        {skillSuggestions.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-indigo-800 mb-2">Recommended Skills</h3>
            <div className="flex flex-wrap gap-2">
              {skillSuggestions.map((skill, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setFormData(prev => ({
                      ...prev,
                      skills: [...prev.skills, skill]
                    }));
                    toast.success(`Added ${skill} to your skills`);
                  }}
                  className="inline-flex items-center px-3 py-1 rounded-full bg-white text-indigo-700 text-sm font-medium hover:bg-indigo-100"
                >
                  <SparklesIcon className="h-4 w-4 mr-1" />
                  {skill}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!user || !profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center space-x-4 mb-6">
          <UserIcon className="h-12 w-12 text-indigo-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-500">
              {profile.role === 'recruiter' ? 'Recruiter Profile' : 'Applicant Profile'}
            </p>
          </div>
        </div>

        {profile.role === 'applicant' && <ResumeUpload />}

        {renderAISuggestions()}

        {/* New LinkedIn-style features */}
        <NetworkSection />
        <EndorsementsSection />
        <RecommendationsSection />

        {/* Existing AI-powered features */}
        <InterviewCoach />
        <SalaryInsights />
        <GamificationProfile />

        <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={formData.full_name}
              onChange={e => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Professional Headline</label>
            <input
              type="text"
              value={formData.headline}
              onChange={e => setFormData(prev => ({ ...prev, headline: e.target.value }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bio</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>

          {profile.role === 'recruiter' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700">Company</label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                  <BuildingIcon className="h-5 w-5" />
                </span>
                <input
                  type="text"
                  value={formData.company}
                  onChange={e => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Skills</label>
                <input
                  type="text"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="e.g., JavaScript, React, Node.js"
                />
                <p className="mt-1 text-sm text-gray-500">Separate skills with commas</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Experience</label>
                  <button
                    type="button"
                    onClick={addExperience}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Experience
                  </button>
                </div>
                {formData.experience.map((exp, index) => (
                  <div key={index} className="border rounded-md p-4 mb-4">
                    <input
                      type="text"
                      value={exp.title}
                      onChange={e => updateExperience(index, 'title', e.target.value)}
                      className="block w-full mb-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Job Title"
                    />
                    <input
                      type="text"
                      value={exp.company}
                      onChange={e => updateExperience(index, 'company', e.target.value)}
                      className="block w-full mb-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Company"
                    />
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="text"
                        value={exp.startDate}
                        onChange={e => updateExperience(index, 'startDate', e.target.value)}
                        className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="Start Date"
                      />
                      <input
                        type="text"
                        value={exp.endDate}
                        onChange={e => updateExperience(index, 'endDate', e.target.value)}
                        className="rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                        placeholder="End Date"
                      />
                    </div>
                    <textarea
                      value={exp.description}
                      onChange={e => updateExperience(index, 'description', e.target.value)}
                      rows={3}
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Description"
                    />
                  </div>
                ))}
              </div>

              <div>
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-medium text-gray-700">Education</label>
                  <button
                    type="button"
                    onClick={addEducation}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
                  >
                    Add Education
                  </button>
                </div>
                {formData.education.map((edu, index) => (
                  <div key={index} className="border rounded-md p-4 mb-4">
                    <input
                      type="text"
                      value={edu.school}
                      onChange={e => updateEducation(index, 'school', e.target.value)}
                      className="block w-full mb-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="School"
                    />
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={e => updateEducation(index, 'degree', e.target.value)}
                      className="block w-full mb-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Degree"
                    />
                    <input
                      type="text"
                      value={edu.field}
                      onChange={e => updateEducation(index, 'field', e.target.value)}
                      className="block w-full mb-2 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Field of Study"
                    />
                    <input
                      type="text"
                      value={edu.graduationYear}
                      onChange={e => updateEducation(index, 'graduationYear', e.target.value)}
                      className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Graduation Year"
                    />
                  </div>
                ))}
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <div className="mt-1 flex rounded-md shadow-sm">
              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
                <MapPinIcon className="h-5 w-5" />
              </span>
              <input
                type="text"
                value={formData.location}
                onChange={e => setFormData(prev => ({ ...prev, location: e.target.value }))}
                className="flex-1 block w-full rounded-none rounded-r-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="e.g., San Francisco, CA"
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}