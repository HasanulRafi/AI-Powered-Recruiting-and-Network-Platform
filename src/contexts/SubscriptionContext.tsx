import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  aiCredits: number;
}

export const plans: Plan[] = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      'Basic job search',
      'Limited profile features',
      '5 AI credits per month',
      'Basic AI chat support'
    ],
    aiCredits: 5
  },
  {
    id: 'pro',
    name: 'Professional',
    price: 9.99,
    features: [
      'Advanced job search',
      'Full profile features',
      '50 AI credits per month',
      'Priority AI support',
      'Resume analysis',
      'Interview preparation'
    ],
    aiCredits: 50
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 29.99,
    features: [
      'Everything in Professional',
      'Unlimited AI credits',
      'Custom AI models',
      'Team collaboration',
      'API access',
      'Priority support'
    ],
    aiCredits: Infinity
  }
];

interface SubscriptionContextType {
  currentPlan: Plan;
  aiCredits: number;
  useAiCredit: () => boolean;
  upgradePlan: (planId: string) => Promise<void>;
  isFeatureAvailable: (feature: string) => boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState<Plan>(() => {
    const saved = localStorage.getItem('user_plan');
    return saved ? (plans.find(p => p.id === saved) || plans[0]) : plans[0];
  });
  
  const [aiCredits, setAiCredits] = useState(() => {
    const saved = localStorage.getItem('ai_credits');
    return saved ? parseInt(saved, 10) : currentPlan.aiCredits;
  });

  useEffect(() => {
    if (user) {
      // Reset AI credits on the first day of each month
      const today = new Date();
      const lastReset = localStorage.getItem('last_credits_reset');
      if (!lastReset || new Date(lastReset).getMonth() !== today.getMonth()) {
        setAiCredits(currentPlan.aiCredits);
        localStorage.setItem('last_credits_reset', today.toISOString());
        localStorage.setItem('ai_credits', currentPlan.aiCredits.toString());
      }
    }
  }, [user, currentPlan]);

  const useAiCredit = () => {
    if (currentPlan.id === 'enterprise') return true;
    if (aiCredits <= 0) {
      toast.error('No AI credits remaining. Please upgrade your plan.');
      return false;
    }
    
    setAiCredits(prev => {
      const newCredits = prev - 1;
      localStorage.setItem('ai_credits', newCredits.toString());
      return newCredits;
    });
    return true;
  };

  const upgradePlan = async (planId: string) => {
    const plan = plans.find(p => p.id === planId);
    if (!plan) throw new Error('Invalid plan');

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setCurrentPlan(plan);
      setAiCredits(plan.aiCredits);
      localStorage.setItem('user_plan', plan.id);
      localStorage.setItem('ai_credits', plan.aiCredits.toString());
      
      toast.success(`Successfully upgraded to ${plan.name} plan!`);
    } catch (error) {
      toast.error('Error processing payment');
      throw error;
    }
  };

  const isFeatureAvailable = (feature: string): boolean => {
    return currentPlan.features.includes(feature);
  };

  return (
    <SubscriptionContext.Provider value={{
      currentPlan,
      aiCredits,
      useAiCredit,
      upgradePlan,
      isFeatureAvailable
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}