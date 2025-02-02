import React from 'react';
import { useSubscription } from '../contexts/SubscriptionContext';
import { SparklesIcon } from 'lucide-react';

export default function AICreditsDisplay() {
  const { currentPlan, aiCredits } = useSubscription();

  if (currentPlan.id === 'enterprise') return null;

  return (
    <div className="flex items-center space-x-2 bg-indigo-50 rounded-full px-3 py-1">
      <SparklesIcon className="h-4 w-4 text-indigo-600" />
      <span className="text-sm font-medium text-indigo-700">
        {aiCredits} AI Credits
      </span>
    </div>
  );
}