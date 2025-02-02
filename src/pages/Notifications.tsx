import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BellIcon, MessageCircleIcon, BriefcaseIcon, UserPlusIcon, SparklesIcon } from 'lucide-react';
import { format } from 'date-fns';

interface Notification {
  id: string;
  type: 'message' | 'connection' | 'job' | 'ai' | 'endorsement';
  title: string;
  description: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export default function Notifications() {
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    // Simulated notifications
    return [
      {
        id: '1',
        type: 'message',
        title: 'New message from Sarah Wilson',
        description: 'Hey, I saw your profile and would like to discuss...',
        timestamp: new Date(),
        read: false,
        actionUrl: '/messages'
      },
      {
        id: '2',
        type: 'connection',
        title: 'New connection request',
        description: 'John Doe wants to connect with you',
        timestamp: new Date(Date.now() - 3600000),
        read: false,
        actionUrl: '/network'
      },
      {
        id: '3',
        type: 'job',
        title: 'New job match',
        description: 'A new job matching your skills has been posted',
        timestamp: new Date(Date.now() - 7200000),
        read: true,
        actionUrl: '/jobs'
      },
      {
        id: '4',
        type: 'ai',
        title: 'AI Credits Update',
        description: 'Your monthly AI credits have been refreshed',
        timestamp: new Date(Date.now() - 86400000),
        read: true
      }
    ];
  });

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
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
              onClick={() => markAsRead(notification.id)}
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
                  {notification.actionUrl && (
                    <a
                      href={notification.actionUrl}
                      className="mt-2 inline-flex items-center text-sm text-indigo-600 hover:text-indigo-700"
                    >
                      View details →
                    </a>
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