import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AwardIcon, ThumbsUpIcon, UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Endorsement {
  skill: string;
  endorsers: any[];
}

export default function EndorsementsSection() {
  const { profile } = useAuth();
  const [endorsements, setEndorsements] = useState<Record<string, Endorsement>>(() => {
    const savedEndorsements = localStorage.getItem('endorsements');
    return savedEndorsements ? JSON.parse(savedEndorsements) : {};
  });

  const handleEndorse = (skill: string) => {
    const newEndorsements = { ...endorsements };
    if (!newEndorsements[skill]) {
      newEndorsements[skill] = { skill, endorsers: [] };
    }
    
    const endorsement = newEndorsements[skill];
    if (!endorsement.endorsers.some(e => e.id === profile?.id)) {
      endorsement.endorsers.push({
        id: profile?.id,
        name: profile?.full_name,
        headline: profile?.headline,
      });
      setEndorsements(newEndorsements);
      localStorage.setItem('endorsements', JSON.stringify(newEndorsements));
      toast.success(`You've endorsed ${skill}`);
    }
  };

  if (!profile?.skills?.length) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center space-x-3 mb-6">
        <AwardIcon className="h-6 w-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Skills & Endorsements</h2>
      </div>

      <div className="space-y-6">
        {profile.skills.map((skill: string) => (
          <div key={skill} className="border-b pb-4 last:border-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium text-gray-900">{skill}</h3>
              <button
                onClick={() => handleEndorse(skill)}
                className="flex items-center space-x-2 text-sm text-indigo-600 hover:text-indigo-700"
              >
                <ThumbsUpIcon className="h-4 w-4" />
                <span>Endorse</span>
              </button>
            </div>

            {endorsements[skill]?.endorsers.length > 0 && (
              <div className="flex items-center space-x-2 mt-2">
                <div className="flex -space-x-2">
                  {endorsements[skill].endorsers.slice(0, 3).map((endorser: any, index: number) => (
                    <div
                      key={endorser.id}
                      className="h-8 w-8 rounded-full bg-indigo-100 border-2 border-white flex items-center justify-center"
                      title={endorser.name}
                    >
                      <UserIcon className="h-4 w-4 text-indigo-600" />
                    </div>
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  {endorsements[skill].endorsers.length} endorsements
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}