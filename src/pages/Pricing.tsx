import React, { useState } from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import {
  CheckIcon,
  SparklesIcon,
  CreditCardIcon,
  LoaderIcon
} from 'lucide-react';

export default function Pricing() {
  const { currentPlan, upgradePlan } = useSubscription();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    if (!user) {
      toast.error('Please sign in to upgrade');
      return;
    }

    if (planId === currentPlan.id) {
      toast.success('You are already on this plan');
      return;
    }

    setSelectedPlan(planId);
    setProcessing(true);

    try {
      await upgradePlan(planId);
      toast.success('Plan upgraded successfully!');
    } catch (error) {
      toast.error('Error upgrading plan');
    } finally {
      setProcessing(false);
      setSelectedPlan(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <SparklesIcon className="mx-auto h-12 w-12 text-indigo-600" />
        <h1 className="mt-4 text-4xl font-bold text-gray-900">
          Unlock Advanced AI Features
        </h1>
        <p className="mt-4 text-xl text-gray-600">
          Choose the perfect plan for your career journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {/* Free Plan */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900">Free</h2>
          <p className="mt-4 text-gray-600">Perfect for getting started</p>
          <p className="mt-2">
            <span className="text-4xl font-bold text-gray-900">$0</span>
            <span className="text-gray-600">/month</span>
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">Basic AI chat support</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">5 AI credits per month</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">Job search features</span>
            </li>
          </ul>
          <button
            onClick={() => handleUpgrade('free')}
            disabled={currentPlan.id === 'free' || processing}
            className="mt-8 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {currentPlan.id === 'free' ? 'Current Plan' : 'Get Started'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="bg-white rounded-lg shadow-sm p-8 border-2 border-indigo-600 relative">
          <div className="absolute top-0 right-0 bg-indigo-600 text-white px-3 py-1 text-sm font-medium rounded-bl">
            Popular
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Pro</h2>
          <p className="mt-4 text-gray-600">For serious job seekers</p>
          <p className="mt-2">
            <span className="text-4xl font-bold text-gray-900">$9.99</span>
            <span className="text-gray-600">/month</span>
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">
                Everything in Free, plus:
              </span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">50 AI credits per month</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">
                Interview practice with AI
              </span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">
                Resume & cover letter analysis
              </span>
            </li>
          </ul>
          <button
            onClick={() => handleUpgrade('pro')}
            disabled={currentPlan.id === 'pro' || processing}
            className="mt-8 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {processing && selectedPlan === 'pro' ? (
              <LoaderIcon className="animate-spin h-5 w-5 mx-auto" />
            ) : currentPlan.id === 'pro' ? (
              'Current Plan'
            ) : (
              'Upgrade to Pro'
            )}
          </button>
        </div>

        {/* Enterprise Plan */}
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900">Enterprise</h2>
          <p className="mt-4 text-gray-600">For organizations</p>
          <p className="mt-2">
            <span className="text-4xl font-bold text-gray-900">$29.99</span>
            <span className="text-gray-600">/month</span>
          </p>
          <ul className="mt-8 space-y-4">
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">Everything in Pro, plus:</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">Unlimited AI credits</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">Custom AI models</span>
            </li>
            <li className="flex items-start">
              <CheckIcon className="h-5 w-5 text-green-500 mt-0.5" />
              <span className="ml-3 text-gray-600">Priority support</span>
            </li>
          </ul>
          <button
            onClick={() => handleUpgrade('enterprise')}
            disabled={currentPlan.id === 'enterprise' || processing}
            className="mt-8 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {processing && selectedPlan === 'enterprise' ? (
              <LoaderIcon className="animate-spin h-5 w-5 mx-auto" />
            ) : currentPlan.id === 'enterprise' ? (
              'Current Plan'
            ) : (
              'Upgrade to Enterprise'
            )}
          </button>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              What are AI credits?
            </h3>
            <p className="mt-2 text-gray-600">
              AI credits are used for advanced features like interview practice,
              document analysis, and in-depth AI conversations. Each feature uses a
              different amount of credits.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Can I upgrade or downgrade anytime?
            </h3>
            <p className="mt-2 text-gray-600">
              Yes, you can change your plan at any time. Your new plan will take
              effect immediately, and we'll prorate any charges.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Is there a refund policy?
            </h3>
            <p className="mt-2 text-gray-600">
              Yes, we offer a 14-day money-back guarantee if you're not satisfied
              with your subscription.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}