import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { MessageCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Message {
  id: string;
  connectionId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

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

// Initialize messages with a conversation between recruiter and job seeker
const initialMessages = [
  {
    id: 'msg-1',
    connectionId: 'f9d7g7d7-0e9h-6e9h-0e9h-0e9h0e9h0e9h',
    senderId: 'd7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f',
    content: 'Hi! I noticed your profile and wanted to reach out about a position that aligns with your skills. Would you be interested in learning more?',
    timestamp: new Date(Date.now() - 3600000),
    read: false,
    sender: {
      id: 'd7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f',
      full_name: 'Sarah Wilson',
      role: 'recruiter',
      headline: 'Senior Recruiter',
      company: 'Tech Corp'
    }
  },
  {
    id: 'msg-2',
    connectionId: 'f9d7g7d7-0e9h-6e9h-0e9h-0e9h0e9h0e9h',
    senderId: 'e8c6f6c6-9d8g-5d8g-9d8g-9d8g9d8g9d8g',
    content: 'Yes, I would be very interested! Could you tell me more about the position?',
    timestamp: new Date(Date.now() - 3000000),
    read: true,
    sender: {
      id: 'e8c6f6c6-9d8g-5d8g-9d8g-9d8g9d8g9d8g',
      full_name: 'John Doe',
      role: 'job_seeker',
      headline: 'Software Engineer',
      company: 'Tech Corp'
    }
  },
  {
    id: 'msg-3',
    connectionId: 'f9d7g7d7-0e9h-6e9h-0e9h-0e9h0e9h0e9h',
    senderId: 'd7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f',
    content: "We're looking for a Senior Software Engineer with your exact skill set. The role offers competitive compensation and great benefits. Would you be available for a quick chat this week?",
    timestamp: new Date(Date.now() - 2400000),
    read: true,
    sender: {
      id: 'd7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f',
      full_name: 'Sarah Wilson',
      role: 'recruiter',
      headline: 'Senior Recruiter',
      company: 'Tech Corp'
    }
  }
];

// Only set initial messages if they don't exist
if (!localStorage.getItem('messages')) {
  localStorage.setItem('messages', JSON.stringify(initialMessages));
}

export default function Messages() {
  const { profile } = useAuth();
  const navigate = useNavigate();
  const { connectionId } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [currentConnection, setCurrentConnection] = useState<Connection | null>(null);

  useEffect(() => {
    if (!profile) {
      navigate('/auth');
      return;
    }

    // Load connections
    const storedConnections = JSON.parse(localStorage.getItem('connections') || '[]');
    setConnections(storedConnections);

    // Load messages from localStorage
    const storedMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    if (connectionId) {
      // Filter messages for current conversation
      const filteredMessages = storedMessages.filter(
        (msg: Message) => msg.connectionId === connectionId
      );
      setMessages(filteredMessages);

      // Set current connection
      const connection = storedConnections.find((conn: Connection) => conn.id === connectionId);
      setCurrentConnection(connection || null);
    } else {
      setMessages([]);
    }
    
    setLoading(false);
  }, [profile, navigate, connectionId]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !profile || !connectionId || !currentConnection) return;

    const newMessageObj = {
      id: Date.now().toString(),
      connectionId,
      senderId: profile.id,
      content: newMessage,
      timestamp: new Date(),
      read: false,
      sender: {
        id: profile.id,
        full_name: profile.full_name,
        role: profile.role,
        headline: profile.headline || '',
        company: profile.company || ''
      }
    };

    // Get all existing messages from localStorage
    const allMessages = JSON.parse(localStorage.getItem('messages') || '[]');
    
    // Add new message to all messages
    const updatedAllMessages = [...allMessages, newMessageObj];
    
    // Update localStorage with all messages
    localStorage.setItem('messages', JSON.stringify(updatedAllMessages));
    
    // Update current conversation messages
    const updatedConversationMessages = [...messages, newMessageObj];
    setMessages(updatedConversationMessages);
    
    setNewMessage('');
  };

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <MessageCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Please sign in to view messages</h3>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 text-center">
          <div className="animate-pulse">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {connectionId && (
                <button
                  onClick={() => navigate('/messages')}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-gray-500" />
                </button>
              )}
              <MessageCircleIcon className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                {connectionId && currentConnection 
                  ? `Chat with ${currentConnection.user.full_name}` 
                  : 'Messages'}
              </h1>
            </div>
          </div>
        </div>

        <div className="divide-y">
          {!connectionId && connections.map(connection => {
            if (!connection?.user?.full_name) return null;
            
            return (
              <Link
                key={connection.id}
                to={`/messages/${connection.id}`}
                className="block p-4 hover:bg-gray-50"
              >
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <span className="text-indigo-600 font-medium">
                        {connection.user.full_name[0] || '?'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {connection.user.full_name}
                    </p>
                    <p className="text-sm text-gray-500 truncate">
                      {connection.user.headline || 'No headline'}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}

          {connectionId && (
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.senderId === profile.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[70%] ${
                        message.senderId === profile.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs mt-1 opacity-75">
                        {format(new Date(message.timestamp), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}

          {!connectionId && connections.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No messages yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}