import React, { useState, useCallback } from 'react';
import { useAI } from '../contexts/AIContext';
import { 
  SparklesIcon, 
  BrainCircuitIcon, 
  MessageSquareIcon, 
  WandIcon, 
  XIcon,
  MicIcon,
  PhoneCallIcon,
  FileTextIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import ChatWindow from './ChatWindow';
import ContentWriter from './ContentWriter';
import VoiceAssistant from './VoiceAssistant';
import CallAssistant from './CallAssistant';
import DocumentAnalyzer from './DocumentAnalyzer';

export default function AIAgentButton() {
  const { aiEnabled, toggleAI, isProcessing } = useAI();
  const [isOpen, setIsOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isContentWriterOpen, setIsContentWriterOpen] = useState(false);
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isCallOpen, setIsCallOpen] = useState(false);
  const [isDocumentOpen, setIsDocumentOpen] = useState(false);

  const closeAllModels = () => {
    setIsChatOpen(false);
    setIsContentWriterOpen(false);
    setIsVoiceOpen(false);
    setIsCallOpen(false);
    setIsDocumentOpen(false);
  };

  const handleModelSelect = useCallback((modelId: string) => {
    if (!aiEnabled) {
      toast.error('Please enable AI Assistant first');
      return;
    }

    if (isProcessing) {
      toast.error('Please wait for the current process to complete');
      return;
    }

    closeAllModels();
    setIsOpen(false);

    // Handle model selection
    switch (modelId) {
      case 'chat':
        setIsChatOpen(true);
        break;
      case 'writer':
        setIsContentWriterOpen(true);
        break;
      case 'voice':
        setIsVoiceOpen(true);
        break;
      case 'call':
        setIsCallOpen(true);
        break;
      case 'document':
        setIsDocumentOpen(true);
        break;
      case 'matcher':
        toast.success('Job Matcher activated');
        break;
      default:
        toast.error('Unknown model selected');
    }
  }, [aiEnabled, isProcessing]);

  const models = [
    {
      id: 'chat',
      name: 'Chat Assistant',
      icon: MessageSquareIcon,
      description: 'Chat with AI for job search advice',
    },
    {
      id: 'voice',
      name: 'Voice Assistant',
      icon: MicIcon,
      description: 'Voice-based interaction and commands',
    },
    {
      id: 'call',
      name: 'Call Assistant',
      icon: PhoneCallIcon,
      description: 'AI-powered interview practice calls',
    },
    {
      id: 'document',
      name: 'Document Analyzer',
      icon: FileTextIcon,
      description: 'Analyze resumes and documents',
    },
    {
      id: 'writer',
      name: 'Content Writer',
      icon: WandIcon,
      description: 'Generate professional content',
    },
    {
      id: 'matcher',
      name: 'Job Matcher',
      icon: BrainCircuitIcon,
      description: 'Smart job recommendations',
    },
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <ChatWindow
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        onMinimize={() => setIsChatOpen(false)}
      />

      <ContentWriter
        isOpen={isContentWriterOpen}
        onClose={() => setIsContentWriterOpen(false)}
        onMinimize={() => setIsContentWriterOpen(false)}
      />

      <VoiceAssistant
        isOpen={isVoiceOpen}
        onClose={() => setIsVoiceOpen(false)}
        onMinimize={() => setIsVoiceOpen(false)}
      />

      <CallAssistant
        isOpen={isCallOpen}
        onClose={() => setIsCallOpen(false)}
        onMinimize={() => setIsCallOpen(false)}
      />

      <DocumentAnalyzer
        isOpen={isDocumentOpen}
        onClose={() => setIsDocumentOpen(false)}
        onMinimize={() => setIsDocumentOpen(false)}
      />

      {/* Models Panel */}
      {isOpen && (
        <div className="absolute bottom-16 right-0 mb-2 bg-white rounded-lg shadow-lg w-72 overflow-hidden">
          <div className="p-4 bg-indigo-50 border-b border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-900">AI Models</h3>
            <p className="text-sm text-indigo-700">Select an AI model to assist you</p>
          </div>
          <div className="p-2">
            {models.map((model) => (
              <button
                key={model.id}
                onClick={() => handleModelSelect(model.id)}
                className="w-full p-3 hover:bg-indigo-50 rounded-lg transition-colors flex items-start space-x-3"
                disabled={isProcessing}
              >
                <div className="flex-shrink-0">
                  <model.icon className="h-6 w-6 text-indigo-600" />
                </div>
                <div className="text-left">
                  <div className="font-medium text-gray-900">{model.name}</div>
                  <div className="text-sm text-gray-500">{model.description}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Button */}
      <div className="flex flex-col items-end space-y-2">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-all ${
            aiEnabled ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-gray-600 hover:bg-gray-700'
          } ${isProcessing ? 'animate-pulse' : ''}`}
          disabled={isProcessing}
        >
          {isOpen ? (
            <XIcon className="h-6 w-6 text-white" />
          ) : (
            <SparklesIcon className="h-6 w-6 text-white" />
          )}
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 hidden group-hover:block">
            <div className="bg-gray-900 text-white text-sm rounded py-1 px-2 whitespace-nowrap">
              {isOpen ? 'Close AI Models' : 'Open AI Models'}
            </div>
          </div>
        </button>

        {/* Status Indicator */}
        <button
          onClick={toggleAI}
          className="flex items-center space-x-2 bg-white rounded-full px-3 py-1 shadow-md hover:bg-gray-50"
          disabled={isProcessing}
        >
          <div
            className={`w-2 h-2 rounded-full ${
              aiEnabled ? 'bg-green-500' : 'bg-gray-400'
            }`}
          />
          <span className="text-sm font-medium text-gray-700">
            {aiEnabled ? 'AI Active' : 'AI Disabled'}
          </span>
        </button>
      </div>
    </div>
  );
}