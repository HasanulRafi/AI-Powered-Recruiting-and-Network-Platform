import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UsersIcon, UserPlusIcon, MessageCircleIcon, UserMinusIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Connection {
  id: string;
  status: string;
  timestamp: Date;
  user: {
    id: string;
    full_name: string;
    role: string;
    headline: string;
    company: string;
  };
}

export default function NetworkSection() {
  const { profile } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    // Load connections from localStorage and ensure they match the expected structure
    const storedConnections = JSON.parse(localStorage.getItem('connections') || '[]');
    const validConnections = storedConnections.filter((conn: any) => 
      conn && conn.user && conn.user.full_name && conn.user.headline
    );
    setConnections(validConnections);
  }, []); // Empty dependency array means this runs once on mount

  const handleRemoveConnection = (connectionId: string, connectionName: string) => {
    // Remove from local state and localStorage
    const updatedConnections = connections.filter(conn => conn.id !== connectionId);
    setConnections(updatedConnections);
    localStorage.setItem('connections', JSON.stringify(updatedConnections));
    toast.success(`Removed ${connectionName} from your network`);
  };

  const handleStartConversation = (connection: Connection) => {
    // Initialize or update messages in localStorage
    const messages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    // Check if a conversation already exists
    const existingConversation = messages.some((msg: any) => msg.connectionId === connection.id);
    
    if (!existingConversation) {
      // Add an empty conversation to localStorage
      const initialMessage = {
        id: Date.now().toString(),
        connectionId: connection.id,
        senderId: connection.user.id,
        content: '',
        timestamp: new Date(),
        read: false,
        sender: connection.user
      };
      messages.push(initialMessage);
      localStorage.setItem('messages', JSON.stringify(messages));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <UsersIcon className="h-6 w-6 text-indigo-600" />
          <h2 className="text-xl font-semibold">My Network</h2>
        </div>
        <span className="text-sm text-gray-500">
          {connections.length} connections
        </span>
      </div>

      <div className="space-y-4">
        {connections.map((connection) => {
          const otherPerson = connection.user;
          if (!otherPerson) return null;

          return (
            <div key={connection.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-medium">
                    {otherPerson.full_name[0]}
                  </span>
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{otherPerson.full_name}</h3>
                  <p className="text-sm text-gray-500">{otherPerson.headline}</p>
                  <p className="text-xs text-gray-500">{otherPerson.company}</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Link
                  to={`/messages/${connection.id}`}
                  className="p-2 text-gray-400 hover:text-indigo-600"
                  onClick={() => handleStartConversation(connection)}
                >
                  <MessageCircleIcon className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => handleRemoveConnection(connection.id, otherPerson.full_name)}
                  className="p-2 text-gray-400 hover:text-red-600"
                  title="Remove connection"
                >
                  <UserMinusIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}

        {connections.length === 0 && (
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