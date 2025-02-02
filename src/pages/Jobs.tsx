import React, { useState, useEffect } from 'react';
import { BriefcaseIcon, MapPinIcon, CurrencyIcon, BuildingIcon, PlusIcon, XIcon } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import CreateJobForm from '../components/CreateJobForm';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  type: string;
  posted: string;
}

const DEFAULT_JOBS: Job[] = [
  {
    id: 'job1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA (Hybrid)',
    salary: '$150,000 - $200,000',
    description: 'Join our core platform team to build scalable microservices and cloud infrastructure. You will work on high-impact projects using modern technologies like React, Node.js, and AWS.',
    requirements: [
      '5+ years of experience in full-stack development',
      'Strong knowledge of React, Node.js, and TypeScript',
      'Experience with cloud services (AWS/GCP/Azure)',
      'Bachelor\'s degree in Computer Science or equivalent experience'
    ],
    type: 'Full-time',
    posted: '2 days ago'
  },
  {
    id: 'job2',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'Remote (US)',
    salary: '$160,000 - $220,000',
    description: 'Build and deploy machine learning models to power our next-generation recommendation engine. Work with large-scale data and state-of-the-art ML frameworks.',
    requirements: [
      'MS/PhD in Computer Science, Machine Learning, or related field',
      'Experience with PyTorch or TensorFlow',
      'Strong background in deep learning and NLP',
      'Production ML deployment experience'
    ],
    type: 'Full-time',
    posted: '1 week ago'
  },
  {
    id: 'job3',
    title: 'Product Manager',
    company: 'Growth Startup',
    location: 'New York, NY (On-site)',
    salary: '$140,000 - $180,000',
    description: 'Lead product strategy and execution for our B2B SaaS platform. Work closely with engineering, design, and sales teams to deliver features that delight our enterprise customers.',
    requirements: [
      '4+ years of product management experience',
      'Track record of launching successful B2B products',
      'Strong analytical and communication skills',
      'MBA or equivalent experience preferred'
    ],
    type: 'Full-time',
    posted: '3 days ago'
  },
  {
    id: 'job4',
    title: 'Full Stack Software Engineer',
    company: 'Future Tech',
    location: 'Austin, TX (Flexible)',
    salary: '$130,000 - $180,000',
    description: 'Build and maintain our customer-facing applications and internal tools. Work with a modern tech stack including React, GraphQL, and Node.js in an agile environment.',
    requirements: [
      '3+ years of full-stack development experience',
      'Proficiency in React and Node.js',
      'Experience with GraphQL and REST APIs',
      'Strong problem-solving skills'
    ],
    type: 'Full-time',
    posted: '5 days ago'
  },
  {
    id: 'job5',
    title: 'Software Engineer - Backend',
    company: 'Innovation Labs',
    location: 'Seattle, WA (Hybrid)',
    salary: '$140,000 - $190,000',
    description: 'Design and implement scalable backend services for our growing platform. Focus on performance optimization, security, and reliability using Go and PostgreSQL.',
    requirements: [
      '4+ years of backend development experience',
      'Strong knowledge of Go or similar languages',
      'Experience with distributed systems',
      'Database design and optimization skills'
    ],
    type: 'Full-time',
    posted: '1 day ago'
  }
];

