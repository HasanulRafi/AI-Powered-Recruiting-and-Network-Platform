import React, { useState } from 'react';
import { useAI } from '../contexts/AIContext';
import { XIcon, SendIcon, SparklesIcon, MinimizeIcon, FileTextIcon, CopyIcon, CheckIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContentWriterProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

type ContentType = 'cover-letter' | 'job-description' | 'profile-bio' | 'custom';

interface ContentTemplate {
  id: ContentType;
  name: string;
  icon: typeof FileTextIcon;
  description: string;
  placeholder: string;
}

export default function ContentWriter({ isOpen, onClose, onMinimize }: ContentWriterProps) {
  const { aiEnabled } = useAI();
  const [selectedTemplate, setSelectedTemplate] = useState<ContentType | null>(null);
  const [prompt, setPrompt] = useState('');
  const [generatedContent, setGeneratedContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const templates: ContentTemplate[] = [
    {
      id: 'cover-letter',
      name: 'Cover Letter',
      icon: FileTextIcon,
      description: 'Generate a professional cover letter',
      placeholder: 'Enter job title, company name, and key requirements...',
    },
    {
      id: 'job-description',
      name: 'Job Description',
      icon: FileTextIcon,
      description: 'Create a compelling job posting',
      placeholder: 'Enter role, requirements, and company details...',
    },
    {
      id: 'profile-bio',
      name: 'Profile Bio',
      icon: FileTextIcon,
      description: 'Write an engaging professional bio',
      placeholder: 'Enter your role, experience, and key achievements...',
    },
    {
      id: 'custom',
      name: 'Custom Content',
      icon: FileTextIcon,
      description: 'Generate any professional content',
      placeholder: 'Describe what you want to write...',
    },
  ];

  const generateContent = async () => {
    if (!aiEnabled) {
      toast.error('Please enable AI Assistant first');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please provide some details first');
      return;
    }

    setIsGenerating(true);

    // Simulate AI content generation
    setTimeout(() => {
      const content = generateTemplateContent(selectedTemplate!, prompt);
      setGeneratedContent(content);
      setIsGenerating(false);
      toast.success('Content generated successfully!');
    }, 2000);
  };

  const generateTemplateContent = (type: ContentType, input: string): string => {
    const templates = {
      'cover-letter': `Dear Hiring Manager,

I am writing to express my strong interest in the [Position] role at [Company]. With my background in [Field] and proven track record of [Achievement], I am confident in my ability to contribute significantly to your team.

${input}

I am particularly drawn to [Company]'s commitment to innovation and excellence in the industry. My experience aligns perfectly with the requirements of this role, and I am excited about the opportunity to bring my unique blend of skills and expertise to your organization.

Thank you for considering my application. I look forward to discussing how I can contribute to [Company]'s continued success.

Best regards,
[Your Name]`,

      'job-description': `Position: [Job Title]

About Us:
We are seeking an exceptional candidate to join our dynamic team. This role offers an exciting opportunity to make a significant impact while working with cutting-edge technologies and talented professionals.

Key Responsibilities:
${input.split(',').map(item => `• ${item.trim()}`).join('\n')}

Required Qualifications:
• Proven experience in relevant field
• Strong analytical and problem-solving skills
• Excellent communication and collaboration abilities
• Ability to work independently and in a team environment

Benefits:
• Competitive salary and benefits package
• Professional development opportunities
• Flexible work arrangements
• Collaborative and innovative work environment

If you are passionate about [Field] and want to be part of a growing organization, we want to hear from you!`,

      'profile-bio': `${input}

As a seasoned professional in [Industry], I bring a unique combination of technical expertise and business acumen. My career has been marked by successful projects and initiatives that have delivered measurable results.

Key achievements include [Achievement 1], [Achievement 2], and [Achievement 3]. I am passionate about [Interest/Specialty] and constantly seek opportunities to learn and grow.

I thrive in collaborative environments and am always eager to share knowledge and mentor others. My approach combines strategic thinking with hands-on execution to drive successful outcomes.`,

      'custom': input,
    };

    return templates[type].replace(/\[.*?\]/g, '___');
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    toast.success('Content copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-[32rem] bg-white rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-5 w-5 text-indigo-600" />
          <h3 className="font-medium">Content Writer</h3>
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

      <div className="flex-1 overflow-y-auto p-4">
        {!selectedTemplate ? (
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">Choose a template</h4>
            <div className="grid grid-cols-1 gap-4">
              {templates.map(template => (
                <button
                  key={template.id}
                  onClick={() => setSelectedTemplate(template.id)}
                  className="flex items-start space-x-4 p-4 border rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-left"
                >
                  <div className="flex-shrink-0">
                    <template.icon className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900">{template.name}</h5>
                    <p className="text-sm text-gray-500">{template.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <button
              onClick={() => {
                setSelectedTemplate(null);
                setPrompt('');
                setGeneratedContent('');
              }}
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              ← Back to templates
            </button>

            <div className="space-y-4">
              <textarea
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                placeholder={templates.find(t => t.id === selectedTemplate)?.placeholder}
                rows={4}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />

              <button
                onClick={generateContent}
                disabled={isGenerating || !prompt.trim()}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <SparklesIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    Generating...
                  </>
                ) : (
                  <>
                    <SparklesIcon className="-ml-1 mr-2 h-4 w-4" />
                    Generate Content
                  </>
                )}
              </button>
            </div>

            {generatedContent && (
              <div className="relative mt-4">
                <div className="absolute top-4 right-4">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 text-gray-500 hover:text-indigo-600 rounded-full hover:bg-indigo-50"
                  >
                    {copied ? (
                      <CheckIcon className="h-5 w-5 text-green-500" />
                    ) : (
                      <CopyIcon className="h-5 w-5" />
                    )}
                  </button>
                </div>
                <textarea
                  value={generatedContent}
                  onChange={e => setGeneratedContent(e.target.value)}
                  rows={12}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}