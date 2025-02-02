import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { useSubscription } from '../contexts/SubscriptionContext';
import { Link } from 'react-router-dom';
import {
  SparklesIcon,
  MessageCircleIcon,
  MicIcon,
  PhoneCallIcon,
  FileTextIcon,
  BrainIcon,
  CreditCardIcon,
  SettingsIcon
} from 'lucide-react';

export default function AISettings() {
  const { profile } = useAuth();
  const { aiEnabled, toggleAI } = useAI();
  const { currentPlan, aiCredits } = useSubscription();

  const aiFeatures = [
    {
      id: 'chat',
      name: 'AI Chat Assistant',
      icon: MessageCircleIcon,
      description: 'Chat with AI for job search and career advice',
      available: true
    },
    {
      id: 'voice',
      name: 'Voice Assistant',
      icon: MicIcon,
      description: 'Voice-based interaction and commands',
      available: currentPlan.id !== 'free'
    },
    {
      id: 'call',
      name: 'Interview Practice',
      icon: PhoneCallIcon,
      description: 'AI-powered mock interviews',
      available: currentPlan.id !== 'free'
    },
    {
      id: 'document',
      name: 'Document Analysis',
      icon: FileTextIcon,
      description: 'Resume and cover letter analysis',
      available: currentPlan.id !== 'free'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BrainIcon className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">AI Assistant Settings</h1>
            </div>
            <button
              onClick={toggleAI}
              className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                aiEnabled ? 'bg-indigo-600' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out ${
                  aiEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* AI Credits */}
          <div className="mb-8 bg-indigo-50 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-medium text-indigo-900">AI Credits</h2>
                <p className="text-sm text-indigo-700">
                  Used for advanced AI features
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-indigo-600">{aiCredits}</p>
                <p className="text-sm text-indigo-700">credits remaining</p>
              </div>
            </div>
            {currentPlan.id === 'free' && (
              <div className="mt-4">
                <Link
                  to="/pricing"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                >
                  <CreditCardIcon className="h-4 w-4 mr-2" />
                  Upgrade for More Credits
                </Link>
              </div>
            )}
          </div>

          {/* AI Features */}
          <div className="space-y-6">
            <h2 className="text-lg font-medium text-gray-900">Available Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {aiFeatures.map(feature => (
                <div
                  key={feature.id}
                  className={`p-6 rounded-lg border ${
                    feature.available
                      ? 'bg-white'
                      : 'bg-gray-50 opacity-75'
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <feature.icon
                        className={`h-6 w-6 ${
                          feature.available
                            ? 'text-indigo-600'
                            : 'text-gray-400'
                        }`}
                      />
                    </div>
                    <div>
                      <h3 className="text-base font-medium text-gray-900">
                        {feature.name}
                      </h3>
                      <p className="mt-1 text-sm text-gray-500">
                        {feature.description}
                      </p>
                      {!feature.available && (
                        <Link
                          to="/pricing"
                          className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                        >
                          Upgrade to unlock →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Usage Settings */}
          <div className="mt-8">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Usage Settings
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Auto-suggestions
                  </h3>
                  <p className="text-sm text-gray-500">
                    Get AI suggestions while writing
                  </p>
                </div>
                <button
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-indigo-600"
                >
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out translate-x-5" />
                </button>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-medium text-gray-900">
                    Voice Commands
                  </h3>
                  <p className="text-sm text-gray-500">
                    Enable voice control for AI features
                  </p>
                </div>
                <button
                  className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 bg-gray-200"
                >
                  <span className="inline-block h-5 w-5 transform rounded-full bg-white transition duration-200 ease-in-out translate-x-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}