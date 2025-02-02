import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { 
  BriefcaseIcon, 
  MessageCircleIcon, 
  UserIcon, 
  HomeIcon, 
  BellIcon, 
  SparklesIcon 
} from 'lucide-react';

export default function Navbar() {
  const { user, profile, signOut } = useAuth();
  const { aiEnabled } = useAI();
  const location = useLocation();

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BriefcaseIcon className="h-8 w-8 text-indigo-600" />
            <span className="text-xl font-bold text-gray-900">TalentLink</span>
          </Link>

          {user ? (
            <div className="flex items-center space-x-6">
              <Link 
                to="/" 
                className={`text-gray-600 hover:text-indigo-600 flex flex-col items-center text-xs ${
                  location.pathname === '/' ? 'text-indigo-600' : ''
                }`}
              >
                <HomeIcon className="h-6 w-6 mb-1" />
                <span>Home</span>
              </Link>
              <Link 
                to="/jobs" 
                className={`text-gray-600 hover:text-indigo-600 flex flex-col items-center text-xs ${
                  location.pathname === '/jobs' ? 'text-indigo-600' : ''
                }`}
              >
                <BriefcaseIcon className="h-6 w-6 mb-1" />
                <span>Jobs</span>
              </Link>
              <Link 
                to="/messages" 
                className={`text-gray-600 hover:text-indigo-600 flex flex-col items-center text-xs relative ${
                  location.pathname === '/messages' ? 'text-indigo-600' : ''
                }`}
              >
                <MessageCircleIcon className="h-6 w-6 mb-1" />
                <span>Messages</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </Link>
              <Link 
                to="/notifications" 
                className={`text-gray-600 hover:text-indigo-600 flex flex-col items-center text-xs relative ${
                  location.pathname === '/notifications' ? 'text-indigo-600' : ''
                }`}
              >
                <BellIcon className="h-6 w-6 mb-1" />
                <span>Notifications</span>
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  2
                </span>
              </Link>
              <Link
                to="/ai-settings"
                className={`flex flex-col items-center text-xs ${
                  location.pathname === '/ai-settings' ? 'text-indigo-600' : 'text-gray-600'
                } hover:text-indigo-600 transition-colors relative group`}
              >
                <SparklesIcon className="h-6 w-6 mb-1" />
                <span>AI Agent</span>
                {aiEnabled && (
                  <span className="absolute -top-1 -right-1 bg-green-500 h-2.5 w-2.5 rounded-full"></span>
                )}
                <div className="absolute bottom-full mb-2 hidden group-hover:block">
                  <div className="bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                    {aiEnabled ? 'AI Agent is active' : 'AI Agent is disabled'}
                  </div>
                </div>
              </Link>
              <Link 
                to="/profile" 
                className={`text-gray-600 hover:text-indigo-600 flex flex-col items-center text-xs ${
                  location.pathname === '/profile' ? 'text-indigo-600' : ''
                }`}
              >
                <UserIcon className="h-6 w-6 mb-1" />
                <span>Profile</span>
              </Link>
              <button
                onClick={() => signOut()}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}