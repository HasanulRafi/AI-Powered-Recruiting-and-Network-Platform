import React, { useState, useRef } from 'react';
import { useAI } from '../contexts/AIContext';
import { 
  XIcon, 
  FileTextIcon, 
  MinimizeIcon, 
  SparklesIcon,
  UploadCloudIcon,
  CheckCircleIcon,
  FileIcon,
  AlertCircleIcon
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface DocumentAnalyzerProps {
  isOpen: boolean;
  onClose: () => void;
  onMinimize: () => void;
}

interface AnalysisResult {
  type: 'success' | 'warning' | 'error';
  message: string;
  details?: string[];
}

export default function DocumentAnalyzer({ isOpen, onClose, onMinimize }: DocumentAnalyzerProps) {
  const { aiEnabled } = useAI();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (!aiEnabled) {
      toast.error('Please enable AI Assistant first');
      return;
    }

    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload a PDF or Word document');
      return;
    }

    setFile(file);
    analyzeDocument(file);
  };

  const analyzeDocument = async (file: File) => {
    setIsAnalyzing(true);
    setResults([]);

    // Simulate document analysis
    setTimeout(() => {
      const mockResults: AnalysisResult[] = [
        {
          type: 'success',
          message: 'Document structure is well-organized',
          details: ['Clear sections', 'Good formatting', 'Appropriate length']
        },
        {
          type: 'warning',
          message: 'Consider adding more quantifiable achievements',
          details: ['Include specific metrics', 'Add project outcomes', 'Highlight key results']
        },
        {
          type: 'success',
          message: 'Keywords are well-optimized for ATS',
          details: ['Relevant industry terms', 'Technical skills present', 'Action verbs used effectively']
        }
      ];

      setResults(mockResults);
      setIsAnalyzing(false);
      toast.success('Document analysis complete');
    }, 2000);
  };

  const getResultIcon = (type: 'success' | 'warning' | 'error') => {
    switch (type) {
      case 'success':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertCircleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <AlertCircleIcon className="h-5 w-5 text-red-500" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-6 w-[32rem] bg-white rounded-lg shadow-xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <FileTextIcon className="h-5 w-5 text-indigo-600" />
          <h3 className="font-medium">Document Analyzer</h3>
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
      <div className="flex-1 p-4">
        {/* Upload Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging
              ? 'border-indigo-500 bg-indigo-50'
              : 'border-gray-300 hover:border-indigo-500'
          }`}
        >
          {isAnalyzing ? (
            <div className="flex flex-col items-center space-y-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
              <p className="text-gray-600">Analyzing document...</p>
            </div>
          ) : file ? (
            <div className="flex items-center justify-center space-x-3">
              <FileIcon className="h-8 w-8 text-indigo-600" />
              <div className="text-left">
                <p className="font-medium text-gray-900">{file.name}</p>
                <p className="text-sm text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
          ) : (
            <>
              <UploadCloudIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="mt-4">
                <p className="text-gray-600">
                  Drag and drop your document here, or{' '}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    browse
                  </button>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  PDF or Word documents only
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={handleFileInput}
              />
            </>
          )}
        </div>

        {/* Analysis Results */}
        {results.length > 0 && (
          <div className="mt-6 space-y-4">
            <h4 className="font-medium text-gray-900">Analysis Results</h4>
            {results.map((result, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  result.type === 'success'
                    ? 'bg-green-50'
                    : result.type === 'warning'
                    ? 'bg-yellow-50'
                    : 'bg-red-50'
                }`}
              >
                <div className="flex items-start space-x-3">
                  {getResultIcon(result.type)}
                  <div>
                    <p className={`font-medium ${
                      result.type === 'success'
                        ? 'text-green-800'
                        : result.type === 'warning'
                        ? 'text-yellow-800'
                        : 'text-red-800'
                    }`}>
                      {result.message}
                    </p>
                    {result.details && (
                      <ul className="mt-2 text-sm space-y-1">
                        {result.details.map((detail, i) => (
                          <li
                            key={i}
                            className={
                              result.type === 'success'
                                ? 'text-green-600'
                                : result.type === 'warning'
                                ? 'text-yellow-600'
                                : 'text-red-600'
                            }
                          >
                            • {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}