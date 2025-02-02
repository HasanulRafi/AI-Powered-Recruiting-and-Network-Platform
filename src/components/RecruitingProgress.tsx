import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  ClipboardListIcon, 
  UserCheckIcon, 
  CalendarIcon, 
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  BriefcaseIcon,
  FileTextIcon,
  PhoneIcon,
  HandshakeIcon
} from 'lucide-react';
import { format } from 'date-fns';

interface Candidate {
  id: string;
  name: string;
  role: string;
  stage: 'screening' | 'interview' | 'offer' | 'accepted' | 'rejected';
  status: 'pending' | 'completed' | 'scheduled';
  nextStep?: string;
  nextDate?: Date;
  interviews: Interview[];
  feedback: string[];
  score: number;
}

interface Interview {
  id: string;
  type: string;
  date: Date;
  interviewer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  feedback?: string;
  score?: number;
}

export default function RecruitingProgress() {
  const { profile } = useAuth();
  const [candidates, setCandidates] = useState<Candidate[]>(() => [
    {
      id: '1',
      name: 'John Smith',
      role: 'Senior Developer',
      stage: 'interview',
      status: 'scheduled',
      nextStep: 'Technical Interview',
      nextDate: new Date(Date.now() + 86400000),
      interviews: [
        {
          id: '1',
          type: 'Initial Screening',
          date: new Date(Date.now() - 172800000),
          interviewer: 'Sarah Wilson',
          status: 'completed',
          feedback: 'Strong communication skills, good cultural fit',
          score: 85
        }
      ],
      feedback: ['Excellent problem-solving skills', 'Strong technical background'],
      score: 85
    },
    {
      id: '2',
      name: 'Emma Davis',
      role: 'UX Designer',
      stage: 'offer',
      status: 'pending',
      interviews: [
        {
          id: '1',
          type: 'Portfolio Review',
          date: new Date(Date.now() - 259200000),
          interviewer: 'Mike Johnson',
          status: 'completed',
          feedback: 'Impressive portfolio, great attention to detail',
          score: 90
        },
        {
          id: '2',
          type: 'Design Challenge',
          date: new Date(Date.now() - 86400000),
          interviewer: 'Lisa Chen',
          status: 'completed',
          feedback: 'Excellent problem-solving approach',
          score: 95
        }
      ],
      feedback: ['Strong portfolio', 'Excellent design thinking', 'Great team fit'],
      score: 92
    }
  ]);

  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'screening':
        return FileTextIcon;
      case 'interview':
        return PhoneIcon;
      case 'offer':
        return HandshakeIcon;
      case 'accepted':
        return CheckCircleIcon;
      case 'rejected':
        return XCircleIcon;
      default:
        return ClipboardListIcon;
    }
  };

  const getStageColor = (stage: string, status: string) => {
    if (status === 'completed') return 'text-green-500';
    if (status === 'scheduled') return 'text-blue-500';
    switch (stage) {
      case 'screening':
        return 'text-gray-500';
      case 'interview':
        return 'text-indigo-500';
      case 'offer':
        return 'text-purple-500';
      case 'accepted':
        return 'text-green-500';
      case 'rejected':
        return 'text-red-500';
      default:
        return 'text-gray-500';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <ClipboardListIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Recruiting Pipeline</h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">
            {candidates.length} active candidates
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {candidates.map(candidate => (
          <div key={candidate.id} className="border rounded-lg p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  {candidate.name}
                </h3>
                <p className="text-sm text-gray-500">{candidate.role}</p>
              </div>
              <div className="flex items-center space-x-2">
                <div className={`p-2 rounded-full bg-opacity-10 ${getStageColor(candidate.stage, candidate.status)} bg-current`}>
                  {React.createElement(getStageIcon(candidate.stage), {
                    className: `h-5 w-5 ${getStageColor(candidate.stage, candidate.status)}`
                  })}
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {candidate.stage.charAt(0).toUpperCase() + candidate.stage.slice(1)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {candidate.status.charAt(0).toUpperCase() + candidate.status.slice(1)}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative mb-6">
              <div className="flex items-center justify-between mb-2">
                <div className="w-1/4 text-center">
                  <div className={`w-4 h-4 rounded-full mx-auto ${
                    candidate.stage === 'screening' ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                  <p className="mt-1 text-xs text-gray-500">Screening</p>
                </div>
                <div className="w-1/4 text-center">
                  <div className={`w-4 h-4 rounded-full mx-auto ${
                    candidate.stage === 'interview' ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                  <p className="mt-1 text-xs text-gray-500">Interview</p>
                </div>
                <div className="w-1/4 text-center">
                  <div className={`w-4 h-4 rounded-full mx-auto ${
                    candidate.stage === 'offer' ? 'bg-indigo-600' : 'bg-gray-200'
                  }`} />
                  <p className="mt-1 text-xs text-gray-500">Offer</p>
                </div>
                <div className="w-1/4 text-center">
                  <div className={`w-4 h-4 rounded-full mx-auto ${
                    candidate.stage === 'accepted' ? 'bg-green-500' : 
                    candidate.stage === 'rejected' ? 'bg-red-500' : 'bg-gray-200'
                  }`} />
                  <p className="mt-1 text-xs text-gray-500">Decision</p>
                </div>
              </div>
              <div className="absolute top-2 left-0 h-0.5 bg-gray-200 w-full -z-10" />
            </div>

            {/* Interview Timeline */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Interview Timeline</h4>
              <div className="space-y-3">
                {candidate.interviews.map(interview => (
                  <div key={interview.id} className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      interview.status === 'completed' ? 'bg-green-100' :
                      interview.status === 'scheduled' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <PhoneIcon className={`h-4 w-4 ${
                        interview.status === 'completed' ? 'text-green-600' :
                        interview.status === 'scheduled' ? 'text-blue-600' : 'text-gray-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {interview.type}
                      </p>
                      <p className="text-xs text-gray-500">
                        {format(interview.date, 'MMM d, h:mm a')} • {interview.interviewer}
                      </p>
                    </div>
                    {interview.score && (
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                          Score: {interview.score}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Next Steps */}
            {candidate.nextStep && (
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                  <CalendarIcon className="h-5 w-5 text-indigo-600" />
                  <div>
                    <p className="text-sm font-medium text-indigo-900">
                      Next Step: {candidate.nextStep}
                    </p>
                    {candidate.nextDate && (
                      <p className="text-xs text-indigo-700">
                        {format(candidate.nextDate, 'MMM d, h:mm a')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Feedback Summary */}
            {candidate.feedback.length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Feedback Summary</h4>
                <div className="flex flex-wrap gap-2">
                  {candidate.feedback.map((feedback, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-800"
                    >
                      {feedback}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}