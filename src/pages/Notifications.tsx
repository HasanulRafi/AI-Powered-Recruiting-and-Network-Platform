import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, MessageCircleIcon, BriefcaseIcon, UserPlusIcon, SparklesIcon } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'message' | 'connection' | 'job' | 'ai' | 'endorsement';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  sender?: {
    id: string;
    full_name: string;
    role: string;
    headline: string;
    company: string;
  };
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

export default function Notifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Try to get notifications from localStorage first
    const storedNotifications = localStorage.getItem('notifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      // Clear stored notifications to ensure fresh state
      localStorage.removeItem('notifications');
      return [];
    }

    // If no stored notifications, create initial ones based on role
    const initialNotifications: Notification[] = [];

    // Only show AI credits notification for recruiters
    if (profile?.role === 'recruiter') {
      initialNotifications.push({
        id: '4',
        type: 'ai' as const,
        title: 'AI Credits Update',
        description: 'Your monthly AI credits have been refreshed',
        timestamp: new Date(Date.now() - 86400000),
        read: true,
        actionUrl: '/ai-settings'
      });
      return initialNotifications;
    }

    // For job seekers, add connection request and Sarah Wilson message
    initialNotifications.push({
      id: '1',
      type: 'connection' as const,
      title: 'New connection request',
      description: 'Emily Chen (Technical Recruiter at Innovation Labs) wants to connect with you',
      timestamp: new Date(Date.now() - 1800000),
      read: false,
      sender: {
        id: 'rec1',
        full_name: 'Emily Chen',
        role: 'recruiter',
        headline: 'Technical Recruiter',
        company: 'Innovation Labs'
      }
    });

    initialNotifications.push({
      id: '2',
      type: 'message' as const,
      title: 'New message from Sarah Wilson',
      description: 'I noticed your profile and wanted to reach out about a position that aligns with your skills.',
      timestamp: new Date(Date.now() - 3600000),
      read: false,
      actionUrl: '/messages/f9d7g7d7-0e9h-6e9h-0e9h-0e9h0e9h0e9h',
      sender: {
        id: 'd7b5e5b5-8c7f-4c7f-8c7f-8c7f8c7f8c7f',
        full_name: 'Sarah Wilson',
        role: 'recruiter',
        headline: 'Senior Recruiter',
        company: 'Tech Corp'
      }
    });

    // Add initial message from Sarah Wilson
    const messages = [];
    const initialMessage = {
      id: 'initial-message',
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
    };
    messages.push(initialMessage);
    localStorage.setItem('messages', JSON.stringify(messages));

    // Add AI credits notification for job seekers too
    initialNotifications.push({
      id: '4',
      type: 'ai' as const,
      title: 'AI Credits Update',
      description: 'Your monthly AI credits have been refreshed',
      timestamp: new Date(Date.now() - 86400000),
      read: true,
      actionUrl: '/ai-settings'
    });

    return initialNotifications;
  });

  // Update localStorage whenever notifications change
  useEffect(() => {
    localStorage.setItem('notifications', JSON.stringify(notifications));
  }, [notifications]);

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const handleAcceptConnection = (notification: Notification) => {
    // Add to connections list in local storage
    const connections = JSON.parse(localStorage.getItem('connections') || '[]');
    const newConnection = {
      id: Date.now().toString(),
      status: 'accepted',
      timestamp: new Date(),
      user: notification.sender
    };
    connections.push(newConnection);
    localStorage.setItem('connections', JSON.stringify(connections));

    // Remove the notification
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
    
    toast.success(`You are now connected with ${notification.sender?.full_name}`);

    // Add a new connection request from a different person
    const newPeople = [
      {
        id: 'rec1',
        full_name: 'Emily Chen',
        role: 'recruiter',
        headline: 'Technical Recruiter',
        company: 'Innovation Labs'
      },
      {
        id: 'rec2',
        full_name: 'Michael Rodriguez',
        role: 'recruiter',
        headline: 'Senior Tech Recruiter',
        company: 'Future Tech'
      },
      {
        id: 'rec3',
        full_name: 'Jessica Kim',
        role: 'recruiter',
        headline: 'Talent Acquisition Manager',
        company: 'Growth Startup'
      }
    ];

    // Pick a random person who isn't already in connections
    const availablePeople = newPeople.filter(person => 
      !connections.some((conn: Connection) => conn.user.id === person.id)
    );

    if (availablePeople.length > 0) {
      const randomPerson = availablePeople[Math.floor(Math.random() * availablePeople.length)];
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'connection' as const,
        title: 'New connection request',
        description: `${randomPerson.full_name} (${randomPerson.headline} at ${randomPerson.company}) wants to connect with you`,
        timestamp: new Date(),
        read: false,
        sender: randomPerson
      };
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  const handleDeclineConnection = (notification: Notification) => {
    // Remove the notification
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
    toast.success('Connection request declined');

    // Add a new connection request from a different person (same logic as accept)
    const newPeople = [
      {
        id: 'rec1',
        full_name: 'Emily Chen',
        role: 'recruiter',
        headline: 'Technical Recruiter',
        company: 'Innovation Labs'
      },
      {
        id: 'rec2',
        full_name: 'Michael Rodriguez',
        role: 'recruiter',
        headline: 'Senior Tech Recruiter',
        company: 'Future Tech'
      },
      {
        id: 'rec3',
        full_name: 'Jessica Kim',
        role: 'recruiter',
        headline: 'Talent Acquisition Manager',
        company: 'Growth Startup'
      }
    ];

    const connections = JSON.parse(localStorage.getItem('connections') || '[]');
    const availablePeople = newPeople.filter(person => 
      !connections.some((conn: Connection) => conn.user.id === person.id)
    );

    if (availablePeople.length > 0) {
      const randomPerson = availablePeople[Math.floor(Math.random() * availablePeople.length)];
      const newNotification: Notification = {
        id: Date.now().toString(),
        type: 'connection' as const,
        title: 'New connection request',
        description: `${randomPerson.full_name} (${randomPerson.headline} at ${randomPerson.company}) wants to connect with you`,
        timestamp: new Date(),
        read: false,
        sender: randomPerson
      };
      setNotifications(prev => [...prev, newNotification]);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);
    // Additional logic can be added here if needed
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MessageCircleIcon className="h-6 w-6 text-blue-500" />;
      case 'connection':
        return <UserPlusIcon className="h-6 w-6 text-green-500" />;
      case 'job':
        return <BriefcaseIcon className="h-6 w-6 text-purple-500" />;
      case 'ai':
        return <SparklesIcon className="h-6 w-6 text-indigo-500" />;
      default:
        return <BellIcon className="h-6 w-6 text-gray-500" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BellIcon className="h-6 w-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
            </div>
            <span className="text-sm text-gray-500">
              {notifications.filter(n => !n.read).length} unread
            </span>
          </div>
        </div>

        <div className="divide-y">
          {notifications.map(notification => (
            <div
              key={notification.id}
              className={`p-6 hover:bg-gray-50 transition-colors ${
                !notification.read ? 'bg-indigo-50' : ''
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-medium text-gray-900">
                      {notification.title}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {format(notification.timestamp, 'MMM d, h:mm a')}
                    </p>
                  </div>
                  <p className="mt-1 text-sm text-gray-600">
                    {notification.description}
                  </p>
                  {notification.type === 'connection' ? (
                    <div className="mt-4 flex space-x-3">
                      <button
                        onClick={() => handleAcceptConnection(notification)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Accept Connection
                      </button>
                      <button
                        onClick={() => handleDeclineConnection(notification)}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Decline
                      </button>
                    </div>
                  ) : notification.actionUrl && (
                    <Link
                      to={notification.actionUrl}
                      className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                      onClick={(e) => {
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                    >
                      View details →
                    </Link>
                  )}
                </div>
                {!notification.read && (
                  <div className="flex-shrink-0">
                    <div className="h-2 w-2 bg-indigo-600 rounded-full"></div>
                  </div>
                )}
              </div>
            </div>
          ))}
          {notifications.length === 0 && (
            <div className="p-6 text-center text-gray-500">
              No notifications yet
            </div>
          )}
        </div>
      </div>
    </div>
  );
}