// Local storage keys
export const JOBS_KEY = 'local_jobs';
export const CONNECTIONS_KEY = 'local_connections';
export const MESSAGES_KEY = 'local_messages';

// Job functions
export const getJobs = () => {
  return JSON.parse(localStorage.getItem(JOBS_KEY) || '[]');
};

export const createJob = (job: any) => {
  const jobs = getJobs();
  const newJob = {
    ...job,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
    status: 'open',
  };
  jobs.push(newJob);
  localStorage.setItem(JOBS_KEY, JSON.stringify(jobs));
  return newJob;
};

// Connection functions
export const getConnections = () => {
  return JSON.parse(localStorage.getItem(CONNECTIONS_KEY) || '[]');
};

export const createConnection = (connection: any) => {
  const connections = getConnections();
  const newConnection = {
    ...connection,
    id: Math.random().toString(36).substr(2, 9),
    status: 'accepted', // For demo purposes, automatically accept connections
    created_at: new Date().toISOString(),
  };
  connections.push(newConnection);
  localStorage.setItem(CONNECTIONS_KEY, JSON.stringify(connections));
  return newConnection;
};

// Message functions
export const getMessages = () => {
  return JSON.parse(localStorage.getItem(MESSAGES_KEY) || '[]');
};

export const createMessage = (message: any) => {
  const messages = getMessages();
  const newMessage = {
    ...message,
    id: Math.random().toString(36).substr(2, 9),
    created_at: new Date().toISOString(),
  };
  messages.push(newMessage);
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  return newMessage;
};