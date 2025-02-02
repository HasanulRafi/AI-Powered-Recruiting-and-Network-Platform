import React, { useState } from 'react';
import { useSubscription, plans, type Plan } from '../contexts/SubscriptionContext';
import { CheckIcon, SparklesIcon, XIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function PricingPlans() {
  const { currentPlan, upgradePlan } = useSubscription();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleUpgrade = async (plan: Plan) => {
    if (plan.id === currentPlan.id) {
      toast.success('You are already on this plan');
      return;
    }

    try {
      setIsProcessing(true);
      await upgradePlan(plan.id);
    } catch (error) {
      console.error('Upgrade error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="text-center mb-8">
        <SparklesIcon className="h-12 w-12 text-indigo-600 mx-auto" />
        <h2 className="mt-4 text-3xl font-bold text-gray-900">Pricing Plans</h2>
        <p className="mt-2 text-lg text-gray-600">
          Choose the perfect plan for your needs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`rounded-lg p-8 ${
              plan.id === currentPlan.id
                ? 'ring-2 ring-indigo-600 bg-indigo-50'
                : 'border'
            }`}
          >
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
              <p className="mt-4 text-gray-600">
                <span className="text-4xl font-bold text-gray-900">
                  ${plan.price}
                </span>
                /month
              </p>
            </div>

            <ul className="mt-8 space-y-4">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-start">
                  <CheckIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                  <span className="ml-3 text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => handleUpgrade(plan)}
              disabled={isProcessing || plan.id === currentPlan.id}
              className={`mt-8 w-full py-3 px-4 rounded-md text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                plan.id === currentPlan.id
                  ? 'bg-indigo-200 text-indigo-700 cursor-default'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              } disabled:opacity-50`}
            >
              {isProcessing
                ? 'Processing...'
                : plan.id === currentPlan.id
                ? 'Current Plan'
                : 'Upgrade'}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        All plans include a 14-day money-back guarantee
      </div>
    </div>
  );
}