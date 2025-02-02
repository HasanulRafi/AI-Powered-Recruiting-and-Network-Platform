import React, { useState } from 'react';
import { useAI } from '../contexts/AIContext';
import { 
  XIcon, 
  PhoneCallIcon, 
  MinimizeIcon, 
  SparklesIcon,
  PhoneIcon,
  PhoneOffIcon,
  MicIcon,
  MicOffIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface CallAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export default function CallAssistant({ isOpen, onClose, onMinimize }: CallAssistantProps) {
  const { aiEnabled } = useAI();
  const [isInCall, setIsInCall] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [callInterval, setCallInterval] = useState<NodeJS.Timeout | null>(null);

  const startCall = () => {
    if (!aiEnabled) {
      toast.error('Please enable AI Assistant first');
      return;
    }

    setIsInCall(true);
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallInterval(interval);
    toast.success('AI Interview call started');
  };

  const endCall = () => {
    setIsInCall(false);
    if (callInterval) {
      clearInterval(callInterval);
      setCallInterval(null);
    }
    setCallDuration(0);
    toast.success('Call ended');
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    toast.success(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <PhoneCallIcon className="h-5 w-5 text-indigo-600" />
          <h3 className="font-medium">AI Interview Call</h3>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MinimizeIcon className="h-4 w-4 text-gray-500" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <XIcon className="h-4 w-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Call Interface */}
      <div className="flex-1 p-8">
        <div className="text-center space-y-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-indigo-100 rounded-full mx-auto flex items-center justify-center">
            <SparklesIcon className="h-12 w-12 text-indigo-600" />
          </div>

          {/* Status */}
          <div>
            <h4 className="text-lg font-medium text-gray-900">AI Interviewer</h4>
            <p className="text-sm text-gray-500">
              {isInCall ? 'In call' : 'Ready to start'}
            </p>
            {isInCall && (
              <p className="text-sm font-medium text-indigo-600 mt-1">
                {formatTime(callDuration)}
              </p>
            )}
          </div>

          {/* Call Controls */}
          <div className="flex items-center justify-center space-x-6">
            {isInCall ? (
              <>
                <button
                  onClick={toggleMute}
                  className={`p-4 rounded-full ${
                    isMuted
                      ? 'bg-gray-100 text-gray-600'
                      : 'bg-indigo-100 text-indigo-600'
                  } hover:opacity-75`}
                >
                  {isMuted ? (
                    <MicOffIcon className="h-6 w-6" />
                  ) : (
                    <MicIcon className="h-6 w-6" />
                  )}
                </button>
                <button
                  onClick={endCall}
                  className="p-4 rounded-full bg-red-100 text-red-600 hover:opacity-75"
                >
                  <PhoneOffIcon className="h-6 w-6" />
                </button>
              </>
            ) : (
              <button
                onClick={startCall}
                className="p-4 rounded-full bg-green-100 text-green-600 hover:opacity-75"
              >
                <PhoneIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Call Info */}
      <div className="p-4 border-t bg-gray-50">
        <div className="text-sm text-gray-500">
          {isInCall ? (
            <div className="flex items-center justify-center space-x-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              <span>Interview in progress...</span>
            </div>
          ) : (
            <p className="text-center">
              Start an AI-powered interview practice call
            </p>
          )}
        </div>
      </div>
    </div>
  );
}