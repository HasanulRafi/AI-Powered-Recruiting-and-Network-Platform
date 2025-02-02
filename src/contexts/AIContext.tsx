import React, { createContext, useContext, useState, useCallback } from 'react';
import { toast } from 'react-hot-toast';

interface AIContextType {
  aiEnabled: boolean;
  toggleAI: () => void;
  isProcessing: boolean;
  startProcessing: () => void;
  stopProcessing: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

export function AIProvider({ children }: { children: React.ReactNode }) {
  const [aiEnabled, setAIEnabled] = useState(() => {
    const saved = localStorage.getItem('ai_enabled');
    return saved ? JSON.parse(saved) : true;
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const toggleAI = useCallback(() => {
    setAIEnabled(prev => {
      const newValue = !prev;
      localStorage.setItem('ai_enabled', JSON.stringify(newValue));
      toast.success(newValue ? 'AI Assistant enabled' : 'AI Assistant disabled');
      return newValue;
    });
  }, []);

  const startProcessing = useCallback(() => {
    if (!aiEnabled) {
      toast.error('Please enable AI Assistant first');
      return;
    }
    setIsProcessing(true);
  }, [aiEnabled]);

  const stopProcessing = useCallback(() => {
    setIsProcessing(false);
  }, []);

  return (
    <AIContext.Provider value={{ 
      aiEnabled, 
      toggleAI, 
      isProcessing, 
      startProcessing, 
      stopProcessing 
    }}>
      {children}
    </AIContext.Provider>
  );
}

export function useAI() {
  const context = useContext(AIContext);
  if (context === undefined) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}