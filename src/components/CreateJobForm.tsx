import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

interface JobFormData {
  title: string;
  company: string;
  location: string;
  salary: string;
  description: string;
  requirements: string[];
  type: string;
}

interface Props {
  onClose: () => void;
  onJobCreated: (job: any) => void;
}

export default function CreateJobForm({ onClose, onJobCreated }: Props) {
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    company: '',
    location: '',
    salary: '',
    description: '',
    requirements: [''],
    type: 'Full-time'
  });

  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, '']
    });
  };

  const removeRequirement = (index: number) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData({ ...formData, requirements: newRequirements });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.title || !formData.company || !formData.location || !formData.salary || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Filter out empty requirements
    const requirements = formData.requirements.filter(req => req.trim() !== '');
    if (requirements.length === 0) {
      toast.error('Please add at least one requirement');
      return;
    }

    // Create new job
    const newJob = {
      id: `job${Date.now()}`,
      ...formData,
      requirements,
      posted: 'Just now'
    };

    // Get existing jobs from localStorage
    const existingJobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const updatedJobs = [newJob, ...existingJobs];
    localStorage.setItem('jobs', JSON.stringify(updatedJobs));

    onJobCreated(newJob);
    toast.success('Job posted successfully!');
    onClose();
  };

  return (
    <div className="bg-white p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Create New Job Posting</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Job Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Company</label>
          <input
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Salary Range</label>
          <input
            type="text"
            value={formData.salary}
            onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
            placeholder="e.g. $100,000 - $150,000"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Requirements</label>
          {formData.requirements.map((req, index) => (
            <div key={index} className="flex mt-2">
              <input
                type="text"
                value={req}
                onChange={(e) => handleRequirementChange(index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Add a requirement"
              />
              <button
                type="button"
                onClick={() => removeRequirement(index)}
                className="ml-2 text-red-600 hover:text-red-800"
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addRequirement}
            className="mt-2 text-sm text-indigo-600 hover:text-indigo-800"
          >
            + Add Requirement
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Job Type</label>
          <select
            value={formData.type}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option>Full-time</option>
            <option>Part-time</option>
            <option>Contract</option>
            <option>Internship</option>
          </select>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Create Job
          </button>
        </div>
      </form>
    </div>
  );
} 