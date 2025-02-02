import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { checkAchievements, calculateLevel, Achievement } from '../lib/ai';
import {
  TrophyIcon,
  AwardIcon,
  StarIcon,
  ShieldIcon,
  CrownIcon,
  SparklesIcon,
} from 'lucide-react';

export default function GamificationProfile() {
  const { profile } = useAuth();
  
  if (!profile) return null;

  const achievements = checkAchievements(profile);
  const totalPoints = achievements.reduce((sum, achievement) => sum + achievement.points, 0);
  const levelInfo = calculateLevel(totalPoints);

  const renderAchievementIcon = (icon: string) => {
    const icons = {
      'user-check': ShieldIcon,
      'award': AwardIcon,
      'briefcase': StarIcon,
      'graduation-cap': CrownIcon,
    };
    const Icon = icons[icon] || TrophyIcon;
    return <Icon className="h-6 w-6" />;
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <TrophyIcon className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Career Progress</h2>
      </div>

      {/* Level Progress */}
      <div className="bg-indigo-50 rounded-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Level {levelInfo.level}</h3>
            <p className="text-sm text-gray-600">{levelInfo.title}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Total Points</p>
            <p className="text-xl font-bold text-indigo-600">{totalPoints}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative pt-1">
          <div className="flex mb-2 items-center justify-between">
            <div>
              <span className="text-xs font-semibold inline-block text-indigo-600">
                Progress to Next Level
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold inline-block text-indigo-600">
                {Math.round(levelInfo.progress)}%
              </span>
            </div>
          </div>
          <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200">
            <div
              style={{ width: `${levelInfo.progress}%` }}
              className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
            ></div>
          </div>
        </div>
      </div>

      {/* Achievements */}
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-gray-900">Achievements</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {achievements.map((achievement: Achievement) => (
            <div
              key={achievement.id}
              className="flex items-start space-x-4 p-4 bg-white border rounded-lg hover:shadow-md transition-shadow"
            >
              <div className="flex-shrink-0">
                <div className="p-2 bg-indigo-100 rounded-lg text-indigo-600">
                  {renderAchievementIcon(achievement.icon)}
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-medium text-gray-900">{achievement.title}</h4>
                <p className="text-sm text-gray-500">{achievement.description}</p>
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Unlocked {new Date(achievement.unlockedAt!).toLocaleDateString()}
                  </span>
                  <span className="text-sm font-medium text-indigo-600">
                    +{achievement.points} pts
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {achievements.length === 0 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <SparklesIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No achievements yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Complete your profile and engage with the platform to earn achievements
            </p>
          </div>
        )}
      </div>
    </div>
  );
}