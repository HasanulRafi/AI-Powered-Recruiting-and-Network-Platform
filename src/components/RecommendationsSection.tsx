import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { MessageSquareIcon, PlusIcon, QuoteIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Recommendation {
  id: string;
  from: {
    id: string;
    name: string;
    headline: string;
  };
  to: string;
  text: string;
  relationship: string;
  createdAt: string;
}

export default function RecommendationsSection() {
  const { profile } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(() => {
    const saved = localStorage.getItem('recommendations');
    return saved ? JSON.parse(saved) : [];
  });
  const [newRecommendation, setNewRecommendation] = useState({
    text: '',
    relationship: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;

    const recommendation: Recommendation = {
      id: Math.random().toString(36).substr(2, 9),
      from: {
        id: profile.id,
        name: profile.full_name,
        headline: profile.headline || '',
      },
      to: profile.id,
      text: newRecommendation.text,
      relationship: newRecommendation.relationship,
      createdAt: new Date().toISOString(),
    };

    setRecommendations(prev => [...prev, recommendation]);
    localStorage.setItem('recommendations', JSON.stringify([...recommendations, recommendation]));
    setShowForm(false);
    setNewRecommendation({ text: '', relationship: '' });
    toast.success('Recommendation added successfully');
  };

  const myRecommendations = recommendations.filter(rec => rec.to === profile?.id);

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <MessageSquareIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Recommendations</h2>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
        >
          <PlusIcon className="h-4 w-4" />
          <span>Add Recommendation</span>
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 bg-gray-50 rounded-lg p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Your Relationship
              </label>
              <input
                type="text"
                value={newRecommendation.relationship}
                onChange={e => setNewRecommendation(prev => ({
                  ...prev,
                  relationship: e.target.value
                }))}
                placeholder="e.g., Worked together at Company X"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Recommendation
              </label>
              <textarea
                value={newRecommendation.text}
                onChange={e => setNewRecommendation(prev => ({
                  ...prev,
                  text: e.target.value
                }))}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                placeholder="Share your experience working with this person..."
              />
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700"
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-6">
        {myRecommendations.map(recommendation => (
          <div key={recommendation.id} className="border-b pb-6 last:border-0">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <QuoteIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <div>
                <p className="text-gray-900 mb-4">{recommendation.text}</p>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {recommendation.from.name}
                  </h4>
                  <p className="text-sm text-gray-500">{recommendation.from.headline}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    {recommendation.relationship}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}

        {myRecommendations.length === 0 && !showForm && (
          <div className="text-center py-8">
            <MessageSquareIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No recommendations yet
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Get recommendations from your professional network
            </p>
          </div>
        )}
      </div>
    </div>
  );
}