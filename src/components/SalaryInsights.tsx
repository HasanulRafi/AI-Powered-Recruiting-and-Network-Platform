import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../contexts/AIContext';
import { getSalaryBenchmarks, type SalaryBenchmark } from '../lib/ai';
import { toast } from 'react-hot-toast';
import { DollarSignIcon, TrendingUpIcon, TrendingDownIcon, MinusIcon, BuildingIcon, MapPinIcon, RefreshCwIcon as RefreshIcon } from 'lucide-react';

export default function SalaryInsights() {
  const { profile } = useAuth();
  const { aiEnabled } = useAI();
  const [insights, setInsights] = useState<SalaryBenchmark | null>(null);
  const [location, setLocation] = useState('');
  const [experienceYears, setExperienceYears] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile?.headline && profile.location && aiEnabled) {
      const experience = profile.experience?.length
        ? Math.min(
            profile.experience.reduce((acc: number, exp: any) => {
              const start = new Date(exp.startDate);
              const end = exp.endDate ? new Date(exp.endDate) : new Date();
              return acc + (end.getFullYear() - start.getFullYear());
            }, 0),
            15
          )
        : 0;

      setLocation(profile.location);
      setExperienceYears(experience);
      updateInsights(profile.headline, profile.location, experience);
    }
  }, [profile, aiEnabled]);

  const updateInsights = (title: string, loc: string, years: number) => {
    if (!aiEnabled) {
      toast.error('Please enable AI Agent to use this feature');
      return;
    }

    setLoading(true);
    try {
      const data = getSalaryBenchmarks(title, loc, years);
      setInsights(data);
    } catch (error) {
      toast.error('Error updating salary insights');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (profile?.headline) {
      updateInsights(profile.headline, location, experienceYears);
    }
  };

  if (!profile || !insights) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <DollarSignIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">Salary Insights</h2>
        </div>
        <button
          onClick={handleRefresh}
          disabled={loading}
          className="flex items-center space-x-2 px-3 py-1 text-sm text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
        >
          <RefreshIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Salary Range */}
        <div className="bg-indigo-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Range</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Minimum</span>
              <span className="font-medium text-gray-900">
                ${insights.min.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Median</span>
              <span className="font-medium text-gray-900">
                ${insights.median.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Maximum</span>
              <span className="font-medium text-gray-900">
                ${insights.max.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Market Insights */}
        <div className="bg-gray-50 rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Market Insights</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Market Trend</span>
              <div className="flex items-center space-x-2">
                {insights.marketTrend === 'up' ? (
                  <>
                    <TrendingUpIcon className="h-5 w-5 text-green-600" />
                    <span className="text-green-600 font-medium">Rising</span>
                  </>
                ) : insights.marketTrend === 'down' ? (
                  <>
                    <TrendingDownIcon className="h-5 w-5 text-red-600" />
                    <span className="text-red-600 font-medium">Declining</span>
                  </>
                ) : (
                  <>
                    <MinusIcon className="h-5 w-5 text-gray-600" />
                    <span className="text-gray-600 font-medium">Stable</span>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Industry Percentile</span>
              <span className="font-medium text-gray-900">
                {insights.industryComparison}th
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Factors */}
      <div className="mt-6 border-t pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Salary Factors</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-3">
            <BuildingIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Role</p>
              <p className="text-sm text-gray-500">{profile.headline}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <MapPinIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Location</p>
              <p className="text-sm text-gray-500">{location}</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <DollarSignIcon className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">Experience</p>
              <p className="text-sm text-gray-500">{experienceYears} years</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}