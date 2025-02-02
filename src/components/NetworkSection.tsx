import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getConnections } from '../lib/store';
import { UsersIcon, UserPlusIcon, MessageCircleIcon } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function NetworkSection() {
  const { profile } = useAuth();
  const [connections] = useState(() => getConnections());

  const myConnections = connections.filter(
    (conn: any) => conn.recruiter_id === profile?.id || conn.applicant_id === profile?.id
  );

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <UsersIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">My Network</h2>
        </div>
        <span className="text-sm text-gray-500">
          {myConnections.length} connections
        </span>
      </div>

      <div className="space-y-4">
        {myConnections.map((connection: any) => {
          const otherPerson = connection.recruiter_id === profile?.id
            ? connection.applicant
            : connection.recruiter;

          return (
            <div key={connection.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <UsersIcon className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{otherPerson.full_name}</h3>
                  <p className="text-sm text-gray-500">{otherPerson.headline}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to="/messages"
                  className="p-2 text-gray-400 hover:text-indigo-600"
                >
                  <MessageCircleIcon className="h-5 w-5" />
                </Link>
              </div>
            </div>
          );
        })}

        {myConnections.length === 0 && (
          <div className="text-center py-8">
            <UserPlusIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No connections yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Start building your professional network
            </p>
          </div>
        )}
      </div>
    </div>
  );
}