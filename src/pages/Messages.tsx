import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getConnections, getMessages, createMessage } from '../lib/store';
import { toast } from 'react-hot-toast';
import { MessageCircleIcon, SendIcon } from 'lucide-react';
import { format } from 'date-fns';

export default function Messages() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [connections, setConnections] = useState<any[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
      return;
    }
    fetchConnections();
  }, [user, navigate]);

  useEffect(() => {
    if (selectedConnection) {
      fetchMessages();
    }
  }, [selectedConnection]);

  const fetchConnections = async () => {
    try {
      const data = getConnections().filter(
        (conn: any) => conn.recruiter_id === user!.id || conn.applicant_id === user!.id
      );
      setConnections(data || []);
      setLoading(false);
    } catch (error) {
      toast.error('Error fetching connections');
      setLoading(false);
    }
  };

  const fetchMessages = async () => {
    try {
      const data = getMessages()
        .filter((msg: any) => msg.connection_id === selectedConnection.id)
        .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      setMessages(data || []);
    } catch (error) {
      toast.error('Error fetching messages');
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const message = createMessage({
        connection_id: selectedConnection.id,
        sender_id: user!.id,
        sender: profile,
        content: newMessage.trim(),
      });
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } catch (error) {
      toast.error('Error sending message');
    }
  };

  const getConnectionName = (connection: any) => {
    const otherPerson = connection.recruiter.id === user!.id
      ? connection.applicant
      : connection.recruiter;
    return otherPerson.full_name;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-12rem)] flex">
        {/* Connections List */}
        <div className="w-1/3 border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-semibold">Messages</h2>
          </div>
          <div className="overflow-y-auto h-[calc(100%-4rem)]">
            {connections.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No connections yet
              </div>
            ) : (
              connections.map(connection => (
                <button
                  key={connection.id}
                  onClick={() => setSelectedConnection(connection)}
                  className={`w-full p-4 text-left hover:bg-gray-50 flex items-center space-x-3 ${
                    selectedConnection?.id === connection.id ? 'bg-gray-50' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <MessageCircleIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">{getConnectionName(connection)}</h3>
                    <p className="text-sm text-gray-500">
                      {connection.recruiter.id === user!.id ? 'Applicant' : 'Recruiter'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 flex flex-col">
          {selectedConnection ? (
            <>
              <div className="p-4 border-b">
                <h3 className="font-medium">{getConnectionName(selectedConnection)}</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map(message => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender.id === user!.id ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        message.sender.id === user!.id
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender.id === user!.id ? 'text-indigo-100' : 'text-gray-500'
                      }`}>
                        {format(new Date(message.created_at), 'p')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <form onSubmit={sendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={e => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessage.trim()}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    <SendIcon className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}