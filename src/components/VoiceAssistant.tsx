import React, { useState, useEffect } from 'react';
import { useAI } from '../contexts/AIContext';
import { XIcon, MicIcon, MinimizeIcon, SparklesIcon, StopCircleIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VoiceAssistantProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

export default function VoiceAssistant({ isOpen, onClose, onMinimize }: VoiceAssistantProps) {
  const { aiEnabled } = useAI();
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  useEffect(() => {
    if (!aiEnabled) return;

    let recognition: any = null;
    
    if ('webkitSpeechRecognition' in window) {
      recognition = new (window as any).webkitSpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map(result => result.transcript)
          .join('');
        
        setTranscript(transcript);
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error('Error with speech recognition');
      };
    }

    if (isListening && recognition) {
      recognition.start();
    } else if (!isListening && recognition) {
      recognition.stop();
    }

    return () => {
      if (recognition) recognition.stop();
    };
  }, [isListening, aiEnabled]);

  const toggleListening = () => {
    if (!aiEnabled) {
      toast.error('Please enable AI Assistant first');
      return;
    }

    if (!('webkitSpeechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser');
      return;
    }

    setIsListening(!isListening);
  };

  const handleSubmit = () => {
    if (!transcript.trim()) {
      toast.error('Please say something first');
      return;
    }

    // Simulate AI processing
    setResponse('Processing your request...');
    setTimeout(() => {
      setResponse(`I heard: "${transcript}". How can I help you with that?`);
      setTranscript('');
      setIsListening(false);
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-96 bg-white rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <MicIcon className="h-5 w-5 text-indigo-600" />
          <h3 className="font-medium">Voice Assistant</h3>
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

      {/* Content */}
      <div className="flex-1 p-4 space-y-4">
        {/* Voice Input Section */}
        <div className="text-center">
          <button
            onClick={toggleListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-colors ${
              isListening
                ? 'bg-red-100 text-red-600 hover:bg-red-200'
                : 'bg-indigo-100 text-indigo-600 hover:bg-indigo-200'
            }`}
          >
            {isListening ? (
              <StopCircleIcon className="h-10 w-10" />
            ) : (
              <MicIcon className="h-10 w-10" />
            )}
          </button>
          <p className="mt-2 text-sm text-gray-500">
            {isListening ? 'Listening...' : 'Click to start speaking'}
          </p>
        </div>

        {/* Transcript */}
        {transcript && (
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Transcript:</h4>
            <p className="text-gray-600">{transcript}</p>
          </div>
        )}

        {/* Response */}
        {response && (
          <div className="bg-indigo-50 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <SparklesIcon className="h-4 w-4 text-indigo-600" />
              <h4 className="text-sm font-medium text-indigo-700">AI Response:</h4>
            </div>
            <p className="text-indigo-600">{response}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="p-4 border-t">
        <button
          onClick={handleSubmit}
          disabled={!transcript.trim()}
          className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
          Process Voice Input
        </button>
      </div>
    </div>
  );
}