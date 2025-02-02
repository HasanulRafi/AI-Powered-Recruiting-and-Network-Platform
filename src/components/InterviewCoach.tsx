import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { generateInterviewQuestions, analyzeMockInterviewResponse } from '../lib/ai';
import { toast } from 'react-hot-toast';
import {
  MicIcon,
  PauseIcon,
  SparklesIcon,
  MessageSquareIcon,
  AwardIcon,
  SkipForwardIcon,
  InfoIcon,
  CheckCircleIcon,
  XCircleIcon,
  BookOpenIcon,
} from 'lucide-react';

export default function InterviewCoach() {
  const { profile } = useAuth();
  const { aiEnabled } = useAI();
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [response, setResponse] = useState('');
  const [analysis, setAnalysis] = useState<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [practiceHistory, setPracticeHistory] = useState<Array<{
    question: string;
    response: string;
    score: number;
    timestamp: Date;
  }>>([]);

  const interviewTips = [
    'Use the STAR method (Situation, Task, Action, Result) to structure your responses',
    'Provide specific examples and quantifiable results',
    'Keep responses concise but detailed (2-3 minutes)',
    'Show enthusiasm and positive attitude',
    'Address challenges constructively',
    'Highlight relevant skills and experiences',
  ];

  useEffect(() => {
    if (!aiEnabled) {
      toast.error('Please enable AI Agent to use this feature');
      return;
    }

    if (profile?.headline) {
      const generatedQuestions = generateInterviewQuestions(
        profile.headline,
        profile.skills || []
      );
      setQuestions(generatedQuestions);
    }
  }, [profile, aiEnabled]);

  const startRecording = () => {
    if (!aiEnabled) {
      toast.error('Please enable AI Agent to use this feature');
      return;
    }
    setIsRecording(true);
    setRecordingTime(0);
    const newTimer = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
    setTimer(newTimer);
  };

  const stopRecording = () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
    setIsRecording(false);
    if (response.trim()) {
      const result = analyzeMockInterviewResponse(response);
      setAnalysis(result);
      // Save to practice history
      setPracticeHistory(prev => [...prev, {
        question: questions[currentQuestionIndex],
        response: response,
        score: result.score,
        timestamp: new Date()
      }]);
    }
  };

  const nextQuestion = () => {
    if (!aiEnabled) {
      toast.error('Please enable AI Agent to use this feature');
      return;
    }
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setResponse('');
      setAnalysis(null);
    }
  };

  const analyzeResponse = () => {
    if (!aiEnabled) {
      toast.error('Please enable AI Agent to use this feature');
      return;
    }
    if (!response.trim()) {
      toast.error('Please provide a response first');
      return;
    }
    const result = analyzeMockInterviewResponse(response);
    setAnalysis(result);
    // Save to practice history
    setPracticeHistory(prev => [...prev, {
      question: questions[currentQuestionIndex],
      response: response,
      score: result.score,
      timestamp: new Date()
    }]);
    toast.success('Response analyzed successfully!');
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [timer]);

  if (!profile) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageSquareIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">AI Interview Coach</h2>
        </div>
        <button
          onClick={() => setShowTips(!showTips)}
          className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600"
        >
          <InfoIcon className="h-5 w-5" />
          <span>Interview Tips</span>
        </button>
      </div>

      {showTips && (
        <div className="mb-6 bg-indigo-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <BookOpenIcon className="h-5 w-5 text-indigo-600" />
            <h3 className="font-medium text-indigo-900">Interview Tips</h3>
          </div>
          <ul className="space-y-2">
            {interviewTips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-2">
                <CheckCircleIcon className="h-5 w-5 text-indigo-600 mt-0.5" />
                <span className="text-indigo-800">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {questions.length > 0 ? (
        <div className="space-y-6">
          {/* Question Display */}
          <div className="bg-indigo-50 p-6 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-indigo-600 font-medium">
                Question {currentQuestionIndex + 1} of {questions.length}
              </span>
              {analysis && (
                <div className="flex items-center space-x-2">
                  <AwardIcon className="h-5 w-5 text-indigo-600" />
                  <span className="font-medium text-indigo-600">
                    Score: {analysis.score}/100
                  </span>
                </div>
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              {questions[currentQuestionIndex]}
            </h3>
          </div>

          {/* Response Section */}
          <div className="space-y-4">
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type or record your response..."
              rows={6}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />

            {/* Recording Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={isRecording ? stopRecording : startRecording}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                    isRecording
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
                  }`}
                >
                  {isRecording ? (
                    <>
                      <PauseIcon className="h-5 w-5" />
                      <span>Stop ({formatTime(recordingTime)})</span>
                    </>
                  ) : (
                    <>
                      <MicIcon className="h-5 w-5" />
                      <span>Start Recording</span>
                    </>
                  )}
                </button>

                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                  className="flex items-center space-x-2 px-4 py-2 rounded-md bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50"
                >
                  <SkipForwardIcon className="h-5 w-5" />
                  <span>Next Question</span>
                </button>
              </div>

              <button
                onClick={analyzeResponse}
                className="flex items-center space-x-2 px-4 py-2 rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                <SparklesIcon className="h-5 w-5" />
                <span>Analyze Response</span>
              </button>
            </div>
          </div>

          {/* Analysis Results */}
          {analysis && (
            <div className="border rounded-lg p-6 space-y-4">
              <h4 className="font-medium text-gray-900">Response Analysis</h4>
              
              {/* Score Visualization */}
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div 
                  className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${analysis.score}%` }}
                ></div>
              </div>
              
              {/* Feedback */}
              {analysis.feedback.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-green-700">Strengths</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.feedback.map((feedback: string, index: number) => (
                      <li key={index} className="text-green-600">
                        {feedback}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Improvements */}
              {analysis.improvements.length > 0 && (
                <div className="space-y-2">
                  <h5 className="text-sm font-medium text-amber-700">Areas for Improvement</h5>
                  <ul className="list-disc list-inside space-y-1">
                    {analysis.improvements.map((improvement: string, index: number) => (
                      <li key={index} className="text-amber-600">
                        {improvement}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Practice History */}
          {practiceHistory.length > 0 && (
            <div className="mt-8">
              <h4 className="font-medium text-gray-900 mb-4">Practice History</h4>
              <div className="space-y-4">
                {practiceHistory.slice(-3).reverse().map((practice, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">
                        {practice.timestamp.toLocaleString()}
                      </span>
                      <span className="text-sm font-medium text-indigo-600">
                        Score: {practice.score}/100
                      </span>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">
                      {practice.question}
                    </p>
                    <p className="text-sm text-gray-600">
                      {practice.response.slice(0, 100)}...
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">
            Please complete your profile with a job title and skills to start the interview practice.
          </p>
        </div>
      )}
    </div>
  );
}