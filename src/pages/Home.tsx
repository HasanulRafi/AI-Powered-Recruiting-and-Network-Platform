import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { BriefcaseIcon, UserIcon, MessageCircleIcon, TrendingUpIcon, BuildingIcon, UsersIcon } from 'lucide-react';

export default function Home() {
  const { user, profile } = useAuth();

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center py-16 sm:py-24">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Find Your Next</span>
            <span className="block text-indigo-600">Career Opportunity</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Join our platform to connect recruiters with job seekers directly. Build meaningful professional relationships and find the perfect match.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <Link
              to="/auth"
              className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="py-12 bg-white rounded-xl shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="text-base text-indigo-600 font-semibold tracking-wide uppercase">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to succeed
              </p>
            </div>

            <div className="mt-10">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <BriefcaseIcon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Job Matching</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Smart algorithms to match you with the perfect opportunities.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <MessageCircleIcon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Direct Messaging</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Connect directly with recruiters and candidates.
                  </p>
                </div>

                <div className="relative">
                  <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
                    <TrendingUpIcon className="h-6 w-6" />
                  </div>
                  <p className="ml-16 text-lg leading-6 font-medium text-gray-900">Career Growth</p>
                  <p className="mt-2 ml-16 text-base text-gray-500">
                    Access resources and opportunities for professional development.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 rounded-xl shadow-sm mt-12 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">1000+</div>
                <div className="mt-2 text-xl text-indigo-100">Active Jobs</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">500+</div>
                <div className="mt-2 text-xl text-indigo-100">Companies</div>
              </div>
              <div className="text-center">
                <div className="text-5xl font-extrabold text-white">10k+</div>
                <div className="mt-2 text-xl text-indigo-100">Professionals</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Welcome Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {profile?.full_name}!
        </h1>
        <p className="mt-2 text-gray-600">
          {profile?.role === 'recruiter' 
            ? 'Find the perfect candidates for your open positions.'
            : 'Discover new opportunities that match your skills and experience.'}
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link
          to="/jobs"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Jobs</h2>
              <p className="text-gray-500">
                {profile?.role === 'recruiter' ? 'Post and manage jobs' : 'Find your next opportunity'}
              </p>
            </div>
          </div>
        </Link>

        <Link
          to="/messages"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <MessageCircleIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Messages</h2>
              <p className="text-gray-500">Chat with your connections</p>
            </div>
          </div>
        </Link>

        <Link
          to="/profile"
          className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors">
              <UserIcon className="h-8 w-8 text-indigo-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
              <p className="text-gray-500">Update your professional profile</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Dashboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
            <Link to="/messages" className="text-sm text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  <MessageCircleIcon className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New message from {i === 0 ? 'Sarah Wilson' : i === 1 ? 'John Doe' : 'Emma Thompson'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {i === 0 ? '2 hours ago' : i === 1 ? '4 hours ago' : 'Yesterday'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {profile?.role === 'recruiter' ? 'Top Candidates' : 'Recommended Jobs'}
            </h2>
            <Link to="/jobs" className="text-sm text-indigo-600 hover:text-indigo-700">
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="bg-indigo-50 p-2 rounded-lg">
                  {profile?.role === 'recruiter' ? (
                    <UsersIcon className="h-5 w-5 text-indigo-600" />
                  ) : (
                    <BuildingIcon className="h-5 w-5 text-indigo-600" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {profile?.role === 'recruiter'
                      ? ['Senior Developer', 'UX Designer', 'Product Manager'][i]
                      : ['Software Engineer at Google', 'Product Designer at Apple', 'Frontend Dev at Meta'][i]}
                  </p>
                  <p className="text-sm text-gray-500">
                    {profile?.role === 'recruiter'
                      ? ['5 years experience', '3 years experience', '7 years experience'][i]
                      : ['San Francisco, CA', 'Cupertino, CA', 'Remote'][i]}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}