export default function Jobs() {
  const { profile } = useAuth();
  const [searchParams] = useSearchParams();
  const highlightedJobId = searchParams.get('highlight');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [jobs, setJobs] = useState<Job[]>(() => {
    const storedJobs = localStorage.getItem('jobs');
    return storedJobs ? JSON.parse(storedJobs) : DEFAULT_JOBS;
  });
  const [appliedJobs, setAppliedJobs] = useState<string[]>(() => {
    const stored = localStorage.getItem('appliedJobs');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('appliedJobs', JSON.stringify(appliedJobs));
  }, [appliedJobs]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  const handleApply = (job: Job) => {
    // Add to applied jobs
    setAppliedJobs(prev => [...prev, job.id]);

    if (profile?.role === 'recruiter') {
      // Only show toast notification for recruiters
      toast.success(`Application received from John Doe for ${job.title}`);
      return;
    }

    // Create a thank you message for job seekers
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    const newMessage = {
      id: Date.now().toString(),
      connectionId: 'f9d7g7d7-0e9h-6e9h-0e9h-0e9h0e9h0e9h',
      senderId: profile?.id || '',
      content: `Thanks for your interest in the ${job.title} position! I'd love to discuss this opportunity with you in more detail. Could you tell me a bit about what interests you most about this role and your relevant experience?`,
      timestamp: new Date(),
      read: false,
      sender: {
        id: profile?.id || '',
        full_name: profile?.full_name || 'Recruiter',
        role: 'recruiter',
        headline: 'Senior Recruiter',
        company: 'Tech Corp'
      },
      recipient: {
        id: 'e8c6f6c6-9d8g-5d8g-9d8g-9d8g9d8g9d8g',
        full_name: 'John Doe',
        role: 'applicant',
        headline: 'Software Engineer',
        company: 'Tech Corp'
      }
    };
    messages.push(newMessage);
    localStorage.setItem('messages', JSON.stringify(messages));

    // Add notification for job seekers
    const notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const newNotification = {
      id: Date.now().toString(),
      type: 'message' as const,
      title: 'New message about your job application',
      description: `${profile?.full_name || 'Recruiter'} wants to discuss your application for the ${job.title} position`,
      timestamp: new Date(),
      read: false,
      actionUrl: `/messages/${newMessage.connectionId}`,
      sender: {
        id: profile?.id || '',
        full_name: profile?.full_name || 'Recruiter',
        role: 'recruiter',
        headline: 'Senior Recruiter',
        company: 'Tech Corp'
      }
    };
    notifications.push(newNotification);
    localStorage.setItem('notifications', JSON.stringify(notifications));

    // Show success toast for job seekers
    toast.success('Application submitted successfully!');
  };

  const handleJobCreated = (newJob: Job) => {
    setJobs(prevJobs => [newJob, ...prevJobs]);
    setShowCreateForm(false);
  };

  if (profile?.role === 'recruiter') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">My Job Postings</h1>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Create New Job
          </button>
        </div>

        {showCreateForm ? (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="relative bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <button
                onClick={() => setShowCreateForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              >
                <XIcon className="h-6 w-6" />
              </button>
              <CreateJobForm
                onClose={() => setShowCreateForm(false)}
                onJobCreated={handleJobCreated}
              />
            </div>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <BriefcaseIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No jobs posted yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating your first job posting
            </p>
            <div className="mt-6">
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                Create Job
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white rounded-lg shadow-sm p-6"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                    <div className="mt-1 flex items-center space-x-4">
                      <div className="flex items-center text-gray-500">
                        <BuildingIcon className="h-4 w-4 mr-1" />
                        {job.company}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <MapPinIcon className="h-4 w-4 mr-1" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-500">
                        <CurrencyIcon className="h-4 w-4 mr-1" />
                        {job.salary}
                      </div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">{job.posted}</span>
                </div>

                <p className="mt-4 text-gray-600">{job.description}</p>

                <div className="mt-4">
                  <h3 className="text-sm font-medium text-gray-900">Requirements:</h3>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="text-sm text-gray-600">{req}</li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {job.type}
                  </span>
                  <button
                    onClick={() => {
                      const updatedJobs = jobs.filter(j => j.id !== job.id);
                      setJobs(updatedJobs);
                      toast.success('Job posting removed');
                    }}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-600 bg-red-50 hover:bg-red-100"
                  >
                    Remove Posting
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BriefcaseIcon className="h-6 w-6 text-indigo-600" />
          <h1 className="text-2xl font-bold text-gray-900">Jobs</h1>
        </div>
        <span className="text-sm text-gray-500">{jobs.length} opportunities</span>
      </div>

      <div className="space-y-6">
        {jobs.map((job) => {
          const isApplied = appliedJobs.includes(job.id);
          
          return (
            <div
              key={job.id}
              className={`bg-white rounded-lg shadow-sm p-6 ${
                job.id === highlightedJobId ? 'ring-2 ring-indigo-500' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{job.title}</h2>
                  <div className="mt-1 flex items-center space-x-4">
                    <div className="flex items-center text-gray-500">
                      <BuildingIcon className="h-4 w-4 mr-1" />
                      {job.company}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <MapPinIcon className="h-4 w-4 mr-1" />
                      {job.location}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <CurrencyIcon className="h-4 w-4 mr-1" />
                      {job.salary}
                    </div>
                  </div>
                </div>
                <span className="text-sm text-gray-500">{job.posted}</span>
              </div>

              <p className="mt-4 text-gray-600">{job.description}</p>

              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-900">Requirements:</h3>
                <ul className="mt-2 list-disc list-inside space-y-1">
                  {job.requirements.map((req, index) => (
                    <li key={index} className="text-sm text-gray-600">{req}</li>
                  ))}
                </ul>
              </div>

              <div className="mt-6 flex justify-between items-center">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {job.type}
                </span>
                <button
                  onClick={() => !isApplied && handleApply(job)}
                  disabled={isApplied}
                  className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${
                    isApplied
                      ? 'bg-green-600 hover:bg-green-700 text-white cursor-default'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                >
                  {isApplied ? 'Applied' : 'Apply Now'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}